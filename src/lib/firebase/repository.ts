import type { User } from "firebase/auth"
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore"
import { categories as defaultCategories, posts as defaultPosts, products as defaultProducts, siteContent } from "@/lib/data"
import type { Category, DeliveryMethod, OrderStatus, Post, Product, TicketStatus } from "@/lib/types"
import { db, handleFirestoreError, OperationType } from "@/lib/firebase/client"
import { isValidId, sanitizeOrderInput, sanitizeTicketInput } from "@/lib/firebase/validators"

export const BOOTSTRAPPED_ADMIN_EMAIL = "hesaam.shadzhi@gmail.com"

export type UserPublicProfile = {
  uid: string
  displayName: string
  plan: string
  walletBalance: number
  favorites: string[]
}

export type UserPrivateProfile = {
  uid: string
  email: string
  phone?: string
  nationalId?: string
}

export type FirestoreOrder = {
  id: string
  orderNumber: string
  userId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  productId: string
  productTitle: string
  planId: string
  planTitle: string
  delivery: DeliveryMethod
  quantity: number
  amount: number
  discountAmount?: number
  discountCode?: string
  paymentMethod: "gateway" | "wallet"
  status: OrderStatus
  deliveryNote?: string
  deliveryCredentialsText?: string
  createdAt: string
}

export type FirestoreInventoryItem = {
  id: string
  productId: string
  productTitle: string
  planId: string
  planTitle: string
  deliveryType: DeliveryMethod
  credentialValue: string
  status: "available" | "reserved" | "delivered"
  assignedOrderId?: string
  createdAt: string
}

export type FirestoreDiscount = {
  code: string
  type: "percent" | "fixed"
  value: number
  limit: number
  used: number
  minOrder: number
  expiresAt?: string
  firstPurchaseOnly?: boolean
  isActive: boolean
}

export type FirestoreTicket = {
  id: string
  userId: string
  userName: string
  subject: string
  department: "پشتیبانی فنی" | "مالی و پرداخت" | "پیش از خرید"
  status: TicketStatus
  priority: "کم" | "متوسط" | "زیاد"
  orderId?: string
  updatedAt: string
}

export type FirestoreTicketMessage = {
  id: string
  ticketId: string
  ticketOwnerId: string
  senderId: string
  senderRole: "user" | "support"
  body: string
  createdAt: string
}

export type FirestoreWalletTx = {
  id: string
  userId: string
  type: string
  amount: number
  status: "success" | "failed" | "pending"
  note?: string
  createdAt: string
}

export type FirestoreNotification = {
  id: string
  userId: string
  title: string
  body: string
  unread: boolean
  createdAt: string
}

export type FirestoreProductRequest = {
  id: string
  userId?: string
  category: string
  productName: string
  plan?: string
  name: string
  contact: string
  note?: string
  status: "new" | "reviewed" | "fulfilled"
  createdAt: string
}

export type FirestoreContactMessage = {
  id: string
  name: string
  phone?: string
  email?: string
  subject: string
  message: string
  status: "new" | "replied"
  createdAt: string
}

export type FirestoreSiteSettings = {
  brandNameFa: string
  brandNameEn: string
  tagline: string
  logoMark: string
  heroBadge: string
  heroHeadlineLead: string
  heroHeadlineTail: string
  heroSubheadline: string
  contactPhone: string
  contactEmail: string
  contactTelegram: string
  contactAddress: string
  contactHours: string
  footerAbout: string
  aboutDescription?: string
  maintenanceMode: boolean
}

