import { products } from "./data"
import type { Plan, Product } from "./types"

export type CartLine = {
  product: Product
  plan: Plan
  quantity: number
}

/** سبد خرید نمونه — بعداً به دیتابیس و وضعیت واقعی کاربر وصل می‌شود */
export const cartLines: CartLine[] = [products[0], products[1], products[4]].map(
  (product, index) => ({
    product,
    plan: product.plans[Math.min(index, product.plans.length - 1)],
    quantity: index === 2 ? 2 : 1,
  }),
)

export const cartCount = cartLines.reduce((sum, line) => sum + line.quantity, 0)

export const cartSubtotal = cartLines.reduce(
  (sum, line) => sum + line.plan.price * line.quantity,
  0,
)

export const cartDiscount = 180000

/** مبلغ نهایی هرگز منفی نمی‌شود */
export const cartTotal = Math.max(0, cartSubtotal - cartDiscount)
