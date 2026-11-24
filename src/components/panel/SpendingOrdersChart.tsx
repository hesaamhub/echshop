"use client"

import { useEffect, useId, useMemo, useState } from "react"
import Link from "next/link"
import { BarChart3, ShoppingBag, TrendingUp } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card } from "@/components/panel/Ui"
import {
  buildSixMonthOrderSeries,
  formatCompactToman,
  type AnalyticsOrderInput,
  type MonthlyOrderPoint,
} from "@/lib/orders/orderAnalytics"
import { cn, toman } from "@/lib/utils"

type ChartMode ="combined" |"spending" |"frequency"

type TooltipPayloadItem = {
  dataKey?: string | number
  value?: number | string
  payload?: MonthlyOrderPoint
}

function CustomChartTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: ReadonlyArray<TooltipPayloadItem>
}) {
  if (!active || !payload || payload.length === 0) return null
  const point = payload[0]?.payload
  if (!point) return null

  return (
    <div
      dir="rtl"
      className="min-w-[175px] rounded-2xl border border-slate-200 bg-white/95 px-3.5 py-2.5 text-right shadow-[0_14px_30px_-14px_rgba(10,27,51,0.22)] backdrop-blur-sm"
    >
      <div className="border-b border-slate-100 pb-1.5 text-[12px] font-bold text-[#0a1b33]">
        {point.fullMonthLabel}
      </div>
      <div className="mt-2 space-y-1.5 text-[11.5px]">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="h-2 w-2 rounded-full bg-[#1b39f5]" aria-hidden />
            هزینه تاییدشده
          </span>
          <span className="num font-bold text-[#0a1b33]">
            {toman(point.spending)} <span className="font-sans text-[10px] font-normal text-slate-400">تومان</span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="h-2 w-2 rounded-full bg-[#7d92ff]" aria-hidden />
            تعداد سفارش
          </span>
          <span className="num font-bold text-[#0a1b33]">
            {toman(point.ordersCount)} <span className="font-sans text-[10px] font-normal text-slate-400">سفارش</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default function SpendingOrdersChart({
  orders,
  loading = false,
  referenceDate,
}: {
  orders: AnalyticsOrderInput[]
  loading?: boolean
  referenceDate?: Date
}) {
  const [mode, setMode] = useState<ChartMode>("combined")
  const [mounted, setMounted] = useState(false)
  const gradientId = useId().replace(/:/g, "")

  const gridStroke ="#e2e8f0"
  const tickFill ="#64748b"
  const primaryStroke ="#1b39f5"
  const combinedBarFill ="#c7d3ff"
  const soloBarFill ="#1b39f5"
  const cursorBarFill ="rgba(27, 57, 245, 0.05)"
  const cursorLineStroke ="#cbd5e1"
  const dotStroke ="#ffffff"

  useEffect(() => {
    setMounted(true)
  }, [])

  const analytics = useMemo(
    () => buildSixMonthOrderSeries(orders, referenceDate),
    [orders, referenceDate],
  )

  const modeTabs: { id: ChartMode; label: string }[] = [
    { id:"combined", label:"نمای ترکیبی" },
    { id:"spending", label:"روند هزینه" },
    { id:"frequency", label:"تعداد سفارش" },
  ]

  return (
    <Card
      title="روند هزینه و تعداد سفارش‌ها (۶ ماه اخیر)"
      action={
        <div
          role="tablist"
          aria-label="حالت نمایش نمودار"
          className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-50 p-1"
        >
          {modeTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={mode === tab.id}
              onClick={() => setMode(tab.id)}
              className={cn(
                "whitespace-nowrap shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors",
                mode === tab.id
                  ? "bg-white text-[#1b39f5] shadow-sm"
                  : "text-slate-500 hover:text-[#0a1b33]",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      }
    >
      {/* نوار خلاصه اعداد ۶ ماهه */}
      <div className="mb-5 grid grid-cols-1 gap-3 border-b border-slate-100 pb-4 sm:grid-cols-3">
        <div className="flex items-center justify-between gap-2 rounded-2xl bg-slate-50/80 px-4 py-3 sm:block">
          <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <TrendingUp className="h-3.5 w-3.5 text-[#1b39f5]" aria-hidden />
            مجموع هزینه ۶ ماهه
          </span>
          <div className="mt-0 sm:mt-1.5 flex items-baseline gap-1">
            <span className="num text-[15px] font-bold text-[#0a1b33]">{toman(analytics.totalSpending)}</span>
            <span className="text-[10.5px] text-slate-400">تومان</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 rounded-2xl bg-slate-50/80 px-4 py-3 sm:block">
          <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShoppingBag className="h-3.5 w-3.5 text-[#1b39f5]" aria-hidden />
            کل سفارش‌های ۶ ماهه
          </span>
          <div className="mt-0 sm:mt-1.5 flex items-baseline gap-1">
            <span className="num text-[15px] font-bold text-[#0a1b33]">{toman(analytics.totalOrders)}</span>
            <span className="text-[10.5px] text-slate-400">سفارش</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 rounded-2xl bg-slate-50/80 px-4 py-3 sm:block">
          <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <BarChart3 className="h-3.5 w-3.5 text-[#1b39f5]" aria-hidden />
            میانگین هزینه ماهانه
          </span>
          <div className="mt-0 sm:mt-1.5 flex items-baseline gap-1">
            <span className="num text-[15px] font-bold text-[#0a1b33]">
              {toman(analytics.averageMonthlySpending)}
            </span>
            <span className="text-[10.5px] text-slate-400">تومان</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div
          className="h-[250px] sm:h-[290px] w-full animate-pulse rounded-2xl bg-slate-100/80"
          aria-label="در حال بارگذاری نمودار"
        />
      ) : analytics.totalOrders === 0 ? (
        <div className="flex h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-4 text-center">
          <p className="text-[13px] font-semibold text-slate-600">
            در ۶ ماه گذشته هنوز سفارشی برای نمایش نمودار ثبت نشده است.
          </p>
          <p className="mt-1.5 text-[11.5px] text-slate-400">
            پس از ثبت اولین سفارش، روند هزینه و تعداد خریدهای ماهانه شما اینجا ترسیم می‌شود.
          </p>
          <Link
            href="/products"
            className="glass-solid mt-4 inline-flex rounded-full px-5 py-2 text-[12px] font-semibold"
          >
            مشاهدهٔ محصولات فروشگاه
          </Link>
        </div>
      ) : (
        <div data-testid="spending-orders-chart" data-mode={mode}>
          {/* راهنمای رنگ سری‌ها */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
            <div className="flex flex-wrap items-center gap-4">
              {mode !== "frequency" ? (
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#1b39f5]" aria-hidden />
                  هزینهٔ تاییدشده (تومان)
                </span>
              ) : null}
              {mode !== "spending" ? (
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[#93a5ff]" aria-hidden />
                  تعداد سفارش ماهانه
                </span>
              ) : null}
            </div>
            {analytics.peakMonthLabel ? (
              <span>پرهزینه‌ترین ماه: {analytics.peakMonthLabel}</span>
            ) : null}
          </div>

          <div dir="ltr" className="h-[250px] sm:h-[290px] w-full min-w-0">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 260 }}>
                {mode === "combined" ? (
                  <ComposedChart
                    data={analytics.months}
                    margin={{ top: 10, right: 6, left: 0, bottom: 4 }}
                  >
                    <defs>
                      <linearGradient id={`spendGrad-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={primaryStroke} stopOpacity={0.22} />
                        <stop offset="95%" stopColor={primaryStroke} stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                    <XAxis
                      dataKey="monthLabel"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: tickFill }}
                      dy={6}
                    />
                    <YAxis
                      yAxisId="spending"
                      orientation="left"
                      width={46}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: tickFill }}
                      tickFormatter={(val: number) => formatCompactToman(val)}
                    />
                    <YAxis
                      yAxisId="orders"
                      orientation="right"
                      width={28}
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: tickFill }}
                    />
                    <Tooltip
                      cursor={{ fill: cursorBarFill }}
                      content={(props) => (
                        <CustomChartTooltip
                          active={props.active}
                          payload={props.payload as ReadonlyArray<TooltipPayloadItem>}
                        />
                      )}
                    />
                    <Bar
                      yAxisId="orders"
                      dataKey="ordersCount"
                      name="تعداد سفارش"
                      fill={combinedBarFill}
                      radius={[8, 8, 0, 0]}
                      maxBarSize={28}
                    />
                    <Area
                      yAxisId="spending"
                      type="monotone"
                      dataKey="spending"
                      name="هزینه تاییدشده"
                      stroke={primaryStroke}
                      strokeWidth={2.5}
                      fill={`url(#spendGrad-${gradientId})`}
                      activeDot={{ r: 5, fill: primaryStroke, stroke: dotStroke, strokeWidth: 2 }}
                    />
                  </ComposedChart>
                ) : mode === "spending" ? (
                  <AreaChart
                    data={analytics.months}
                    margin={{ top: 10, right: 12, left: 0, bottom: 4 }}
                  >
                    <defs>
                      <linearGradient id={`spendOnlyGrad-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={primaryStroke} stopOpacity={0.26} />
                        <stop offset="95%" stopColor={primaryStroke} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                    <XAxis
                      dataKey="monthLabel"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: tickFill }}
                      dy={6}
                    />
                    <YAxis
                      width={46}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: tickFill }}
                      tickFormatter={(val: number) => formatCompactToman(val)}
                    />
                    <Tooltip
                      cursor={{ stroke: cursorLineStroke, strokeDasharray:"3 3" }}
                      content={(props) => (
                        <CustomChartTooltip
                          active={props.active}
                          payload={props.payload as ReadonlyArray<TooltipPayloadItem>}
                        />
                      )}
                    />
                    <Area
                      type="monotone"
                      dataKey="spending"
                      name="هزینه تاییدشده"
                      stroke={primaryStroke}
                      strokeWidth={2.5}
                      fill={`url(#spendOnlyGrad-${gradientId})`}
                      activeDot={{ r: 5, fill: primaryStroke, stroke: dotStroke, strokeWidth: 2 }}
                    />
                  </AreaChart>
                ) : (
                  <BarChart
                    data={analytics.months}
                    margin={{ top: 10, right: 12, left: 0, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                    <XAxis
                      dataKey="monthLabel"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: tickFill }}
                      dy={6}
                    />
                    <YAxis
                      width={34}
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: tickFill }}
                    />
                    <Tooltip
                      cursor={{ fill: cursorBarFill }}
                      content={(props) => (
                        <CustomChartTooltip
                          active={props.active}
                          payload={props.payload as ReadonlyArray<TooltipPayloadItem>}
                        />
                      )}
                    />
                    <Bar
                      dataKey="ordersCount"
                      name="تعداد سفارش"
                      fill={soloBarFill}
                      radius={[8, 8, 0, 0]}
                      maxBarSize={36}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full animate-pulse rounded-2xl bg-slate-100/70" />
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
