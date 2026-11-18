import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Headphones } from "lucide-react"
import Shell from "@/components/site/Shell"
import FaqBrowser, { type FaqEntry } from "@/components/site/FaqBrowser"
import { resolveSiteUrl, serializeJsonLd } from "@/lib/seo/structuredData"

export const metadata: Metadata = {
  title: "سوالات متداول — راهنمای خرید، تحویل و گارانتی",
  description:
    "پاسخ کامل به پرسش‌های پرتکرار دربارهٔ نحوه تحویل فوری اکانت‌ها، ارتقای ایمیل شخصی، گارانتی کامل اشتراک، بازگشت وجه و اپل آیدی در اچ‌شاپ.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "سوالات متداول اچ‌شاپ",
    description:
      "همه چیز دربارهٔ تحویل خودکار اکانت، امنیت اطلاعات شخصی و شرایط گارانتی و بازگشت وجه.",
    url: "/faq",
  },
}

const FAQ_ITEMS: FaqEntry[] = [
  {
    id: "delivery-time",
    category: "delivery",
    categoryLabel: "تحویل و فعال‌سازی",
    q: "سفارش پس از پرداخت چقدر طول می‌کشد تا تحویل شود؟",
    a: "محصولاتی که برچسب تحویل فوری یا خودکار دارند بلافاصله پس از ثبت پرداخت از انبار دیجیتال برداشت شده و در بخش سفارش‌های پنل کاربری قرار می‌گیرند. محصولاتی که نیاز به ارتقای ایمیل شخصی دارند معمولاً بین ۲ تا ۱۵ دقیقه توسط تیم پشتیبانی یا سیستم فعال‌سازی انجام می‌شوند.",
  },
  {
    id: "personal-email-upgrade",
    category: "delivery",
    categoryLabel: "تحویل و فعال‌سازی",
    q: "در محصولاتی که روی ایمیل شخصی فعال می‌شوند، آیا رمز ایمیل ما را نیاز دارید؟",
    a: "خیر. در سرویس‌هایی مثل Spotify، YouTube Premium، Canva Pro یا Adobe، فعال‌سازی از طریق ارسال دعوت‌نامه رسمی (Invite) یا ارتقای پنل سازمانی انجام می‌شود و هیچ نیازی به ارسال رمز عبور ایمیل یا اکانت خودتان ندارید؛ تمام پلی‌لیست‌ها و فایل‌های قبلی شما دست‌نخورده باقی می‌مانند.",
  },
  {
    id: "exclusive-vs-shared",
    category: "delivery",
    categoryLabel: "تحویل و فعال‌سازی",
    q: "اکانت‌های اختصاصی چه تفاوتی با پروفایل اختصاصی دارند؟",
    a: "در اکانت اختصاصی (مانند ChatGPT Plus اختصاصی یا اپل آیدی) کل اکانت به‌صورت یکجا متعلق به شماست و امکان تغییر رمز وجود دارد. در اشتراک‌های پروفایل اختصاصی (مانند Netflix 4K)، یک پروفایل مجزا با پین اختصاصی برای شما تنظیم می‌شود تا تاریخچه تماشا و تنظیمات شما کاملاً جدا باشد.",
  },
  {
    id: "warranty-coverage",
    category: "warranty",
    categoryLabel: "گارانتی و بازگشت وجه",
    q: "گارانتی کامل مدت اشتراک شامل چه مواردی است؟",
    a: "تمام محصولات اچ‌شاپ در کل بازه زمانی پلن خریداری‌شده (۱ ماهه، ۳ ماهه، ۱ ساله و غیره) دارای گارانتی فعال بودن اشتراک هستند. در صورت بروز هرگونه اختلال فنی یا قطع ناخواسته سرویس بدون نقض قوانین سرویس‌دهنده، اکانت جایگزین رایگان یا بازپرداخت وجه انجام می‌شود.",
  },
  {
    id: "refund-process",
    category: "warranty",
    categoryLabel: "گارانتی و بازگشت وجه",
    q: "در چه شرایطی امکان لغو سفارش و بازگشت وجه وجود دارد؟",
    a: "اگر سفارش قبل از شروع فرآیند فعال‌سازی لغو شود یا امکان تحویل جایگزین در بازه توافق‌شده وجود نداشته باشد، کل مبلغ به انتخاب شما به کیف پول اچ‌شاپ (آنی) یا کارت بانکی مبدأ (ظرف ۲۴ تا ۴۸ ساعت کاری) بازگردانده می‌شود.",
  },
  {
    id: "payment-methods",
    category: "payment",
    categoryLabel: "پرداخت و کیف پول",
    q: "روش‌های پرداخت در اچ‌شاپ چیست و آیا کد تخفیف دارید؟",
    a: "می‌توانید از طریق درگاه پرداخت بانکی عضو شتاب یا موجودی کیف پول اچ‌شاپ خرید خود را تکمیل کنید. کدهای تخفیف دوره‌ای مثل کد خرید اول در نوار بالایی سایت یا صفحه سبد خرید قابل اعمال هستند.",
  },
  {
    id: "appleid-security",
    category: "appleid",
    categoryLabel: "اپل آیدی و امنیت",
    q: "آیا اپل آیدی‌های اچ‌شاپ دائمی هستند و امکان تغییر رمز دارند؟",
    a: "بله، تمام اپل آیدی‌ها روی ایمیل واقعی و همراه با تاریخ تولد و سه سوال امنیتی کامل تحویل داده می‌شوند. شما می‌توانید پس از تحویل، رمز عبور، سوالات امنیتی و حتی ایمیل بازیابی را به دلخواه تغییر دهید و بدون محدودیت استفاده کنید.",
  },
  {
    id: "vpn-or-sanction",
    category: "appleid",
    categoryLabel: "اپل آیدی و امنیت",
    q: "برای استفاده از سرویس‌های هوش مصنوعی یا استریم نیاز به تغییر IP است؟",
    a: "بسته به سیاست تحریمی هر سرویس (مانند OpenAI، Spotify یا Netflix)، استفاده از آی‌پی غیرتحریمی مناسب ضروری است؛ اما برای حفظ سلامت اکانت در سرویس‌های دارای پروفایل یا فمیلی توصیه می‌شود کشور آی‌پی را مدام تغییر ندهید.",
  },
]

export default function FaqPage() {
  const siteUrl = resolveSiteUrl()
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: `${siteUrl}/faq`,
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqLd) }}
      />
      <Shell
        title="سوالات متداول"
        subtitle="پاسخ پرسش‌های رایج دربارهٔ خرید اکانت، نحوه تحویل، گارانتی و پشتیبانی اچ‌شاپ."
        breadcrumb={[{ label: "صفحه اصلی", href: "/" }, { label: "سوالات متداول" }]}
      >
        <FaqBrowser items={FAQ_ITEMS} />

        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-[26px] border border-[#1b39f5]/12 bg-[#0a152d] p-6 text-white sm:flex-row sm:items-center sm:p-7">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/10 text-[#9fb2ff]">
              <Headphones className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-[15px] font-bold">پاسخ سوال خود را پیدا نکردید؟</h2>
              <p className="mt-1 text-[12px] text-white/70">
                کارشناسان پشتیبانی اچ‌شاپ به‌صورت ۲۴ ساعته از طریق تیکت آمادهٔ راهنمایی شما هستند.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/dashboard/tickets"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[12px] font-bold text-[#0a152d] transition-colors hover:bg-[#dfe7ff]"
            >
              ثبت تیکت پشتیبانی
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-white/10"
            >
              تماس با ما
            </Link>
          </div>
        </div>
      </Shell>
    </>
  )
}
