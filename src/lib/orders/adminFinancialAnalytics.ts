import type { OrderStatus, Product } from "@/lib/types"

export type AdminAnalyticsOrderInput = {
  id?: string
  createdAt: string
  amount: number
  quantity?: number
  status: OrderStatus
  productId?: string
  productTitle?: string
}

export type AdminMonthlySalesPoint = {
  key: string
  monthLabel: string
  fullMonthLabel: string
  confirmedRevenue: number
  pendingRevenue: number
  ordersCount: number
  confirmedOrdersCount: number
}

export type BestSellerSlice = {
  id: string
  name: string
  shortName: string
  revenue: number
  units: number
  shareRevenuePct: number
  shareUnitsPct: number
  color: string
  isOther?: boolean
}

export type AdminFinancialAnalytics = {
  months: AdminMonthlySalesPoint[]
  totalConfirmedRevenue: number
  totalPendingRevenue: number
  totalOrders: number
  confirmedOrdersCount: number
  averageOrderValue: number
  monthOverMonthGrowthPct: number | null
  peakMonthLabel: string | null
  bestSellers: BestSellerSlice[]
  bestSellersSource: "orders" | "catalog"
  topProductName: string | null
}

export const BEST_SELLER_PALETTE = [
  "#1b39f5",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#64748b",
] as const

const persianMonthNames = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
] as const

const persianPartsFormatter = new Intl.DateTimeFormat("en-US-u-ca-persian", {
  year: "numeric",
  month: "numeric",
  timeZone: "UTC",
})

function parseDateSafe(input: string): Date | null {
  if (!input || typeof input !== "string") return null
  const trimmed = input.trim()
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
    ? `${trimmed}T12:00:00.000Z`
    : trimmed
  const parsed = new Date(normalized)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function getPersianYearMonth(date: Date): { year: number; month: number } | null {
  const parts = persianPartsFormatter.formatToParts(date)
  const yearPart = parts.find((p) => p.type === "year")?.value
  const monthPart = parts.find((p) => p.type === "month")?.value
  const year = yearPart ? Number.parseInt(yearPart, 10) : Number.NaN
  const month = monthPart ? Number.parseInt(monthPart, 10) : Number.NaN
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    return null
  }
  return { year, month }
}

function toMonthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`
}

function truncateLabel(text: string, maxLen = 22): string {
  const clean = text.trim()
  if (clean.length <= maxLen) return clean
  return `${clean.slice(0, maxLen - 1)}…`
}

function getProductBasePrice(product: Product): number {
  if (!Array.isArray(product.plans) || product.plans.length === 0) return 0
  return Math.min(...product.plans.map((p) => Math.max(0, Number(p.price) || 0)))
}

export function buildAdminMonthlySalesSeries(
  orders: AdminAnalyticsOrderInput[],
  monthsCount: 6 | 12 = 6,
  referenceDate: Date = new Date(),
): AdminMonthlySalesPoint[] {
  const refYm = getPersianYearMonth(referenceDate) ?? { year: 1405, month: 8 }
  const refTotalMonths = refYm.year * 12 + (refYm.month - 1)

  const buckets: AdminMonthlySalesPoint[] = []
  const bucketMap = new Map<string, AdminMonthlySalesPoint>()

  for (let offset = monthsCount - 1; offset >= 0; offset -= 1) {
    const totalMonths = refTotalMonths - offset
    const year = Math.floor(totalMonths / 12)
    const month = (totalMonths % 12) + 1
    const key = toMonthKey(year, month)
    const monthName = persianMonthNames[month - 1]
    const point: AdminMonthlySalesPoint = {
      key,
      monthLabel: year !== refYm.year ? `${monthName} ${String(year).slice(-2)}` : monthName,
      fullMonthLabel: `${monthName} ${year}`,
      confirmedRevenue: 0,
      pendingRevenue: 0,
      ordersCount: 0,
      confirmedOrdersCount: 0,
    }
    buckets.push(point)
    bucketMap.set(key, point)
  }

  for (const order of orders) {
    const date = parseDateSafe(order.createdAt)
    if (!date) continue
    const ym = getPersianYearMonth(date)
    if (!ym) continue
    const bucket = bucketMap.get(toMonthKey(ym.year, ym.month))
    if (!bucket) continue

    const amount = Math.max(0, Number(order.amount) || 0)
    bucket.ordersCount += 1
    if (order.status === "paid" || order.status === "delivered") {
      bucket.confirmedOrdersCount += 1
      bucket.confirmedRevenue += amount
    } else if (order.status === "pending") {
      bucket.pendingRevenue += amount
    }
  }

  return buckets
}

export function buildBestSellingProductsBreakdown(
  orders: AdminAnalyticsOrderInput[],
  products: Product[],
  topLimit = 5,
): { slices: BestSellerSlice[]; source: "orders" | "catalog" } {
  const confirmedOrders = orders.filter(
    (order) => order.status === "paid" || order.status === "delivered",
  )

  const entries: Array<{ id: string; name: string; revenue: number; units: number }> = []
  let source: "orders" | "catalog" = "orders"

  if (confirmedOrders.length > 0) {
    const agg = new Map<string, { id: string; name: string; revenue: number; units: number }>()
    for (const order of confirmedOrders) {
      const id = (order.productId || order.productTitle || "unknown").trim()
      const name = (order.productTitle || order.productId || "محصول دیجیتال").trim()
      const existing = agg.get(id) ?? { id, name, revenue: 0, units: 0 }
      existing.revenue += Math.max(0, Number(order.amount) || 0)
      existing.units += Math.max(1, Number(order.quantity) || 1)
      agg.set(id, existing)
    }
    entries.push(...agg.values())
  } else {
    source = "catalog"
    for (const product of products) {
      const units = Math.max(0, Number(product.sold) || 0)
      if (units <= 0) continue
      const unitPrice = getProductBasePrice(product)
      entries.push({
        id: product.id,
        name: product.title,
        revenue: units * unitPrice,
        units,
      })
    }
  }

  if (entries.length === 0) {
    return { slices: [], source }
  }

  const sorted = [...entries].sort((a, b) => {
    if (b.revenue !== a.revenue) return b.revenue - a.revenue
    return b.units - a.units
  })

  const limit = Math.max(1, Math.min(topLimit, BEST_SELLER_PALETTE.length - 1))
  const topEntries = sorted.slice(0, limit)
  const restEntries = sorted.slice(limit)

  const combined = [...topEntries]
  if (restEntries.length > 0) {
    combined.push({
      id: "other-products",
      name: "سایر محصولات",
      revenue: restEntries.reduce((sum, item) => sum + item.revenue, 0),
      units: restEntries.reduce((sum, item) => sum + item.units, 0),
    })
  }

  const totalRevenue = combined.reduce((sum, item) => sum + item.revenue, 0)
  const totalUnits = combined.reduce((sum, item) => sum + item.units, 0)

  const slices: BestSellerSlice[] = combined.map((item, idx) => ({
    id: item.id,
    name: item.name,
    shortName: truncateLabel(item.name, 20),
    revenue: item.revenue,
    units: item.units,
    shareRevenuePct: totalRevenue > 0 ? Math.round((item.revenue / totalRevenue) * 1000) / 10 : 0,
    shareUnitsPct: totalUnits > 0 ? Math.round((item.units / totalUnits) * 1000) / 10 : 0,
    color:
      item.id === "other-products"
        ? BEST_SELLER_PALETTE[BEST_SELLER_PALETTE.length - 1]
        : BEST_SELLER_PALETTE[idx % (BEST_SELLER_PALETTE.length - 1)],
    isOther: item.id === "other-products",
  }))

  return { slices, source }
}

export function buildAdminFinancialAnalytics(
  orders: AdminAnalyticsOrderInput[],
  products: Product[],
  options?: { monthsCount?: 6 | 12; topLimit?: number; referenceDate?: Date },
): AdminFinancialAnalytics {
  const monthsCount = options?.monthsCount ?? 6
  const topLimit = options?.topLimit ?? 5
  const months = buildAdminMonthlySalesSeries(orders, monthsCount, options?.referenceDate)

  const totalConfirmedRevenue = months.reduce((sum, item) => sum + item.confirmedRevenue, 0)
  const totalPendingRevenue = months.reduce((sum, item) => sum + item.pendingRevenue, 0)
  const totalOrders = months.reduce((sum, item) => sum + item.ordersCount, 0)
  const confirmedOrdersCount = months.reduce((sum, item) => sum + item.confirmedOrdersCount, 0)
  const averageOrderValue =
    confirmedOrdersCount > 0 ? Math.round(totalConfirmedRevenue / confirmedOrdersCount) : 0

  let monthOverMonthGrowthPct: number | null = null
  if (months.length >= 2) {
    const current = months[months.length - 1].confirmedRevenue
    const previous = months[months.length - 2].confirmedRevenue
    if (previous > 0) {
      monthOverMonthGrowthPct = Math.round(((current - previous) / previous) * 1000) / 10
    } else if (current > 0) {
      monthOverMonthGrowthPct = 100
    }
  }

  let peak: AdminMonthlySalesPoint | null = null
  for (const bucket of months) {
    if (bucket.confirmedRevenue > 0 && (!peak || bucket.confirmedRevenue > peak.confirmedRevenue)) {
      peak = bucket
    }
  }

  const { slices: bestSellers, source: bestSellersSource } = buildBestSellingProductsBreakdown(
    orders,
    products,
    topLimit,
  )

  return {
    months,
    totalConfirmedRevenue,
    totalPendingRevenue,
    totalOrders,
    confirmedOrdersCount,
    averageOrderValue,
    monthOverMonthGrowthPct,
    peakMonthLabel: peak ? peak.fullMonthLabel : null,
    bestSellers,
    bestSellersSource,
    topProductName: bestSellers[0]?.name ?? null,
  }
}
