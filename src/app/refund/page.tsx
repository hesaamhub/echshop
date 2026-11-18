import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, BadgeCheck, Clock, RefreshCw, ShieldCheck } from "lucide-react"
import Shell from "@/components/site/Shell"

export const metadata: Metadata = {
  title: "شرایط گارانتی، جایگزینی و بازگشت وجه",
  description:
    "گارانتی کامل مدت اشتراک در اچ‌شاپ: شرایط تعویض فوری اکانت، بازگشت وجه به کیف پول یا کارت بانکی و زمان‌بندی رسیدگی به تیکت‌ها.",
  alternates: { canonical: "/refund" },
}

const GUARANTEES = [
  {
    icon: ShieldCheck,
    title: "گارانتی کل دورهٔ اشتراک",
    body: "هر اکانت یا لایسنس تا آخرین روز اعتبار پلن خریداری‌شده تحت پوشش ضمانت اچ‌شاپ است.",
  },
  {
    icon: RefreshCw,
    title: "جایگزینی سریع در کمتر از ۲ ساعت",
    body: "در صورت قطع ناگهانی اشتراک یا مشکل دسترسی، بلافاصله اکانت یا کد جایگزین صادر می‌شود.",
  },
  {
    icon: BadgeCheck,
    title: "بازگشت وجه شفاف",
    body: "اگر امکان جایگزینی وجود نداشته باشد یا سفارش پیش از فعال‌سازی لغو شود، مبلغ کامل بازگردانده می‌شود.",
  },
  {
    icon: Clock,
    title: "پاسخ‌گویی ۲۴/۷ در تیکت",
    body: "درخواست‌های گارانتی در پنل کاربری با اولویت بالا بررسی و در کوتاه‌ترین زمان تعیین تکلیف می‌شوند.",
  },
]

export default function RefundPage() {
  return (
    <Shell
      title="شرایط گارانتی و بازگشت وجه"
      subtitle="خرید بدون دغدغه با ضمانت کتبی جایگزینی و بازپرداخت در تمام مدت اشتراک."
      breadcrumb={[{ label: "صفحه اصلی", href: "/" }, { label: "شرایط بازگشت وجه" }]}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {GUARANTEES.map((item) => (
          <div
            key={item.title}
            className="rounded-[24px] border border-[#1b39f5]/10 bg-white p-5 shadow-[0_18px_40px_-34px_rgba(27,57,245,0.45)]"
          >
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#1b39f5]/8 text-[#1b39f5]">
              <item.icon className="h-5 w-5" />
            </span>
            <h2 className="mt-3.5 text-[14px] font-bold text-[#0a1b33]">{item.title}</h2>
            <p className="mt-1.5 text-[12px] leading-6 text-slate-500">{item.body}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 space-y-4 rounded-[28px] border border-[#1b39f5]/10 bg-white p-5 shadow-[0_18px_40px_-34px_rgba(27,57,245,0.45)] sm:p-7">
        <h2 className="font-display text-[16px] font-bold text-[#0a1b33]">موارد مشمول بازپرداخت</h2>
        <ul className="list-disc space-y-2.5 pr-5 text-[12.5px] leading-7 text-slate-600 sm:text-[13px]">
          <li>لغو سفارش از سوی خریدار پیش از تحویل مشخصات اکانت یا ارسال دعوت‌نامه فعال‌سازی.</li>
          <li>ناتوانی در برقراری مجدد اشتراک یا تحویل جایگزین ظرف ۲۴ ساعت پس از ثبت تیکت نقص فنی.</li>
          <li>برداشت تکراری در پرداخت بانکی (بازگشت کامل وجه اضافه به حساب مبدا).</li>
          <li>بازگشت وجه به کیف پول اچ‌شاپ بلافاصله و به کارت بانکی ظرف ۲۴ تا ۴۸ ساعت کاری انجام می‌شود.</li>
        </ul>

        <div className="pt-2">
          <Link
            href="/dashboard/tickets"
            className="inline-flex items-center gap-2 rounded-full bg-[#0a152d] px-6 py-3 text-[12.5px] font-bold text-white transition-colors hover:bg-[#1b39f5]"
          >
            ثبت درخواست گارانتی یا پیگیری سفارش
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Shell>
  )
}
