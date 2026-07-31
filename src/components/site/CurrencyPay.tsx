"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowLeftRight,
  CreditCard,
  Globe,
  Headphones,
  ShieldCheck,
  Zap,
} from "lucide-react"

type Currency = {
  code: string
  label: string
  rate: number
}

const CURRENCIES: Currency[] = [
  { code: "USD", label: "دلار آمریکا", rate: 219100 },
  { code: "EUR", label: "یورو", rate: 236400 },
  { code: "TRY", label: "لیر ترکیه", rate: 6350 },
]

const PRESETS = [5, 10, 25, 50]

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "پرداخت امن و تضمین‌شده",
    text: "رمزگذاری SSL و تأیید هویت برای هر تراکنش",
  },
  {
    icon: Zap,
    title: "تحویل در کمترین زمان",
    text: "پرداخت تراکنش بلافاصله پس از تأیید سفارش",
  },
  {
    icon: Headphones,
    title: "پشتیبانی همیشگی",
    text: "کارشناسان ما در تمام ساعات شبانه‌روز در دسترس شما هستند",
  },
]

function latinNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(Math.round(value))
}

export default function CurrencyPay() {
  const [code, setCode] = useState(CURRENCIES[0].code)
  const [amount, setAmount] = useState(10)

  const currency = CURRENCIES.find((entry) => entry.code === code) ?? CURRENCIES[0]
  const safeAmount = Number.isFinite(amount) ? amount : 0
  const subtotal = currency.rate * safeAmount
  const fee = Math.round(subtotal * 0.02)
  const total = subtotal + fee

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#0a152d] px-4 py-8 md:px-9 md:py-12">
      {/* مش رنگی و شبکه */}
      <span
        className="pointer-events-none absolute -right-28 -top-36 h-[440px] w-[440px] rounded-full bg-[#1b39f5] opacity-45 blur-[120px]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -bottom-44 -left-24 h-[440px] w-[440px] rounded-full bg-[#8158f5] opacity-30 blur-[120px]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          maskImage: "radial-gradient(75% 70% at 80% 0%, #000 0%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(75% 70% at 80% 0%, #000 0%, transparent 78%)",
        }}
        aria-hidden
      />

      <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_430px]">
        {/* متن و مزیت‌ها */}
        <div className="text-right">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[11.5px] font-semibold text-[#9fb2ff] backdrop-blur-xl">
            <Globe className="h-3.5 w-3.5" />
            سرویس پرداخت جهانی
          </span>

          <h2 className="font-display mt-4 text-[28px] font-extrabold leading-tight text-white md:text-[40px]">
            پرداخت ارزی آنلاین
          </h2>
          <p className="mt-2 bg-gradient-to-l from-[#9fb2ff] to-[#c9b9ff] bg-clip-text text-[14px] font-bold text-transparent md:text-[16px]">
            سریع، امن و بدون واسطه
          </p>
          <p className="mt-4 max-w-[520px] text-[13px] leading-8 text-white/65">
            بدون نیاز به کارت بین‌المللی، هزینهٔ هر سرویس خارجی را به تومان بپردازید؛
            مبلغ و ارز را انتخاب کنید و بقیهٔ کار را به اچ‌شاپ بسپارید.
          </p>

          <div className="mt-7 grid gap-2.5 sm:max-w-[520px]">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08]"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-[#2a49ff] to-[#1226c4] text-white shadow-[0_16px_30px_-18px_rgba(42,73,255,0.95)]">
                  <benefit.icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-[12.5px] font-bold text-white">{benefit.title}</span>
                  <span className="mt-0.5 block text-[11.5px] leading-6 text-white/50">{benefit.text}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-[#2a49ff] to-[#8158f5] px-7 py-3.5 text-[13px] font-extrabold text-white shadow-[0_24px_46px_-24px_rgba(129,88,245,0.95)] transition-transform hover:-translate-y-0.5"
            >
              شروع پرداخت ارزی
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              href="/blog"
              className="rounded-full border border-white/25 bg-white/[0.06] px-7 py-3.5 text-[13px] font-bold text-white backdrop-blur-xl transition-colors hover:bg-white/15"
            >
              راهنمای پرداخت
            </Link>
          </div>
        </div>

        {/* کارت مبدل نرخ */}
        <div className="relative rounded-[34px] border border-white/12 bg-white/[0.07] p-5 shadow-[0_40px_80px_-50px_rgba(0,0,0,0.9)] backdrop-blur-2xl md:p-6">
          <span
            className="pointer-events-none absolute -left-14 -top-16 h-44 w-44 rounded-full bg-[#8158f5] opacity-35 blur-[60px]"
            aria-hidden
          />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-latin grid h-8 w-12 place-items-center rounded-lg bg-white text-[11px] font-extrabold tracking-tight text-[#0a152d]">
                VISA
              </span>
              <span className="relative grid h-8 w-12 place-items-center rounded-lg border border-white/10 bg-white/10">
                <span className="absolute left-[15px] h-4 w-4 rounded-full bg-[#ff5f00]/90" aria-hidden />
                <span className="absolute right-[15px] h-4 w-4 rounded-full bg-[#f79e1b]/90" aria-hidden />
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#2a49ff]/40 bg-[#2a49ff]/15 px-3 py-2 text-[11px] font-bold text-[#9fb2ff]">
              <CreditCard className="h-3.5 w-3.5" />
              پرداخت امن
            </span>
          </div>

          {/* انتخاب ارز */}
          <div className="relative mt-6 grid grid-cols-3 gap-1.5 rounded-2xl border border-white/10 bg-white/[0.05] p-1.5">
            {CURRENCIES.map((entry) => {
              const active = entry.code === currency.code

              return (
                <button
                  key={entry.code}
                  type="button"
                  onClick={() => setCode(entry.code)}
                  className={`rounded-xl px-2 py-2.5 text-center transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-b from-[#2a49ff] to-[#1226c4] shadow-[0_16px_30px_-20px_rgba(42,73,255,0.95)]"
                      : "hover:bg-white/[0.06]"
                  }`}
                >
                  <span
                    className={`font-latin block text-[12px] font-extrabold ${
                      active ? "text-white" : "text-white/60"
                    }`}
                  >
                    {entry.code}
                  </span>
                  <span
                    className={`mt-0.5 block text-[10px] font-semibold ${
                      active ? "text-white/75" : "text-white/35"
                    }`}
                  >
                    {entry.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* مبدل */}
          <div className="relative mt-3 rounded-[26px] border border-white/10 bg-[#0a152d]/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-semibold text-white/45">مبلغ مورد نظر</span>
              <span className="font-latin text-[10.5px] font-semibold tracking-[0.14em] text-white/35" dir="ltr">
                1 {currency.code} = {latinNumber(currency.rate)}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={10000}
                value={amount}
                onChange={(event) => setAmount(Math.max(0, Number(event.target.value)))}
                className="font-latin w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-left text-[20px] font-extrabold text-white outline-none transition-colors focus:border-[#2a49ff]"
                dir="ltr"
                aria-label="مبلغ ارز"
              />
              <span className="font-latin grid shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-[13px] font-extrabold text-white/70">
                {currency.code}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className={`font-latin rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all duration-300 ${
                    safeAmount === preset
                      ? "border-[#2a49ff]/60 bg-[#2a49ff]/20 text-white"
                      : "border-white/10 bg-white/[0.04] text-white/50 hover:text-white"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="my-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-white/10" aria-hidden />
              <span className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-[#9fb2ff]">
                <ArrowLeftRight className="h-3.5 w-3.5" />
              </span>
              <span className="h-px flex-1 bg-white/10" aria-hidden />
            </div>

            <div className="space-y-2 text-[11.5px] font-semibold text-white/50">
              <div className="flex items-center justify-between">
                <span>معادل تومانی</span>
                <span className="font-latin text-white/80" dir="ltr">
                  {latinNumber(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>کارمزد سرویس</span>
                <span className="font-latin text-white/80" dir="ltr">
                  {latinNumber(fee)}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between rounded-2xl bg-white/[0.05] px-4 py-3">
              <span className="text-[11.5px] font-semibold text-white/55">مبلغ قابل پرداخت</span>
              <span className="font-display text-[24px] font-extrabold text-white md:text-[27px]">
                <span className="font-latin" dir="ltr">
                  {latinNumber(total)}
                </span>
                <span className="mr-1.5 text-[11px] font-semibold text-white/55">تومان</span>
              </span>
            </div>
          </div>

          <div className="relative mt-4 flex items-center gap-2 text-[11px] font-semibold text-white/45">
            <span className="relative grid h-2.5 w-2.5 place-items-center" aria-hidden>
              <span className="absolute inset-0 animate-ping rounded-full bg-[#3ff0a5]/60" />
              <span className="relative h-2 w-2 rounded-full bg-[#3ff0a5]" />
            </span>
            نرخ‌ها به‌صورت لحظه‌ای به‌روز می‌شوند
          </div>
        </div>
      </div>
    </div>
  )
}