function formatTs(value: unknown): string {
  if (value && typeof value === "object" && "toDate" in value && typeof (value as { toDate: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toISOString().slice(0, 10)
  }
  if (typeof value === "string") return value.slice(0, 10)
  return new Date().toISOString().slice(0, 10)
}

export async function checkIsAdmin(user: User | null): Promise<boolean> {
  if (!user || !user.emailVerified) return false
  if (user.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL) return true
  const path = `admins/${user.uid}`
  try {
    const snap = await getDoc(doc(db, "admins", user.uid))
    return snap.exists()
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path)
  }
}

const inFlightUserProfileSync = new Map<
  string,
  Promise<{ publicProfile: UserPublicProfile; privateProfile: UserPrivateProfile }>
>()

export function ensureUserProfile(user: User): Promise<{
  publicProfile: UserPublicProfile
  privateProfile: UserPrivateProfile
}> {
  const existing = inFlightUserProfileSync.get(user.uid)
  if (existing) return existing

  const task = ensureUserProfileInternal(user).finally(() => {
    inFlightUserProfileSync.delete(user.uid)
  })
  inFlightUserProfileSync.set(user.uid, task)
  return task
}

async function ensureUserProfileInternal(user: User): Promise<{
  publicProfile: UserPublicProfile
  privateProfile: UserPrivateProfile
}> {
  const pubPath = `users/${user.uid}`
  const privPath = `users/${user.uid}/private/profile`
  const pubRef = doc(db, "users", user.uid)
  const privRef = doc(db, "users", user.uid, "private", "profile")

  let pubSnap
  try {
    pubSnap = await getDoc(pubRef)
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, pubPath)
  }

  if (!pubSnap.exists()) {
    const displayName = (
      user.displayName?.trim() ||
      user.email?.split("@")[0]?.trim() ||
      "کاربر اچ‌شاپ"
    ).slice(0, 100)
    try {
      await setDoc(pubRef, {
        uid: user.uid,
        displayName,
        plan: "عادی",
        walletBalance: 0,
        favorites: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      pubSnap = await getDoc(pubRef)
    } catch (error) {
      const existingCheck = await getDoc(pubRef).catch(() => null)
      if (existingCheck?.exists()) {
        pubSnap = existingCheck
      } else {
        handleFirestoreError(error, OperationType.CREATE, pubPath)
      }
    }
  }

  let privSnap
  try {
    privSnap = await getDoc(privRef)
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, privPath)
  }

  if (!privSnap.exists()) {
    const email = (user.email?.trim() || "user@echshop.ir").slice(0, 160)
    try {
      await setDoc(privRef, {
        uid: user.uid,
        email,
        phone: "",
        nationalId: "",
        updatedAt: serverTimestamp(),
      })
      privSnap = await getDoc(privRef)
    } catch (error) {
      const existingPrivCheck = await getDoc(privRef).catch(() => null)
      if (existingPrivCheck?.exists()) {
        privSnap = existingPrivCheck
      } else {
        handleFirestoreError(error, OperationType.CREATE, privPath)
      }
    }
  }

  const pubData = pubSnap.data() ?? {}
  const privData = privSnap.data() ?? {}

  return {
    publicProfile: {
      uid: user.uid,
      displayName: String(pubData.displayName ?? user.displayName ?? "کاربر"),
      plan: String(pubData.plan ?? "عادی"),
      walletBalance: Number(pubData.walletBalance ?? 0),
      favorites: Array.isArray(pubData.favorites) ? pubData.favorites : [],
    },
    privateProfile: {
      uid: user.uid,
      email: String(privData.email ?? user.email ?? ""),
      phone: String(privData.phone ?? ""),
      nationalId: String(privData.nationalId ?? ""),
    },
  }
}

export async function updateUserProfile(
  uid: string,
  payload: { displayName: string; phone: string; nationalId: string },
) {
  const pubPath = `users/${uid}`
  const privPath = `users/${uid}/private/profile`
  try {
    await updateDoc(doc(db, "users", uid), {
      displayName: payload.displayName.trim().slice(0, 100),
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, pubPath)
  }

  try {
    await updateDoc(doc(db, "users", uid, "private", "profile"), {
      phone: payload.phone.trim().slice(0, 20),
      nationalId: payload.nationalId.trim().slice(0, 20),
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, privPath)
  }
}

export async function toggleUserFavorite(uid: string, currentFavorites: string[], productId: string): Promise<string[]> {
  const next = currentFavorites.includes(productId)
    ? currentFavorites.filter((id) => id !== productId)
    : [...currentFavorites, productId].slice(0, 100)
  const path = `users/${uid}`
  try {
    await updateDoc(doc(db, "users", uid), {
      favorites: next,
      updatedAt: serverTimestamp(),
    })
    return next
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path)
  }
}

export async function fetchProducts(includeInactive = false): Promise<{ items: Product[]; fromFirestore: boolean }> {
  const path = "products"
  try {
    const q = includeInactive
      ? collection(db, "products")
      : query(collection(db, "products"), where("isActive", "==", true))
    const snap = await getDocs(q)
    if (snap.empty) {
      return { items: defaultProducts, fromFirestore: false }
    }
    return {
      items: snap.docs.map((d) => d.data() as Product),
      fromFirestore: true,
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path)
  }
}

export async function upsertProduct(product: Product & { isActive?: boolean }) {
  const path = `products/${product.id}`
  const cleanPayload = Object.fromEntries(
    Object.entries({
      ...product,
      isActive: product.isActive ?? true,
      updatedAt: serverTimestamp(),
    }).filter(([, value]) => value !== undefined),
  )
  try {
    await setDoc(doc(db, "products", product.id), cleanPayload)
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path)
  }
}

export async function deleteProduct(productId: string) {
  const path = `products/${productId}`
  try {
    await deleteDoc(doc(db, "products", productId))
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path)
  }
}

