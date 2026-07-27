import Link from "next/link"
import Header from "@/components/site/Header"
import Footer from "@/components/site/Footer"

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="relative mx-auto flex max-w-[1400px] flex-col items-center px-4 py-24 text-center">
        <span
          className="pointer-events-none absolute top-10 h-56 w-56 rounded-full bg-[#1b39f5]/12 blur-3xl"
          aria-hidden
        />
        <span className="relative font-display text-[110px] font-semibold leading-none text-[#1b39f5]">
          <span className="num">۴۰۴</span>
        </span>
        <h1 className="relative mt-4 text-[20px] font-bold text-[#0a1b33]">این صفحه پیدا نشد</h1>
        <p className="relative mt-3 max-w-md text-[13px] leading-7 text-slate-500">
          ممکن است نشانی را اشتباه وارد کرده باشید یا محصول مورد نطر حذف شده باشد.
          از مسیرهای زیر ادامه دهید.
        </p>
        <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="glass-solid rounded-full px-7 py-3 text-[13px] font-semibold">
            بازگشت به صفحه اصلی
          </Link>
          <Link
            href="/products"
            className="glass-plate glass-plate-hover rounded-full px-7 py-3 text-[13px] font-semibold text-[#1b39f5]"
          >
            مشاهدهٔ محصولات
          </Link>
          <Link
            href="/dashboard/tickets"
            className="glass-plate glass-plate-hover rounded-full px-7 py-3 text-[13px] font-semibold text-[#1b39f5]"
          >
            ارسال تیکت
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
