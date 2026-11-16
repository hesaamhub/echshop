import type { DeliveryMethod, OrderStatus, TicketStatus } from "@/lib/types"

/**
 * Schema bounds synced verbatim with firebase-blueprint.json and firestore.rules
 */
export const SCHEMA_LIMITS = {
  idPattern: /^[a-zA-Z0-9_-]+$/,
  slugPattern: /^[a-z0-9-]+$/,
  codePattern: /^[A-Z0-9_-]+$/,
  idMaxLength: 128,
  productTitleMax: 120,
  excerptMax: 300,
  descriptionMax: 4000,
  displayNameMax: 100,
  emailMax: 160,
  phoneMax: 20,
  ticketSubjectMax: 160,
  ticketBodyMax: 2000,
  credentialMax: 1000,
  noteMax: 1000,
  maxFavorites: 100,
  maxQuantity: 20,
} as const

export const VALID_DELIVERY_METHODS: readonly DeliveryMethod[] = [
  "manual",
  "stock",
  "api",
  "upgrade",
  "gift_code",
  "scheduled",
]

export const VALID_ORDER_STATUSES: readonly OrderStatus[] = [
  "pending",
  "paid",
  "delivered",
  "failed",
  "refunded",
]

export const VALID_TICKET_STATUSES: readonly TicketStatus[] = [
  "open",
  "answered",
  "pending_user",
  "closed",
]

export function isValidId(id: unknown): id is string {
  return (
    typeof id === "string" &&
    id.length >= 1 &&
    id.length <= SCHEMA_LIMITS.idMaxLength &&
    SCHEMA_LIMITS.idPattern.test(id)
  )
}

export function isValidSlug(slug: unknown): slug is string {
  return (
    typeof slug === "string" &&
    slug.length >= 1 &&
    slug.length <= 100 &&
    SCHEMA_LIMITS.slugPattern.test(slug)
  )
}

export function isBoundedString(val: unknown, min: number, max: number): val is string {
  return typeof val === "string" && val.length >= min && val.length <= max
}

export function sanitizeOrderInput(input: {
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
}) {
  if (!isValidId(input.userId)) throw new Error("شناسهٔ کاربر نامعتبر است.")
  if (!isBoundedString(input.customerName.trim(), 1, SCHEMA_LIMITS.displayNameMax)) {
    throw new Error("نام خریدار نامعتبر است.")
  }
  if (!isBoundedString(input.customerEmail.trim(), 3, SCHEMA_LIMITS.emailMax)) {
    throw new Error("ایمیل خریدار نامعتبر است.")
  }
  if (!isValidId(input.productId) || !isValidId(input.planId)) {
    throw new Error("شناسهٔ محصول یا پلن نامعتبر است.")
  }
  if (!VALID_DELIVERY_METHODS.includes(input.delivery)) {
    throw new Error("روش تحویل نامعتبر است.")
  }
  if (!Number.isInteger(input.quantity) || input.quantity < 1 || input.quantity > SCHEMA_LIMITS.maxQuantity) {
    throw new Error("تعداد سفارش باید بین ۱ تا ۲۰ باشد.")
  }
  if (typeof input.amount !== "number" || input.amount < 0) {
    throw new Error("مبلغ سفارش نامعتبر است.")
  }

  return {
    userId: input.userId,
    customerName: input.customerName.trim().slice(0, SCHEMA_LIMITS.displayNameMax),
    customerEmail: input.customerEmail.trim().toLowerCase().slice(0, SCHEMA_LIMITS.emailMax),
    customerPhone: (input.customerPhone ?? "").trim().slice(0, SCHEMA_LIMITS.phoneMax),
    productId: input.productId,
    productTitle: input.productTitle.trim().slice(0, 140),
    planId: input.planId,
    planTitle: input.planTitle.trim().slice(0, 120),
    delivery: input.delivery,
    quantity: input.quantity,
    amount: Math.round(input.amount),
    discountAmount: Math.max(0, Math.round(input.discountAmount ?? 0)),
    discountCode: (input.discountCode ?? "").trim().toUpperCase().slice(0, 32),
    paymentMethod: input.paymentMethod,
  }
}

export function sanitizeTicketInput(input: {
  userId: string
  userName: string
  subject: string
  department: "پشتیبانی فنی" | "مالی و پرداخت" | "پیش از خرید"
  priority: "کم" | "متوسط" | "زیاد"
  body: string
  orderId?: string
}) {
  if (!isValidId(input.userId)) throw new Error("شناسهٔ کاربر نامعتبر است.")
  if (!isBoundedString(input.subject.trim(), 1, SCHEMA_LIMITS.ticketSubjectMax)) {
    throw new Error("موضوع تیکت باید بین ۱ تا ۱۶۰ کاراکتر باشد.")
  }
  if (!isBoundedString(input.body.trim(), 1, SCHEMA_LIMITS.ticketBodyMax)) {
    throw new Error("متن تیکت باید بین ۱ تا ۲۰۰۰ کاراکتر باشد.")
  }
  if (input.orderId && !isValidId(input.orderId)) {
    throw new Error("شناسهٔ سفارش نامعتبر است.")
  }

  return {
    userId: input.userId,
    userName: input.userName.trim().slice(0, SCHEMA_LIMITS.displayNameMax) || "کاربر",
    subject: input.subject.trim().slice(0, SCHEMA_LIMITS.ticketSubjectMax),
    department: input.department,
    priority: input.priority,
    body: input.body.trim().slice(0, SCHEMA_LIMITS.ticketBodyMax),
    orderId: input.orderId?.trim() || "",
  }
}

export function computeDiscountAmount(
  subtotal: number,
  discount: { type: "percent" | "fixed"; value: number; minOrder: number; isActive: boolean; used: number; limit: number },
): number {
  if (!discount.isActive) return 0
  if (discount.limit > 0 && discount.used >= discount.limit) return 0
  if (subtotal < discount.minOrder) return 0
  if (discount.type === "percent") {
    const pct = Math.min(100, Math.max(0, discount.value))
    return Math.min(subtotal, Math.round((subtotal * pct) / 100))
  }
  return Math.min(subtotal, Math.max(0, Math.round(discount.value)))
}