export async function fetchCategories(includeInactive = false): Promise<{ items: Category[]; fromFirestore: boolean }> {
  const path = "categories"
  try {
    const q = includeInactive
      ? collection(db, "categories")
      : query(collection(db, "categories"), where("isActive", "==", true))
    const snap = await getDocs(q)
    if (snap.empty) {
      return { items: defaultCategories, fromFirestore: false }
    }
    return {
      items: snap.docs.map((d) => d.data() as Category),
      fromFirestore: true,
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path)
  }
}

export async function upsertCategory(category: Category & { isActive?: boolean; order?: number }) {
  const path = `categories/${category.slug}`
  try {
    await setDoc(doc(db, "categories", category.slug), {
      slug: category.slug,
      title: category.title,
      description: category.description,
      icon: category.icon,
      count: category.count,
      order: category.order ?? 1,
      isActive: category.isActive ?? true,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path)
  }
}

export async function deleteCategory(slug: string) {
  const path = `categories/${slug}`
  try {
    await deleteDoc(doc(db, "categories", slug))
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path)
  }
}

export async function fetchPosts(includeDrafts = false): Promise<{ items: Post[]; fromFirestore: boolean }> {
  const path = "posts"
  try {
    const q = includeDrafts
      ? collection(db, "posts")
      : query(collection(db, "posts"), where("isPublished", "==", true))
    const snap = await getDocs(q)
    if (snap.empty) {
      return { items: defaultPosts, fromFirestore: false }
    }
    return {
      items: snap.docs.map((d) => d.data() as Post),
      fromFirestore: true,
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path)
  }
}

export async function upsertPost(post: Post & { isPublished?: boolean }) {
  const path = `posts/${post.slug}`
  try {
    await setDoc(doc(db, "posts", post.slug), {
      ...post,
      isPublished: post.isPublished ?? true,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path)
  }
}

export async function deletePost(slug: string) {
  const path = `posts/${slug}`
  try {
    await deleteDoc(doc(db, "posts", slug))
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path)
  }
}

export async function fetchSiteSettings(): Promise<{ data: FirestoreSiteSettings; fromFirestore: boolean }> {
  const path = "site_settings/main"
  try {
    const snap = await getDoc(doc(db, "site_settings", "main"))
    if (!snap.exists()) {
      return {
        data: {
          brandNameFa: siteContent.brand.nameFa,
          brandNameEn: siteContent.brand.nameEn,
          tagline: siteContent.brand.tagline,
          logoMark: siteContent.brand.logoMark,
          heroBadge: siteContent.hero.badge,
          heroHeadlineLead: siteContent.hero.headlineLead,
          heroHeadlineTail: siteContent.hero.headlineTail,
          heroSubheadline: siteContent.hero.subheadline,
          contactPhone: siteContent.contact.phone,
          contactEmail: siteContent.contact.email,
          contactTelegram: siteContent.contact.telegram,
          contactAddress: siteContent.contact.address,
          contactHours: siteContent.contact.hours,
          footerAbout: siteContent.footer.about,
          aboutDescription: siteContent.about.description,
          maintenanceMode: false,
        },
        fromFirestore: false,
      }
    }
    const raw = snap.data() as FirestoreSiteSettings
    return {
      data: {
        ...raw,
        aboutDescription: raw.aboutDescription || siteContent.about.description,
      },
      fromFirestore: true,
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path)
  }
}

