"use client"

import { useState } from "react"
import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import { siteContent } from "@/lib/data"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login")

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* فرم */}
      <div className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0a152d] text-white text-sm">
              {siteContent.brand.logoMark}
            </span>
            <span className="text-[15px] font-bold text-[#0a1b33]">{siteContent.brand.nameFa}</span>
          </Link>

          <h1 className="mt-8 font-display text-[24px] font-semibold text-[#0a1b33]">
            {mode === "login" ? "ورود به حساب کاربری" : "ساخت حساب جدید"}
          </h1>
          <p className="mt-2 text-[12.5px] leading-7 text-slate-500">
            {mode === "login"
              ? "برای مشاهدهٔ سفارش‌ها و دریافت اکانت‌ها وارد شوید."
              : "فقط با شماره موبایل و ایمیل در دو دقیقه ثبت‌نام کنید."}
          </p>

          <div className="mt-6 flex rounded-full bg-slate-100 p-1">
            {(
              [
                { key: "login", label: "ورود" },
                { key: "register", label: "ثبت‌نام" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setMode(tab.key)}
                className={cn(
                  "flex-1 rounded-full py-2 text-[12px] font-semibold transition-all",
                  mode === tab.key ? "bg-white text-[#0a1b33] shadow-sm" : "text-slate-500",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form className="mt-6 space-y-4" onSubmit={(event) => event.preventDefault()}>
            {mode === "register" ? (
              <label className="block">
                <span className="text-[12px] font-semibold text-[#0a1b33]">نام و نام خانوادگی</span>
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12.5px] outline-none focus:border-[#2783de]"
                  placeholder="مانند: علی محمدی"
                />
              </label>
            ) : null}

            <label className="block">
              <span className="text-[12px] font-semibold text-[#0a1b33]">موبایل یا ایمیل</span>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12.5px] outline-none focus:border-[#2783de]"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              />
            </label>

            <label className="block">
              <span className="text-[12px] font-semibold text-[#0a1b33]">کلمهٔ عبور</span>
              <input
                type="password"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12.5px] outline-none focus:border-[#2783de]"
                placeholder="••••••••"
              />
            </label>

            <Link
              href="/dashboard"
              className="block rounded-full bg-[#0a152d] py-3.5 text-center text-[13px] font-semibold text-white"
            >
              {mode === "login" ? "ورود به پنل" : "ثبت‌نام و ورود"}
            </Link>
          </form>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            ورود امن با رمز یک‌بارمصرف پیامکی
          </p>
        </div>
      </div>

      {/* تصویر کناری */}
      <div className="relative hidden overflow-hidden bg-[#0a152d] lg:block">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[#2783de]/25 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#2783de]/15 blur-3xl" />
        <div className="relative flex h-full flex-col justify-center px-16">
          <h2 className="font-display text-[34px] font-medium leading-[1.6] text-white">
            هر اشتراک دیجیتالی که لازم دارید،
            <br />
            در کمتر از ۵ دقیقه
          </h2>
          <p className="mt-6 max-w-md text-[13px] leading-8 text-white/70">
            تحویل خودکار از انبار، تحویل از API تامین‌کننده، ارتقای اکانت شخصی یا تحویل
            دستی توسط کارشناس — همه در یک پنل.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {siteContent.stats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="text-[20px] font-bold text-white">{stat.value}</div>
                <div className="mt-1 text-[11.5px] text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
