import type { Product } from "./types"
import { products } from "./data"
import { discountPercent } from "./utils"

/** شمارهٔ عددی شناسهٔ محصول (p-12 ← 12) */
function idNumber(product: Product) {
  return Number(product.id.replace(/\D/g, "")) || 0
}

/** بیشترین درصد تخفیف بین پلن‌های یک محصول */
export function bestDiscount(product: Product) {
  return product.plans.reduce(
    (max, plan) => Math.max(max, discountPercent(plan.price, plan.compareAt)),
    0,
  )
}

/** تازه‌ترین اکانت‌ها — اول محصولات با برچسب جدید، سپس جدیدترین افزوده‌ها */
export function newArrivals(limit = 3): Product[] {
  return [...products]
    .sort((a, b) => {
      const badgeScore = (product: Product) => (product.badge === "جدید" ? 1 : 0)
      const byBadge = badgeScore(b) - badgeScore(a)
      if (byBadge !== 0) return byBadge
      return idNumber(b) - idNumber(a)
    })
    .slice(0, limit)
}

/** بیشترین تخفیف‌های فعال */
export function topDiscounts(limit = 3): Product[] {
  return [...products]
    .filter((product) => bestDiscount(product) > 0)
    .sort((a, b) => bestDiscount(b) - bestDiscount(a))
    .slice(0, limit)
}
