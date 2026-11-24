import type { Metadata } from "next"
import { Database, KeyRound, Lock, ShieldCheck } from "lucide-react"
import Shell from "@/components/site/Shell"

export const metadata: Metadata = {
  title:"حریم خصوصی و امنیت داده‌های کاربران",
  description:
    "سیاست حفظ حریم خصوصی در اچ‌شاپ: نگهداری حداقلی داده‌ها، عدم ذخیره رمز عبور ایمیل مشتریان و حفاظت کامل از اطلاعات حساب کاربری.",
  alternates: { canonical:"/privacy" },
}

const PILLARS = [
  {
    icon: KeyRound,
    title:"عدم درخواست رمز عبور برای ارتقاها",
    body:"در سرویس‌های ارتقای اکانت شخصی، فرآیند فعال‌سازی از طریق ایمیل دعوت رسمی انجام می‌شود و هیچ نیازی به ارسال رمز جیمیل یا رمز اصلی شما نیست.",
  },
  {
    icon: Lock,
    title:"امنیت احراز هویت و دسترسی",
    body:"ورود کاربران با استانداردهای امنیتی Google و Firebase Authentication انجام می‌شود و اطلاعات سفارش‌ها تنها با حساب کاربری مالک قابل مشاهده است.",
  },
  {
    icon: Database,
    title:"حداقل داده‌های ضروری",
    body:"فقط نام، ایمیل، شماره تماس اختیاری و سوابق سفارش برای تحویل محصول، اطلاع‌رسانی وضعیت و ارائه خدمات گارانتی نگهداری می‌شوند.",
  },
  {
    icon: ShieldCheck,
    title:"عدم اشتراک‌گذاری با اشخاص ثالث",
    body:"اطلاعات تماس و سوابق خرید شما تحت هیچ شرایطی در اختیار شرکت‌ها، تبلیغ‌کنندگان یا اشخاص ثالث قرار نمی‌گیرد.",
  },
]

export default function PrivacyPage() {
  return (
    <Shell
      title="حریم خصوصی کاربران"
      subtitle="امنیت حساب و اطلاعات شخصی شما خط قرمز اچ‌شاپ است؛ تمام داده‌ها به‌صورت رمزنگاری‌شده و حداقلی نگهداری می‌شوند."
      breadcrumb={[{ label:"صفحه اصلی", href:"/" }, { label:"حریم خصوصی" }]}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {PILLARS.map((item) => (
          <section
            key={item.title}
            className="rounded-[26px] border border-[#1b39f5]/10 bg-white p-5 shadow-[0_18px_40px_-34px_rgba(27,57,245,0.45)] sm:p-6"
          >
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#1b39f5]/8 text-[#1b39f5]">
              <item.icon className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-display text-[15px] font-bold text-[#0a1b33]">{item.title}</h2>
            <p className="mt-2 text-[12.5px] leading-7 text-slate-600">{item.body}</p>
          </section>
        ))}
      </div>

      <section className="mt-6 rounded-[26px] border border-[#1b39f5]/10 bg-white p-5 shadow-[0_18px_40px_-34px_rgba(27,57,245,0.45)] sm:p-7">
        <h2 className="font-display text-[16px] font-bold text-[#0a1b33]">درخواست حذف یا ویرایش اطلاعات</h2>
        <p className="mt-2.5 text-[12.5px] leading-7 text-slate-600">
          شما در هر زمان می‌توانید اطلاعات پروفایل خود را از بخش پروفایل پنل کاربری ویرایش کنید یا از طریق تیکت پشتیبانی درخواست پاک‌سازی داده‌های ارتباطی خود را ثبت نمایید.
        </p>
      </section>
    </Shell>
  )
}
