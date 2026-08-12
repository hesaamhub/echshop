import Link from "next/link"
import { BadgeCheck, CreditCard, Lock, Mail, MapPin, PhoneCall, Send, ShieldCheck } from "lucide-react"
import { siteContent } from "@/lib/data"
import Logo from "./Logo"

/** نمادهای اعتماد و پرداخت — جای آماده برای لوگوهای رسمی (اینماد، زرین‌پال و…) */
const trustBadges = [
  { icon: ShieldCheck, title: "اینماد", note: "نماد اعتماد الکترونیکی", tint: "#1b39f5" },
  { icon: CreditCard, title: "زرین‌پال", note: "درگاه پرداخت امن", tint: "#D5803B" },
  { icon: BadgeCheck, title: "ساماندهی", note: "ثبت رسمی کسب‌وکار", tint: "#46A171" },
  { icon: Lock, title: "SSL", note: "رمزگذاری تراکنش‌ها", tint: "#0A66C2" },
]

export default function Footer() {
  const { brand, footer, contact } = siteContent

  return (
    <footer className="mt-24 border-t border-[#1b39f5]/10 bg-white">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="glass-plate grid h-9 w-9 place-items-center rounded-[12px]">
                <Logo className="h-5 w-5" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="wordmark text-[16px] leading-none text-[#0a1b33]">echshop</span>
                <span className="mt-1 text-[10.5px] font-semibold leading-none text-slate-400">
                  {brand.nameFa}
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-[13px] leading-7 text-slate-500">{footer.about}</p>

            <ul className="mt-6 space-y-3 text-[13px] text-slate-600">
              <li className="flex items-center gap-2.5">
                <span className="glass-plate grid h-7 w-7 shrink-0 place-items-center rounded-[10px]">
                  <PhoneCall className="h-3.5 w-3.5 text-[#1b39f5]" />
                </span>
                {contact.phone}
              </li>
              <li className="flex items-center gap-2.5">
                <span className="glass-plate grid h-7 w-7 shrink-0 place-items-center rounded-[10px]">
                  <Mail className="h-3.5 w-3.5 text-[#1b39f5]" />
                </span>
                <span className="font-latin">{contact.email}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="glass-plate grid h-7 w-7 shrink-0 place-items-center rounded-[10px]">
                  <Send className="h-3.5 w-3.5 text-[#1b39f5]" />
                </span>
                <span className="font-latin">{contact.telegram}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="glass-plate grid h-7 w-7 shrink-0 place-items-center rounded-[10px]">
                  <MapPin className="h-3.5 w-3.5 text-[#1b39f5]" />
                </span>
                <span className="leading-7">{contact.address}</span>
              </li>
            </ul>
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
                      className="text-[13px] text-slate-500 transition-colors hover:text-[#1b39f5]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* نمادهای اعتماد و پرداخت */}
        <div className="mt-12 overflow-hidden rounded-[28px] border border-[#1b39f5]/10 bg-gradient-to-l from-[#f5f8ff] via-white to-[#f8f6ff] p-5 md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-[13px] font-bold text-[#0a1b33]">
                <span className="h-3.5 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
                اعتماد شما، اعتبار ماست
              </p>
              <p className="mt-1.5 text-[11.5px] leading-6 text-slate-500">
                پرداخت‌ها از درگاه‌های رسمی و امن انجام می‌شوند؛ لوگوی رسمی هر نماد اینجا قرار می‌گیرد.
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

        <div className="mt-12 flex flex-col gap-3 border-t border-[#1b39f5]/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-slate-400">
            تمامی حقوق برای {brand.nameFa} محفوظ است. ۱۴۰۵
            <span className="sr-only"> ui-v2</span>
          </p>
          <p className="text-[12px] text-slate-400">{contact.hours}</p>
        </div>
      </div>
    </footer>
  )
}
