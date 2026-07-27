import { Clock, Mail, MapPin, PhoneCall, Send } from "lucide-react"
import Shell from "@/components/site/Shell"
import { siteContent } from "@/lib/data"

export const metadata = { title: "تماس با ما" }

export default function ContactPage() {
  const { contact } = siteContent

  const items = [
    { icon: PhoneCall, label: "تلفن پشتیبانی", value: contact.phone },
    { icon: Mail, label: "ایمیل", value: contact.email, latin: true },
    { icon: Send, label: "تلگرام", value: contact.telegram, latin: true },
    { icon: MapPin, label: "نشانی", value: contact.address },
    { icon: Clock, label: "ساعات پاسخ‌گویی", value: contact.hours },
  ]

  return (
    <Shell
      title="تماس با ما"
      subtitle="برای پیگیری سفارش بهتر است از تیکت پنل کاربری استفاده کنید؛ برای همکاری و فروش عمده از فرم زیر."
      breadcrumb={[{ label: "صفحه اصلی", href: "/" }, { label: "تماس با ما" }]}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <form className="rounded-[32px] border border-[#1b39f5]/10 bg-white p-8 shadow-[0_22px_48px_-36px_rgba(27,57,245,0.5)]">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="نام و نام خانوادگی" placeholder="مانند: زهرا موسوی" />
            <Field label="شماره تماس" placeholder="۰۹۱۲۳۴۵۶۷۸۹" />
            <Field label="ایمیل" placeholder="you@example.com" latin />
            <Field label="موضوع" placeholder="مانند: همکاری عمده" />
          </div>
          <label className="mt-4 block">
            <span className="text-[12px] font-semibold text-[#0a1b33]">متن پیام</span>
            <textarea
              rows={6}
              placeholder="توضیح درخواست خود را بنویسید…"
              className="mt-2 w-full rounded-2xl border border-[#1b39f5]/12 bg-[#1b39f5]/4 px-4 py-3 text-[12.5px] leading-7 outline-none transition-all focus:border-[#1b39f5]/45 focus:bg-white focus:shadow-[0_0_0_4px_rgba(27,57,245,0.1)]"
            />
          </label>
          <button type="button" className="glass-solid mt-5 rounded-full px-8 py-3.5 text-[13px] font-semibold">
            ارسال پیام
          </button>
        </form>

        <aside className="space-y-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-3.5 rounded-3xl border border-[#1b39f5]/10 bg-white p-5 shadow-[0_18px_40px_-34px_rgba(27,57,245,0.5)]"
            >
              <span className="glass-plate grid h-10 w-10 shrink-0 place-items-center rounded-[14px]">
                <item.icon className="h-4 w-4 text-[#1b39f5]" />
              </span>
              <span>
                <span className="block text-[11.5px] text-slate-400">{item.label}</span>
                <span
                  className={`mt-1 block text-[12.5px] font-semibold text-[#0a1b33] ${item.latin ? "font-latin" : ""}`}
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
        className="mt-2 w-full rounded-2xl border border-[#1b39f5]/12 bg-[#1b39f5]/4 px-4 py-3 text-[12.5px] outline-none transition-all focus:border-[#1b39f5]/45 focus:bg-white focus:shadow-[0_0_0_4px_rgba(27,57,245,0.1)]"
      />
    </label>
  )
}
