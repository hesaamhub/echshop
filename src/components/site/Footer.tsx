import Link from "next/link"
import {
  BadgeCheck,
  CreditCard,
  Instagram,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall,
  Send,
  ShieldCheck,
  Youtube,
} from "lucide-react"
import { siteContent } from "@/lib/data"
import LiveRichSetting from "./LiveRichSetting"
import Logo from "./Logo"
import Wordmark from "./Wordmark"

/** نمادهای اعتماد و پرداخت */
const trustBadges = [
  { icon: ShieldCheck, title: "اینماد", note: "نماد اعتماد الکترونیکی", tint: "#1b39f5" },
  { icon: CreditCard, title: "زرین‌پال", note: "درگاه پرداخت امن", tint: "#D5803B" },
  { icon: BadgeCheck, title: "ساماندهی", note: "ثبت رسمی کسب‌وکار", tint: "#46A171" },
  { icon: Lock, title: "SSL", note: "رمزگذاری تراکنش‌ها", tint: "#0A66C2" },
]

/** شبکه‌های اجتماعی — هرکدام با رنگ برند خودشان */
const socials = [
  { label: "تلگرام", href: "https://t.me/echshop", icon: Send, color: "#2AABEE" },
  { label: "اینستاگرام", href: "https://instagram.com/echshop", icon: Instagram, color: "#E1306C" },
  { label: "واتساپ", href: "https://wa.me/", icon: MessageCircle, color: "#25D366" },
  { label: "یوتیوب", href: "https://youtube.com/", icon: Youtube, color: "#FF0033" },
]