export async function updateSiteSettings(settings: FirestoreSiteSettings) {
  const path = "site_settings/main"
  try {
    await setDoc(doc(db, "site_settings", "main"), {
      ...settings,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path)
  }
}

export async function lookupDiscount(code: string): Promise<FirestoreDiscount | null> {
  const normalized = code.trim().toUpperCase()
  if (!isValidId(normalized)) return null
  const path = `discounts/${normalized}`
  try {
    const snap = await getDoc(doc(db, "discounts", normalized))
    if (!snap.exists()) return null
    return snap.data() as FirestoreDiscount
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path)
  }
}

export async function fetchDiscounts(): Promise<FirestoreDiscount[]> {
  const path = "discounts"
  try {
    const snap = await getDocs(collection(db, "discounts"))
    return snap.docs.map((d) => d.data() as FirestoreDiscount)
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path)
  }
}

export async function upsertDiscount(discount: FirestoreDiscount) {
  const code = discount.code.trim().toUpperCase()
  const path = `discounts/${code}`
  try {
    await setDoc(doc(db, "discounts", code), {
      ...discount,
      code,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path)
  }
}

export async function deleteDiscount(code: string) {
  const path = `discounts/${code}`
  try {
    await deleteDoc(doc(db, "discounts", code))
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path)
  }
}

export async function createOrder(input: Parameters<typeof sanitizeOrderInput>[0]): Promise<string> {
  const clean = sanitizeOrderInput(input)
  const orderNumber = `ECH-${Date.now().toString().slice(-6)}`
  const path = `orders/${orderNumber}`
  try {
    await setDoc(doc(db, "orders", orderNumber), {
      ...clean,
      orderNumber,
      status: "pending",
      paymentMethod: "gateway",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return orderNumber
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path)
  }
}

export async function fetchUserOrders(uid: string): Promise<FirestoreOrder[]> {
  const path = "orders"
  try {
    const q = query(collection(db, "orders"), where("userId", "==", uid), orderBy("createdAt", "desc"))
    const snap = await getDocs(q)
    return snap.docs.map((d) => {
      const data = d.data()
      return {
        ...(data as Omit<FirestoreOrder, "id" | "createdAt">),
        id: d.id,
        createdAt: formatTs(data.createdAt),
      }
    })
  } catch (error) {
    // Fallback without orderBy if composite index isn't created yet
    try {
      const q = query(collection(db, "orders"), where("userId", "==", uid))
      const snap = await getDocs(q)
      return snap.docs.map((d) => {
        const data = d.data()
        return {
          ...(data as Omit<FirestoreOrder, "id" | "createdAt">),
          id: d.id,
          createdAt: formatTs(data.createdAt),
        }
      })
    } catch (innerError) {
      handleFirestoreError(innerError ?? error, OperationType.LIST, path)
    }
  }
}

export async function fetchAllOrders(): Promise<FirestoreOrder[]> {
  const path = "orders"
  try {
    const snap = await getDocs(collection(db, "orders"))
    return snap.docs.map((d) => {
      const data = d.data()
      return {
        ...(data as Omit<FirestoreOrder, "id" | "createdAt">),
        id: d.id,
        createdAt: formatTs(data.createdAt),
      }
    })
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path)
  }
}

export async function deliverOrderAsAdmin(
  orderId: string,
  payload: { status: OrderStatus; deliveryCredentialsText?: string; deliveryNote?: string },
) {
  const path = `orders/${orderId}`
  try {
    await updateDoc(doc(db, "orders", orderId), {
      status: payload.status,
      ...(payload.deliveryCredentialsText !== undefined
        ? { deliveryCredentialsText: payload.deliveryCredentialsText.slice(0, 2000) }
        : {}),
      ...(payload.deliveryNote !== undefined
        ? { deliveryNote: payload.deliveryNote.slice(0, 1000) }
        : {}),
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path)
  }
}

export async function fetchInventoryItems(): Promise<FirestoreInventoryItem[]> {
  const path = "inventory"
  try {
    const snap = await getDocs(collection(db, "inventory"))
    return snap.docs.map((d) => {
      const data = d.data()
      return {
        ...(data as Omit<FirestoreInventoryItem, "id" | "createdAt">),
        id: d.id,
        createdAt: formatTs(data.createdAt),
      }
    })
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path)
  }
}

