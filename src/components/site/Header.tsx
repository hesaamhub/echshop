"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  Bell,
  ChevronDown,
  Gamepad2,
  Heart,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  MessageCircle,
  MonitorSmartphone,
  Music,
  Package,
  PenTool,
  Search,
  ShoppingCart,
  Sparkles,
  UserRound,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react"
import { categories } from "@/lib/data"
import { session } from "@/lib/session"
import { cn } from "@/lib/utils"
import Logo from "./Logo"

/** لینک‌های سادهٔ منو */
const navItems = [
  { label: "بلاگ", href: "/blog" },
  { label: "درباره ما", href: "/about" },
  { label: "تماس با ما", href: "/contact" },
]

/** آیکون دسته‌بندی‌ها */
const categoryIcons: Record<string, LucideIcon> = {
  Music,
  Sparkles,
  PenTool,
  Gamepad2,
  MonitorSmartphone,
  MessageCircle,
}

/** آیتم‌های منوی پنل کاربری (فقط برای کاربر واردشده) */
const panelItems: Array<{ label: string; href: string; icon: LucideIcon; hint: string }> = [
  { label: "پیشخوان", href: "/dashboard", icon: LayoutDashboard, hint: "خلاصهٔ حساب و سفارش‌ها" },
  { label: "سفارش‌ها و تحویل", href: "/dashboard/orders", icon: Package, hint: "پیگیری وضعیت تحویل" },
  { label: "کیف پول", href: "/dashboard/wallet", icon: Wallet, hint: "شارژ و تراکنش‌ها" },
  { label: "تیکت‌های پشتیبانی", href: "/dashboard/tickets", icon: LifeBuoy, hint: "گفتگو با تیم پشتیبانی" },
  { label: "اطلاع‌رسانی‌ها", href: "/dashboard/notifications", icon: Bell, hint: "پیام‌ها و هشدارها" },
  { label: "علاقه‌مندی‌ها", href: "/dashboard/favorites", icon: Heart, hint: "محصولات ذخیره‌شده" },
  { label: "پروفایل و امنیت", href: "/dashboard/profile", icon: UserRound, hint: "اطلاعات حساب شما" },
]

