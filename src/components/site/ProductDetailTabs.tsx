"use client"

import { useState } from "react"
import { BadgeCheck, CheckCircle2, Clock, Layers, ShieldCheck, Sparkles, Zap } from "lucide-react"
import type { DeliveryMethod, Plan } from "@/lib/types"
import { deliveryLabels } from "@/lib/types"
import { cn, discountPercent, num, toman } from "@/lib/utils"

type TabKey ="specs" |"compare" |"steps"

const TABS: { key: TabKey; label: string; icon: typeof Layers }[] = [
  { key:"specs", label:"مشخصات و امکانات", icon: Layers },
  { key:"compare", label:"مقایسه پلن‌ها", icon: Sparkles },
  { key:"steps", label:"مراحل فعال‌سازی", icon: Zap },
]

function buildDeliverySteps(delivery: DeliveryMethod, brand: string) {
  switch (delivery) {
    case "upgrade":
      return [
        {
          step:"۰۱",
          title:"ثبت سفارش و وارد کردن ایمیل",
          body:`در مرحله تسویه کافی است آدرس ایمیل اکانت ${brand} خودتان را وارد کنید؛ هیچ نیازی به ارسال رمز عبور نیست.`,
        },
        {
          step:"۰۲",
          title:"ارسال دعوت‌نامه رسمی یا ارتقا",
          body:"تیم پشتیبانی دعوت‌نامه رسمی یا مجوز اشتراک را برای ایمیل شما صادر می‌کند تا اکانت فعلی شما ارتقا پیدا کند.",
        },
        {
          step:"۰۳",
          title:"حفظ کامل اطلاعات و شروع استفاده",
          body:"تمام تاریخچه، فایل‌ها یا پلی‌لیست‌های قبلی شما دست‌نخورده می‌ماند و گارانتی کل دوره فعال می‌شود.",
        },
      ]
    case "gift_code":
      return [
        {
          step:"۰۱",
          title:"تکمیل خرید و دریافت کد",
          body:"پس از پرداخت، کد فعال‌سازی اورجینال به‌صورت آنی در بخش سفارش‌های پنل کاربری نمایش داده می‌شود.",
        },
        {
          step:"۰۲",
          title:"وارد کردن کد در سرویس رسمی",
          body:`کد دریافت‌شده را مطابق راهنمای فارسی داخل بخش Redeem اکانت ${brand} خود وارد کنید.`,
        },
        {
          step:"۰۳",
          title:"فعال‌سازی فوری و گارانتی کامل",
          body:"اعتبار یا اشتراک همان لحظه به اکانت شما اضافه می‌شود و پشتیبانی ۲۴/۷ در کنارتان است.",
        },
      ]
    case "manual":
    case "scheduled":
      return [
        {
          step:"۰۱",
          title:"انتخاب پلن و ثبت سفارش",
          body:"مشخصات مورد نیاز برای فعال‌سازی اختصاصی را در فرم تسویه وارد و سفارش را ثبت کنید.",
        },
        {
          step:"۰۲",
          title:"تنظیم و آماده‌سازی توسط کارشناس",
          body:`کارشناسان ما اشتراک ${brand} را با اطلاعات اختصاصی و امن آماده و بررسی نهایی می‌کنند.`,
        },
        {
          step:"۰۳",
          title:"تحویل کامل با قابلیت تغییر اطلاعات",
          body:"مشخصات کامل دسترسی در پنل کاربری و تیکت برایتان ارسال می‌شود و امکان شخصی‌سازی کامل دارید.",
        },
      ]
    default:
      return [
        {
          step:"۰۱",
          title:"پرداخت و پردازش خودکار",
          body:"بلافاصله پس از تایید پرداخت، سیستم انبار دیجیتال سفارش شما را به‌صورت خودکار تخصیص می‌دهد.",
        },
        {
          step:"۰۲",
          title:"نمایش آنی اطلاعات در پنل کاربری",
          body:`مشخصات ورود اختصاصی ${brand} در صفحه سفارش‌های پنل کاربری و اطلاع‌رسانی حساب شما ثبت می‌شود.`,
        },
        {
          step:"۰۳",
          title:"ورود امن و پشتیبانی کل دوره",
          body:"از اشتراک خود استفاده کنید؛ در تمام طول دوره گارانتی تعویض و پشتیبانی شبانه‌روزی فعال است.",
        },
      ]
  }
}