export async function addInventoryBulk(input: {
  productId: string
  productTitle: string
  planId: string
  planTitle: string
  deliveryType: DeliveryMethod
  lines: string[]
}): Promise<number> {
  const batch = writeBatch(db)
  const cleanLines = input.lines.map((l) => l.trim()).filter(Boolean).slice(0, 100)
  for (const value of cleanLines) {
    const id = `INV-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    batch.set(doc(db, "inventory", id), {
      productId: input.productId,
      productTitle: input.productTitle.slice(0, 140),
      planId: input.planId,
      planTitle: input.planTitle.slice(0, 120),
      deliveryType: input.deliveryType,
      credentialValue: value.slice(0, 1000),
      status: "available",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }
  try {
    await batch.commit()
    return cleanLines.length
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "inventory")
  }
}

export async function deleteInventoryItem(itemId: string) {
  const path = `inventory/${itemId}`
  try {
    await deleteDoc(doc(db, "inventory", itemId))
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path)
  }
}

export async function createTicket(input: Parameters<typeof sanitizeTicketInput>[0]): Promise<string> {
  const clean = sanitizeTicketInput(input)
  const ticketId = `TK-${Date.now().toString().slice(-6)}`
  const msgId = `MSG-${Date.now().toString().slice(-6)}`

  try {
    await setDoc(doc(db, "tickets", ticketId), {
      userId: clean.userId,
      userName: clean.userName,
      subject: clean.subject,
      department: clean.department,
      status: "open",
      priority: clean.priority,
      ...(clean.orderId ? { orderId: clean.orderId } : {}),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    await setDoc(doc(db, "tickets", ticketId, "messages", msgId), {
      ticketId,
      ticketOwnerId: clean.userId,
      senderId: clean.userId,
      senderRole: "user",
      body: clean.body,
      createdAt: serverTimestamp(),
    })

    return ticketId
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `tickets/${ticketId}`)
  }
}

export async function addTicketMessage(input: {
  ticketId: string
  ticketOwnerId: string
  senderId: string
  senderRole: "user" | "support"
  body: string
  nextStatus?: TicketStatus
}) {
  const msgId = `MSG-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const batch = writeBatch(db)
  batch.set(doc(db, "tickets", input.ticketId, "messages", msgId), {
    ticketId: input.ticketId,
    ticketOwnerId: input.ticketOwnerId,
    senderId: input.senderId,
    senderRole: input.senderRole,
    body: input.body.trim().slice(0, 2000),
    createdAt: serverTimestamp(),
  })
  batch.update(doc(db, "tickets", input.ticketId), {
    status: input.nextStatus ?? (input.senderRole === "support" ? "answered" : "open"),
    updatedAt: serverTimestamp(),
  })
  try {
    await batch.commit()
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `tickets/${input.ticketId}/messages/${msgId}`)
  }
}

export async function fetchUserTickets(uid: string): Promise<FirestoreTicket[]> {
  const path = "tickets"
  try {
    const q = query(collection(db, "tickets"), where("userId", "==", uid))
    const snap = await getDocs(q)
    return snap.docs.map((d) => {
      const data = d.data()
      return {
        ...(data as Omit<FirestoreTicket, "id" | "updatedAt">),
        id: d.id,
        updatedAt: formatTs(data.updatedAt),
      }
    })
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path)
  }
}

export async function fetchAllTickets(): Promise<FirestoreTicket[]> {
  const path = "tickets"
  try {
    const snap = await getDocs(collection(db, "tickets"))
    return snap.docs.map((d) => {
      const data = d.data()
      return {
        ...(data as Omit<FirestoreTicket, "id" | "updatedAt">),
        id: d.id,
        updatedAt: formatTs(data.updatedAt),
      }
    })
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path)
  }
}

