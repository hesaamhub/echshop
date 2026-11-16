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
    <footer className="mt-16 px-4 pb-5 md:px-6">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[28px] border border-[#1b39f5]/10 bg-gradient-to-b from-[#f5f8ff] via-white to-white shadow-[0_30px_70px_-50px_rgba(27,57,245,0.45)]">
        {/* خط برند لبهٔ بالایی + هالهٔ نرم گوشه */}
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-[#1b39f5]/45 to-transparent"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute -top-24 -left-20 h-64 w-64 rounded-full bg-[#1b39f5]/6 blur-3xl"
          aria-hidden
        />

        {/* بخش بالایی: برند + ستون‌های لینک */}
        <div className="relative grid gap-10 p-6 md:p-8 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <Logo className="h-12 w-12 rounded-[16px] shadow-[0_16px_32px_-16px_rgba(27,57,245,0.55)]" />
              <div className="flex flex-col items-start gap-1.5 leading-none">
                <Wordmark className="h-[24px] w-auto" />
                <span className="text-[11px] font-semibold text-slate-400">{brand.tagline}</span>
              </div>
            </div>
            <LiveRichSetting
              field="footerAbout"
              fallback={footer.about}
              className="mt-4 max-w-xs text-[12.5px] leading-6 text-slate-500"
            />

            <div className="mt-5 flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  style={{ color: social.color }}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-black/6 bg-white shadow-[0_10px_22px_-16px_rgba(10,21,45,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_28px_-16px_rgba(10,21,45,0.55)]"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <h3 className="flex items-center gap-2 text-[13px] font-bold text-[#0a1b33]">
                <span className="h-3.5 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="inline-block text-[13px] text-slate-500 transition-all duration-300 hover:ps-1 hover:text-[#1b39f5]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* نوار تماس فشرده */}
        <div className="relative px-6 pb-5 md:px-8">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 border-y border-[#1b39f5]/8 py-4 text-[11.5px] font-medium text-slate-500">
            <span className="inline-flex items-center gap-2">
              <PhoneCall className="h-3.5 w-3.5 text-[#1b39f5]" />
              {contact.phone}
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-[#1b39f5]" />
              <span className="font-latin">{contact.email}</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <Send className="h-3.5 w-3.5 text-[#1b39f5]" />
              <span className="font-latin">{contact.telegram}</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-[#1b39f5]" />
              {contact.address}
            </span>
          </div>
        </div>

        {/* نمادهای اعتماد و پرداخت */}
        <div className="relative px-6 pb-7 md:px-8">
          <div className="rounded-[24px] border border-[#1b39f5]/10 bg-white/70 p-4 backdrop-blur-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="flex items-center gap-2 text-[13px] font-bold text-[#0a1b33]">
                  <span className="h-3.5 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
                  اعتماد شما، اعتبار ماست
                </p>
                <p className="mt-1.5 text-[11.5px] leading-6 text-slate-500">
                  همهٔ پرداخت‌ها از درگاه‌های رسمی و امن انجام می‌شوند و خرید شما تا تحویل کامل سفارش تضمین است.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {trustBadges.map((badge) => (
                  <span
                    key={badge.title}
                    className="inline-flex items-center gap-2.5 rounded-2xl border border-[#1b39f5]/10 bg-white px-4 py-2.5 shadow-[0_10px_24px_-18px_rgba(10,21,45,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1b39f5]/25"
                  >
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-xl"
                      style={{ background: `${badge.tint}14`, color: badge.tint }}
                    >
                      <badge.icon className="h-4 w-4" />
                    </span>
                    <span className="flex flex-col leading-none">
                      <span className="text-[12px] font-bold text-[#0a1b33]">{badge.title}</span>
                      <span className="mt-1 text-[10px] font-medium text-slate-400">{badge.note}</span>
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
            className="relative flex items-end justify-center gap-3 md:gap-5"
            style={{
              maskImage: "linear-gradient(to bottom, #000 52%, transparent 98%)",
              WebkitMaskImage: "linear-gradient(to bottom, #000 52%, transparent 98%)",
            }}
          >
            <Logo className="-mb-2 h-[clamp(56px,6.5vw,96px)] w-[clamp(56px,6.5vw,96px)] shrink-0 drop-shadow-[0_16px_24px_rgba(27,57,245,0.35)] md:-mb-3" />
            <span className="watermark-shine font-latin -mb-[0.24em] text-[clamp(64px,9vw,132px)] font-bold leading-[0.95] tracking-tight">
              echshop
            </span>
          </div>
        </div>

        {/* نوار پایانی */}
        <div className="relative flex flex-col gap-3 border-t border-[#1b39f5]/10 px-6 py-5 text-[12px] text-slate-400 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <p>تمامی حقوق برای {brand.nameFa} محفوظ است. ۱۴۰۵</p>
          <p>{contact.hours}</p>
        </div>
      </div>
    </footer>
  )
}
