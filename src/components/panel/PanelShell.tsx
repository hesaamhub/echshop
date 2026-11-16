"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ChevronLeft, ShieldAlert } from "lucide-react"
import { useFirebase } from "@/components/providers/FirebaseProvider"
import Logo from "@/components/site/Logo"
import Wordmark from "@/components/site/Wordmark"
import { cn } from "@/lib/utils"

export type PanelNavItem = { href: string; label: string; badge?: number }

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
  const { user, authReady, isAdmin, publicProfile, signInWithGoogle } = useFirebase()
  const [signingIn, setSigningIn] = useState(false)
  const [authError, setAuthError] = useState("")

  const isAdminRoute = pathname.startsWith("/admin")
  const displayName = publicProfile?.displayName || user?.displayName || "کاربر مهمان"
  const plan = isAdmin ? "مدیر کل" : publicProfile?.plan || "عادی"
  const initial = displayName.trim().charAt(0) || "ک"

  async function handleSignIn() {
    setAuthError("")
    setSigningIn(true)
    try {
      await signInWithGoogle()
    } catch {
      setAuthError("ورود با گوگل انجام نشد. دسترسی پاپ‌آپ مرورگر را بررسی کنید.")
    } finally {
      setSigningIn(false)
    }
  }

  let gateContent: React.ReactNode = null
  if (!authReady) {
    gateContent = (
      <div className="rounded-[28px] border border-[#1b39f5]/10 bg-white p-10 text-center text-[13px] text-slate-500 shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)]">
        در حال بررسی نشست کاربری…
      </div>
    )
  } else if (!user) {
    gateContent = (
      <div className="mx-auto max-w-md rounded-[28px] border border-[#1b39f5]/12 bg-white p-8 text-center shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)]">
        <h2 className="font-display text-[18px] font-bold text-[#0a1b33]">
          {isAdminRoute ? "ورود مدیر فروشگاه لازم است" : "برای مشاهدهٔ پنل کاربری وارد شوید"}
        </h2>
        <p className="mt-2 text-[12px] leading-7 text-slate-500">
          {isAdminRoute
            ? "برای دسترسی به مدیریت محصولات، سفارش‌ها و تنظیمات دیتابیس، ابتدا با حساب گوگل مدیر وارد شوید."
            : "برای مشاهدهٔ سفارش‌ها، کیف پول و تیکت‌ها با حساب گوگل خود وارد شوید."}
        </p>
        {authError ? (
          <p className="mt-3 rounded-2xl bg-[#FDF1EF] px-4 py-2 text-[11.5px] font-semibold text-[#A8382C]">
            {authError}
          </p>
        ) : null}
        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          <button
            type="button"
            onClick={() => void handleSignIn()}
            disabled={signingIn}
            className="glass-solid rounded-full px-6 py-2.5 text-[12.5px] font-semibold disabled:opacity-60"
          >
            {signingIn ? "در حال ورود…" : "ورود با حساب گوگل"}
          </button>
          <Link
            href="/login"
            className="glass-plate glass-plate-hover rounded-full px-5 py-2.5 text-[12.5px] font-semibold text-[#1b39f5]"
          >
            صفحهٔ ورود
          </Link>
        </div>
      </div>
    )
  } else if (isAdminRoute && !isAdmin) {
    gateContent = (
      <div className="mx-auto max-w-md rounded-[28px] border border-[#FCEAE8] bg-white p-8 text-center shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)]">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#FCEAE8] text-[#A8382C]">
          <ShieldAlert className="h-6 w-6" />
        </span>
        <h2 className="mt-4 font-display text-[18px] font-bold text-[#0a1b33]">دسترسی غیرمجاز</h2>
        <p className="mt-2 text-[12px] leading-7 text-slate-500">
          حساب فعلی ({user.email}) نقش مدیر کل ندارد.
        </p>
        <div className="mt-5 flex justify-center gap-2.5">
          <Link href="/dashboard" className="glass-solid rounded-full px-6 py-2.5 text-[12px] font-semibold">
            پنل کاربری
          </Link>
          <Link href="/" className="glass-plate rounded-full px-5 py-2.5 text-[12px] font-semibold text-[#1b39f5]">
            صفحه اصلی
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="mx-auto flex max-w-[1500px] gap-6 px-4 py-6 md:px-6">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-6 rounded-[28px] border border-[#1b39f5]/10 bg-white p-5 shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)]">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="glass-plate glass-plate-hover grid h-9 w-9 place-items-center rounded-[12px]">
                <Logo className="h-5 w-5" />
              </span>
              <span className="flex flex-col items-start gap-1">
                <Wordmark className="h-[18px] w-auto" />
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
                      "flex items-center justify-between rounded-2xl px-4 py-2.5 text-[12.5px] font-medium transition-all",
                      active
                        ? "glass-solid"
                        : "text-slate-600 hover:bg-[#1b39f5]/8 hover:text-[#1b39f5]",
                    )}
                  >
                    {item.label}
                    {item.badge ? (
                      <span
                        className={cn(
                          "num rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                          active ? "bg-white/25 text-white" : "bg-[#1b39f5] text-white",
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
              className="glass-plate glass-plate-hover mt-6 flex items-center justify-between rounded-2xl px-4 py-2.5 text-[12px] font-semibold text-[#1b39f5]"
            >
              بازگشت به فروشگاه
              <ChevronLeft className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-[#1b39f5]/10 bg-white px-6 py-5 shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)]">
            <div>
              <h1 className="font-display text-[19px] font-semibold text-[#0a1b33]">{title}</h1>
              <p className="mt-1 text-[11.5px] text-slate-400">{role}</p>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && !isAdminRoute ? (
                <Link
                  href="/admin"
                  className="rounded-full bg-[#1b39f5]/8 px-3.5 py-2 text-[11.5px] font-bold text-[#1b39f5] hover:bg-[#1b39f5]/15"
                >
                  پنل مدیریت
                </Link>
              ) : null}
              {user && isAdminRoute ? (
                <Link
                  href="/dashboard"
                  className="rounded-full bg-[#1b39f5]/8 px-3.5 py-2 text-[11.5px] font-bold text-[#1b39f5] hover:bg-[#1b39f5]/15"
                >
                  پنل کاربری
                </Link>
              ) : null}
              <span className="glass-plate hidden rounded-full px-3.5 py-2 text-[11.5px] text-[#334155] sm:block">
                {user ? `${displayName} — ${plan}` : "وارد نشده"}
              </span>
              <span className="glass-plate grid h-9 w-9 place-items-center rounded-full text-[12px] font-bold text-[#1b39f5]">
                {initial}
              </span>
            </div>
          </header>

          <div className="mb-5 flex gap-2 overflow-x-auto lg:hidden">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-[11.5px] font-semibold transition-all",
                  pathname === item.href
                    ? "glass-solid"
                    : "glass-plate glass-plate-hover text-[#334155]",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {gateContent ?? children}
        </div>
      </div>
    </div>
  )
}
