import Link from "next/link"
import Header from "@/components/site/Header"
import Footer from "@/components/site/Footer"

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-[1400px] flex-col items-center px-4 py-24 text-center">
        <span className="font-display text-[110px] font-semibold leading-none text-[#0a1b33]">
          <span className="num">۴۰۴</span>
        </span>
        <h1 className="mt-4 text-[20px] font-bold text-[#0a1b33]">این صفحه پیدا نشد</h1>
        <p className="mt-3 max-w-md text-[13px] leading-7 text-slate-500">
          ممکن است نشانی را اشتباه وارد کرده باشید یا محصول مورد نطر حذف شده باشد.
          از مسیرهای زیر ادامه دهید.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-[#0a152d] px-7 py-3 text-[13px] font-semibold text-white"
          >
            بازگشت به صفحه اصلی
          </Link>
          <Link
            href="/products"
            className="rounded-full border border-slate-200 bg-white px-7 py-3 text-[13px] font-semibold text-[#0a1b33] hover:border-slate-300"
          >
            مشاهدهٔ محصولات
          </Link>
          <Link
            href="/dashboard/tickets"
            className="rounded-full border border-slate-200 bg-white px-7 py-3 text-[13px] font-semibold text-[#0a1b33] hover:border-slate-300"
          >
            ارسال تیکت
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