export async function fetchTicketMessages(
  ticketId: string,
  ticketOwnerId: string,
  isAdmin: boolean,
): Promise<FirestoreTicketMessage[]> {
  const path = `tickets/${ticketId}/messages`
  try {
    const ref = collection(db, "tickets", ticketId, "messages")
    const q = isAdmin ? ref : query(ref, where("ticketOwnerId", "==", ticketOwnerId))
    const snap = await getDocs(q)
    return snap.docs.map((d) => {
      const data = d.data()
      return {
        ...(data as Omit<FirestoreTicketMessage, "id" | "createdAt">),
        id: d.id,
        createdAt: formatTs(data.createdAt),
      }
    })
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path)
  }
}

export async function fetchWalletTransactions(uid: string): Promise<FirestoreWalletTx[]> {
  const path = `users/${uid}/wallet_transactions`
  try {
    const snap = await getDocs(collection(db, "users", uid, "wallet_transactions"))
    return snap.docs.map((d) => {
      const data = d.data()
      return {
        ...(data as Omit<FirestoreWalletTx, "id" | "createdAt">),
        id: d.id,
        createdAt: formatTs(data.createdAt),
      }
    })
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path)
  }
}

export async function creditWalletAsAdmin(uid: string, amount: number, note: string) {
  const userRef = doc(db, "users", uid)
  const txId = `TRX-${Date.now().toString().slice(-6)}`
  const path = `users/${uid}`
  try {
    const userSnap = await getDoc(userRef)
    const current = Number(userSnap.data()?.walletBalance ?? 0)
    const batch = writeBatch(db)
    batch.update(userRef, {
      walletBalance: Math.max(0, current + Math.round(amount)),
      updatedAt: serverTimestamp(),
    })
    batch.set(doc(db, "users", uid, "wallet_transactions", txId), {
      userId: uid,
      type: note.trim().slice(0, 120) || "شارژ کیف پول توسط مدیر",
      amount: Math.round(amount),
      status: "success",
      note: note.trim().slice(0, 300),
      createdAt: serverTimestamp(),
    })
    await batch.commit()
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path)
  }
}

export async function fetchUserNotifications(uid: string): Promise<FirestoreNotification[]> {
  const path = `users/${uid}/notifications`
  try {
    const snap = await getDocs(collection(db, "users", uid, "notifications"))
    return snap.docs.map((d) => {
      const data = d.data()
      return {
        ...(data as Omit<FirestoreNotification, "id" | "createdAt">),
        id: d.id,
        createdAt: formatTs(data.createdAt),
      }
    })
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path)
  }
}

export async function markNotificationRead(uid: string, notificationId: string) {
  const path = `users/${uid}/notifications/${notificationId}`
  try {
    await updateDoc(doc(db, "users", uid, "notifications", notificationId), {
      unread: false,
    })
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path)
  }
}

export async function submitProductRequest(input: {
  userId?: string
  category: string
  productName: string
  plan?: string
  name: string
  contact: string
  note?: string
}): Promise<string> {
  const id = `REQ-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const path = `product_requests/${id}`
  try {
    await setDoc(doc(db, "product_requests", id), {
      userId: input.userId || "",
      category: input.category.trim().slice(0, 40),
      productName: input.productName.trim().slice(0, 120),
      plan: (input.plan ?? "").trim().slice(0, 120),
      name: input.name.trim().slice(0, 100),
      contact: input.contact.trim().slice(0, 160),
      note: (input.note ?? "").trim().slice(0, 1000),
      status: "new",
      createdAt: serverTimestamp(),
    })
    return id
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path)
  }
}

export async function fetchProductRequests(): Promise<FirestoreProductRequest[]> {
  const path = "product_requests"
  try {
    const snap = await getDocs(collection(db, "product_requests"))
    return snap.docs.map((d) => {
      const data = d.data()
      return {
        ...(data as Omit<FirestoreProductRequest, "id" | "createdAt">),
        id: d.id,
        createdAt: formatTs(data.createdAt),
      }
    })
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path)
  }
}

export async function submitContactMessage(input: {
  name: string
  phone?: string
  email?: string
  subject: string
  message: string
}): Promise<string> {
  const id = `MSG-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const path = `contact_messages/${id}`
  try {
    await setDoc(doc(db, "contact_messages", id), {
      name: input.name.trim().slice(0, 100),
      phone: (input.phone ?? "").trim().slice(0, 30),
      email: (input.email ?? "").trim().slice(0, 160),
      subject: input.subject.trim().slice(0, 140),
      message: input.message.trim().slice(0, 3000),
      status: "new",
      createdAt: serverTimestamp(),
    })
    return id
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path)
  }
}

