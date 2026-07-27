import Link from "next/link"
import { BadgeCheck, Headphones, ShieldCheck, Zap } from "lucide-react"
import Shell from "@/components/site/Shell"
import { siteContent } from "@/lib/data"

export const metadata = { title: "دربارهٔ ما" }

const timeline = [
  { year: "۱۴۰۱", title: "شروع با فروش لایسنس نرم‌افزاری", body: "فعالیت را با تامین لایسنس‌های طراحی و نرم‌افزاری برای تیم‌های کوچک آغاز کردیم." },
  { year: "۱۴۰۲", title: "راه‌اندازی تحویل خودکار", body: "انبار اکانت و موتور تحویل لحظه‌ای راه‌اندازی شد و میانگین زمان تحویل به زیر ۵ دقیقه رسید." },
  { year: "۱۴۰۳", title: "اتصال به API تامین‌کنندگان", body: "با اتصال به سرویس‌های بین‌المللی، سفارش‌ها بدون دخالت انسانی تکمیل می‌شوند." },
  { year: "۱۴۰۵", title: "اچ‌شاپ امروز", body: "بیش از ۴۰ هزار سفارش موفق و پشتیبانی شبانه‌روزی در بستر تیکت." },
]

const values = [
  { icon: ShieldCheck, title: "امنیت حساب شما", body: "هیچ‌گاه اطلاعات ورود شما را برای مقاصد دیگر نگه نمی‌داریم." },
  { icon: Zap, title: "سرعت در تحویل", body: "موتور تحویل چندروشی: انبار، API، ارتقا یا تحویل دستی." },
  { icon: BadgeCheck, title: "محصول اورجینال", body: "تمام اکانت‌ها از مسیر رسمی تامین می‌شوند." },
  { icon: Headphones, title: "پشتیبانی واقعی", body: "پاسخ کارشناس در بازهٔ زمانی کوتاه، نه ربات." },
]

export default function AboutPage() {
  return (
    <Shell
      title="دربارهٔ اچ‌شاپ"
      subtitle={siteContent.footer.about}
      breadcrumb={[{ label: "صفحه اصلی", href: "/" }, { label: "دربارهٔ ما" }]}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {siteContent.stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-slate-200/70 bg-white p-6 text-center"
          >
            <div className="text-[24px] font-bold text-[#0a1b33]">{stat.value}</div>
            <div className="mt-1.5 text-[12px] text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {values.map((value) => (
          <div key={value.title} className="rounded-3xl border border-slate-200/70 bg-white p-7">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#E5F2FC] text-[#2783de]">
              <value.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-[14px] font-bold text-[#0a1b33]">{value.title}</h3>
            <p className="mt-2 text-[12.5px] leading-7 text-slate-500">{value.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-10 rounded-[32px] border border-slate-200/70 bg-white p-8">
        <h2 className="font-display text-[20px] font-semibold text-[#0a1b33]">مسیر ما</h2>
        <ol className="mt-6 space-y-6 border-r border-slate-200 pr-6">
          {timeline.map((item) => (
            <li key={item.year} className="relative">
              <span className="absolute -right-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#2783de] ring-4 ring-[#E5F2FC]" />
              <span className="num text-[11.5px] font-bold text-[#2783de]">{item.year}</span>
              <h3 className="mt-1 text-[13.5px] font-bold text-[#0a1b33]">{item.title}</h3>
              <p className="mt-1.5 text-[12.5px] leading-7 text-slate-500">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 rounded-[32px] bg-[#0a152d] p-10 text-center">
        <h2 className="font-display text-[24px] font-medium text-white">سوالی دارید؟</h2>
        <p className="mx-auto mt-3 max-w-lg text-[13px] leading-7 text-white/70">
          تیم پشتیبانی اچ‌شاپ آمادهٔ راهنمایی دربارهٔ انتخاب پلن، روش تحویل و شرایط گارانتی است.
        </p>
        <Link
          href="/contact"
          className="mt-7 inline-block rounded-full bg-white px-7 py-3 text-[13px] font-semibold text-[#0a1b33]"
        >
          تماس با ما
        </Link>
      </section>
    </Shell>
  )
}
