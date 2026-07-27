import Link from "next/link"
import { Mail, MapPin, PhoneCall, Send } from "lucide-react"
import { siteContent } from "@/lib/data"
import Logo from "./Logo"

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
