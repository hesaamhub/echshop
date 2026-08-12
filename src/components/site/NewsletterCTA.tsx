"use client"

import { useState } from "react"
import type { FormEvent } from "react"
import {
  Check,
  Instagram,
  Mail,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  X,
  Youtube,
} from "lucide-react"

/** شبکه‌های اجتماعی اچ‌شاپ */
const SOCIALS = [
  { label: "تلگرام", href: "https://t.me/echshop", Icon: Send, color: "#2AABEE" },
  { label: "اینستاگرام", href: "https://instagram.com/echshop", Icon: Instagram, color: "#E1306C" },
  { label: "واتساپ", href: "https://wa.me/", Icon: MessageCircle, color: "#25D366" },
  { label: "یوتیوب", href: "https://youtube.com/", Icon: Youtube, color: "#FF0033" },
]

/** آواتارهای گرادیانی برای نمایش اجتماعی */
const AVATARS = [
  "linear-gradient(140deg, #2a49ff, #1226c4)",
  "linear-gradient(140deg, #7c3aed, #4c1d95)",
  "linear-gradient(140deg, #06b6d4, #0e7490)",
]

export default function NewsletterCTA() {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!email.trim()) return
    setDone(true)
  }

  function close() {
    setOpen(false)
  }

  return (
    <>
      {/* کارت خبرنامه — نقاشی پاستلی با پنل شیشه‌ای مرکزی */}
      <div className="relative flex h-full min-h-[380px] items-center justify-center overflow-hidden rounded-[32px] border border-white/60 shadow-[0_30px_70px_-40px_rgba(10,21,45,0.5)]">
        {/* نقاشی پاستلی پس‌زمینه (public/newsletter-bg.svg) */}
        <span
          className="pointer-events-none absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/newsletter-bg.svg)" }}
          aria-hidden
        />

        {/* پنل شیشه‌ای مرکزی */}
        <div className="relative m-6 w-full max-w-md rounded-[28px] border border-white/70 bg-white/55 p-7 text-center shadow-[0_24px_60px_-30px_rgba(10,21,45,0.45)] backdrop-blur-2xl">
          <h3 className="font-display text-[21px] font-bold leading-[2.1] text-[#0a152d] md:text-[24px]">
            عضویت در خبرنامهٔ
            <span className="mx-1.5 inline-flex align-middle" aria-hidden>
              {AVATARS.map((background, index) => (
                <span
                  key={index}
                  className="-ms-2.5 h-7 w-7 rounded-full border-2 border-white shadow-sm first:ms-0"
                  style={{ background }}
                />
              ))}
            </span>
            اچ‌شاپ
            <br />
            برای تخفیف‌های هفتگی
          </h3>
          <p className="mt-2 text-[13px] leading-7 text-[#0a152d]/65">
            جدیدترین محصولات، تخفیف‌ها و کدهای ویژه را زودتر از همه دریافت کن.
          </p>
          <p className="mt-2.5 text-[12px] text-[#0a152d]/55">
            به بیش از <span className="font-latin font-bold text-[#0a152d]/80">10,000</span> مشتری راضی با امتیاز{" "}
            <span className="font-latin font-bold text-[#0a152d]/80">4.9</span> از{" "}
            <span className="font-latin">5</span> بپیوند.
          </p>

          <button
            type="button"
            onClick={() => {
              setDone(false)
              setOpen(true)
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-bold text-[#0a152d] shadow-[0_16px_34px_-18px_rgba(10,21,45,0.55)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-18px_rgba(27,57,245,0.5)]"
          >
            <Sparkles className="h-4 w-4 text-[#1b39f5]" />
            عضویت در خبرنامه
          </button>
        </div>
      </div>

      {/* پاپ‌آپ عضویت */}
      {open ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="بستن"
            onClick={close}
            className="absolute inset-0 bg-[#0a152d]/50 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md rounded-[28px] border border-black/5 bg-white p-7 shadow-[0_40px_90px_-40px_rgba(10,21,45,0.7)]">
            <button
              type="button"
              aria-label="بستن"
              onClick={close}
              className="absolute top-5 left-5 grid h-8 w-8 place-items-center rounded-full bg-[#f2f4fb] text-[#0a152d]/60 transition-colors hover:bg-[#e7ebf6] hover:text-[#0a152d]"
            >
              <X className="h-4 w-4" />
            </button>

            {done ? (
              <div className="py-6 text-center">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#3ff0a5]/20 text-[#0a9d63]">
                  <Check className="h-8 w-8" />
                </span>
                <h4 className="font-display mt-4 text-[19px] font-bold text-[#0a152d]">عضویتت ثبت شد</h4>
                <p className="mx-auto mt-2 max-w-xs text-[13px] leading-7 text-[#0a152d]/60">
                  از این به بعد جدیدترین محصولات و تخفیف‌ها را زودتر از همه برایت می‌فرستیم.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-5 rounded-full bg-[#0a152d] px-6 py-2.5 text-[12.5px] font-bold text-white transition-colors hover:bg-[#1b39f5]"
                >
                  باشه، ممنون
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#1b39f5]/10 text-[#1b39f5]">
                    <Mail className="h-6 w-6" />
                  </span>
                  <h4 className="font-display mt-3 text-[19px] font-bold text-[#0a152d]">
                    عضویت در خبرنامهٔ اچ‌شاپ
                  </h4>
                  <p className="mx-auto mt-1.5 max-w-xs text-[12.5px] leading-6 text-[#0a152d]/60">
                    ایمیل و شماره‌ات را وارد کن تا جدیدترین‌ها را برایت بفرستیم.
                  </p>
                </div>

                <label className="mt-5 block text-right">
                  <span className="mb-1.5 block text-[12px] font-semibold text-[#0a152d]/70">ایمیل</span>
                  <span className="relative block">
                    <Mail className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#0a152d]/35" />
                    <input
                      type="email"
                      required
                      dir="ltr"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@email.com"
                      className="w-full rounded-2xl border border-black/8 bg-[#f7f8fc] py-3 pr-9 pl-4 text-[13px] text-[#0a152d] outline-none transition-all placeholder:text-[#0a152d]/30 focus:border-[#1b39f5] focus:bg-white"
                    />
                  </span>
                </label>

                <label className="mt-3 block text-right">
                  <span className="mb-1.5 block text-[12px] font-semibold text-[#0a152d]/70">شماره تماس</span>
                  <span className="relative block">
                    <Phone className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#0a152d]/35" />
                    <input
                      type="tel"
                      dir="ltr"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="0912 000 0000"
                      className="w-full rounded-2xl border border-black/8 bg-[#f7f8fc] py-3 pr-9 pl-4 text-[13px] text-[#0a152d] outline-none transition-all placeholder:text-[#0a152d]/30 focus:border-[#1b39f5] focus:bg-white"
                    />
                  </span>
                </label>

                <button
                  type="submit"
                  className="mt-5 w-full rounded-2xl bg-[#1b39f5] py-3 text-[13px] font-bold text-white shadow-[0_18px_36px_-20px_rgba(27,57,245,0.9)] transition-all duration-500 hover:-translate-y-0.5 hover:bg-[#1226c4]"
                >
                  عضویت در خبرنامه
                </button>

                <div className="mt-6">
                  <div className="flex items-center gap-3">
                    <span className="h-px flex-1 bg-black/8" />
                    <span className="text-[11px] text-[#0a152d]/45">یا ما را دنبال کن</span>
                    <span className="h-px flex-1 bg-black/8" />
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2.5">
                    {SOCIALS.map(({ label, href, Icon, color }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={label}
                        className="grid h-11 w-11 place-items-center rounded-2xl border border-black/8 bg-white text-[#0a152d] shadow-[0_12px_24px_-18px_rgba(10,21,45,0.6)] transition-all duration-300 hover:-translate-y-0.5"
                        style={{ color }}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
