"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, LogOut, ShieldCheck, UserCheck } from "lucide-react"
import { siteContent } from "@/lib/data"
import { useFirebase } from "@/components/providers/FirebaseProvider"
import Logo from "@/components/site/Logo"
import Wordmark from "@/components/site/Wordmark"

export default function LoginPage() {
  const router = useRouter()
  const { user, authReady, isAdmin, publicProfile, signInWithGoogle, signOutUser } = useFirebase()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function handleGoogleLogin() {
    setError("")
    setBusy(true)
    try {
      const signedIn = await signInWithGoogle()
      if (signedIn) {
        router.push("/dashboard")
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "ورود با گوگل انجام نشد. دوباره تلاش کنید."
      setError(msg.includes("popup-closed") ? "پنجرهٔ ورود بسته شد." : "خطا در ورود با حساب گوگل. دسترسی پاپ‌آپ مرورگر را بررسی کنید.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="glass-plate glass-plate-hover grid h-9 w-9 place-items-center rounded-[12px]">
              <Logo className="h-5 w-5" />
            </span>
            <span className="flex flex-col items-start gap-1 leading-none">
              <Wordmark className="h-5 w-auto" />
              <span className="text-[10.5px] font-semibold leading-none text-slate-400">
                {siteContent.brand.nameFa}
              </span>
            </span>
          </Link>

          {authReady && user ? (
            <div className="mt-8 rounded-3xl border border-[#1b39f5]/15 bg-white p-6 shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)]">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#1b39f5] to-[#7d92ff] text-[16px] font-bold text-white">
                  {(publicProfile?.displayName || user.displayName || "ک").charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-[14px] font-bold text-[#0a1b33]">
                      {publicProfile?.displayName || user.displayName || "کاربر اچ‌شاپ"}
                    </span>
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#46A171]" />
                  </div>
                  <p dir="ltr" className="font-latin truncate text-right text-[11px] text-slate-400">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                <Link
                  href="/dashboard"
                  className="glass-solid flex w-full items-center justify-center gap-2 rounded-full py-3 text-[13px] font-semibold"
                >
                  ورود به پنل کاربری
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="glass-plate glass-plate-hover flex w-full items-center justify-center gap-2 rounded-full py-3 text-[13px] font-semibold text-[#1b39f5]"
                  >
                    <UserCheck className="h-4 w-4" />
                    ورود به پنل مدیریت
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={() => void signOutUser()}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FDF1EF] py-2.5 text-[12px] font-bold text-[#A8382C] transition-colors hover:bg-[#FCE4E0]"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  خروج از حساب کاربری
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="mt-8 font-display text-[24px] font-semibold text-[#0a1b33]">
                ورود به حساب کاربری
              </h1>
              <p className="mt-2 text-[12.5px] leading-7 text-slate-500">
                برای ثبت سفارش، مشاهدهٔ اکانت‌های تحویل‌شده و پیگیری تیکت‌ها با حساب گوگل خود وارد شوید.
              </p>

              <div className="mt-6 rounded-3xl border border-[#1b39f5]/12 bg-white p-6 shadow-[0_20px_44px_-34px_rgba(27,57,245,0.45)]">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={busy || !authReady}
                  className="glass-solid flex w-full items-center justify-center gap-2.5 rounded-full py-3.5 text-[13px] font-semibold disabled:opacity-60"
                >
                  {busy ? "در حال اتصال به گوگل…" : "ورود / ثبت‌نام با حساب گوگل"}
                </button>

                {error ? (
                  <p role="alert" className="mt-3 rounded-2xl bg-[#FDF1EF] px-4 py-2.5 text-[11.5px] font-semibold text-[#A8382C]">
                    {error}
                  </p>
                ) : null}

                <p className="mt-4 text-center text-[11px] leading-6 text-slate-400">
                  با اولین ورود، پروفایل کاربری و کیف پول شما به‌صورت خودکار ساخته می‌شود.
                </p>
              </div>
            </>
          )}

          <p className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-[#1b39f5]" />
            احراز هویت امن مبتنی بر Firebase Auth
          </p>
        </div>
      </div>

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
