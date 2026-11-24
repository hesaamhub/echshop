"use client"

import React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Loader2 } from "lucide-react"
import { clampSkeletonCount } from "@/lib/ui/loadingState"

export function CardTransitionOverlay({
  visible,
  label ="در حال بروزرسانی…",
}: {
  visible: boolean
  label?: string
}) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="card-transition-overlay"
          data-testid="card-transition-overlay"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between rounded-[inherit] bg-white/55 backdrop-blur-[2px]"
        >
          <div className="loading-sweep-bar h-0.5 w-full bg-[#1b39f5]/12" />
          <div className="flex flex-1 items-center justify-center p-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#1b39f5]/15 bg-white/95 px-3.5 py-1.5 text-[11.5px] font-semibold text-[#0a1b33] shadow-[0_12px_28px_-14px_rgba(27,57,245,0.45)]">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#1b39f5]" />
              <span>{label}</span>
            </span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export function AdminTableSkeleton({
  columns = 6,
  rows = 5,
}: {
  columns?: number
  rows?: number
}) {
  const safeCols = clampSkeletonCount(columns, 6, 9)
  const safeRows = clampSkeletonCount(rows, 5, 10)
  const widths = ["w-20", "w-28", "w-32", "w-20", "w-24", "w-16", "w-20", "w-24", "w-20"]

  return (
    <div
      data-testid="admin-table-skeleton"
      role="status"
      aria-live="polite"
      aria-label="در حال بارگذاری جدول"
      className="overflow-x-auto"
    >
      <div className="min-w-[600px] space-y-2.5">
        <div className="flex items-center gap-4 border-b border-[#1b39f5]/12 px-3 pb-3">
          {Array.from({ length: safeCols }).map((_, colIdx) => (
            <div
              key={colIdx}
              className={`skeleton-shimmer h-3 flex-1 rounded ${widths[colIdx % widths.length]}`}
            />
          ))}
        </div>
        {Array.from({ length: safeRows }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="flex items-center gap-4 border-b border-slate-100/80 px-3 py-3 last:border-b-0"
          >
            {Array.from({ length: safeCols }).map((_, colIdx) => (
              <div
                key={colIdx}
                className={`skeleton-shimmer h-4 flex-1 rounded-md ${
                  colIdx === 0 ? "max-w-[90px]" : ""
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function AdminListSkeleton({ rows = 5 }: { rows?: number }) {
  const safeRows = clampSkeletonCount(rows, 5, 8)
  return (
    <div
      data-testid="admin-list-skeleton"
      role="status"
      aria-live="polite"
      aria-label="در حال بارگذاری فهرست"
      className="space-y-3"
    >
      {Array.from({ length: safeRows }).map((_, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/60 p-3.5"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="skeleton-shimmer h-7 w-7 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="skeleton-shimmer h-3.5 w-3/5 rounded-md" />
              <div className="skeleton-shimmer h-3 w-2/5 rounded-md" />
            </div>
          </div>
          <div className="skeleton-shimmer h-6 w-16 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function AdminChartsSkeleton() {
  const barHeights = ["h-20", "h-32", "h-24", "h-44", "h-36", "h-52"]
  return (
    <div
      data-testid="admin-charts-skeleton"
      role="status"
      aria-live="polite"
      aria-label="در حال بارگذاری نمودارهای مالی"
      className="space-y-4"
    >
      {/* 4 financial KPI cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-3xl border border-slate-200/75 bg-white p-4 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="skeleton-shimmer h-3 w-24 rounded" />
              <div className="skeleton-shimmer h-8 w-8 rounded-xl" />
            </div>
            <div className="skeleton-shimmer mt-3 h-6 w-32 rounded-md" />
            <div className="skeleton-shimmer mt-2 h-3 w-28 rounded" />
          </div>
        ))}
      </div>

      {/* Bar + Pie chart cards */}
      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <div className="rounded-[28px] border border-[#1b39f5]/10 bg-white p-6 shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="skeleton-shimmer h-4 w-44 rounded-md" />
            <div className="flex gap-2">
              <div className="skeleton-shimmer h-7 w-24 rounded-xl" />
              <div className="skeleton-shimmer h-7 w-20 rounded-xl" />
            </div>
          </div>
          <div className="flex h-[270px] items-end justify-between gap-3 px-4 pt-6 pb-2">
            {barHeights.map((heightCls, idx) => (
              <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                <div className={`skeleton-shimmer w-full max-w-[36px] rounded-t-xl ${heightCls}`} />
                <div className="skeleton-shimmer h-3 w-10 rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-[#1b39f5]/10 bg-white p-6 shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="skeleton-shimmer h-4 w-44 rounded-md" />
            <div className="skeleton-shimmer h-7 w-24 rounded-xl" />
          </div>
          <div className="flex h-[205px] items-center justify-center">
            <div className="relative grid h-40 w-40 place-items-center rounded-full border-[18px] border-slate-200/75">
              <div className="space-y-1.5 text-center">
                <div className="skeleton-shimmer mx-auto h-2.5 w-12 rounded" />
                <div className="skeleton-shimmer mx-auto h-4 w-16 rounded" />
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 rounded-xl bg-slate-50/70 px-3 py-2">
                <div className="skeleton-shimmer h-3.5 w-36 rounded" />
                <div className="skeleton-shimmer h-3.5 w-14 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function AdminDashboardPageSkeleton() {
  return (
    <div
      data-testid="admin-dashboard-skeleton"
      role="status"
      aria-live="polite"
      aria-label="در حال بارگذاری داشبورد مدیریت"
      className="space-y-5"
    >
      {/* Status banner card skeleton */}
      <div className="rounded-[28px] border border-[#1b39f5]/10 bg-white p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="skeleton-shimmer h-4 w-40 rounded-md" />
          <div className="flex gap-2">
            <div className="skeleton-shimmer h-9 w-24 rounded-full" />
            <div className="skeleton-shimmer h-9 w-36 rounded-full" />
          </div>
        </div>
        <div className="skeleton-shimmer h-12 w-full rounded-2xl" />
      </div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-[24px] border border-[#1b39f5]/10 bg-white p-5"
          >
            <div className="skeleton-shimmer h-3 w-24 rounded" />
            <div className="skeleton-shimmer mt-3 h-6 w-32 rounded-md" />
            <div className="skeleton-shimmer mt-2 h-3 w-20 rounded" />
          </div>
        ))}
      </div>

      <AdminChartsSkeleton />

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[28px] border border-[#1b39f5]/10 bg-white p-6">
          <div className="skeleton-shimmer mb-5 h-4 w-32 rounded-md" />
          <AdminTableSkeleton columns={6} rows={5} />
        </div>
        <div className="rounded-[28px] border border-[#1b39f5]/10 bg-white p-6">
          <div className="skeleton-shimmer mb-5 h-4 w-36 rounded-md" />
          <AdminListSkeleton rows={5} />
        </div>
      </div>
    </div>
  )
}
