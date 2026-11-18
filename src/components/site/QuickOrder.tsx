"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { useCart } from "@/lib/cartStore"

type QuickOption = {
  id: string
  planId: string
  title: string
  note: string
  price: number
  tag?: string
}

const OPTIONS: QuickOption[] = [
  { id: "us", planId: "pl-65", title: "اپل آیدی آمریکا", note: "تحویل فوری", price: 100000, tag: "محبوب" },
  { id: "custom", planId: "pl-66", title: "اپل آیدی کشور دلخواه", note: "تحویل فوری", price: 130000 },
  { id: "personal", planId: "pl-67", title: "اپل آیدی با اطلاعات شخصی", note: "تحویل 2 تا 4 ساعت", price: 180000 },
  { id: "canada", planId: "pl-68", title: "اپل آیدی کانادا", note: "دائمی و بدون محدودیت", price: 150000 },
  { id: "pack", planId: "pl-69", title: "پکیج اپل آیدی", note: "ویژهٔ فروشندگان", price: 850000, tag: "عمده" },
  { id: "fix", planId: "pl-70", title: "رفع خطای Not Active", note: "رفع مشکل فعال نشدن اپل آیدی", price: 90000 },
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
  const router = useRouter()
  const { add } = useCart()
  const [selected, setSelected] = useState(OPTIONS[0].id)
  const [quantity, setQuantity] = useState(1)

  const option = OPTIONS.find((entry) => entry.id === selected) ?? OPTIONS[0]
  const total = option.price * quantity

  function handleAddQuickOrder() {
    add("p-32", option.planId, quantity)
    router.push("/cart")
  }

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0a152d] p-3.5 md:p-4">
      {/* مش رنگی پس‌زمینه */}
      <span
        className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-[#1b39f5] opacity-40 blur-[100px]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -bottom-32 right-6 h-72 w-72 rounded-full bg-[#8158f5] opacity-25 blur-[100px]"
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
      <div className="relative flex flex-wrap items-center justify-between gap-2.5 px-1 pb-3">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/[0.07] text-white backdrop-blur-xl sm:h-10 sm:w-10 sm:rounded-2xl">
            <span
              className="pointer-events-none absolute inset-x-3 -bottom-3 h-7 rounded-full bg-[#2a49ff] opacity-60 blur-[20px]"
              aria-hidden
            />
            <span className="relative">
              <BrandIcon slug="apple" size={20} color="#ffffff" />
            </span>
          </span>
          <div>
            <div className="font-display text-[15px] font-extrabold leading-6 text-white sm:text-[16px] md:text-[18px]">
              سفارش سریع اپل آیدی
            </div>
            <div className="font-latin text-[9.5px] font-bold tracking-[0.22em] text-[#8ea3ff] sm:text-[10px]">
              APPLE ID
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {TRUST.map((item) => (
            <span
              key={item.text}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] px-2 py-1 text-[9.5px] font-semibold text-white/75 backdrop-blur-xl sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[10.5px]"
            >
              <item.icon className="h-3 w-3 text-[#9fb2ff] sm:h-3.5 sm:w-3.5" />
              {item.text}
            </span>
          ))}
        </div>
      </div>

      <div className="relative grid gap-2.5 lg:grid-cols-[1fr_320px]">
        {/* گزینه‌ها — در موبایل و دسکتاپ ۲ستونه و جمع‌وجور */}
        <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-2.5 backdrop-blur-xl sm:rounded-[24px] sm:p-3">
          <div className="flex items-center justify-between px-1 pb-2">
            <span className="text-[11px] font-bold text-white sm:text-[11.5px]">نوع اکانت را انتخاب کن</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white/45 sm:gap-1.5 sm:text-[10.5px]">
              <Sparkles className="h-3 w-3 text-[#9fb2ff] sm:h-3.5 sm:w-3.5" />
              قیمت‌های به‌روز
            </span>
          </div>

          <div data-testid="apple-id-options" className="grid grid-cols-2 gap-2">
            {OPTIONS.map((entry) => {
              const active = entry.id === option.id

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setSelected(entry.id)}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-[14px] border p-2.5 text-right transition-all duration-300 sm:rounded-[18px] sm:p-3 ${
                    active
                      ? "border-[#2a49ff]/70 bg-[#2a49ff]/15 shadow-[0_20px_36px_-26px_rgba(42,73,255,0.95)]"
                      : "border-white/10 bg-white/[0.03] hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.07]"
                  }`}
                >
                  {active ? (
                    <span
                      className="pointer-events-none absolute -right-10 -top-12 h-24 w-24 rounded-full bg-[#2a49ff] opacity-40 blur-[40px]"
                      aria-hidden
                    />
                  ) : null}

                  <span className="relative flex w-full items-start justify-between gap-1.5 sm:gap-3">
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="line-clamp-2 text-[11px] font-bold leading-4 text-white sm:line-clamp-1 sm:text-[12px] sm:leading-5">
                          {entry.title}
                        </span>
                        {entry.tag ? (
                          <span className="hidden shrink-0 rounded-full bg-[#8158f5]/25 px-2 py-0.5 text-[9.5px] font-bold text-[#c9b9ff] sm:inline-block">
                            {entry.tag}
                          </span>
                        ) : null}
                      </span>
                      <span
                        className={`mt-1 flex items-center gap-1 truncate text-[9.5px] font-semibold sm:gap-1.5 sm:text-[10.5px] ${
                          active ? "text-[#9fb2ff]" : "text-white/45"
                        }`}
                      >
                        <Clock className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" />
                        <span className="truncate">{entry.note}</span>
                      </span>
                    </span>
                    <span
                      className={`grid h-4 w-4 shrink-0 place-items-center rounded-md border transition-all duration-300 sm:h-5 sm:w-5 sm:rounded-lg ${
                        active
                          ? "border-transparent bg-gradient-to-b from-[#2a49ff] to-[#1226c4] text-white"
                          : "border-white/20 bg-white/[0.06] text-transparent group-hover:border-white/40"
                      }`}
                    >
                      <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </span>
                  </span>

                  <span className="relative mt-2 flex w-full items-center justify-between border-t border-white/10 pt-1.5 sm:mt-2.5 sm:pt-2">
                    <span className="hidden text-[10px] font-semibold text-white/40 sm:inline">شروع از</span>
                    {entry.tag ? (
                      <span className="rounded-full bg-[#8158f5]/25 px-1.5 py-0.5 text-[8.5px] font-bold text-[#c9b9ff] sm:hidden">
                        {entry.tag}
                      </span>
                    ) : (
                      <span className="text-[9.5px] font-semibold text-white/40 sm:hidden">قیمت</span>
                    )}
                    <span className="text-[11px] font-extrabold text-white sm:text-[12.5px]">
                      <span className="font-latin" dir="ltr">
                        {latinPrice(entry.price)}
                      </span>
                      <span className="mr-0.5 text-[9px] font-semibold text-white/45 sm:mr-1 sm:text-[10px]">تومان</span>
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* خلاصهٔ سفارش */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-[20px] border border-white/12 bg-white/[0.07] p-3.5 backdrop-blur-2xl sm:rounded-[24px] sm:p-4">
          <span
            className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-[#2a49ff] opacity-35 blur-[60px]"
            aria-hidden
          />

          <div className="relative">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-display text-[13.5px] font-extrabold text-white sm:text-[14px]">تأیید و ثبت سفارش</div>
                <div className="font-latin text-[9.5px] font-semibold tracking-[0.16em] text-[#8ea3ff] sm:text-[10px]">
                  Accept and Ordering
                </div>
              </div>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/10 text-[#9fb2ff]">
                <ShoppingBag className="h-4 w-4" />
              </span>
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-[#0a152d]/60 px-3 py-2 sm:mt-3 sm:block sm:px-3.5 sm:py-2.5">
              <div className="truncate text-[11.5px] font-bold text-white sm:text-[12px]">{option.title}</div>
              <div className="flex shrink-0 items-center gap-1 text-[10px] font-semibold text-[#9fb2ff] sm:mt-1 sm:gap-1.5 sm:text-[10.5px]">
                <Clock className="h-3 w-3" />
                {option.note}
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between sm:mt-3">
              <span className="text-[11px] font-semibold text-white/55">تعداد</span>
              <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.05] p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20"
                  aria-label="کاهش تعداد"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="font-latin w-8 text-center text-[14px] font-extrabold text-white" dir="ltr">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.min(10, current + 1))}
                  className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-b from-[#2a49ff] to-[#1226c4] text-white transition-transform hover:-translate-y-0.5"
                  aria-label="افزایش تعداد"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-2.5 hidden space-y-1.5 border-t border-white/10 pt-2.5 text-[11px] font-semibold text-white/50 sm:block sm:pt-3">
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

            <div className="mt-2.5 flex items-end justify-between rounded-xl bg-white/[0.05] px-3 py-2 sm:mt-3 sm:px-3.5 sm:py-2.5">
              <span className="text-[11px] font-semibold text-white/55">مبلغ قابل پرداخت</span>
              <span className="font-display text-[16px] font-extrabold text-white sm:text-[18px]">
                <span className="font-latin" dir="ltr">
                  {latinPrice(total)}
                </span>
                <span className="mr-1.5 text-[10px] font-semibold text-white/55 sm:text-[10.5px]">تومان</span>
              </span>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={handleAddQuickOrder}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#2a49ff] to-[#8158f5] px-5 py-2.5 text-[12px] font-extrabold text-white shadow-[0_22px_40px_-22px_rgba(129,88,245,0.95)] transition-transform hover:-translate-y-0.5 sm:mt-3.5"
            >
              <ShoppingBag className="h-4 w-4" />
              افزودن به سبد خرید
            </button>
            <p className="mt-1.5 text-center text-[10px] leading-5 text-white/40 sm:mt-2">
              پس از پرداخت، اطلاعات اکانت در پنل کاربری و ایمیل شما قرار می‌گیرد.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
