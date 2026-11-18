import type { Metadata } from "next"
import Link from "next/link"
import {
  Apple,
  ArrowLeft,
  Banknote,
  Gamepad2,
  MessageCircle,
  MonitorSmartphone,
  Music,
  PenTool,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react"
import Shell from "@/components/site/Shell"
import BrandIcon from "@/components/site/BrandIcon"
import { categories, lowestPrice, productsByCategory } from "@/lib/data"
import { resolveSiteUrl, serializeJsonLd } from "@/lib/seo/structuredData"
import { num, toman } from "@/lib/utils"

const categoryIcons: Record<string, LucideIcon> = {
  Music,
  Sparkles,
  PenTool,
  Gamepad2,
  MonitorSmartphone,
  MessageCircle,
  Banknote,
  Smartphone,
  Apple,
}

export const metadata: Metadata = {
  title: "دسته‌بندی محصولات — اشتراک‌ها و سرویس‌های دیجیتال",
  description:
    "مرور همهٔ دسته‌بندی‌های فروشگاه اچ‌شاپ: هوش مصنوعی، موسیقی و ویدیو، طراحی و گرافیک، گیمینگ، نرم‌افزار، شبکه‌های اجتماعی، پرداخت ارزی، شماره مجازی و اپل آیدی.",
  alternates: { canonical: "/categories" },
  openGraph: {
    title: "دسته‌بندی‌های اچ‌شاپ",
    description:
      "تمام دسته‌بندی‌های اکانت پرمیوم و لایسنس رسمی در اچ‌شاپ با تحویل فوری و گارانتی کامل.",
    url: "/categories",
  },
}

export default function CategoriesPage() {
  const siteUrl = resolveSiteUrl()
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "دسته‌بندی محصولات اچ‌شاپ",
    url: `${siteUrl}/categories`,
    inLanguage: "fa-IR",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: categories.length,
      itemListElement: categories.map((category, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: category.title,
        url: `${siteUrl}/category/${category.slug}`,
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <Shell
        title="دسته‌بندی‌های محصولات"
        subtitle="اشتراک یا لایسنس مورد نظرتان را بر اساس دسته‌بندی پیدا و مقایسه کنید."
        breadcrumb={[{ label: "صفحه اصلی", href: "/" }, { label: "دسته‌بندی‌ها" }]}
      >
        <div
          data-testid="categories-directory-grid"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4"
        >
          {categories.map((category) => {
            const Icon = categoryIcons[category.icon] ?? Sparkles
            const items = productsByCategory(category.slug)
            const minPrice = items.length ? Math.min(...items.map(lowestPrice)) : null
            const previewBrands = items.slice(0, 4)

            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group flex flex-col justify-between rounded-[24px] border border-[#1b39f5]/10 bg-white p-5 shadow-[0_18px_40px_-34px_rgba(27,57,245,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1b39f5]/30 hover:shadow-[0_26px_54px_-34px_rgba(27,57,245,0.5)] sm:p-6"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#1b39f5]/8 text-[#1b39f5] transition-colors group-hover:bg-[#1b39f5] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="num rounded-full border border-[#1b39f5]/12 bg-[#f5f8ff] px-3 py-1 text-[11px] font-bold text-[#1b39f5]">
                      {num(items.length)} محصول
                    </span>
                  </div>

                  <h2 className="mt-4 font-display text-[17px] font-bold text-[#0a1b33] transition-colors group-hover:text-[#1b39f5]">
                    {category.title}
                  </h2>
                  <p className="mt-1.5 text-[12px] leading-6 text-slate-500">{category.description}</p>
                </div>

                <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
                  {previewBrands.length > 0 ? (
                    <div className="flex items-center gap-1.5">
                      {previewBrands.map((product) => (
                        <span
                          key={product.id}
                          className="grid h-7 w-7 place-items-center rounded-lg border border-slate-100 bg-[#f8faff]"
                        >
                          <BrandIcon slug={product.logo} size={15} />
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] font-medium text-slate-400">سرویس اختصاصی</span>
                  )}

                  <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-[#1b39f5]">
                    {minPrice ? `از ${toman(minPrice)} تومان` : "مشاهده دسته"}
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </Shell>
    </>
  )
}
