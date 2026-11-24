"use client"

import React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Loader2 } from "lucide-react"
import { clampSkeletonCount } from "@/lib/ui/loadingState"

export function ProductCardSkeleton() {
  return (
    <div
      data-testid="product-card-skeleton"
      aria-hidden="true"
      className="flex h-full flex-col overflow-hidden rounded-[18px] border border-white/10 bg-[#0f1017] p-2 shadow-[0_22px_50px_-34px_rgba(10,27,51,0.7)] sm:rounded-[22px] sm:p-2.5"
    >
      {/* Poster frame matching ProductCard h-[120px] sm:h-[168px] */}
      <div className="relative h-[120px] overflow-hidden rounded-[13px] bg-white/[0.04] sm:h-[168px] sm:rounded-[16px]">
        <div className="skeleton-shimmer-dark h-full w-full" />
        {/* Price corner block */}
        <div className="absolute right-0 bottom-0 rounded-tl-[13px] bg-[#0f1017] pt-1 pl-1 sm:rounded-tl-[16px] sm:pt-1.5 sm:pl-1.5">
          <div className="skeleton-shimmer-dark h-6 w-20 rounded-[10px] sm:h-7 sm:w-24 sm:rounded-[12px]" />
        </div>
      </div>

      {/* Card body matching ProductCard structure */}
      <div className="flex flex-1 flex-col px-1 pt-2.5 pb-1 sm:px-2.5 sm:pt-3.5 sm:pb-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="skeleton-shimmer-dark h-4 w-3/4 rounded-md sm:h-5" />
          <div className="skeleton-shimmer-dark h-5 w-10 shrink-0 rounded-md sm:h-6 sm:w-12" />
        </div>

        <div className="mt-2 hidden space-y-1.5 sm:block">
          <div className="skeleton-shimmer-dark h-3 w-full rounded" />
          <div className="skeleton-shimmer-dark h-3 w-2/3 rounded" />
        </div>

        <div className="mt-2.5 flex items-center gap-1.5 sm:mt-3">
          <div className="skeleton-shimmer-dark h-5 w-20 rounded-md sm:h-6 sm:w-24 sm:rounded-lg" />
          <div className="skeleton-shimmer-dark hidden h-6 w-16 rounded-lg sm:block" />
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-white/8 pt-2.5 sm:mt-auto sm:pt-3">
          <div className="skeleton-shimmer-dark hidden h-3.5 w-20 rounded sm:block" />
          <div className="skeleton-shimmer-dark h-7 w-full rounded-lg sm:h-8 sm:w-28 sm:rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  const safeCount = clampSkeletonCount(count, 6, 12)
  return (
    <div
      data-testid="product-list-skeleton"
      role="status"
      aria-live="polite"
      aria-label="در حال بارگذاری محصولات"
      className="grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-3"
    >
      {Array.from({ length: safeCount }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  )
}

export function ProductsBrowserSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      data-testid="products-browser-skeleton"
      role="status"
      aria-live="polite"
      aria-label="در حال بارگذاری فهرست محصولات"
      className="grid gap-6 lg:grid-cols-[260px_1fr]"
    >
      {/* Mobile filter button placeholder */}
      <div className="skeleton-shimmer h-12 w-full rounded-2xl lg:hidden" />

      {/* Sidebar skeleton */}
      <aside className="hidden space-y-4 lg:block" aria-hidden="true">
        {[4, 4, 3].map((chipCount, groupIdx) => (
          <div
            key={groupIdx}
            className="rounded-3xl border border-[#1b39f5]/10 bg-white p-5 shadow-[0_18px_40px_-34px_rgba(27,57,245,0.5)]"
          >
            <div className="skeleton-shimmer mb-3.5 h-4 w-24 rounded-md" />
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: chipCount }).map((_, i) => (
                <div key={i} className="skeleton-shimmer h-7 w-20 rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </aside>

      {/* Main list column */}
      <div>
        <div
          aria-hidden="true"
          className="mb-4 space-y-3 rounded-2xl border border-[#1b39f5]/10 bg-white px-4 py-3 shadow-[0_18px_40px_-34px_rgba(27,57,245,0.5)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="skeleton-shimmer h-9 w-full max-w-xs rounded-full" />
            <div className="skeleton-shimmer h-4 w-24 rounded-md" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-shimmer h-7 w-20 rounded-full" />
            ))}
          </div>
        </div>

        <ProductGridSkeleton count={count} />
      </div>
    </div>
  )
}

export function ProductListTransitionOverlay({
  visible,
  label ="در حال به‌روزرسانی فهرست محصولات…",
}: {
  visible: boolean
  label?: string
}) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="product-list-overlay"
          data-testid="product-list-transition-overlay"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center overflow-hidden rounded-3xl bg-white/55 backdrop-blur-[2px]"
        >
          <div className="loading-sweep-bar h-0.5 w-full bg-[#1b39f5]/12" />
          <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-[#1b39f5]/20 bg-white/95 px-4 py-2 text-[12px] font-semibold text-[#0a1b33] shadow-[0_14px_30px_-14px_rgba(27,57,245,0.45)]">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#1b39f5]" />
            <span>{label}</span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