export default function ProductDetailTabs({
  title,
  brand,
  categoryTitle,
  description,
  features,
  plans,
  deliverySummary,
}: {
  title: string
  brand: string
  categoryTitle?: string
  description: string
  features: string[]
  plans: Plan[]
  deliverySummary: string
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("specs")
  const primaryDelivery = plans[0]?.delivery ?? "stock"
  const steps = buildDeliverySteps(primaryDelivery, brand)

  return (
    <section
      data-testid="product-detail-tabs"
      className="mt-6 rounded-[26px] border border-[#1b39f5]/10 bg-white p-4 shadow-[0_22px_48px_-36px_rgba(27,57,245,0.45)] sm:rounded-[32px] sm:p-7"
    >
      {/* نوار تب‌های تعاملی */}
      <div
        role="tablist"
        aria-label="جزئیات محصول"
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[12px] font-bold transition-all sm:px-5 sm:text-[12.5px]",
                active
                  ? "bg-[#0a152d] text-white shadow-[0_14px_26px_-14px_rgba(10,21,45,0.7)]"
                  : "border border-slate-200 bg-[#f8faff] text-slate-600 hover:border-[#1b39f5]/30 hover:text-[#1b39f5]",
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* محتوای تب انتخاب‌شده */}
      <div className="mt-5 border-t border-slate-100 pt-5">
        {activeTab === "specs" ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.9fr]">
            <div className="min-w-0">
              <h2 className="font-display text-[16px] font-bold text-[#0a1b33]">
                معرفی کامل {title}
              </h2>
              <p className="mt-3 text-[13px] leading-8 text-slate-600">{description}</p>

              <h3 className="mt-5 text-[13.5px] font-bold text-[#0a1b33]">امکانات کلیدی این اشتراک</h3>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 rounded-2xl border border-[#1b39f5]/10 bg-[#f8faff] px-3.5 py-2.5 text-[12px] leading-6 text-slate-600"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#46A171]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0 rounded-[22px] border border-[#1b39f5]/10 bg-[#f8faff] p-4 sm:p-5">
              <h3 className="text-[13.5px] font-bold text-[#0a1b33]">شناسنامهٔ فنی و شرایط سرویس</h3>
              <dl className="mt-3.5 divide-y divide-slate-200/70 text-[12px]">
                <SpecRow label="برند رسمی" value={brand} latin />
                {categoryTitle ? <SpecRow label="دسته‌بندی" value={categoryTitle} /> : null}
                <SpecRow label="روش تحویل" value={deliverySummary} />
                <SpecRow label="اصالت سرویس" value="اورجینال و رسمی (غیرکرکی)" />
                <SpecRow label="پوشش گارانتی" value="ضمانت کامل تمام مدت اشتراک" />
                <SpecRow label="پشتیبانی" value="۲۴ ساعته فارسی در تیکت و چت" />
              </dl>
            </div>
          </div>
        ) : null}

        {activeTab === "compare" ? (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-[16px] font-bold text-[#0a1b33]">
                مقایسه سریع پلن‌های {title}
              </h2>
              <span className="text-[11.5px] text-slate-400">
                همه پلن‌ها شامل گارانتی کامل دوره هستند
              </span>
            </div>

            {/* موبایل: کارت‌های ۲ستونه مقایسه */}
            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:hidden">
              {plans.map((plan) => {
                const off = discountPercent(plan.price, plan.compareAt)
                const saving =
                  plan.compareAt && plan.compareAt > plan.price ? plan.compareAt - plan.price : 0
                return (
                  <div
                    key={plan.id}
                    className="rounded-2xl border border-[#1b39f5]/12 bg-[#f8faff] p-3.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-bold text-[#0a1b33]">{plan.title}</span>
                      {off > 0 ? (
                        <span className="num rounded-full bg-[#E56458]/15 px-2 py-0.5 text-[10px] font-bold text-[#C24539]">
                          {num(off)}٪ تخفیف
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">{deliveryLabels[plan.delivery]}</p>
                    <div className="mt-2.5 flex items-baseline justify-between border-t border-slate-200/70 pt-2.5">
                      <span className="num text-[14px] font-extrabold text-[#1b39f5]">
                        {toman(plan.price)} تومان
                      </span>
                      {saving > 0 ? (
                        <span className="num text-[10.5px] font-semibold text-[#2f7a55]">
                          {toman(saving)} تومان صرفه‌جویی
                        </span>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* دسکتاپ/تبلت: جدول تمیز مقایسه */}
            <div className="mt-4 hidden overflow-x-auto sm:block">
              <table className="w-full border-collapse text-right text-[12.5px]">
                <thead>
                  <tr className="border-b border-slate-200 text-[11.5px] text-slate-400">
                    <th className="py-3 pl-4 font-semibold">عنوان پلن</th>
                    <th className="py-3 px-4 font-semibold">نحوه تحویل</th>
                    <th className="py-3 px-4 font-semibold">قیمت اصلی</th>
                    <th className="py-3 px-4 font-semibold">تخفیف</th>
                    <th className="py-3 pr-4 font-semibold">مبلغ نهایی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {plans.map((plan) => {
                    const off = discountPercent(plan.price, plan.compareAt)
                    return (
                      <tr key={plan.id} className="hover:bg-[#f8faff]">
                        <td className="py-3.5 pl-4 font-bold text-[#0a1b33]">{plan.title}</td>
                        <td className="py-3.5 px-4 text-slate-600">{deliveryLabels[plan.delivery]}</td>
                        <td className="num py-3.5 px-4 text-slate-400">
                          {plan.compareAt ? (
                            <span className="line-through">{toman(plan.compareAt)} تومان</span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="num py-3.5 px-4">
                          {off > 0 ? (
                            <span className="rounded-full bg-[#E56458]/12 px-2.5 py-1 text-[11px] font-bold text-[#C24539]">
                              {num(off)}٪
                            </span>
                          ) : (
                            <span className="text-slate-400">قیمت مصوب</span>
                          )}
                        </td>
                        <td className="num py-3.5 pr-4 font-extrabold text-[#1b39f5]">
                          {toman(plan.price)} تومان
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {activeTab === "steps" ? (
          <div>
            <h2 className="font-display text-[16px] font-bold text-[#0a1b33]">
              مراحل دریافت و فعال‌سازی {title}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {steps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-[22px] border border-[#1b39f5]/10 bg-[#f8faff] p-4 sm:p-5"
                >
                  <span className="font-latin inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#1b39f5] text-[12px] font-extrabold text-white">
                    {item.step}
                  </span>
                  <h3 className="mt-3 text-[13.5px] font-bold text-[#0a1b33]">{item.title}</h3>
                  <p className="mt-1.5 text-[12px] leading-6 text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-[#1b39f5]/10 bg-[#f5f8ff] px-4 py-3 text-[11.5px] text-slate-600">
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#0a1b33]">
                <ShieldCheck className="h-4 w-4 text-[#1b39f5]" />
                گارانتی تعویض در تمام طول اشتراک
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#1b39f5]" />
                پشتیبانی سریع تیکت ۲۴ ساعته
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-4 w-4 text-[#46A171]" />
                فعال‌سازی رسمی روی سرویس اصلی
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

function SpecRow({
  label,
  value,
  latin,
}: {
  label: string
  value: string
  latin?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <dt className="text-slate-500">{label}</dt>
      <dd
        className={cn(
          "font-bold text-[#0a1b33]",
          latin && "font-latin",
        )}
      >
        {value}
      </dd>
    </div>
  )
}
