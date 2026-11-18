import type { OrderStatus } from "@/lib/types"

export type AnalyticsOrderInput = {
  createdAt: string
  amount: number
  status: OrderStatus
}

export type MonthlyOrderPoint = {
  key: string
  monthLabel: string
  fullMonthLabel: string
  spending: number
  ordersCount: number
  confirmedOrdersCount: number
}

export type SixMonthAnalytics = {
  months: MonthlyOrderPoint[]
  totalSpending: number
  totalOrders: number
  averageMonthlySpending: number
  peakMonthLabel: string | null
}

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
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(input.trim())
    ? `${input.trim()}T12:00:00.000Z`
    : input.trim()
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

export function buildSixMonthOrderSeries(
  orders: AnalyticsOrderInput[],
  referenceDate: Date = new Date(),
): SixMonthAnalytics {
  const refYm = getPersianYearMonth(referenceDate) ?? { year: 1405, month: 8 }
  const refTotalMonths = refYm.year * 12 + (refYm.month - 1)

  const buckets: MonthlyOrderPoint[] = []
  const bucketMap = new Map<string, MonthlyOrderPoint>()

  for (let offset = 5; offset >= 0; offset -= 1) {
    const totalMonths = refTotalMonths - offset
    const year = Math.floor(totalMonths / 12)
    const month = (totalMonths % 12) + 1
    const key = toMonthKey(year, month)
    const monthName = persianMonthNames[month - 1]
    const point: MonthlyOrderPoint = {
      key,
      monthLabel: year !== refYm.year ? `${monthName} ${String(year).slice(-2)}` : monthName,
      fullMonthLabel: `${monthName} ${year}`,
      spending: 0,
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

    bucket.ordersCount += 1
    if (order.status === "paid" || order.status === "delivered") {
      bucket.confirmedOrdersCount += 1
      bucket.spending += Math.max(0, Number(order.amount) || 0)
    }
  }

  const totalSpending = buckets.reduce((sum, item) => sum + item.spending, 0)
  const totalOrders = buckets.reduce((sum, item) => sum + item.ordersCount, 0)
  const averageMonthlySpending = Math.round(totalSpending / buckets.length)

  let peak: MonthlyOrderPoint | null = null
  for (const bucket of buckets) {
    if (bucket.spending > 0 && (!peak || bucket.spending > peak.spending)) {
      peak = bucket
    }
  }

  return {
    months: buckets,
    totalSpending,
    totalOrders,
    averageMonthlySpending,
    peakMonthLabel: peak ? peak.fullMonthLabel : null,
  }
}

export function formatCompactToman(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "0"
  if (value >= 1_000_000) {
    const millions = value / 1_000_000
    return `${Number.isInteger(millions) ? millions : millions.toFixed(1)}M`
  }
  if (value >= 1_000) {
    const thousands = Math.round(value / 1_000)
    return `${thousands}K`
  }
  return String(Math.round(value))
}
