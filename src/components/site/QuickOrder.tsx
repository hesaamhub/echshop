"use client"

import { useState } from "react"
import {
  BadgeCheck,
  Check,
  Clock,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Zap,
} from "lucide-react"
import BrandIcon from "@/components/site/BrandIcon"

type QuickOption = {
  id: string
  title: string
  note: string
  price: number
  tag?: string
}

const OPTIONS: QuickOption[] = [
  { id: "us", title: "اپل آیدی آمریکا", note: "تحویل فوری", price: 100000, tag: "محبوب" },
  { id: "custom", title: "اپل آیدی کشور دلخواه", note: "تحویل فوری", price: 130000 },
  { id: "personal", title: "اپل آیدی با اطلاعات شخصی", note: "تحویل 2 تا 4 ساعت", price: 180000 },
  { id: "canada", title: "اپل آیدی کانادا", note: "دائمی و بدون محدودیت", price: 150000 },
  { id: "pack", title: "پکیج اپل آیدی", note: "ویژهٔ فروشندگان", price: 850000, tag: "عمده" },
  { id: "fix", title: "رفع خطای Not Active", note: "رفع مشکل فعال نشدن اپل آیدی", price: 90000 },
]

const TRUST = [
  { icon: Zap, text: "فعال‌سازی فوری" },
  { icon: ShieldCheck, text: "گارانتی سلامت اکانت" },
  { icon: BadgeCheck, text: "پشتیبانی پس از خرید" },
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
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#0a152d] p-4 md:p-6">
      {/* مش رنگی پس‌زمینه */}
      <span
        className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[#1b39f5] opacity-40 blur-[100px]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -bottom-32 right-6 h-80 w-80 rounded-full bg-[#8158f5] opacity-25 blur-[100px]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
          maskImage: "radial-gradient(80% 70% at 50% 0%, #000 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(80% 70% at 50% 0%, #000 0%, transparent 75%)",
        }}
        aria-hidden
      />

      {/* سربرگ */}
      <div className="relative flex flex-wrap items-center justify-between gap-4 px-1 pb-5">
        <div className="flex items-center gap-3.5">
          <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/[0.07] text-white backdrop-blur-xl">
            <span
              className="pointer-events-none absolute inset-x-3 -bottom-4 h-8 rounded-full bg-[#2a49ff] opacity-60 blur-[22px]"
              aria-hidden
            />
            <span className="relative">
              <BrandIcon slug="apple" size={30} color="#ffffff" />
            </span>
          </span>
          <div>
            <div className="font-display text-[19px] font-extrabold leading-6 text-white md:text-[22px]">
              سفارش سریع اپل آیدی
            </div>
            <div className="font-latin mt-1 text-[10.5px] font-bold tracking-[0.24em] text-[#8ea3ff]">
              APPLE ID
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {TRUST.map((item) => (
            <span
              key={item.text}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-[10.5px] font-semibold text-white/70 backdrop-blur-xl"
            >
              <item.icon className="h-3.5 w-3.5 text-[#9fb2ff]" />
              {item.text}
            </span>
          ))}
        </div>
      </div>

      <div className="relative grid gap-3 lg:grid-cols-[1fr_330px]">
        {/* گزینه‌ها */}
        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between px-1 pb-3">
            <span className="text-[12px] font-bold text-white">نوع اکانت را انتخاب کن</span>
            <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-white/45">
              <Sparkles className="h-3.5 w-3.5 text-[#9fb2ff]" />
              قیمت‌ها به‌روز هستند
            </span>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {OPTIONS.map((entry) => {
              const active = entry.id === option.id

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setSelected(entry.id)}
                  className={`group relative overflow-hidden rounded-[22px] border p-4 text-right transition-all duration-300 ${
                    active
                      ? "border-[#2a49ff]/70 bg-[#2a49ff]/15 shadow-[0_22px_40px_-26px_rgba(42,73,255,0.95)]"
                      : "border-white/10 bg-white/[0.03] hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.07]"
                  }`}
                >
                  {active ? (
                    <span
                      className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-[#2a49ff] opacity-40 blur-[40px]"
                      aria-hidden
                    />
                  ) : null}

                  <span className="relative flex items-start justify-between gap-3">
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[12.5px] font-bold text-white">{entry.title}</span>
                        {entry.tag ? (
                          <span className="shrink-0 rounded-full bg-[#8158f5]/25 px-2 py-0.5 text-[9.5px] font-bold text-[#c9b9ff]">
                            {entry.tag}
                          </span>
                        ) : null}
                      </span>
                      <span
                        className={`mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold ${
                          active ? "text-[#9fb2ff]" : "text-white/45"
                        }`}
                      >
                        <Clock className="h-3 w-3" />
                        {entry.note}
                      </span>
                    </span>
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border transition-all duration-300 ${
                        active
                          ? "border-transparent bg-gradient-to-b from-[#2a49ff] to-[#1226c4] text-white"
                          : "border-white/20 bg-white/[0.06] text-transparent group-hover:border-white/40"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  </span>

                  <span className="relative mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                    <span className="text-[10.5px] font-semibold text-white/40">شروع از</span>
                    <span className="text-[13px] font-extrabold text-white">
                      <span className="font-latin" dir="ltr">
                        {latinPrice(entry.price)}
                      </span>
                      <span className="mr-1 text-[10px] font-semibold text-white/45">تومان</span>
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* خلاصهٔ سفارش */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-[30px] border border-white/12 bg-white/[0.07] p-5 backdrop-blur-2xl">
          <span
            className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#2a49ff] opacity-35 blur-[60px]"
            aria-hidden
          />

          <div className="relative">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-display text-[16px] font-extrabold text-white">تأیید و ثبت سفارش</div>
                <div className="font-latin mt-1 text-[10.5px] font-semibold tracking-[0.16em] text-[#8ea3ff]">
                  Accept and Ordering
                </div>
              </div>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-[#9fb2ff]">
                <ShoppingBag className="h-4 w-4" />
              </span>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-[#0a152d]/60 px-4 py-3.5">
              <div className="truncate text-[12.5px] font-bold text-white">{option.title}</div>
              <div className="mt-1.5 flex items-center gap-1.5 text-[10.5px] font-semibold text-[#9fb2ff]">
                <Clock className="h-3 w-3" />
                {option.note}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11.5px] font-semibold text-white/55">تعداد</span>
              <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.05] p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="grid h-8 w-8 place-items-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
                  aria-label="کاهش تعداد"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-latin w-9 text-center text-[15px] font-extrabold text-white" dir="ltr">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.min(10, current + 1))}
                  className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-b from-[#2a49ff] to-[#1226c4] text-white transition-transform hover:-translate-y-0.5"
                  aria-label="افزایش تعداد"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-[11.5px] font-semibold text-white/50">
              <div className="flex items-center justify-between">
                <span>قیمت واحد</span>
                <span className="font-latin text-white/80" dir="ltr">
                  {latinPrice(option.price)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>کارمزد فعال‌سازی</span>
                <span className="text-[#3ff0a5]">رایگان</span>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between rounded-2xl bg-white/[0.05] px-4 py-3">
              <span className="text-[11.5px] font-semibold text-white/55">مبلغ قابل پرداخت</span>
              <span className="font-display text-[22px] font-extrabold text-white">
                <span className="font-latin" dir="ltr">
                  {latinPrice(total)}
                </span>
                <span className="mr-1.5 text-[11px] font-semibold text-white/55">تومان</span>
              </span>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#2a49ff] to-[#8158f5] px-5 py-3.5 text-[13px] font-extrabold text-white shadow-[0_24px_46px_-22px_rgba(129,88,245,0.95)] transition-transform hover:-translate-y-0.5"
            >
              <ShoppingBag className="h-4 w-4" />
              افزودن به سبد خرید
            </button>
            <p className="mt-3 text-center text-[10.5px] leading-5 text-white/40">
              پس از پرداخت، اطلاعات اکانت در پنل کاربری و ایمیل شما قرار می‌گیرد.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
