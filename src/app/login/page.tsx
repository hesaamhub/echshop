"use client"

import { useState } from "react"
import Link from "next/link"
import { ShieldCheck } from "lucide-react"
import { siteContent } from "@/lib/data"
import { cn } from "@/lib/utils"
import Logo from "@/components/site/Logo"

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login")

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* فرم */}
      <div className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="glass-plate glass-plate-hover grid h-9 w-9 place-items-center rounded-[12px]">
              <Logo className="h-5 w-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="wordmark text-[16px] leading-none text-[#0a1b33]">echshop</span>
              <span className="mt-1 text-[10.5px] font-semibold leading-none text-slate-400">
                {siteContent.brand.nameFa}
              </span>
            </span>
          </Link>

          <h1 className="mt-8 font-display text-[24px] font-semibold text-[#0a1b33]">
            {mode === "login" ? "ورود به حساب کاربری" : "ساخت حساب جدید"}
          </h1>
          <p className="mt-2 text-[12.5px] leading-7 text-slate-500">
            {mode === "login"
              ? "برای مشاهدهٔ سفارش‌ها و دریافت اکانت‌ها وارد شوید."
              : "فقط با شماره موبایل و ایمیل در دو دقیقه ثبت‌نام کنید."}
          </p>

          <div className="mt-6 flex rounded-full bg-[#1b39f5]/6 p-1">
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
                  mode === tab.key ? "glass-solid" : "text-slate-500 hover:text-[#1b39f5]",
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
                  className="mt-2 w-full rounded-2xl border border-[#1b39f5]/12 bg-[#1b39f5]/4 px-4 py-3 text-[12.5px] outline-none transition-all focus:border-[#1b39f5]/45 focus:bg-white focus:shadow-[0_0_0_4px_rgba(27,57,245,0.1)]"
                  placeholder="مانند: علی محمدی"
                />
              </label>
            ) : null}

            <label className="block">
              <span className="text-[12px] font-semibold text-[#0a1b33]">موبایل یا ایمیل</span>
              <input
                className="mt-2 w-full rounded-2xl border border-[#1b39f5]/12 bg-[#1b39f5]/4 px-4 py-3 text-[12.5px] outline-none transition-all focus:border-[#1b39f5]/45 focus:bg-white focus:shadow-[0_0_0_4px_rgba(27,57,245,0.1)]"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              />
            </label>

            <label className="block">
              <span className="text-[12px] font-semibold text-[#0a1b33]">کلمهٔ عبور</span>
              <input
                type="password"
                className="mt-2 w-full rounded-2xl border border-[#1b39f5]/12 bg-[#1b39f5]/4 px-4 py-3 text-[12.5px] outline-none transition-all focus:border-[#1b39f5]/45 focus:bg-white focus:shadow-[0_0_0_4px_rgba(27,57,245,0.1)]"
                placeholder="••••••••"
              />
            </label>

            <Link
              href="/dashboard"
              className="glass-solid block rounded-full py-3.5 text-center text-[13px] font-semibold"
            >
              {mode === "login" ? "ورود به پنل" : "ثبت‌نام و ورود"}
            </Link>
          </form>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-[#1b39f5]" />
            ورود امن با رمز یک‌بارمصرف پیامکی
          </p>
        </div>
      </div>

      {/* تصویر کناری */}
      <div className="relative hidden overflow-hidden bg-[#0a152d] lg:block">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[#1b39f5]/45 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#1b39f5]/25 blur-3xl" />
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
