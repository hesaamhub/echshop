"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  Apple,
  Banknote,
  Bell,
  ChevronDown,
  Flame,
  Gamepad2,
  Menu,
  MessageCircle,
  MonitorSmartphone,
  Music,
  PenTool,
  Percent,
  Search,
  ShoppingCart,
  Smartphone,
  Sparkles,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react"
import { newArrivals, topDiscounts } from "@/lib/collections"
import { useCart } from "@/lib/cartStore"
import { fetchUserNotifications, type FirestoreNotification } from "@/lib/firebase/repository"
import { useCatalog } from "@/lib/firebase/useCatalog"
import { useFirebase } from "@/components/providers/FirebaseProvider"
import { cn, num } from "@/lib/utils"
import BestSellersMenu from "./BestSellersMenu"
import CartMenu from "./CartMenu"
import Logo from "./Logo"
import NotificationsMenu from "./NotificationsMenu"
import PanelMenu from "./PanelMenu"
import ProductMiniList from "./ProductMiniList"
import Wordmark from "./Wordmark"

/** لینک‌های سادهٔ منو */
const navItems = [
  { label: "بلاگ", href: "/blog" },
  { label: "سوالات متداول", href: "/faq" },
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
  Banknote,
  Smartphone,
  Apple,
}

/** فهرست‌های ویژهٔ منوی محصولات */
const freshAccounts = newArrivals(4)
const discountedProducts = topDiscounts(4)

type MenuKey = "products" | "panel" | "cart" | "bell"