export default function Footer() {
  const { brand, footer, contact } = siteContent

  return (
    <footer className="mt-10 px-3 pb-4 md:mt-16 md:px-6 md:pb-5">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[24px] border border-[#1b39f5]/10 bg-gradient-to-b from-[#f5f8ff] via-white to-white shadow-[0_30px_70px_-50px_rgba(27,57,245,0.45)] md:rounded-[28px]">
        {/* خط برند لبهٔ بالایی + هالهٔ نرم گوشه */}
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-[#1b39f5]/45 to-transparent"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute -top-24 -left-20 h-64 w-64 rounded-full bg-[#1b39f5]/6 blur-3xl"
          aria-hidden
        />

        {/* بخش بالایی: برند + ستون‌های لینک (۳ستونه کنار هم در موبایل و دسکتاپ) */}
        <div className="relative grid gap-7 p-4 sm:p-6 md:gap-10 md:p-8 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <Logo className="h-10 w-10 rounded-[14px] shadow-[0_16px_32px_-16px_rgba(27,57,245,0.55)] sm:h-12 sm:w-12 sm:rounded-[16px]" />
              <div className="flex flex-col items-start gap-1.5 leading-none">
                <Wordmark className="h-[21px] w-auto sm:h-[24px]" />
                <span className="text-[10.5px] font-semibold text-slate-400 sm:text-[11px]">{brand.tagline}</span>
              </div>
            </div>
            <LiveRichSetting
              field="footerAbout"
              fallback={footer.about}
              className="mt-3 max-w-xs text-[12px] leading-6 text-slate-500 sm:mt-4 sm:text-[12.5px]"
            />

            <div className="mt-4 flex items-center gap-2 sm:mt-5">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  style={{ color: social.color }}
                  className="grid h-8 w-8 place-items-center rounded-xl border border-black/6 bg-white shadow-[0_10px_22px_-16px_rgba(10,21,45,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_28px_-16px_rgba(10,21,45,0.55)] sm:h-9 sm:w-9"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div
            data-testid="footer-link-columns"
            className="grid grid-cols-3 gap-3 sm:gap-6 lg:contents"
          >
            {footer.columns.map((column) => (
              <div key={column.title}>
                <h3 className="flex items-center gap-1.5 text-[12px] font-bold text-[#0a1b33] sm:gap-2 sm:text-[13px]">
                  <span className="h-3 w-1 rounded-full bg-[#1b39f5] sm:h-3.5 sm:w-1.5" aria-hidden />
                  {column.title}
                </h3>
                <ul className="mt-2.5 space-y-2 sm:mt-4 sm:space-y-3">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="inline-block text-[11.5px] leading-5 text-slate-500 transition-all duration-300 hover:ps-1 hover:text-[#1b39f5] sm:text-[13px]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* نوار تماس فشرده */}
        <div className="relative px-4 pb-4 sm:px-6 md:px-8 md:pb-5">
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 border-y border-[#1b39f5]/8 py-3.5 text-[11px] font-medium text-slate-500 sm:flex sm:flex-wrap sm:items-center sm:gap-x-6 sm:py-4 sm:text-[11.5px]">
            <span className="inline-flex min-w-0 items-center gap-1.5 sm:gap-2">
              <PhoneCall className="h-3.5 w-3.5 shrink-0 text-[#1b39f5]" />
              <span className="truncate">{contact.phone}</span>
            </span>
            <span className="inline-flex min-w-0 items-center gap-1.5 sm:gap-2">
              <Mail className="h-3.5 w-3.5 shrink-0 text-[#1b39f5]" />
              <span className="font-latin truncate">{contact.email}</span>
            </span>
            <span className="inline-flex min-w-0 items-center gap-1.5 sm:gap-2">
              <Send className="h-3.5 w-3.5 shrink-0 text-[#1b39f5]" />
              <span className="font-latin truncate">{contact.telegram}</span>
            </span>
            <span className="col-span-2 inline-flex min-w-0 items-center gap-1.5 sm:col-span-1 sm:gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#1b39f5]" />
              <span>{contact.address}</span>
            </span>
          </div>
        </div>

        {/* نمادهای اعتماد و پرداخت — ۲×۲ در موبایل */}
        <div className="relative px-4 pb-5 sm:px-6 md:px-8 md:pb-7">
          <div className="rounded-[20px] border border-[#1b39f5]/10 bg-white/70 p-3.5 backdrop-blur-sm sm:rounded-[24px] sm:p-4">
            <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="flex items-center gap-2 text-[12.5px] font-bold text-[#0a1b33] sm:text-[13px]">
                  <span className="h-3.5 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
                  اعتماد شما، اعتبار ماست
                </p>
                <p className="mt-1 text-[11px] leading-5 text-slate-500 sm:mt-1.5 sm:text-[11.5px] sm:leading-6">
                  همهٔ پرداخت‌ها از درگاه‌های رسمی و امن انجام می‌شوند و خرید شما تا تحویل کامل سفارش تضمین است.
                </p>
              </div>
              <div
                data-testid="footer-trust-badges"
                className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2.5"
              >
                {trustBadges.map((badge) => (
                  <span
                    key={badge.title}
                    className="inline-flex w-full items-center gap-2 rounded-xl border border-[#1b39f5]/10 bg-white px-2.5 py-2 shadow-[0_10px_24px_-18px_rgba(10,21,45,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1b39f5]/25 sm:w-auto sm:gap-2.5 sm:rounded-2xl sm:px-4 sm:py-2.5"
                  >
                    <span
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg sm:h-8 sm:w-8 sm:rounded-xl"
                      style={{ background: `${badge.tint}14`, color: badge.tint }}
                    >
                      <badge.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </span>
                    <span className="flex min-w-0 flex-col leading-none">
                      <span className="truncate text-[11px] font-bold text-[#0a1b33] sm:text-[12px]">{badge.title}</span>
                      <span className="mt-1 truncate text-[9.5px] font-medium text-slate-400 sm:text-[10px]">{badge.note}</span>
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* امضای برند — نشان سه‌بعدی کلید + وردمارک لاتین با گرادیان و برق متحرک */}
        <div className="pointer-events-none relative select-none overflow-hidden" aria-hidden>
          <span
            className="absolute inset-x-1/4 top-1/2 h-36 -translate-y-1/2 rounded-full bg-[#1b39f5]/10 blur-3xl"
          />
          <div
            dir="ltr"
            className="relative flex items-end justify-center gap-2.5 md:gap-5"
            style={{
              maskImage: "linear-gradient(to bottom, #000 52%, transparent 98%)",
              WebkitMaskImage: "linear-gradient(to bottom, #000 52%, transparent 98%)",
            }}
          >
            <Logo className="-mb-2 h-[clamp(44px,6.5vw,96px)] w-[clamp(44px,6.5vw,96px)] shrink-0 drop-shadow-[0_16px_24px_rgba(27,57,245,0.35)] md:-mb-3" />
            <span className="watermark-shine font-latin -mb-[0.24em] text-[clamp(48px,9vw,132px)] font-bold leading-[0.95] tracking-tight">
              echshop
            </span>
          </div>
        </div>

        {/* نوار پایانی */}
        <div className="relative flex flex-col gap-1.5 border-t border-[#1b39f5]/10 px-4 py-4 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6 sm:text-[12px] md:px-8 md:py-5">
          <p>تمامی حقوق برای {brand.nameFa} محفوظ است. ۱۴۰۵</p>
          <p>{contact.hours}</p>
        </div>
      </div>
    </footer>
  )
}
