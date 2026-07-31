"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CreditCard, Globe, Headphones, ShieldCheck, Zap } from "lucide-react"

type Currency = {
  code: string
  label: string
  rate: number
}

const CURRENCIES: Currency[] = [
  { code: "USD", label: "دلار", rate: 219100 },
  { code: "EUR", label: "یورو", rate: 236400 },
  { code: "TRY", label: "لیر", rate: 6350 },
]

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
  const [amount, setAmount] = useState(1)

  const currency = CURRENCIES.find((entry) => entry.code === code) ?? CURRENCIES[0]
  const total = currency.rate * (Number.isFinite(amount) ? amount : 0)

  return (
    <div className="relative overflow-hidden rounded-[40px] bg-[#0a152d] px-5 py-10 md:px-10 md:py-14">
      {/* مش رنگی */}
      <span
        className="pointer-events-none absolute -right-24 -top-32 h-[420px] w-[420px] rounded-full bg-[#1b39f5] opacity-45 blur-[110px]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -bottom-40 -left-20 h-[420px] w-[420px] rounded-full bg-[#8158f5] opacity-35 blur-[110px]"
        aria-hidden
      />

      <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_440px]">
        {/* متن و مزیت‌ها */}
        <div className="text-right">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[11.5px] font-semibold text-[#9fb2ff] backdrop-blur-sm">
            <Globe className="h-3.5 w-3.5" />
            سرویس پرداخت جهانی
          </span>

          <h2 className="font-display mt-4 text-[28px] font-extrabold leading-tight text-white md:text-[38px]">
            پرداخت ارزی آنلاین
          </h2>
          <p className="mt-2 text-[14px] font-bold text-[#9fb2ff] md:text-[16px]">
            سریع، امن و بدون واسطه
          </p>
          <p className="mt-4 max-w-[520px] text-[13px] leading-8 text-white/65">
            بدون نیاز به کارت بین‌المللی، هزینهٔ هر سرویس خارجی را به ریال بپردازید؛
            مبلغ و ارز را انتخاب کنید و بقیهٔ کار را به اچ‌شاپ بسپارید.
          </p>

          <div className="mt-7 grid gap-2.5 sm:max-w-[520px]">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 backdrop-blur-xl transition-colors hover:border-white/25"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-b from-[#2a49ff] to-[#1226c4] text-white">
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
              className="rounded-full border border-white/25 bg-white/[0.06] px-7 py-3.5 text-[13px] font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              راهنمای پرداخت
            </Link>
          </div>
        </div>

        {/* کارت نرخ لحظه‌ای */}
        <div className="rounded-[32px] border border-white/12 bg-white/[0.06] p-5 backdrop-blur-2xl md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-latin grid h-7 w-11 place-items-center rounded-md bg-white text-[10px] font-extrabold tracking-tight text-[#0a152d]">
                VISA
              </span>
              <span className="relative grid h-7 w-11 place-items-center rounded-md bg-white/10">
                <span className="absolute left-[13px] h-4 w-4 rounded-full bg-[#ff5f00]/90" aria-hidden />
                <span className="absolute right-[13px] h-4 w-4 rounded-full bg-[#f79e1b]/90" aria-hidden />
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#2a49ff]/40 bg-[#2a49ff]/15 px-3 py-1.5 text-[11px] font-bold text-[#9fb2ff]">
              <CreditCard className="h-3.5 w-3.5" />
              پرداخت امن
            </span>
          </div>

          {/* انتخاب ارز */}
          <div className="mt-6 flex items-center justify-between">
            <span className="text-[11.5px] font-semibold text-white/55">نرخ‌های لحظه‌ای</span>
            <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] p-1">
              {CURRENCIES.map((entry) => (
                <button
                  key={entry.code}
                  type="button"
                  onClick={() => setCode(entry.code)}
                  className={`font-latin rounded-lg px-3 py-1.5 text-[11px] font-extrabold transition-all duration-300 ${
                    entry.code === currency.code
                      ? "bg-gradient-to-b from-[#2a49ff] to-[#1226c4] text-white"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {entry.code}
                </button>
              ))}
            </div>
          </div>

          {/* مبلغ */}
          <div className="mt-3 rounded-2xl border border-white/10 bg-[#0a152d]/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-right">
                <div className="text-[13px] font-bold text-white">{currency.label}</div>
                <div className="font-latin mt-0.5 text-[10.5px] font-semibold tracking-[0.16em] text-white/40">
                  {currency.code}
                </div>
              </div>
              <input
                type="number"
                min={1}
                max={10000}
                value={amount}
                onChange={(event) => setAmount(Math.max(0, Number(event.target.value)))}
                className="font-latin w-28 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-left text-[15px] font-extrabold text-white outline-none transition-colors focus:border-[#2a49ff]"
                dir="ltr"
                aria-label="مبلغ ارز"
              />
            </div>

            <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-4">
              <span className="text-[11.5px] font-semibold text-white/55">معادل تومانی</span>
              <span className="font-display text-[24px] font-extrabold text-white md:text-[28px]">
                <span className="font-latin" dir="ltr">
                  {latinNumber(total)}
                </span>
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-white/45">
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
