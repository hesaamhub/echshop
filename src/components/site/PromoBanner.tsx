"use client"

import Link from "next/link"
import { useState } from "react"
import { motion } from "motion/react"
import { ChevronLeft, Sparkles, X } from "lucide-react"

/**
 * تنظیمات بنر کمپین بالای صفحه.
 * فعلاً اینجا تعریف شده؛ در مرحلهٔ بعد به پنل مدیریت و دیتابیس وصل می‌شود.
 * برای خاموش کردن بنر کافی است enabled را false کنید.
 */
export const promoBanner = {
  enabled: true,
  href: "/products",
  deadline: "تا ۱۰ مرداد",
  lead: "هرچی بخری،",
  highlight: "iPhone 17 Pro Max",
  tail: "می‌بری!",
  note: "هر ۵۰۰٬۰۰۰ تومان یک شانس",
  ctaLabel: "شرکت در قرعه‌کشی",
}

/**
 * بنر تبلیغاتی بالای هیرو (زیر نوار دسته‌بندی‌ها).
 * قابل بستن است و ارتفاع کمی می‌گیرد تا هیرو عقب نرود.
 */
export default function PromoBanner() {
  const [closed, setClosed] = useState(false)

  if (!promoBanner.enabled || closed) return null

  return (
    <div className="px-4 md:px-6 pt-3">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto flex w-full max-w-[1400px] items-center gap-3 overflow-hidden rounded-2xl border border-[#1b39f5]/12 bg-white px-3 py-2 shadow-[0_14px_34px_-28px_rgba(27,57,245,0.6)] md:px-5"
      >
        {/* درخشش متحرک روی بنر */}
        <motion.span
          aria-hidden
          initial={{ x: "-120%" }}
          animate={{ x: "320%" }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-y-0 w-1/5 skew-x-[-20deg] bg-gradient-to-r from-transparent via-[#1b39f5]/8 to-transparent"
        />

        <Link
          href={promoBanner.href}
          className="relative flex flex-1 flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center"
        >
          {/* مهلت کمپین */}
          <span className="num inline-flex shrink-0 items-center rounded-lg bg-[#1b39f5]/8 px-2.5 py-1 text-[11px] font-bold text-[#1b39f5]">
            {promoBanner.deadline}
          </span>

          <Sparkles className="hidden h-4 w-4 shrink-0 text-[#D5803B] sm:block" />

          {/* متن اصلی */}
          <span className="inline-flex flex-wrap items-center justify-center gap-2 text-[12.5px] font-extrabold text-[#0a1b33] md:text-[15px]">
            {promoBanner.lead}
            <span
              dir="ltr"
              className="wordmark rounded-lg bg-[#0a152d] px-2.5 py-1 text-[11.5px] text-white md:text-[13px]"
            >
              {promoBanner.highlight}
            </span>
            {promoBanner.tail}
          </span>

          {/* شرط قرعه‌کشی */}
          <span className="inline-flex shrink-0 items-center rounded-lg bg-[#D5803B] px-2.5 py-1 text-[11px] font-bold text-white">
            {promoBanner.note}
          </span>

          <Sparkles className="hidden h-4 w-4 shrink-0 text-[#D5803B] sm:block" />

          {/* دکمهٔ اقدام */}
          <span className="hidden shrink-0 items-center gap-1 text-[12px] font-bold text-[#1b39f5] lg:inline-flex">
            {promoBanner.ctaLabel}
            <ChevronLeft className="h-3.5 w-3.5" />
          </span>
        </Link>

        {/* بستن بنر */}
        <button
          type="button"
          onClick={() => setClosed(true)}
          aria-label="بستن بنر"
          className="relative grid h-7 w-7 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-[#1b39f5]/8 hover:text-[#1b39f5]"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    </div>
  )
}
