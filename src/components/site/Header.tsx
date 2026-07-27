"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Bell,
  LayoutDashboard,
  Menu,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react"
import { categories } from "@/lib/data"
import { cn } from "@/lib/utils"
import Logo from "./Logo"

const navItems = [
  { label: "محصولات", href: "/products" },
  { label: "بلاگ", href: "/blog" },
  { label: "درباره ما", href: "/about" },
  { label: "تماس با ما", href: "/contact" },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#f9fafb]/85 backdrop-blur-xl border-b border-slate-200/60">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        <div className="flex h-14 items-center gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white border border-slate-200/70 shadow-sm">
              <Logo className="h-5 w-5" />
            </span>
            <span className="wordmark text-[19px] leading-none text-[#0a1b33]">
              echshop
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 mr-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 rounded-full text-[13px] font-semibold text-slate-500 hover:text-[#0a1b33] hover:bg-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <form
            action="/products"
            className="hidden md:flex flex-1 items-center gap-2 rounded-full bg-white border border-slate-200/70 px-4 h-9 shadow-sm focus-within:border-slate-300"
          >
            <Search className="h-4 w-4 text-slate-400" />
            <input
              name="q"
              placeholder="جستجوی محصول، برند یا دسته‌بندی…"
              className="h-full w-full bg-transparent text-[12.5px] outline-none placeholder:text-slate-400"
            />
          </form>

          <div className="flex items-center gap-1.5 shrink-0">
            <IconLink href="/dashboard/notifications" label="اطلاع‌رسانی‌ها" badge="2">
              <Bell className="h-4 w-4" />
            </IconLink>
            <IconLink href="/cart" label="سبد خرید" badge="3">
              <ShoppingCart className="h-4 w-4" />
            </IconLink>
            <IconLink href="/dashboard" label="پنل کاربری">
              <LayoutDashboard className="h-4 w-4" />
            </IconLink>
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#0a152d] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#132349] transition-colors"
            >
              <UserRound className="h-4 w-4" />
              ورود / ثبت‌نام
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="منو"
              className="lg:hidden grid h-9 w-9 place-items-center rounded-full bg-white border border-slate-200/70 text-[#0a1b33]"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* نوار دسته‌بندی‌ها */}
        <div className="hidden lg:flex items-center gap-1 pb-2 overflow-x-auto">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="whitespace-nowrap rounded-full border border-transparent px-3 py-1 text-[11.5px] font-medium text-slate-500 hover:border-slate-200 hover:bg-white hover:text-[#0a1b33] transition-all"
            >
              {category.title}
            </Link>
          ))}
        </div>
      </div>

      {/* منوی موبایل */}
      <div
        className={cn(
          "lg:hidden overflow-hidden border-t border-slate-200/60 bg-white transition-all",
          open ? "max-h-[520px]" : "max-h-0",
        )}
      >
        <div className="px-4 py-4 space-y-1">
          {[...navItems, { label: "سبد خرید", href: "/cart" }, { label: "پنل کاربری", href: "/dashboard" }].map(
            (item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-[14px] font-semibold text-[#0a1b33] hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ),
          )}
          <div className="pt-2 grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-slate-200/70 px-3 py-2.5 text-[12px] font-medium text-slate-600"
              >
                {category.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

function IconLink({
  href,
  label,
  badge,
  children,
}: {
  href: string
  label: string
  badge?: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="relative grid h-9 w-9 place-items-center rounded-full bg-white border border-slate-200/70 text-[#0a1b33] shadow-sm hover:border-slate-300 transition-all"
    >
      {children}
      {badge ? (
        <span className="absolute -top-1 -left-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#E56458] px-1 text-[9px] font-bold text-white">
          {badge}
        </span>
      ) : null}
    </Link>
  )
}
