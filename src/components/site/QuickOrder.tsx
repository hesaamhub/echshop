"use client"

import { useState } from "react"
import { Check, Minus, Plus, ShieldCheck, ShoppingBag, Zap } from "lucide-react"
import BrandIcon from "@/components/site/BrandIcon"

type QuickOption = {
  id: string
  title: string
  note: string
  price: number
}

const OPTIONS: QuickOption[] = [
  { id: "us", title: "اپل آیدی آمریکا", note: "تحویل فوری", price: 100000 },
  { id: "custom", title: "اپل آیدی کشور دلخواه", note: "تحویل فوری", price: 130000 },
  { id: "personal", title: "اپل آیدی با اطلاعات شخصی", note: "تحویل 2 تا 4 ساعت", price: 180000 },
  { id: "canada", title: "اپل آیدی کانادا", note: "دائمی و بدون محدودیت", price: 150000 },
  { id: "pack", title: "پکیج اپل آیدی", note: "ویژهٔ فروشندگان", price: 850000 },
  { id: "fix", title: "رفع خطای Not Active", note: "رفع مشکل فعال نشدن اپل آیدی", price: 90000 },
]

function latinPrice(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}

export default function QuickOrder() {
  const [selected, setSelected] = useState(OPTIONS[0].id)
  const [quantity, setQuantity] = useState(1)

  const option = OPTIONS.find((entry) => entry.id === selected) ?? OPTIONS[0]
  const total = option.price * quantity

  return (
    <div className="relative overflow-hidden rounded-[36px] bg-[#0a152d] p-3 md:p-5">
      {/* مش رنگی پس‌زمینه */}
      <span
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#1b39f5] opacity-40 blur-[90px]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -bottom-28 right-10 h-72 w-72 rounded-full bg-[#8158f5] opacity-25 blur-[90px]"
        aria-hidden
      />

      <div className="relative grid gap-3 lg:grid-cols-[300px_1fr_320px]">
        {/* پنل برند */}
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-7 text-center backdrop-blur-xl">
          <span
            className="pointer-events-none absolute inset-x-6 -bottom-16 h-40 rounded-full bg-[#2a49ff] opacity-35 blur-[60px]"
            aria-hidden
          />
          <span className="relative text-white drop-shadow-[0_10px_28px_rgba(42,73,255,0.55)]">
            <BrandIcon slug="apple" size={64} color="#ffffff" />
          </span>
          <div className="font-display relative mt-5 text-[20px] font-extrabold text-white">سفارش اپل آیدی</div>
          <div className="font-latin relative mt-1 text-[12px] font-bold tracking-[0.2em] text-[#8ea3ff]">APPLE ID</div>
          <p className="relative mt-4 text-[11.5px] leading-6 text-white/55">
            نوع اکانت را انتخاب کن، تعداد را مشخص کن و همین‌جا ثبت سفارش کن.
          </p>
        </div>

        {/* گزینه‌ها */}
        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-xl">
          <div className="grid gap-2.5 sm:grid-cols-2">
            {OPTIONS.map((entry) => {
              const active = entry.id === option.id

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setSelected(entry.id)}
                  className={`group flex items-center justify-between gap-3 rounded-[20px] border p-3.5 text-right transition-all duration-300 ${
                    active
                      ? "border-[#2a49ff]/70 bg-[#2a49ff]/15 shadow-[0_18px_36px_-24px_rgba(42,73,255,0.9)]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.07]"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[12.5px] font-bold text-white">{entry.title}</span>
                    <span
                      className={`mt-1 block text-[11px] font-semibold ${active ? "text-[#9fb2ff]" : "text-white/45"}`}
                    >
                      {entry.note}
                    </span>
                  </span>
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border transition-all duration-300 ${
                      active
                        ? "border-transparent bg-gradient-to-b from-[#2a49ff] to-[#1226c4] text-white"
                        : "border-white/20 bg-white/[0.06] text-transparent"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[10.5px] font-semibold text-white/60">
              <Zap className="h-3 w-3 text-[#9fb2ff]" />
              فعال‌سازی فوری
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[10.5px] font-semibold text-white/60">
              <ShieldCheck className="h-3 w-3 text-[#9fb2ff]" />
              گارانتی سلامت اکانت
            </span>
          </div>
        </div>

        {/* سبد و تعداد */}
        <div className="flex flex-col justify-between rounded-[28px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-display text-[16px] font-extrabold text-white">تأیید و ثبت سفارش</div>
                <div className="font-latin mt-1 text-[11px] font-semibold tracking-[0.12em] text-[#8ea3ff]">
                  Accept and Ordering
                </div>
              </div>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-[#9fb2ff]">
                <ShoppingBag className="h-4 w-4" />
              </span>
            </div>

            <div className="mt-5 truncate rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[12px] font-bold text-white">
              {option.title}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11.5px] font-semibold text-white/55">تعداد</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
                  aria-label="کاهش تعداد"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-latin w-10 text-center text-[16px] font-extrabold text-white" dir="ltr">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.min(10, current + 1))}
                  className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-b from-[#2a49ff] to-[#1226c4] text-white transition-transform hover:-translate-y-0.5"
                  aria-label="افزایش تعداد"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-4">
              <span className="text-[11.5px] font-semibold text-white/55">مبلغ قابل پرداخت</span>
              <span className="font-display text-[22px] font-extrabold text-white">
                <span className="font-latin" dir="ltr">
                  {latinPrice(total)}
                </span>
                <span className="mr-1.5 text-[11.5px] font-semibold text-white/55">تومان</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#2a49ff] to-[#1226c4] px-5 py-3.5 text-[13px] font-extrabold text-white shadow-[0_22px_44px_-22px_rgba(42,73,255,0.95)] transition-transform hover:-translate-y-0.5"
          >
            <ShoppingBag className="h-4 w-4" />
            افزودن به سبد خرید
          </button>
        </div>
      </div>
    </div>
  )
}
