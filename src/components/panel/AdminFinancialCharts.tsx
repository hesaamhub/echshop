"use client"

import React, { useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  Award,
  BarChart3,
  PieChart as PieChartIcon,
  Receipt,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { AdminChartsSkeleton } from "@/components/panel/AdminSkeletons"
import { Badge, Card } from "@/components/panel/Ui"
import type { FirestoreOrder } from "@/lib/firebase/repository"
import {
  buildAdminFinancialAnalytics,
  type AdminMonthlySalesPoint,
  type BestSellerSlice,
} from "@/lib/orders/adminFinancialAnalytics"
import { formatCompactToman } from "@/lib/orders/orderAnalytics"
import type { Product } from "@/lib/types"
import { cn, toman } from "@/lib/utils"

type Props = {
  orders: FirestoreOrder[]
  products: Product[]
  loading?: boolean
  refreshing?: boolean
}

type BarMetric ="revenue" |"orders"
type PieMetric ="revenue" |"units"

type BarTooltipProps = {
  active?: boolean
  payload?: Array<{ payload: AdminMonthlySalesPoint }>
  metric: BarMetric
}

function MonthlyBarTooltip({ active, payload, metric }: BarTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const point = payload[0]?.payload
  if (!point) return null

  return (
    <div
      dir="rtl"
      className="rounded-2xl border border-slate-200/80 bg-white/95 px-3.5 py-2.5 text-right shadow-[0_16px_36px_-14px_rgba(15,23,42,0.28)] backdrop-blur-md"
    >
      <p className="text-[11.5px] font-bold text-[#0a1b33]">
        {point.fullMonthLabel}
      </p>
      <div className="mt-1.5 space-y-1 text-[11px]">
        {metric === "revenue" ? (
          <>
            <p className="flex items-center justify-between gap-4 text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#1b39f5]" />
                فروش تاییدشده:
              </span>
              <span className="num font-bold text-[#0a1b33]">
                {toman(point.confirmedRevenue)} تومان
              </span>
            </p>
            <p className="flex items-center justify-between gap-4 text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
                در انتظار پرداخت:
              </span>
              <span className="num font-semibold text-[#0a1b33]">
                {toman(point.pendingRevenue)} تومان
              </span>
            </p>
          </>
        ) : (
          <>
            <p className="flex items-center justify-between gap-4 text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#10b981]" />
                کل سفارش‌ها:
              </span>
              <span className="num font-bold text-[#0a1b33]">
                {toman(point.ordersCount)} سفارش
              </span>
            </p>
            <p className="flex items-center justify-between gap-4 text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#1b39f5]" />
                پرداخت‌شده / تحویل‌شده:
              </span>
              <span className="num font-semibold text-[#0a1b33]">
                {toman(point.confirmedOrdersCount)} سفارش
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

type PieTooltipProps = {
  active?: boolean
  payload?: Array<{ payload: BestSellerSlice }>
  metric: PieMetric
}

function BestSellerPieTooltip({ active, payload, metric }: PieTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const slice = payload[0]?.payload
  if (!slice) return null

  return (
    <div
      dir="rtl"
      className="rounded-2xl border border-slate-200/80 bg-white/95 px-3.5 py-2.5 text-right shadow-[0_16px_36px_-14px_rgba(15,23,42,0.28)] backdrop-blur-md"
    >
      <p className="flex items-center gap-2 text-[11.5px] font-bold text-[#0a1b33]">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: slice.color }} />
        <span>{slice.name}</span>
      </p>
      <div className="mt-1.5 space-y-1 text-[11px] text-slate-600">
        <p className="flex items-center justify-between gap-4">
          <span>فروش تخمینی / ثبت‌شده:</span>
          <span className="num font-bold text-[#0a1b33]">
            {toman(slice.revenue)} تومان
          </span>
        </p>
        <p className="flex items-center justify-between gap-4">
          <span>تعداد فروش:</span>
          <span className="num font-semibold text-[#0a1b33]">
            {toman(slice.units)} عدد
          </span>
        </p>
        <p className="flex items-center justify-between gap-4">
          <span>سهم از کل ({metric === "revenue" ? "درآمد" : "تعداد"}):</span>
          <span className="num font-bold text-[#1b39f5]">
            {metric === "revenue" ? slice.shareRevenuePct : slice.shareUnitsPct}٪
          </span>
        </p>
      </div>
    </div>
  )
}

export default function AdminFinancialCharts({
  orders,
  products,
  loading = false,
  refreshing = false,
}: Props) {
  const [monthsCount, setMonthsCount] = useState<6 | 12>(6)
  const [barMetric, setBarMetric] = useState<BarMetric>("revenue")
  const [pieMetric, setPieMetric] = useState<PieMetric>("revenue")

  const analytics = useMemo(
    () => buildAdminFinancialAnalytics(orders, products, { monthsCount, topLimit: 5 }),
    [orders, products, monthsCount],
  )

  if (loading) {
    return (
      <section data-testid="admin-financial-charts" aria-label="داشبورد تحلیل مالی مدیریت" aria-busy="true">
        <AdminChartsSkeleton />
      </section>
    )
  }

  const gridStroke ="rgba(148,163,184,0.25)"
  const axisTickColor ="#64748b"
  const primaryBarColor ="#1b39f5"
  const pendingBarColor ="#f59e0b"
  const ordersBarColor ="#10b981"

  const pieTotalRevenue = analytics.bestSellers.reduce((sum, s) => sum + s.revenue, 0)
  const pieTotalUnits = analytics.bestSellers.reduce((sum, s) => sum + s.units, 0)
  const kpiCardClass =
    "relative overflow-hidden rounded-3xl border border-slate-200/75 bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]"

  return (
    <section
      data-testid="admin-financial-charts"
      aria-label="داشبورد تحلیل مالی مدیریت"
      aria-busy={refreshing}
      className="space-y-4"
    >
      {/* Financial KPI strip */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <div className={kpiCardClass}>
          {refreshing ? (
            <div aria-hidden="true" className="loading-sweep-bar absolute inset-x-0 top-0 h-0.5 bg-[#1b39f5]/12" />
          ) : null}
          <div className={cn("transition-opacity duration-200", refreshing && "opacity-60")}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">
              فروش تاییدشده ({monthsCount === 6 ? "۶ ماه" : "۱۲ ماه"})
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#1b39f5]/10 text-[#1b39f5]">
              <BarChart3 className="h-4 w-4" />
            </span>
          </div>
          <p className="num mt-2 text-[17px] font-extrabold text-[#0a1b33] sm:text-[19px]">
            {toman(analytics.totalConfirmedRevenue)}{""}
            <span className="text-[11px] font-medium text-slate-400">تومان</span>
          </p>
          <p className="mt-1 text-[10.5px] text-slate-400">
            در انتظار پرداخت: <span className="num">{toman(analytics.totalPendingRevenue)}</span> تومان
          </p>
          </div>
        </div>

        <div className={kpiCardClass}>
          {refreshing ? (
            <div aria-hidden="true" className="loading-sweep-bar absolute inset-x-0 top-0 h-0.5 bg-[#1b39f5]/12" />
          ) : null}
          <div className={cn("transition-opacity duration-200", refreshing && "opacity-60")}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">
              رشد فروش ماهانه
            </span>
            <span
              className={`grid h-8 w-8 place-items-center rounded-xl ${
                (analytics.monthOverMonthGrowthPct ?? 0) >= 0
                  ? "bg-emerald-500/12 text-emerald-600"
                  : "bg-rose-500/12 text-rose-600"
              }`}
            >
              {(analytics.monthOverMonthGrowthPct ?? 0) >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
            </span>
          </div>
          <p className="num mt-2 text-[17px] font-extrabold text-[#0a1b33] sm:text-[19px]">
            {analytics.monthOverMonthGrowthPct === null
              ? "—"
              : `${analytics.monthOverMonthGrowthPct > 0 ? "+" : ""}${analytics.monthOverMonthGrowthPct}٪`}
          </p>
          <p className="mt-1 text-[10.5px] text-slate-400">
            اوج فروش: {analytics.peakMonthLabel ?? "در انتظار ثبت سفارش"}
          </p>
          </div>
        </div>

        <div className={kpiCardClass}>
          {refreshing ? (
            <div aria-hidden="true" className="loading-sweep-bar absolute inset-x-0 top-0 h-0.5 bg-[#1b39f5]/12" />
          ) : null}
          <div className={cn("transition-opacity duration-200", refreshing && "opacity-60")}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">
              میانگین ارزش هر سفارش
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-500/12 text-amber-600">
              <Receipt className="h-4 w-4" />
            </span>
          </div>
          <p className="num mt-2 text-[17px] font-extrabold text-[#0a1b33] sm:text-[19px]">
            {toman(analytics.averageOrderValue)}{""}
            <span className="text-[11px] font-medium text-slate-400">تومان</span>
          </p>
          <p className="mt-1 text-[10.5px] text-slate-400">
            از <span className="num">{toman(analytics.confirmedOrdersCount)}</span> سفارش تاییدشده
          </p>
          </div>
        </div>

        <div className={kpiCardClass}>
          {refreshing ? (
            <div aria-hidden="true" className="loading-sweep-bar absolute inset-x-0 top-0 h-0.5 bg-[#1b39f5]/12" />
          ) : null}
          <div className={cn("transition-opacity duration-200", refreshing && "opacity-60")}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">
              پرفروش‌ترین محصول
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-violet-500/12 text-violet-600">
              <Award className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 truncate text-[14px] font-extrabold text-[#0a1b33] sm:text-[15px]">
            {analytics.topProductName ?? "—"}
          </p>
          <p className="mt-1 text-[10.5px] text-slate-400">
            منبع:{""}
            {analytics.bestSellersSource === "orders"
              ? "سفارش‌های ثبت‌شده"
              : "آمار فروش کاتالوگ"}
          </p>
          </div>
        </div>
      </div>

      {/* Main Charts Row: Monthly Sales Bar Chart + Best Sellers Pie Chart */}
      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        {/* Bar Chart: Monthly Sales Trend */}
        <Card
          title="روند فروش ماهانه (نمودار میله‌ای)"
          refreshing={refreshing}
          refreshLabel="در حال بروزرسانی نمودار فروش…"
          action={
            <div className="flex flex-wrap items-center gap-1.5">
              <div className="inline-flex rounded-xl bg-slate-100 p-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setBarMetric("revenue")}
                  className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                    barMetric === "revenue"
                      ? "bg-white text-[#0a1b33] shadow-xs"
                      : "text-slate-500 hover:text-[#0a1b33]"
                  }`}
                >
                  درآمد
                </button>
                <button
                  type="button"
                  onClick={() => setBarMetric("orders")}
                  className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                    barMetric === "orders"
                      ? "bg-white text-[#0a1b33] shadow-xs"
                      : "text-slate-500 hover:text-[#0a1b33]"
                  }`}
                >
                  تعداد سفارش
                </button>
              </div>
              <div className="inline-flex rounded-xl bg-slate-100 p-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setMonthsCount(6)}
                  className={`rounded-lg px-2 py-1 font-semibold transition-colors ${
                    monthsCount === 6
                      ? "bg-white text-[#0a1b33] shadow-xs"
                      : "text-slate-500 hover:text-[#0a1b33]"
                  }`}
                >
                  ۶ ماهه
                </button>
                <button
                  type="button"
                  onClick={() => setMonthsCount(12)}
                  className={`rounded-lg px-2 py-1 font-semibold transition-colors ${
                    monthsCount === 12
                      ? "bg-white text-[#0a1b33] shadow-xs"
                      : "text-slate-500 hover:text-[#0a1b33]"
                  }`}
                >
                  ۱۲ ماهه
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-3">
                  {barMetric === "revenue" ? (
                    <>
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="h-2.5 w-2.5 rounded-sm"
                          style={{ backgroundColor: primaryBarColor }}
                        />
                        فروش تاییدشده (تومان)
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="h-2.5 w-2.5 rounded-sm"
                          style={{ backgroundColor: pendingBarColor }}
                        />
                        در انتظار پرداخت
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="h-2.5 w-2.5 rounded-sm"
                          style={{ backgroundColor: ordersBarColor }}
                        />
                        کل سفارش‌ها
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="h-2.5 w-2.5 rounded-sm"
                          style={{ backgroundColor: primaryBarColor }}
                        />
                        تاییدشده
                      </span>
                    </>
                  )}
                </div>
                {analytics.totalOrders === 0 ? (
                  <Badge tone="amber">هنوز سفارش ثبت‌شده‌ای در این بازه نیست</Badge>
                ) : null}
              </div>

              <div className="h-[270px] w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analytics.months}
                    margin={{ top: 8, right: 8, left: 4, bottom: 4 }}
                    barGap={4}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                    <XAxis
                      dataKey="monthLabel"
                      tick={{ fill: axisTickColor, fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: axisTickColor, fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={46}
                      tickFormatter={(val: number) =>
                        barMetric === "revenue" ? formatCompactToman(val) : String(val)
                      }
                      allowDecimals={false}
                    />
                    <Tooltip
                      content={<MonthlyBarTooltip metric={barMetric} />}
                      cursor={{ fill:"rgba(27,57,245,0.05)" }}
                    />
                    {barMetric === "revenue" ? (
                      <>
                        <Bar
                          dataKey="confirmedRevenue"
                          name="فروش تاییدشده"
                          fill={primaryBarColor}
                          radius={[8, 8, 2, 2]}
                          maxBarSize={32}
                        />
                        <Bar
                          dataKey="pendingRevenue"
                          name="در انتظار پرداخت"
                          fill={pendingBarColor}
                          radius={[8, 8, 2, 2]}
                          maxBarSize={22}
                        />
                      </>
                    ) : (
                      <>
                        <Bar
                          dataKey="ordersCount"
                          name="کل سفارش‌ها"
                          fill={ordersBarColor}
                          radius={[8, 8, 2, 2]}
                          maxBarSize={28}
                        />
                        <Bar
                          dataKey="confirmedOrdersCount"
                          name="تاییدشده"
                          fill={primaryBarColor}
                          radius={[8, 8, 2, 2]}
                          maxBarSize={24}
                        />
                      </>
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
        </Card>

        {/* Pie Chart: Best-Selling Products */}
        <Card
          title="پرفروش‌ترین محصولات (نمودار دایره‌ای)"
          refreshing={refreshing}
          refreshLabel="در حال بروزرسانی سهم محصولات…"
          action={
            <div className="inline-flex rounded-xl bg-slate-100 p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setPieMetric("revenue")}
                className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                  pieMetric === "revenue"
                    ? "bg-white text-[#0a1b33] shadow-xs"
                    : "text-slate-500 hover:text-[#0a1b33]"
                }`}
              >
                درآمد
              </button>
              <button
                type="button"
                onClick={() => setPieMetric("units")}
                className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                  pieMetric === "units"
                    ? "bg-white text-[#0a1b33] shadow-xs"
                    : "text-slate-500 hover:text-[#0a1b33]"
                }`}
              >
                تعداد
              </button>
            </div>
          }
        >
          {analytics.bestSellers.length === 0 ? (
            <div className="flex h-[290px] flex-col items-center justify-center gap-2 text-center text-[12px] text-slate-400">
              <PieChartIcon className="h-8 w-8 opacity-40" />
              <p>داده‌ای برای نمایش سهم فروش محصولات یافت نشد.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative h-[205px] w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.bestSellers}
                      dataKey={pieMetric === "revenue" ? "revenue" : "units"}
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={84}
                      paddingAngle={2.5}
                      stroke="#ffffff"
                      strokeWidth={2}
                    >
                      {analytics.bestSellers.map((slice) => (
                        <Cell key={slice.id} fill={slice.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<BestSellerPieTooltip metric={pieMetric} />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-medium text-slate-400">
                    {pieMetric === "revenue" ? "کل فروش" : "کل تعداد"}
                  </span>
                  <span className="num text-[13px] font-extrabold text-[#0a1b33]">
                    {pieMetric === "revenue"
                      ? formatCompactToman(pieTotalRevenue)
                      : toman(pieTotalUnits)}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                {analytics.bestSellers.map((slice) => {
                  const pct =
                    pieMetric === "revenue" ? slice.shareRevenuePct : slice.shareUnitsPct
                  return (
                    <div
                      key={slice.id}
                      className="flex items-center justify-between gap-2 rounded-xl bg-slate-50/80 px-3 py-1.5 text-[11.5px]"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: slice.color }}
                        />
                        <span className="truncate font-semibold text-[#0a1b33]">
                          {slice.name}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="num text-[11px] text-slate-500">
                          {pieMetric === "revenue"
                            ? `${formatCompactToman(slice.revenue)}`
                            : `${toman(slice.units)} عدد`}
                        </span>
                        <span className="num min-w-[38px] text-left font-bold text-[#1b39f5]">
                          {pct}٪
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  )
}
