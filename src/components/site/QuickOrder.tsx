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
      <div className="relative flex flex-wrap items-center justify-between gap-3 px-1 pb-3">
        <div className="flex items-center gap-3">
          <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/[0.07] text-white backdrop-blur-xl">
            <span
              className="pointer-events-none absolute inset-x-3 -bottom-3 h-7 rounded-full bg-[#2a49ff] opacity-60 blur-[20px]"
              aria-hidden
            />
            <span className="relative">
              <BrandIcon slug="apple" size={22} color="#ffffff" />
            </span>
          </span>
          <div>
            <div className="font-display text-[16px] font-extrabold leading-6 text-white md:text-[18px]">
              سفارش سریع اپل آیدی
            </div>
            <div className="font-latin text-[10px] font-bold tracking-[0.24em] text-[#8ea3ff]">
              APPLE ID
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {TRUST.map((item) => (
            <span
              key={item.text}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10.5px] font-semibold text-white/70 backdrop-blur-xl"
            >
              <item.icon className="h-3.5 w-3.5 text-[#9fb2ff]" />
              {item.text}
            </span>
          ))}
        </div>
      </div>

      <div className="relative grid gap-2.5 lg:grid-cols-[1fr_320px]">
        {/* گزینه‌ها */}
        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl">
          <div className="flex items-center justify-between px-1 pb-2.5">
            <span className="text-[11.5px] font-bold text-white">نوع اکانت را انتخاب کن</span>
            <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-white/45">
              <Sparkles className="h-3.5 w-3.5 text-[#9fb2ff]" />
              قیمت‌ها به‌روز هستند
            </span>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {OPTIONS.map((entry) => {
              const active = entry.id === option.id

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setSelected(entry.id)}
                  className={`group relative overflow-hidden rounded-[18px] border p-3 text-right transition-all duration-300 ${
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

                  <span className="relative flex items-start justify-between gap-3">
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[12px] font-bold text-white">{entry.title}</span>
                        {entry.tag ? (
                          <span className="shrink-0 rounded-full bg-[#8158f5]/25 px-2 py-0.5 text-[9.5px] font-bold text-[#c9b9ff]">
                            {entry.tag}
                          </span>
                        ) : null}
                      </span>
                      <span
                        className={`mt-1 flex items-center gap-1.5 text-[10.5px] font-semibold ${
                          active ? "text-[#9fb2ff]" : "text-white/45"
                        }`}
                      >
                        <Clock className="h-3 w-3" />
                        {entry.note}
                      </span>
                    </span>
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-lg border transition-all duration-300 ${
                        active
                          ? "border-transparent bg-gradient-to-b from-[#2a49ff] to-[#1226c4] text-white"
                          : "border-white/20 bg-white/[0.06] text-transparent group-hover:border-white/40"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                  </span>

                  <span className="relative mt-2.5 flex items-center justify-between border-t border-white/10 pt-2">
                    <span className="text-[10px] font-semibold text-white/40">شروع از</span>
                    <span className="text-[12.5px] font-extrabold text-white">
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
        <div className="relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/12 bg-white/[0.07] p-4 backdrop-blur-2xl">
          <span
            className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-[#2a49ff] opacity-35 blur-[60px]"
            aria-hidden
          />

          <div className="relative">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-display text-[14px] font-extrabold text-white">تأیید و ثبت سفارش</div>
                <div className="font-latin text-[10px] font-semibold tracking-[0.16em] text-[#8ea3ff]">
                  Accept and Ordering
                </div>
              </div>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/10 text-[#9fb2ff]">
                <ShoppingBag className="h-4 w-4" />
              </span>
            </div>

            <div className="mt-3 rounded-2xl border border-white/10 bg-[#0a152d]/60 px-3.5 py-2.5">
              <div className="truncate text-[12px] font-bold text-white">{option.title}</div>
              <div className="mt-1 flex items-center gap-1.5 text-[10.5px] font-semibold text-[#9fb2ff]">
                <Clock className="h-3 w-3" />
                {option.note}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
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

            <div className="mt-3 space-y-1.5 border-t border-white/10 pt-3 text-[11px] font-semibold text-white/50">
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

            <div className="mt-3 flex items-end justify-between rounded-xl bg-white/[0.05] px-3.5 py-2.5">
              <span className="text-[11px] font-semibold text-white/55">مبلغ قابل پرداخت</span>
              <span className="font-display text-[18px] font-extrabold text-white">
                <span className="font-latin" dir="ltr">
                  {latinPrice(total)}
                </span>
                <span className="mr-1.5 text-[10.5px] font-semibold text-white/55">تومان</span>
              </span>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={handleAddQuickOrder}
              className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#2a49ff] to-[#8158f5] px-5 py-2.5 text-[12px] font-extrabold text-white shadow-[0_22px_40px_-22px_rgba(129,88,245,0.95)] transition-transform hover:-translate-y-0.5"
            >
              <ShoppingBag className="h-4 w-4" />
              افزودن به سبد خرید
            </button>
            <p className="mt-2 text-center text-[10px] leading-5 text-white/40">
              پس از پرداخت، اطلاعات اکانت در پنل کاربری و ایمیل شما قرار می‌گیرد.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
