"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { siteContent } from "@/lib/data"
import { cn } from "@/lib/utils"

export type PanelNavItem = { href: string; label: string; badge?: number }

/** پوستهٔ مشترک پنل کاربری و پنل مدیریت (RTL) */
export default function PanelShell({
  nav,
  title,
  role,
  children,
}: {
  nav: PanelNavItem[]
  title: string
  role: string
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="mx-auto flex max-w-[1500px] gap-6 px-4 py-6 md:px-6">
        {/* سایدبار */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-6 rounded-[28px] border border-slate-200/70 bg-white p-5">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0a152d] text-sm text-white">
                {siteContent.brand.logoMark}
              </span>
              <span>
                <span className="block text-[13.5px] font-bold text-[#0a1b33]">
                  {siteContent.brand.nameFa}
                </span>
                <span className="block text-[10.5px] text-slate-400">{role}</span>
              </span>
            </Link>

            <nav className="mt-6 space-y-1">
              {nav.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    item.href !== "/admin" &&
                    pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-4 py-2.5 text-[12.5px] font-medium transition-colors",
                      active
                        ? "bg-[#0a152d] text-white"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#0a1b33]",
                    )}
                  >
                    {item.label}
                    {item.badge ? (
                      <span
                        className={cn(
                          "num rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                          active ? "bg-white/20 text-white" : "bg-[#E56458] text-white",
                        )}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                )
              })}
            </nav>

            <Link
              href="/"
              className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-2.5 text-[12px] font-semibold text-[#0a1b33] hover:border-slate-300"
            >
              بازگشت به فروشگاه
              <ChevronLeft className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>

        {/* محتوا */}
        <div className="min-w-0 flex-1">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-slate-200/70 bg-white px-6 py-5">
            <div>
              <h1 className="font-display text-[19px] font-semibold text-[#0a1b33]">{title}</h1>
              <p className="mt-1 text-[11.5px] text-slate-400">{role}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden rounded-full bg-slate-50 px-3.5 py-2 text-[11.5px] text-slate-500 sm:block">
                حسام — کاربر طلایی
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#E5F2FC] text-[12px] font-bold text-[#1c5f9e]">
                ح
              </span>
            </div>
          </header>

          {/* منوی موبایل */}
          <div className="mb-5 flex gap-2 overflow-x-auto lg:hidden">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-[11.5px] font-semibold",
                  pathname === item.href
                    ? "border-transparent bg-[#0a152d] text-white"
                    : "border-slate-200 bg-white text-slate-600",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