export default function Header() {
  const isLoggedIn = session.isLoggedIn
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState<"products" | "panel" | null>(null)
  const [mobileSection, setMobileSection] = useState<"products" | "panel" | null>(null)
  const barRef = useRef<HTMLDivElement>(null)

  // بستن منوی بازشونده با کلیک بیرون یا کلید Escape
  useEffect(() => {
    if (!menu) return

    const handlePointer = (event: MouseEvent | TouchEvent) => {
      if (!barRef.current?.contains(event.target as Node)) setMenu(null)
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(null)
    }

    document.addEventListener("mousedown", handlePointer)
    document.addEventListener("touchstart", handlePointer)
    document.addEventListener("keydown", handleKey)

    return () => {
      document.removeEventListener("mousedown", handlePointer)
      document.removeEventListener("touchstart", handlePointer)
      document.removeEventListener("keydown", handleKey)
    }
  }, [menu])

  return (
    <header className="sticky top-11 z-40 bg-[#f9fafb]/75 backdrop-blur-xl border-b border-white/60 md:top-12">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        <div ref={barRef} className="flex h-14 items-center gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="glass-plate glass-plate-hover grid h-9 w-9 place-items-center rounded-[12px]">
              <Logo className="h-5 w-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="wordmark text-[18px] leading-none text-[#0a1b33]">
                echshop
              </span>
              <span className="mt-1 text-[10.5px] font-semibold leading-none text-slate-400">
                اچ‌شاپ
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 mr-2">
            {/* محصولات — بازشونده */}
            <div
              className="relative"
              onMouseEnter={() => setMenu("products")}
              onMouseLeave={() => setMenu(null)}
            >
              <MenuTrigger
                label="محصولات"
                href="/products"
                active={menu === "products"}
                onToggle={() => setMenu((value) => (value === "products" ? null : "products"))}
              />

              <AnimatePresence>
                {menu === "products" ? (
                  <DropdownPanel align="right" className="w-[440px]">
                    <div className="grid grid-cols-2 gap-1">
                      {categories.map((category) => {
                        const Icon = categoryIcons[category.icon] ?? Sparkles

                        return (
                          <Link
                            key={category.slug}
                            href={`/category/${category.slug}`}
                            onClick={() => setMenu(null)}
                            className="group flex items-center gap-2.5 rounded-2xl px-3 py-2.5 transition-colors hover:bg-[#1b39f5]/6"
                          >
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#1b39f5]/8 text-[#1b39f5]">
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[12.5px] font-semibold text-[#0a1b33] group-hover:text-[#1b39f5]">
                                {category.title}
                              </span>
                              <span className="num block text-[10.5px] text-slate-400">
                                {category.count} محصول
                              </span>
                            </span>
                          </Link>
                        )
                      })}
                    </div>

                    <Link
                      href="/products"
                      onClick={() => setMenu(null)}
                      className="mt-2 flex items-center justify-between rounded-2xl bg-[#1b39f5]/6 px-3 py-2.5 text-[12px] font-bold text-[#1b39f5] transition-colors hover:bg-[#1b39f5]/12"
                    >
                      مشاهدهٔ همهٔ محصولات
                      <ChevronDown className="h-4 w-4 rotate-90" />
                    </Link>
                  </DropdownPanel>
                ) : null}
              </AnimatePresence>
            </div>

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 rounded-full text-[13px] font-semibold text-slate-500 transition-all hover:text-[#1b39f5] hover:bg-[#1b39f5]/8"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <form
            action="/products"
            className="glass-plate hidden md:flex flex-1 items-center gap-2 rounded-full px-4 h-9"
          >
            <Search className="h-4 w-4 text-[#1b39f5]/70" />
            <input
              name="q"
              placeholder="جستجوی محصول، برند یا دسته‌بندی…"
              className="h-full w-full bg-transparent text-[12.5px] outline-none placeholder:text-slate-400"
            />
          </form>

          <div className="flex items-center gap-1.5 shrink-0">
            {isLoggedIn ? (
              <IconLink href="/dashboard/notifications" label="اطلاع‌رسانی‌ها" badge="2">
                <Bell className="h-4 w-4" />
              </IconLink>
            ) : null}

            <IconLink href="/cart" label="سبد خرید" badge="3">
              <ShoppingCart className="h-4 w-4" />
            </IconLink>

            {/* پنل کاربری — فقط برای کاربر واردشده؛ با موس یا لمس باز می‌شود */}
            {isLoggedIn ? (
              <div
                className="relative"
                onMouseEnter={() => setMenu("panel")}
                onMouseLeave={() => setMenu(null)}
              >
                <Link
                  href="/dashboard"
                  aria-label="پنل کاربری"
                  title="پنل کاربری"
                  aria-expanded={menu === "panel"}
                  onClick={(event) => {
                    if (menu !== "panel") {
                      event.preventDefault()
                      setMenu("panel")
                    }
                  }}
                  className={cn(
                    "glass-plate glass-plate-hover relative grid h-9 w-9 place-items-center rounded-[12px] text-[#1b39f5]",
                    menu === "panel" && "bg-[#1b39f5]/10",
                  )}
                >
                  <LayoutDashboard className="h-4 w-4" />
                </Link>

                <AnimatePresence>
                  {menu === "panel" ? (
                    <DropdownPanel align="left" className="w-[300px]">
                      <div className="flex items-center gap-2.5 rounded-2xl bg-[#1b39f5]/6 px-3 py-2.5">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#1b39f5] text-white">
                          <UserRound className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[12.5px] font-bold text-[#0a1b33]">
                            {session.user.name}
                          </span>
                          <span dir="ltr" className="block truncate text-right text-[10.5px] text-slate-400">
                            {session.user.email}
                          </span>
                        </span>
                      </div>

                      <div className="mt-1">
                        {panelItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMenu(null)}
                            className="group flex items-center gap-2.5 rounded-2xl px-3 py-2.5 transition-colors hover:bg-[#1b39f5]/6"
                          >
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#1b39f5]/8 text-[#1b39f5]">
                              <item.icon className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[12.5px] font-semibold text-[#0a1b33] group-hover:text-[#1b39f5]">
                                {item.label}
                              </span>
                              <span className="block truncate text-[10.5px] text-slate-400">
                                {item.hint}
                              </span>
                            </span>
                          </Link>
                        ))}
                      </div>

                      <Link
                        href="/login"
                        onClick={() => setMenu(null)}
                        className="mt-1 flex items-center justify-between rounded-2xl px-3 py-2.5 text-[12px] font-bold text-[#A8382C] transition-colors hover:bg-[#FCEAE8]"
                      >
                        خروج از حساب
                        <LogOut className="h-4 w-4" />
                      </Link>
                    </DropdownPanel>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="glass-solid hidden sm:inline-flex items-center gap-2 rounded-[14px] px-4 py-2 text-[12px] font-semibold"
              >
                <UserRound className="h-4 w-4" />
                ورود / ثبت‌نام
              </Link>
            )}

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="منو"
              className="glass-plate glass-plate-hover lg:hidden grid h-9 w-9 place-items-center rounded-[12px] text-[#1b39f5]"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* نوار دسته‌بندی‌ها */}
        <div className="hidden lg:flex items-center gap-1.5 pb-2 overflow-x-auto">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="glass-plate glass-plate-hover whitespace-nowrap rounded-full px-3 py-1 text-[11.5px] font-medium text-[#334155] hover:text-[#1b39f5]"
            >
              {category.title}
            </Link>
          ))}
        </div>
      </div>

      {/* منوی موبایل */}
      <div
        className={cn(
          "lg:hidden overflow-hidden border-t border-white/60 bg-white/85 backdrop-blur-xl transition-all",
          open ? "max-h-[820px]" : "max-h-0",
        )}
      >
        <div className="px-4 py-4 space-y-1">
          {/* محصولات — با لمس باز می‌شود */}
          <MobileSection
            label="محصولات"
            open={mobileSection === "products"}
            onToggle={() =>
              setMobileSection((value) => (value === "products" ? null : "products"))
            }
          >
            {categories.map((category) => {
              const Icon = categoryIcons[category.icon] ?? Sparkles

              return (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-[12.5px] font-semibold text-[#334155]"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#1b39f5]/8 text-[#1b39f5]">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {category.title}
                </Link>
              )
            })}
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="mt-1 block rounded-2xl bg-[#1b39f5]/8 px-3 py-2.5 text-center text-[12px] font-bold text-[#1b39f5]"
            >
              مشاهدهٔ همهٔ محصولات
            </Link>
          </MobileSection>

          {/* پنل کاربری — فقط برای کاربر واردشده */}
          {isLoggedIn ? (
            <MobileSection
              label="پنل کاربری"
              open={mobileSection === "panel"}
              onToggle={() => setMobileSection((value) => (value === "panel" ? null : "panel"))}
            >
              {panelItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-[12.5px] font-semibold text-[#334155]"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#1b39f5]/8 text-[#1b39f5]">
                    <item.icon className="h-3.5 w-3.5" />
                  </span>
                  {item.label}
                </Link>
              ))}
            </MobileSection>
          ) : null}

          {[...navItems, { label: "سبد خرید", href: "/cart" }].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3 text-[14px] font-semibold text-[#0a1b33] hover:bg-[#1b39f5]/8"
            >
              {item.label}
            </Link>
          ))}

          {isLoggedIn ? null : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="glass-solid mt-2 block rounded-2xl px-4 py-3 text-center text-[13px] font-semibold"
            >
              ورود / ثبت‌نام
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

/**
 * دکمهٔ منوی بازشونده.
 * در دسکتاپ با عبور موس باز می‌شود و کلیک دوم به صفحه می‌برد؛
 * در لمسی، لمس اول فقط منو را باز می‌کند.
 */
function MenuTrigger({
  label,
  href,
  active,
  onToggle,
}: {
  label: string
  href: string
  active: boolean
  onToggle: () => void
}) {
  return (
    <Link
      href={href}
      aria-expanded={active}
      onClick={(event) => {
        if (!active) {
          event.preventDefault()
          onToggle()
        }
      }}
      className={cn(
        "flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-semibold transition-all",
        active ? "bg-[#1b39f5]/8 text-[#1b39f5]" : "text-slate-500 hover:bg-[#1b39f5]/8 hover:text-[#1b39f5]",
      )}
    >
      {label}
      <ChevronDown
        className={cn("h-3.5 w-3.5 transition-transform", active && "rotate-180")}
      />
    </Link>
  )
}

/** کارت شیشه‌ای منوی بازشونده */
function DropdownPanel({
  align = "right",
  className,
  children,
}: {
  align?: "right" | "left"
  className?: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "absolute top-full z-50 mt-2 rounded-3xl border border-[#1b39f5]/10 bg-white/95 p-2 shadow-[0_30px_70px_-32px_rgba(27,57,245,0.6)] backdrop-blur-xl",
        align === "right" ? "right-0" : "left-0",
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

/** بخش بازشوندهٔ منوی موبایل */
function MobileSection({
  label,
  open,
  onToggle,
  children,
}: {
  label: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-[14px] font-semibold transition-colors",
          open ? "bg-[#1b39f5]/8 text-[#1b39f5]" : "text-[#0a1b33]",
        )}
      >
        {label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all",
          open ? "mt-1 max-h-[520px]" : "max-h-0",
        )}
      >
        <div className="space-y-0.5 pr-1">{children}</div>
      </div>
    </div>
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
      className="glass-plate glass-plate-hover relative grid h-9 w-9 place-items-center rounded-[12px] text-[#1b39f5]"
    >
      {children}
      {badge ? (
        <span className="num absolute -top-1 -left-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#1b39f5] px-1 text-[9px] font-bold text-white shadow-[0_4px_10px_-4px_rgba(27,57,245,0.9)]">
          {badge}
        </span>
      ) : null}
    </Link>
  )
}
