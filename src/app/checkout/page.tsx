import Link from "next/link"
import { CreditCard, Wallet } from "lucide-react"
import Shell from "@/components/site/Shell"
import { toman } from "@/lib/utils"

export const metadata = { title: "تسویه حساب" }

export default function CheckoutPage() {
  const total = 2_420_000

  return (
    <Shell
      title="تسویه حساب"
      subtitle="اطلاعات تحویل را بررسی کنید و روش پرداخت را انتخاب نمایید."
      breadcrumb={[
        { label: "صفحه اصلی", href: "/" },
        { label: "سبد خرید", href: "/cart" },
        { label: "تسویه حساب" },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-[#1b39f5]/10 bg-white p-6 shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)]">
            <h2 className="flex items-center gap-2.5 text-[14px] font-bold text-[#0a1b33]">
              <span className="h-4 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
              اطلاعات خریدار
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="نام و نام خانوادگی" placeholder="مانند: سارا رضایی" />
              <Field label="شماره موبایل" placeholder="۰۹۱۲۳۴۵۶۷۸۹" />
              <Field label="ایمیل دریافت اکانت" placeholder="you@example.com" latin />
              <Field label="تکرار ایمیل" placeholder="you@example.com" latin />
            </div>
            <label className="mt-4 block">
              <span className="text-[12px] font-semibold text-[#0a1b33]">یادداشت برای پشتیبانی (اختیاری)</span>
              <textarea
                rows={3}
                placeholder="مانند: اشتراک را روی ایمیل دوم فعال کنید"
                className="mt-2 w-full rounded-2xl border border-[#1b39f5]/12 bg-[#1b39f5]/4 px-4 py-3 text-[12px] outline-none transition-all focus:border-[#1b39f5]/45 focus:bg-white focus:shadow-[0_0_0_4px_rgba(27,57,245,0.1)]"
              />
            </label>
          </div>

          <div className="rounded-3xl border border-[#1b39f5]/10 bg-white p-6 shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)]">
            <h2 className="flex items-center gap-2.5 text-[14px] font-bold text-[#0a1b33]">
              <span className="h-4 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
              روش پرداخت
            </h2>
            <div className="mt-4 space-y-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#1b39f5]/35 bg-[#1b39f5]/8 p-4">
                <input type="radio" name="pay" defaultChecked className="mt-1 h-4 w-4 accent-[#1b39f5]" />
                <span className="flex-1">
                  <span className="flex items-center gap-2 text-[12.5px] font-bold text-[#0a1b33]">
                    <CreditCard className="h-4 w-4 text-[#1b39f5]" /> درگاه پرداخت اینترنتی
                  </span>
                  <span className="mt-1.5 block text-[11.5px] leading-6 text-slate-600">
                    درگاه نهایی در بخش تنظیمات پنل مدیریت متصل می‌شود (فعلاً حالت نمایشی).
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#1b39f5]/10 p-4 transition-all hover:border-[#1b39f5]/25 hover:bg-[#1b39f5]/4">
                <input type="radio" name="pay" className="mt-1 h-4 w-4 accent-[#1b39f5]" />
                <span className="flex-1">
                  <span className="flex items-center gap-2 text-[12.5px] font-bold text-[#0a1b33]">
                    <Wallet className="h-4 w-4 text-[#1b39f5]" /> کیف پول اچ‌شاپ
                  </span>
                  <span className="mt-1.5 block text-[11.5px] leading-6 text-slate-600">
                    موجودی فعلی: <span className="num">{toman(1_250_000)}</span> تومان
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-3xl border border-[#1b39f5]/10 bg-white p-6 shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)] lg:sticky lg:top-24">
          <h2 className="flex items-center gap-2.5 text-[14px] font-bold text-[#0a1b33]">
            <span className="h-4 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
            پرداخت نهایی
          </h2>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[12.5px] text-slate-500">مبلغ قابل پرداخت</span>
            <span className="text-[17px] font-bold text-[#0a1b33]">
              <span className="num">{toman(total)}</span>
              <span className="mr-1 text-[11px] font-medium text-slate-500">تومان</span>
            </span>
          </div>
          <label className="mt-5 flex items-start gap-2 text-[11.5px] leading-6 text-slate-500">
            <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 accent-[#1b39f5]" />
            <span>
              قوانین و مقررات و شرایط گارانتی را می‌پذیرم.
            </span>
          </label>
          <button type="button" className="glass-solid mt-5 w-full rounded-full py-3.5 text-[13px] font-semibold">
            پرداخت و ثبت سفارش
          </button>
          <Link
            href="/cart"
            className="mt-3 block text-center text-[11.5px] text-slate-400 transition-colors hover:text-[#1b39f5]"
          >
            بازگشت به سبد خرید
          </Link>
        </aside>
      </div>
    </Shell>
  )
}

function Field({
  label,
  placeholder,
  latin,
}: {
  label: string
  placeholder: string
  latin?: boolean
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold text-[#0a1b33]">{label}</span>
      <input
        placeholder={placeholder}
        dir={latin ? "ltr" : undefined}
        className="mt-2 w-full rounded-2xl border border-[#1b39f5]/12 bg-[#1b39f5]/4 px-4 py-3 text-[12px] outline-none transition-all focus:border-[#1b39f5]/45 focus:bg-white focus:shadow-[0_0_0_4px_rgba(27,57,245,0.1)]"
      />
    </label>
  )
}