export async function fetchAllUsersAsAdmin(): Promise<UserPublicProfile[]> {
  const path = "users"
  try {
    const snap = await getDocs(collection(db, "users"))
    return snap.docs.map((d) => d.data() as UserPublicProfile)
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path)
  }
}

export async function updateUserPlanAsAdmin(uid: string, plan: string) {
  const path = `users/${uid}`
  try {
    await updateDoc(doc(db, "users", uid), {
      plan: plan.trim().slice(0, 40) || "عادی",
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path)
  }
}

export async function createNotificationAsAdmin(uid: string, title: string, body: string) {
  const id = `N-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const path = `users/${uid}/notifications/${id}`
  try {
    await setDoc(doc(db, "users", uid, "notifications", id), {
      userId: uid,
      title: title.trim().slice(0, 160),
      body: body.trim().slice(0, 1000),
      unread: true,
      createdAt: serverTimestamp(),
    })
    return id
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path)
  }
}

export async function sendBroadcastNotificationAsAdmin(title: string, body: string): Promise<number> {
  const users = await fetchAllUsersAsAdmin()
  if (users.length === 0) return 0
  const batch = writeBatch(db)
  const cleanTitle = title.trim().slice(0, 160)
  const cleanBody = body.trim().slice(0, 1000)
  for (const user of users.slice(0, 400)) {
    const id = `N-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    batch.set(doc(db, "users", user.uid, "notifications", id), {
      userId: user.uid,
      title: cleanTitle,
      body: cleanBody,
      unread: true,
      createdAt: serverTimestamp(),
    })
  }
  try {
    await batch.commit()
    return users.slice(0, 400).length
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "broadcast_notifications")
  }
}

export async function markAllNotificationsRead(uid: string, ids: string[]) {
  if (ids.length === 0) return
  const batch = writeBatch(db)
  for (const id of ids.slice(0, 100)) {
    batch.update(doc(db, "users", uid, "notifications", id), { unread: false })
  }
  try {
    await batch.commit()
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}/notifications`)
  }
}

export async function fetchContactMessages(): Promise<FirestoreContactMessage[]> {
  const path = "contact_messages"
  try {
    const snap = await getDocs(collection(db, "contact_messages"))
    return snap.docs.map((d) => {
      const data = d.data()
      return {
        ...(data as Omit<FirestoreContactMessage, "id" | "createdAt">),
        id: d.id,
        createdAt: formatTs(data.createdAt),
      }
    })
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path)
  }
}

export async function updateProductRequestStatus(id: string, status: "new" | "reviewed" | "fulfilled") {
  const path = `product_requests/${id}`
  try {
    await updateDoc(doc(db, "product_requests", id), { status })
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path)
  }
}

export async function updateContactMessageStatus(id: string, status: "new" | "replied") {
  const path = `contact_messages/${id}`
  try {
    await updateDoc(doc(db, "contact_messages", id), { status })
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path)
  }
}

export async function checkCatalogSeeded(): Promise<boolean> {
  try {
    const snap = await getDocs(query(collection(db, "products"), where("isActive", "==", true)))
    return !snap.empty
  } catch {
    return false
  }
}

export async function updateTicketStatusAsAdmin(ticketId: string, status: TicketStatus) {
  const path = `tickets/${ticketId}`
  try {
    await updateDoc(doc(db, "tickets", ticketId), {
      status,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path)
  }
}

export async function deleteNotificationAsAdmin(uid: string, notificationId: string) {
  const path = `users/${uid}/notifications/${notificationId}`
  try {
    await deleteDoc(doc(db, "users", uid, "notifications", notificationId))
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path)
  }
}
