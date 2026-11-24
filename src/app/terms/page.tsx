import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, FileText, ShieldAlert } from "lucide-react"
import Shell from "@/components/site/Shell"

export const metadata: Metadata = {
  title:"قوانین و مقررات استفاده از خدمات",
  description:
    "شرایط و ضوابط خرید اکانت پرمیوم، لایسنس نرم‌افزاری، نحوهٔ استفاده مجاز از اشتراک‌ها و تعهدات تحویل و گارانتی در فروشگاه اچ‌شاپ.",
  alternates: { canonical:"/terms" },
}

const SECTIONS = [
  {
    title:"۱. ثبت سفارش و صحت اطلاعات",
    points: [
      "خریدار موظف است ایمیل و شماره تماس معتبر خود را هنگام ثبت سفارش وارد کند؛ مسئولیت اشتباه در تایپ ایمیل برای ارتقای اکانت شخصی به عهده کاربر است.",
      "در محصولاتی که به‌صورت دعوت‌نامه رسمی روی ایمیل مشتری فعال می‌شوند، تایید لینک دعوت باید ظرف ۴۸ ساعت انجام شود تا سفارش بدون تاخیر تکمیل گردد.",
    ],
  },
  {
    title:"۲. شرایط استفادهٔ مجاز از اشتراک‌ها",
    points: [
      "اکانت‌ها و پروفایل‌های اختصاصی صرفاً برای استفادهٔ شخصی خریدار صادر می‌شوند و فروش مجدد، به اشتراک‌گذاری هم‌زمان بیش از دستگاه مجاز یا تغییر ایمیل اکانت‌های اشتراکی مجاز نیست.",
      "در استفاده از سرویس‌هایی که محدودیت منطقه‌ای دارند، استفاده از ابزار تغییر IP پایدار و عدم نقض قوانین سرویس‌دهنده اصلی ضروری است.",
    ],
  },
  {
    title:"۳. زمان‌بندی تحویل و پشتیبانی",
    points: [
      "محصولات تحویل فوری بلافاصله پس از تایید پرداخت در پنل کاربری نمایش داده می‌شوند.",
      "سفارش‌هایی که نیاز به ارتقای ایمیل یا فعال‌سازی تخصصی دارند در بازهٔ اعلام‌شده در صفحهٔ محصول (معمولاً ۲ تا ۶۰ دقیقه) انجام و از طریق پیام/تیکت اطلاع‌رسانی می‌گردند.",
    ],
  },
  {
    title:"۴. تغییرات قوانین سرویس‌دهندگان خارجی",
    points: [
      "در صورت تغییر ناگهانی سیاست‌های قیمت‌گذاری یا محدودیت‌های سراسری از سوی شرکت‌های اصلی، اچ‌شاپ متعهد است یا سرویس جایگزین هم‌تراز ارائه دهد یا مطابق شرایط گارانتی نسبت به جبران یا بازگشت وجه باقیمانده اقدام کند.",
    ],
  },
]

export default function TermsPage() {
  return (
    <Shell
      title="قوانین و مقررات اچ‌شاپ"
      subtitle="ثبت سفارش و استفاده از خدمات اچ‌شاپ به معنای پذیرش شفاف این ضوابط و تعهدات دوطرفه است."
      breadcrumb={[{ label:"صفحه اصلی", href:"/" }, { label:"قوانین و مقررات" }]}
    >
      <div className="space-y-4">
        {SECTIONS.map((section) => (
          <section
            key={section.title}
            className="rounded-[26px] border border-[#1b39f5]/10 bg-white p-5 shadow-[0_18px_40px_-34px_rgba(27,57,245,0.45)] sm:p-7"
          >
            <h2 className="flex items-center gap-2.5 font-display text-[16px] font-bold text-[#0a1b33]">
              <FileText className="h-4 w-4 shrink-0 text-[#1b39f5]" />
              {section.title}
            </h2>
            <ul className="mt-4 space-y-3">
              {section.points.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-[12.5px] leading-7 text-slate-600 sm:text-[13px]">
                  <CheckCircle2 className="mt-1.5 h-4 w-4 shrink-0 text-[#46A171]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-[#1b39f5]/12 bg-[#f5f8ff] p-5 text-[12px] text-slate-600">
          <span className="flex items-center gap-2 font-semibold text-[#0a1b33]">
            <ShieldAlert className="h-4 w-4 text-[#1b39f5]" />
            برای مطالعه شرایط کامل جایگزینی و بازپرداخت به صفحهٔ شرایط بازگشت وجه مراجعه کنید.
          </span>
          <Link
            href="/refund"
            className="rounded-full bg-[#1b39f5] px-4 py-2 text-[11.5px] font-bold text-white transition-colors hover:bg-[#1530d8]"
          >
            شرایط گارانتی و بازگشت وجه
          </Link>
        </div>
      </div>
    </Shell>
  )
}
