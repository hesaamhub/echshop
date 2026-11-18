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
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0a152d] px-4 py-5 md:px-7 md:py-6">
      {/* مش رنگی و شبکه */}
      <span
        className="pointer-events-none absolute -right-28 -top-36 h-[380px] w-[380px] rounded-full bg-[#1b39f5] opacity-45 blur-[110px]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -bottom-40 -left-24 h-[380px] w-[380px] rounded-full bg-[#8158f5] opacity-30 blur-[110px]"
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

      <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_400px]">
        {/* متن و مزیت‌ها */}
        <div className="text-right">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1 text-[11px] font-semibold text-[#9fb2ff] backdrop-blur-xl">
            <Globe className="h-3.5 w-3.5" />
            سرویس پرداخت جهانی
          </span>

          <h2 className="font-display mt-3 text-[21px] font-extrabold leading-tight text-white md:text-[28px]">
            پرداخت ارزی آنلاین
          </h2>
          <p className="mt-1.5 bg-gradient-to-l from-[#9fb2ff] to-[#c9b9ff] bg-clip-text text-[12.5px] font-bold text-transparent md:text-[14px]">
            سریع، امن و بدون واسطه
          </p>
          <p className="mt-2.5 max-w-[520px] text-[12.5px] leading-6 text-white/65">
            بدون نیاز به کارت بین‌المللی، هزینهٔ هر سرویس خارجی را به تومان بپردازید؛
            مبلغ و ارز را انتخاب کنید و بقیهٔ کار را به اچ‌شاپ بسپارید.
          </p>

          <div className="mt-4 grid gap-2 sm:max-w-[520px]">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08] sm:px-3.5"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-b from-[#2a49ff] to-[#1226c4] text-white shadow-[0_14px_26px_-18px_rgba(42,73,255,0.95)] sm:h-9 sm:w-9">
                  <benefit.icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-[12px] font-bold text-white">{benefit.title}</span>
                  <span className="hidden text-[11px] leading-5 text-white/50 sm:block">{benefit.text}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-[#2a49ff] to-[#8158f5] px-5 py-2.5 text-[12px] font-extrabold text-white shadow-[0_22px_40px_-24px_rgba(129,88,245,0.95)] transition-transform hover:-translate-y-0.5"
            >
              شروع پرداخت ارزی
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              href="/blog"
              className="rounded-full border border-white/25 bg-white/[0.06] px-5 py-2.5 text-[12px] font-bold text-white backdrop-blur-xl transition-colors hover:bg-white/15"
            >
              راهنمای پرداخت
            </Link>
          </div>
        </div>

        {/* کارت مبدل نرخ */}
        <div className="relative rounded-[24px] border border-white/12 bg-white/[0.07] p-4 shadow-[0_36px_70px_-50px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
          <span
            className="pointer-events-none absolute -left-14 -top-16 h-40 w-40 rounded-full bg-[#8158f5] opacity-35 blur-[60px]"
            aria-hidden
          />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-latin grid h-7 w-11 place-items-center rounded-lg bg-white text-[10.5px] font-extrabold tracking-tight text-[#0a152d]">
                VISA
              </span>
              <span className="relative grid h-7 w-11 place-items-center rounded-lg border border-white/10 bg-white/10">
                <span className="absolute left-[14px] h-3.5 w-3.5 rounded-full bg-[#ff5f00]/90" aria-hidden />
                <span className="absolute right-[14px] h-3.5 w-3.5 rounded-full bg-[#f79e1b]/90" aria-hidden />
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#2a49ff]/40 bg-[#2a49ff]/15 px-2.5 py-1.5 text-[10.5px] font-bold text-[#9fb2ff]">
              <CreditCard className="h-3.5 w-3.5" />
              پرداخت امن
            </span>
          </div>

          {/* انتخاب ارز */}
          <div className="relative mt-4 grid grid-cols-3 gap-1.5 rounded-2xl border border-white/10 bg-white/[0.05] p-1.5">
            {CURRENCIES.map((entry) => {
              const active = entry.code === currency.code

              return (
                <button
                  key={entry.code}
                  type="button"
                  onClick={() => setCode(entry.code)}
                  className={`rounded-xl px-2 py-1.5 text-center transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-b from-[#2a49ff] to-[#1226c4] shadow-[0_16px_30px_-20px_rgba(42,73,255,0.95)]"
                      : "hover:bg-white/[0.06]"
                  }`}
                >
                  <span
                    className={`font-latin block text-[11.5px] font-extrabold ${
                      active ? "text-white" : "text-white/60"
                    }`}
                  >
                    {entry.code}
                  </span>
                  <span
                    className={`block text-[9.5px] font-semibold ${
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
          <div className="relative mt-2.5 rounded-[22px] border border-white/10 bg-[#0a152d]/70 p-3.5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-semibold text-white/45">مبلغ مورد نظر</span>
              <span className="font-latin text-[10px] font-semibold tracking-[0.14em] text-white/35" dir="ltr">
                1 {currency.code} = {latinNumber(currency.rate)}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={10000}
                value={amount}
                onChange={(event) => setAmount(Math.max(0, Number(event.target.value)))}
                className="font-latin w-full rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-left text-[17px] font-extrabold text-white outline-none transition-colors focus:border-[#2a49ff]"
                dir="ltr"
                aria-label="مبلغ ارز"
              />
              <span className="font-latin grid shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-[12.5px] font-extrabold text-white/70">
                {currency.code}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className={`font-latin rounded-full border px-3 py-1 text-[10.5px] font-bold transition-all duration-300 ${
                    safeAmount === preset
                      ? "border-[#2a49ff]/60 bg-[#2a49ff]/20 text-white"
                      : "border-white/10 bg-white/[0.04] text-white/50 hover:text-white"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="my-2.5 flex items-center gap-3">
              <span className="h-px flex-1 bg-white/10" aria-hidden />
              <span className="grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-[#9fb2ff]">
                <ArrowLeftRight className="h-3.5 w-3.5" />
              </span>
              <span className="h-px flex-1 bg-white/10" aria-hidden />
            </div>

            <div className="space-y-1.5 text-[11px] font-semibold text-white/50">
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

            <div className="mt-2.5 flex items-end justify-between rounded-xl bg-white/[0.05] px-3.5 py-2.5">
              <span className="text-[11px] font-semibold text-white/55">مبلغ قابل پرداخت</span>
              <span className="font-display text-[18px] font-extrabold text-white md:text-[21px]">
                <span className="font-latin" dir="ltr">
                  {latinNumber(total)}
                </span>
                <span className="mr-1.5 text-[10.5px] font-semibold text-white/55">تومان</span>
              </span>
            </div>
          </div>

          <div className="relative mt-2.5 flex items-center gap-2 text-[10.5px] font-semibold text-white/45">
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
