import Link from "next/link"
import { Mail, MapPin, PhoneCall, Send } from "lucide-react"
import { siteContent } from "@/lib/data"
import Logo from "./Logo"

export default function Footer() {
  const { brand, footer, contact } = siteContent

  return (
    <footer className="mt-24 border-t border-slate-200/70 bg-white">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white border border-slate-200/70 shadow-sm">
                <Logo className="h-5 w-5" />
              </span>
              <span className="text-[15px] font-bold text-[#0a1b33]">{brand.nameFa}</span>
            </div>
            <p className="mt-4 max-w-sm text-[13px] leading-7 text-slate-500">{footer.about}</p>

            <ul className="mt-6 space-y-3 text-[13px] text-slate-600">
              <li className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-slate-400" />
                {contact.phone}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="font-latin">{contact.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <Send className="h-4 w-4 text-slate-400" />
                <span className="font-latin">{contact.telegram}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                {contact.address}
              </li>
            </ul>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-[13px] font-bold text-[#0a1b33]">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-slate-500 hover:text-[#0a1b33] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-200/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-slate-400">
            تمامی حقوق برای {brand.nameFa} محفوظ است. ۱۴۰۵
          </p>
          <p className="text-[12px] text-slate-400">{contact.hours}</p>
        </div>
      </div>
    </footer>
  )
}
