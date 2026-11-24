import type { Metadata } from "next"
import { Clock, Mail, MapPin, PhoneCall, Send } from "lucide-react"
import Shell from "@/components/site/Shell"
import ContactForm from "@/components/site/ContactForm"
import { siteContent } from "@/lib/data"

export const metadata: Metadata = {
  title:"تماس با ما — پشتیبانی ۲۴/۷",
  description:
    "ارتباط با پشتیبانی اچ‌شاپ: تیکت شبانه‌روزی، تماس تلفنی ۹ تا ۲۱، ایمیل و تلگرام. پاسخ سریع برای پیگیری سفارش، همکاری و فروش عمده.",
  alternates: { canonical:"/contact" },
  openGraph: {
    title:"تماس با اچ‌شاپ",
    description:"پشتیبانی شبانه‌روزی تیکت و پاسخ سریع برای پیگیری سفارش و همکاری.",
    url:"/contact",
  },
}

export default function ContactPage() {
  const { contact } = siteContent

  const items = [
    { icon: PhoneCall, label:"تلفن پشتیبانی", value: contact.phone },
    { icon: Mail, label:"ایمیل", value: contact.email, latin: true },
    { icon: Send, label:"تلگرام", value: contact.telegram, latin: true },
    { icon: MapPin, label:"نشانی", value: contact.address },
    { icon: Clock, label:"ساعات پاسخ‌گویی", value: contact.hours },
  ]

  return (
    <Shell
      title="تماس با ما"
      subtitle="برای پیگیری سفارش بهتر است از تیکت پنل کاربری استفاده کنید؛ برای همکاری و فروش عمده از فرم زیر."
      breadcrumb={[{ label:"صفحه اصلی", href:"/" }, { label:"تماس با ما" }]}
    >
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_380px]">
        <ContactForm />

        <aside className="space-y-2.5 sm:space-y-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-3 rounded-3xl border border-[#1b39f5]/10 bg-white p-4 sm:p-5 shadow-[0_18px_40px_-34px_rgba(27,57,245,0.5)]"
            >
              <span className="glass-plate grid h-10 w-10 shrink-0 place-items-center rounded-[14px]">
                <item.icon className="h-4 w-4 text-[#1b39f5]" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11.5px] text-slate-400">{item.label}</span>
                <span
                  className={`mt-1 block break-words text-[12.5px] font-semibold text-[#0a1b33] ${item.latin ? "font-latin" : ""}`}
                  dir={item.latin ? "ltr" : undefined}
                >
                  {item.value}
                </span>
              </span>
            </div>
          ))}
        </aside>
      </div>
    </Shell>
  )
}
