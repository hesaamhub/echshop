"use client"

import { useCallback, useEffect, useState } from "react"
import { products } from "@/lib/data"
import type { Plan, Product } from "@/lib/types"

export type StoredCartItem = {
  productId: string
  planId: string
  quantity: number
}

export type ResolvedCartLine = {
  product: Product
  plan: Plan
  quantity: number
}

const STORAGE_KEY = "echshop_cart_v1"
const CART_EVENT = "echshop:cart-updated"

export function addCartItem(items: StoredCartItem[], productId: string, planId: string, qty = 1): StoredCartItem[] {
  const safeQty = Math.max(1, Math.min(20, Math.round(qty)))
  const existing = items.find((item) => item.productId === productId && item.planId === planId)
  if (existing) {
    return items.map((item) =>
      item.productId === productId && item.planId === planId
        ? { ...item, quantity: Math.min(20, item.quantity + safeQty) }
        : item,
    )
  }
  return [...items, { productId, planId, quantity: safeQty }]
}

export function setCartItemQuantity(
  items: StoredCartItem[],
  productId: string,
  planId: string,
  quantity: number,
): StoredCartItem[] {
  if (quantity <= 0) {
    return items.filter((item) => !(item.productId === productId && item.planId === planId))
  }
  const safeQty = Math.min(20, Math.round(quantity))
  return items.map((item) =>
    item.productId === productId && item.planId === planId ? { ...item, quantity: safeQty } : item,
  )
}

export function removeCartItem(items: StoredCartItem[], productId: string, planId: string): StoredCartItem[] {
  return items.filter((item) => !(item.productId === productId && item.planId === planId))
}

export function resolveCartLines(items: StoredCartItem[], catalog: Product[] = products): ResolvedCartLine[] {
  const lines: ResolvedCartLine[] = []
  for (const item of items) {
    const product = catalog.find((p) => p.id === item.productId)
    if (!product) continue
    const plan = product.plans.find((pl) => pl.id === item.planId) ?? product.plans[0]
    if (!plan) continue
    lines.push({ product, plan, quantity: item.quantity })
  }
  return lines
}

export function computeCartTotals(lines: ResolvedCartLine[], discountAmount = 0) {
  const count = lines.reduce((sum, line) => sum + line.quantity, 0)
  const subtotal = lines.reduce((sum, line) => sum + line.plan.price * line.quantity, 0)
  const discount = Math.max(0, Math.min(subtotal, Math.round(discountAmount)))
  const total = Math.max(0, subtotal - discount)
  return { count, subtotal, discount, total }
}

const DISCOUNTCODE_KEY = "echshop_discount_v1"

function readStoredCart(): StoredCartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (entry): entry is StoredCartItem =>
        Boolean(entry) &&
        typeof entry.productId === "string" &&
        typeof entry.planId === "string" &&
        typeof entry.quantity === "number" &&
        entry.quantity >= 1,
    )
  } catch {
    return []
  }
}

function writeStoredCart(items: StoredCartItem[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event(CART_EVENT))
}

export type AppliedDiscount = {
  code: string
  type: "percent" | "fixed"
  value: number
  minOrder: number
}

function readStoredDiscount(): AppliedDiscount | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(DISCOUNTCODE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed.code !== "string") return null
    return parsed as AppliedDiscount
  } catch {
    return null
  }
}

function writeStoredDiscount(discount: AppliedDiscount | null) {
  if (typeof window === "undefined") return
  if (discount) {
    window.localStorage.setItem(DISCOUNTCODE_KEY, JSON.stringify(discount))
  } else {
    window.localStorage.removeItem(DISCOUNTCODE_KEY)
  }
  window.dispatchEvent(new Event(CART_EVENT))
}

export function useCart(catalog: Product[] = products) {
  const [items, setItems] = useState<StoredCartItem[]>([])
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null)

  useEffect(() => {
    setItems(readStoredCart())
    setAppliedDiscount(readStoredDiscount())
    const sync = () => {
      setItems(readStoredCart())
      setAppliedDiscount(readStoredDiscount())
    }
    window.addEventListener(CART_EVENT, sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener(CART_EVENT, sync)
      window.removeEventListener("storage", sync)
    }
  }, [])

  const add = useCallback((productId: string, planId: string, qty = 1) => {
    const next = addCartItem(readStoredCart(), productId, planId, qty)
    writeStoredCart(next)
    setItems(next)
  }, [])

  const updateQty = useCallback((productId: string, planId: string, quantity: number) => {
    const next = setCartItemQuantity(readStoredCart(), productId, planId, quantity)
    writeStoredCart(next)
    setItems(next)
  }, [])

  const remove = useCallback((productId: string, planId: string) => {
    const next = removeCartItem(readStoredCart(), productId, planId)
    writeStoredCart(next)
    setItems(next)
  }, [])

  const clear = useCallback(() => {
    writeStoredCart([])
    writeStoredDiscount(null)
    setItems([])
    setAppliedDiscount(null)
  }, [])

  const applyDiscount = useCallback((discount: AppliedDiscount | null) => {
    writeStoredDiscount(discount)
    setAppliedDiscount(discount)
  }, [])

  const lines = resolveCartLines(items, catalog)
  const rawSubtotal = lines.reduce((sum, line) => sum + line.plan.price * line.quantity, 0)
  let discountAmount = 0
  if (appliedDiscount && rawSubtotal >= appliedDiscount.minOrder) {
    discountAmount =
      appliedDiscount.type === "percent"
        ? Math.round((rawSubtotal * Math.min(100, Math.max(0, appliedDiscount.value))) / 100)
        : Math.round(appliedDiscount.value)
  }
  const totals = computeCartTotals(lines, discountAmount)

  return {
    items,
    lines,
    appliedDiscount,
    ...totals,
    add,
    updateQty,
    remove,
    clear,
    applyDiscount,
  }
}