export default function Header() {
  const { user, publicProfile } = useFirebase()
  const { products, categories } = useCatalog()
  const { count: cartCount } = useCart(products)
  const [notificationsList, setNotificationsList] = useState<FirestoreNotification[]>([])
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState<MenuKey | null>(null)
  const [mobileSection, setMobileSection] = useState<"products" | "panel" | null>(null)
  const barRef = useRef<HTMLDivElement>(null)

  const isLoggedIn = Boolean(user)
  const unreadCount = notificationsList.filter((n) => n.unread).length
  const userInitial = (publicProfile?.displayName || user?.displayName || "ک").trim().charAt(0)
  const categoryCount = (slug: string) => products.filter((p) => p.categorySlug === slug).length

  const canHover = () =>
    typeof window !== "undefined" &&
    window.innerWidth >= 768 &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches

  const toggleMenu = (key: MenuKey) => {
    setOpen(false)
    setMenu((current) => (current === key ? null : key))
  }

  useEffect(() => {
    if (!user?.uid) {
      setNotificationsList([])
      return
    }
    let active = true
    fetchUserNotifications(user.uid)
      .then((items) => {
        if (active) setNotificationsList(items)
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [user?.uid])

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
    <header className="sticky top-9 z-40 border-b border-white/60 bg-[#f9fafb]/75 backdrop-blur-xl md:top-10">
      <div ref={barRef} className="relative mx-auto max-w-[1280px] px-3 sm:px-4 md:px-6">
        <div className="flex h-14 items-center justify-between gap-2 md:gap-4">
          <Link
            href="/"
            aria-label="اچ‌شاپ — بازگشت به صفحهٔ اصلی"
            className="flex shrink-0 items-center gap-2 sm:gap-2.5"
          >
            {/* لوگوموشن سه‌بعدی برند + وردمارک تایپوگرافی متحرک */}
            <Logo className="h-7 w-7 rounded-[9px] shadow-[0_8px_18px_-8px_rgba(27,57,245,0.5)] sm:h-8 sm:w-8 sm:rounded-[10px] md:h-9 md:w-9 md:rounded-[11px]" />
            <Wordmark className="h-[19px] w-auto sm:h-[22px] md:h-6" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1 mr-2">
            {/* محصولات — بازشونده */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (canHover()) setMenu("products")
              }}
              onMouseLeave={() => {
                if (canHover()) setMenu(null)
              }}
            >
              <MenuTrigger
                label="محصولات"
                href="/products"
                active={menu === "products"}
                onToggle={() => toggleMenu("products")}
              />

              <AnimatePresence>
                {menu === "products" ? (
                  <DropdownPanel
                    align="right"
                    className="lg:w-[1080px] lg:max-w-[calc(100vw-3rem)]"
                  >
                    <div className="flex items-stretch gap-1">
                      {/* دسته‌بندی‌ها */}
                      <div className="min-w-[300px] flex-1">
                        <div className="flex items-center justify-between px-3 pb-1 pt-1.5">
                          <p className="text-[10.5px] font-bold text-slate-400">دسته‌بندی محصولات</p>
                          <Link
                            href="/categories"
                            onClick={() => setMenu(null)}
                            className="text-[10.5px] font-bold text-[#1b39f5] hover:underline"
                          >
                            فهرست دسته‌ها
                          </Link>
                        </div>

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
                                  <span className="block text-[10.5px] text-slate-400">
                                    <span className="num">{num(categoryCount(category.slug))}</span> محصول
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
                      </div>

                      {/* سه فهرست ویژه — کنار هم */}
                      <div className="w-[228px] shrink-0 border-r border-[#1b39f5]/10 pr-1.5">
                        <MenuListTitle
                          icon={Flame}
                          color="#E56458"
                          label="پرفروش‌ترین‌ها"
                          href="/products"
                          onNavigate={() => setMenu(null)}
                        />
                        <BestSellersMenu limit={4} onNavigate={() => setMenu(null)} />
                      </div>

                      <div className="w-[228px] shrink-0 border-r border-[#1b39f5]/10 pr-1.5">
                        <MenuListTitle
                          icon={Sparkles}
                          color="#1b39f5"
                          label="اکانت‌های جدید"
                          href="/products"
                          onNavigate={() => setMenu(null)}
                        />
                        <ProductMiniList
                          items={freshAccounts}
                          meta="new"
                          onNavigate={() => setMenu(null)}
                        />
                      </div>

                      <div className="w-[228px] shrink-0 border-r border-[#1b39f5]/10 pr-1.5">
                        <MenuListTitle
                          icon={Percent}
                          color="#137a4b"
                          label="بیشترین تخفیف"
                          href="/products"
                          onNavigate={() => setMenu(null)}
                        />
                        <ProductMiniList
                          items={discountedProducts}
                          meta="discount"
                          onNavigate={() => setMenu(null)}
                        />
                      </div>
                    </div>
                  </DropdownPanel>
                ) : null}
              </AnimatePresence>
            </div>

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap px-2.5 xl:px-3 py-1.5 rounded-full text-[12.5px] xl:text-[13px] font-semibold text-slate-500 transition-all hover:text-[#1b39f5] hover:bg-[#1b39f5]/8"
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

          <div className="flex shrink-0 items-center gap-1.5">
            {/* اطلاع‌رسانی‌ها — در موبایل تمام‌عرض زیر هدر و در دسکتاپ بازشونده */}
            {isLoggedIn ? (
              <div
                className="md:relative"
                onMouseEnter={() => {
                  if (canHover()) setMenu("bell")
                }}
                onMouseLeave={() => {
                  if (canHover()) setMenu(null)
                }}
              >
                <IconTrigger
                  href="/dashboard/notifications"
                  label="اطلاع‌رسانی‌ها"
                  badge={unreadCount > 0 ? num(unreadCount) : undefined}
                  active={menu === "bell"}
                  canHover={canHover}
                  onToggle={() => toggleMenu("bell")}
                >
                  <Bell className="h-4 w-4" />
                </IconTrigger>

                <AnimatePresence>
                  {menu === "bell" ? (
                    <DropdownPanel align="left" onClose={() => setMenu(null)} className="md:w-[336px]">
                      <NotificationsMenu
                        items={notificationsList}
                        onMarkedRead={() =>
                          setNotificationsList((prev) => prev.map((n) => ({ ...n, unread: false })))
                        }
                        onNavigate={() => setMenu(null)}
                      />
                    </DropdownPanel>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : null}

            {/* سبد خرید — در موبایل تمام‌عرض زیر هدر و در دسکتاپ بازشونده */}
            <div
              className="md:relative"
              onMouseEnter={() => {
                if (canHover()) setMenu("cart")
              }}
              onMouseLeave={() => {
                if (canHover()) setMenu(null)
              }}
            >
              <IconTrigger
                href="/cart"
                label="سبد خرید"
                badge={cartCount > 0 ? num(cartCount) : undefined}
                active={menu === "cart"}
                canHover={canHover}
                onToggle={() => toggleMenu("cart")}
              >
                <ShoppingCart className="h-4 w-4" />
              </IconTrigger>

              <AnimatePresence>
                {menu === "cart" ? (
                  <DropdownPanel align="left" onClose={() => setMenu(null)} className="md:w-[372px]">
                    <CartMenu onNavigate={() => setMenu(null)} />
                  </DropdownPanel>
                ) : null}
              </AnimatePresence>
            </div>

            {/* پنل کاربری یا ورود */}
            {isLoggedIn ? (
              <div
                className="md:relative"
                onMouseEnter={() => {
                  if (canHover()) setMenu("panel")
                }}
                onMouseLeave={() => {
                  if (canHover()) setMenu(null)
                }}
              >
                <Link
                  href="/dashboard"
                  aria-label="پنل کاربری"
                  title="پنل کاربری"
                  aria-expanded={menu === "panel"}
                  onClick={(event) => {
                    if (!canHover() || menu !== "panel") {
                      event.preventDefault()
                      toggleMenu("panel")
                    }
                  }}
                  className={cn(
                    "relative grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#1b39f5] to-[#7d92ff] text-[13px] font-bold text-white transition-all",
                    menu === "panel"
                      ? "shadow-[0_14px_28px_-14px_rgba(27,57,245,0.95)] ring-2 ring-[#1b39f5]/20"
                      : "shadow-[0_10px_22px_-14px_rgba(27,57,245,0.9)] hover:-translate-y-[1px]",
                  )}
                >
                  {userInitial}
                </Link>

                <AnimatePresence>
                  {menu === "panel" ? (
                    <DropdownPanel align="left" onClose={() => setMenu(null)} className="md:w-[312px]">
                      <PanelMenu unreadNotifications={unreadCount} onNavigate={() => setMenu(null)} />
                    </DropdownPanel>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  aria-label="حساب کاربری و ورود"
                  title="ورود / ثبت‌نام"
                  className="glass-plate glass-plate-hover grid h-9 w-9 place-items-center rounded-[12px] text-[#1b39f5] sm:hidden"
                >
                  <UserRound className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="glass-solid hidden items-center gap-2 rounded-[14px] px-4 py-2 text-[12px] font-semibold sm:inline-flex"
                >
                  <UserRound className="h-4 w-4" />
                  ورود / ثبت‌نام
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                setMenu(null)
                setOpen((v) => !v)
              }}
              aria-label="منو"
              className="glass-plate glass-plate-hover grid h-9 w-9 place-items-center rounded-[12px] text-[#1b39f5] lg:hidden"
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

      {/* منوی موبایل — با اسکرول مستقل تا در صفحات کوتاه هم بریده نشود */}
      <div
        className={cn(
          "lg:hidden overflow-hidden border-t border-white/60 bg-white/85 backdrop-blur-xl transition-all",
          open ? "max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain" : "max-h-0",
        )}
      >
        <div className="px-4 py-4 space-y-1">
          {/* جستجو در موبایل */}
          <form action="/products" className="glass-plate mb-2 flex h-10 items-center gap-2 rounded-full px-4">
            <Search className="h-4 w-4 shrink-0 text-[#1b39f5]/70" />
            <input
              name="q"
              type="search"
              aria-label="جستجوی محصول"
              placeholder="جستجوی محصول، برند یا دسته‌بندی…"
              className="h-full w-full bg-transparent text-[12.5px] font-medium outline-none placeholder:text-slate-400"
            />
          </form>

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
                  <span className="flex-1">{category.title}</span>
                  <span className="num text-[10.5px] text-slate-400">
                    {num(categoryCount(category.slug))}
                  </span>
                </Link>
              )}
            )}

            <MenuListTitle
              icon={Flame}
              color="#E56458"
              label="پرفروش‌ترین‌ها"
              href="/products"
              onNavigate={() => setOpen(false)}
            />
            <BestSellersMenu limit={3} onNavigate={() => setOpen(false)} />

            <MenuListTitle
              icon={Sparkles}
              color="#1b39f5"
              label="اکانت‌های جدید"
              href="/products"
              onNavigate={() => setOpen(false)}
            />
            <ProductMiniList
              items={freshAccounts.slice(0, 3)}
              meta="new"
              onNavigate={() => setOpen(false)}
            />

            <MenuListTitle
              icon={Percent}
              color="#137a4b"
              label="بیشترین تخفیف"
              href="/products"
              onNavigate={() => setOpen(false)}
            />
            <ProductMiniList
              items={discountedProducts.slice(0, 3)}
              meta="discount"
              onNavigate={() => setOpen(false)}
            />

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
              <PanelMenu
                variant="mobile"
                unreadNotifications={unreadCount}
                onNavigate={() => setOpen(false)}
              />
            </MobileSection>
          ) : null}

          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3 text-[14px] font-semibold text-[#0a1b33] hover:bg-[#1b39f5]/8"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between rounded-2xl px-4 py-3 text-[14px] font-semibold text-[#0a1b33] hover:bg-[#1b39f5]/8"
          >
            سبد خرید
            <span className="num rounded-full bg-[#1b39f5]/8 px-2 py-0.5 text-[10.5px] font-bold text-[#1b39f5]">
              {num(cartCount)}
            </span>
          </Link>

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

/** عنوان کوچک فهرست‌های منو */
function MenuListTitle({
  icon: Icon,
  color,
  label,
  href,
  onNavigate,
}: {
  icon: LucideIcon
  color: string
  label: string
  href: string
  onNavigate?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex items-center gap-1.5 px-2.5 pb-1 pt-1.5 text-[10.5px] font-bold text-slate-400 transition-colors hover:text-[#1b39f5]"
    >
      <Icon className="h-3.5 w-3.5" style={{ color }} />
      {label}
    </Link>
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

/** کارت شیشه‌ای منوی بازشونده — تمام‌عرض و خوانا روی موبایل، لنگر کنار آیکون روی دسکتاپ */
function DropdownPanel({
  align = "right",
  className,
  onClose,
  children,
}: {
  align?: "right" | "left"
  className?: string
  onClose?: () => void
  children: React.ReactNode
}) {
  return (
    <motion.div
      data-testid="header-dropdown-panel"
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "absolute left-3 right-3 top-full z-50 mt-2 max-h-[calc(100dvh-6.75rem)] overflow-y-auto overscroll-contain rounded-3xl border border-[#1b39f5]/12 bg-white/[0.98] p-2.5 shadow-[0_30px_70px_-32px_rgba(27,57,245,0.65)] backdrop-blur-xl md:left-auto md:right-auto md:max-h-none md:overflow-visible md:p-2",
        align === "right" ? "md:right-0" : "md:left-0",
        className,
      )}
    >
      {onClose ? (
        <div className="mb-1 flex justify-end md:hidden">
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن پنجره"
            className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-[#0a1b33]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}
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
          open ? "mt-1 max-h-[1100px]" : "max-h-0",
        )}
      >
        <div className="space-y-0.5 pr-1">{children}</div>
      </div>
    </div>
  )
}

/** دکمهٔ آیکونی با منوی بازشونده (اطلاع‌رسانی و سبد خرید) */
function IconTrigger({
  href,
  label,
  badge,
  active,
  canHover,
  onToggle,
  children,
}: {
  href: string
  label: string
  badge?: string
  active: boolean
  canHover: () => boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      aria-expanded={active}
      onClick={(event) => {
        if (!canHover() || !active) {
          event.preventDefault()
          onToggle()
        }
      }}
      className={cn(
        "glass-plate glass-plate-hover relative grid h-9 w-9 place-items-center rounded-[12px] text-[#1b39f5] transition-all",
        active && "bg-white/90 ring-2 ring-[#1b39f5]/15 shadow-[0_14px_28px_-16px_rgba(27,57,245,0.85)]",
      )}
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
