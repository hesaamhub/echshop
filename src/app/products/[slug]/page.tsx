import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  Award,
  BadgeCheck,
  ChevronDown,
  Clock,
  Headphones,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react"
import Shell from "@/components/site/Shell"
import ProductCard from "@/components/site/ProductCard"
import PlanPicker from "@/components/site/PlanPicker"
import ProductPoster from "@/components/site/ProductPoster"
import ProductDetailTabs from "@/components/site/ProductDetailTabs"
import BrandIcon from "@/components/site/BrandIcon"
import { getCategory, getProduct, lowestPrice, products } from "@/lib/data"
import { deliveryLabels } from "@/lib/types"
import {
  buildProductDetailGraphJsonLd,
  DEFAULT_PRODUCT_REVIEWS,
  resolveSiteUrl,
  serializeJsonLd,
} from "@/lib/seo/structuredData"
import { num, toman } from "@/lib/utils"

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return { title: "محصول یافت نشد" }

  return {
    title: `${product.title} — خرید با تحویل فوری`,
    description: `${product.excerpt} شروع قیمت از ${toman(lowestPrice(product))} تومان؛ گارانتی کل مدت اشتراک و پشتیبانی شبانه‌روزی.`,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.title} | اچ‌شاپ`,
      description: product.excerpt,
      url: `/products/${product.slug}`,
      type: "website",
      images: [{ url: "/art/hero-1.jpg", width: 2560, height: 768, alt: product.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | اچ‌شاپ`,
      description: product.excerpt,
      images: ["/art/hero-1.jpg"],
    },
  }
}

const BUYER_AVATARS = [
  { initial: "م", gradient: "linear-gradient(135deg,#1b39f5,#7d92ff)" },
  { initial: "س", gradient: "linear-gradient(135deg,#6d28d9,#a78bfa)" },
  { initial: "ن", gradient: "linear-gradient(135deg,#0284c7,#38bdf8)" },
]

const RATING_BREAKDOWN = [
  { stars: 5, percent: 86 },
  { stars: 4, percent: 10 },
  { stars: 3, percent: 3 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 0 },
]

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const category = getCategory(product.categorySlug)
  const related = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4)

  const primaryDelivery = product.plans[0]?.delivery ?? "instant"
  const deliverySummary = deliveryLabels[primaryDelivery]

  const jsonLd = buildProductDetailGraphJsonLd({
    product,
    category,
    reviews: DEFAULT_PRODUCT_REVIEWS,
    siteUrl: resolveSiteUrl(),
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <Shell
        breadcrumb={[
          { label: "صفحه اصلی", href: "/" },
          { label: "محصولات", href: "/products" },
          ...(category ? [{ label: category.title, href: `/category/${category.slug}` }] : []),
          { label: product.title },
        ]}
        includeBreadcrumbSchema={false}
      >
        {/* ─── بخش هیروی محصول با چیدمان بنتو و دسترسی فوری به انتخاب پلن ─── */}
        <div className="rounded-[24px] border border-[#1b39f5]/10 bg-[linear-gradient(160deg,#eef2fc_0%,#e1e9f9_100%)] p-2.5 shadow-[0_36px_80px_-52px_rgba(27,57,245,0.55)] sm:rounded-[34px] sm:p-4">
          <div className="grid grid-cols-1 items-start gap-3 sm:gap-4 lg:grid-cols-12">
            {/* ستون اصلی معرفی محصول + پوستر + ۳ کاشی اعتماد */}
            <div className="min-w-0 space-y-3 sm:space-y-4 lg:col-span-8">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:gap-4">
                {/* پوستر برند */}
                <div className="relative min-h-[210px] min-w-0 overflow-hidden rounded-[20px] shadow-[0_24px_50px_-34px_rgba(10,21,45,0.6)] sm:col-span-5 sm:min-h-[360px] sm:rounded-[24px]">
                  <ProductPoster slug={product.logo} brand={product.brand} />

                  {product.badge ? (
                    <span className="absolute left-3.5 top-3.5 z-10 rounded-full bg-white/15 px-3 py-1 text-[10.5px] font-extrabold text-white backdrop-blur-md sm:left-4 sm:top-4 sm:text-[11px]">
                      {product.badge}
                    </span>
                  ) : null}
                  <span className="absolute right-3.5 top-3.5 z-10 inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-extrabold text-[#fbbf24] backdrop-blur-md sm:right-4 sm:top-4">
                    ★ <span className="font-latin">{num(product.rating)}</span>
                  </span>

                  <span className="absolute inset-x-0 bottom-0 z-10 block border-t border-white/12 bg-[#060b1a]/72 px-4 py-3 backdrop-blur-md">
                    <span className="flex items-center justify-between gap-2">
                      <span className="min-w-0 truncate text-[12.5px] font-bold text-white">{product.title}</span>
                      <span className="shrink-0 text-[10.5px] font-semibold text-white/70">
                        از <span className="font-latin">{toman(lowestPrice(product))}</span> تومان
                      </span>
                    </span>
                  </span>
                </div>

                {/* کارت معرفی و ویژگی‌های کلیدی */}
                <div className="flex min-w-0 flex-col rounded-[20px] bg-white p-4 shadow-[0_18px_40px_-34px_rgba(27,57,245,0.4)] sm:col-span-7 sm:rounded-[24px] sm:p-6">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {category ? (
                      <Link
                        href={`/category/${category.slug}`}
                        className="rounded-full bg-[#1b39f5]/8 px-3 py-1 text-[10.5px] font-bold text-[#1b39f5] transition-colors hover:bg-[#1b39f5]/15 sm:text-[11px]"
                      >
                        {category.title}
                      </Link>
                    ) : null}
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#46A171]/10 px-3 py-1 text-[10.5px] font-bold text-[#2f7a55] sm:text-[11px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#46A171]" aria-hidden />
                      موجود — {deliverySummary}
                    </span>
                  </div>

                  <h1 className="mt-3 font-display text-[24px] font-extrabold leading-[1.35] text-[#0a1b33] sm:mt-4 sm:text-[32px] md:text-[36px] md:leading-[1.28]">
                    {product.title}
                  </h1>

                  <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11.5px] text-slate-500 sm:text-[12px]">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-4 w-4 fill-[#EAC26B] text-[#EAC26B]" />
                      <span className="num font-bold text-[#0a1b33]">{product.rating}</span> از ۵
                    </span>
                    <span aria-hidden>·</span>
                    <span>
                      <span className="num font-bold text-[#0a1b33]">{toman(product.sold)}</span> خرید موفق
                    </span>
                    <span aria-hidden>·</span>
                    <span className="font-latin font-semibold text-slate-600">{product.brand}</span>
                  </div>

                  <p className="mt-3.5 text-[12.5px] leading-7 text-slate-600 sm:mt-4 sm:text-[13px] sm:leading-7">
                    {product.description}
                  </p>

                  <ul className="mt-4 grid grid-cols-1 gap-2 sm:mt-5 sm:grid-cols-2">
                    {product.features.slice(0, 4).map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 rounded-2xl border border-[#1b39f5]/10 bg-[#1b39f5]/5 px-3 py-2.5 text-[11.5px] leading-5 text-slate-600 sm:text-[12px]"
                      >
                        <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1b39f5]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex flex-wrap items-center gap-2.5 pt-5">
                    <a
                      href="#buy"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0a152d] px-5 py-3 text-[12.5px] font-bold text-white shadow-[0_18px_36px_-18px_rgba(10,21,45,0.8)] transition-all hover:-translate-y-0.5 hover:bg-[#1b39f5] sm:flex-none sm:px-6"
                    >
                      انتخاب پلن و خرید
                      <Zap className="h-4 w-4" />
                    </a>
                    <span className="rounded-full border border-[#1b39f5]/15 bg-[#1b39f5]/6 px-4 py-2.5 text-[11.5px] font-bold text-[#0a1b33] sm:text-[12px]">
                      از <span className="num">{toman(lowestPrice(product))}</span> تومان
                    </span>
                  </div>
                </div>
              </div>

              {/* ۳ کاشی اعتماد — ردیف فشرده در موبایل و دسکتاپ */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="flex min-h-[96px] flex-col items-center justify-center gap-1.5 rounded-[18px] bg-white p-2.5 text-center shadow-[0_18px_40px_-34px_rgba(27,57,245,0.4)] sm:min-h-[118px] sm:gap-2 sm:rounded-[24px] sm:p-4">
                  <span className="glass-plate grid h-8 w-8 place-items-center rounded-full text-[#1b39f5] sm:h-10 sm:w-10">
                    <Award className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  </span>
                  <span className="text-[10.5px] font-bold text-[#0a1b33] sm:text-[12px]">ضمانت اورجینال</span>
                  <span className="font-latin hidden text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 sm:block" dir="ltr">
                    ECHSHOP GUARANTEE
                  </span>
                </div>

                <div className="flex min-h-[96px] flex-col items-center justify-center gap-1.5 rounded-[18px] bg-white p-2.5 text-center shadow-[0_18px_40px_-34px_rgba(27,57,245,0.4)] sm:min-h-[118px] sm:gap-2 sm:rounded-[24px] sm:p-4">
                  <span className="flex items-center">
                    {BUYER_AVATARS.map((avatar, index) => (
                      <span
                        key={avatar.initial}
                        className={`grid h-6 w-6 place-items-center rounded-full text-[9.5px] font-bold text-white ring-2 ring-white sm:h-8 sm:w-8 sm:text-[11px] ${
                          index > 0 ? "-ms-2" : ""
                        }`}
                        style={{ background: avatar.gradient }}
                      >
                        {avatar.initial}
                      </span>
                    ))}
                    <span
                      className="font-latin -ms-2 grid h-6 w-6 place-items-center rounded-full bg-[#0a152d] text-[7px] font-extrabold text-white ring-2 ring-white sm:h-8 sm:w-8 sm:text-[8px]"
                      dir="ltr"
                    >
                      48K+
                    </span>
                  </span>
                  <span className="text-[10.5px] font-bold text-[#0a1b33] sm:text-[12px]">۴۸ هزار+ خریدار</span>
                  <span className="hidden text-[10px] font-medium text-slate-400 sm:block">رضایت ۹۸٪ از خریدها</span>
                </div>

                <div className="relative grid min-h-[96px] place-items-center overflow-hidden rounded-[18px] bg-[#0a152d] p-2.5 shadow-[0_20px_44px_-30px_rgba(10,21,45,0.75)] sm:min-h-[118px] sm:rounded-[24px] sm:p-4">
                  <svg
                    viewBox="0 0 100 100"
                    aria-hidden
                    className="absolute inset-0 m-auto h-[92%] w-[92%] motion-safe:animate-[spin_16s_linear_infinite]"
                  >
                    <defs>
                      <path
                        id="product-orbit"
                        d="M50 50 m -36 0 a 36 36 0 1 1 72 0 a 36 36 0 1 1 -72 0"
                        fill="none"
                      />
                    </defs>
                    <text
                      className="fill-white/75 font-latin"
                      style={{ fontSize: "7px", letterSpacing: "2.4px" }}
                    >
                      <textPath href="#product-orbit">ECHSHOP • ORIGINAL • INSTANT •</textPath>
                    </text>
                  </svg>
                  <BrandIcon slug={product.logo} size={26} color="#ffffff" />
                </div>
              </div>
            </div>

            {/* ستون خرید چسبان سمت چپ در دسکتاپ */}
            <aside id="buy" className="min-w-0 space-y-3 scroll-mt-28 lg:sticky lg:top-28 lg:col-span-4">
              <PlanPicker productId={product.id} plans={product.plans} />

              <div className="grid grid-cols-1 gap-3 rounded-[22px] border border-[#1b39f5]/10 bg-white p-4 shadow-[0_18px_40px_-34px_rgba(27,57,245,0.4)] sm:rounded-[24px] sm:p-5">
                <Assurance icon={<ShieldCheck className="h-4 w-4 text-[#1b39f5]" />} title="گارانتی کامل مدت اشتراک">
                  در صورت بروز اختلال، جایگزین فوری یا بازگشت وجه انجام می‌شود.
                </Assurance>
                <Assurance icon={<Clock className="h-4 w-4 text-[#1b39f5]" />} title="میانگین تحویل ۲ دقیقه">
                  سفارش بلافاصله پس از پرداخت به‌صورت خودکار یا توسط کارشناس فعال می‌شود.
                </Assurance>
                <Assurance icon={<BadgeCheck className="h-4 w-4 text-[#1b39f5]" />} title="اشتراک اورجینال و رسمی">
                  بدون روش‌های ناامن؛ دسترسی کامل روی سرویس رسمی خود برند.
                </Assurance>
              </div>

              <Link
                href="/dashboard/tickets"
                className="flex items-center justify-center gap-2 rounded-[20px] border border-dashed border-[#1b39f5]/30 bg-white/75 px-4 py-3.5 text-[12px] font-semibold text-[#1b39f5] transition-all hover:bg-white sm:rounded-[24px]"
              >
                <Headphones className="h-4 w-4" />
                سوالی دارید؟ پیش از خرید تیکت بزنید
              </Link>
            </aside>
          </div>
        </div>

        {/* بخش تعاملی: مشخصات، مقایسه پلن‌ها و مراحل فعال‌سازی */}
        <ProductDetailTabs
          title={product.title}
          brand={product.brand}
          categoryTitle={category?.title}
          description={product.description}
          features={product.features}
          plans={product.plans}
          deliverySummary={deliverySummary}
        />

        {/* نظرات خریداران همراه با نمودار امتیازها + سوالات متداول */}
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <section className="min-w-0 rounded-[26px] border border-[#1b39f5]/10 bg-white p-5 shadow-[0_22px_48px_-36px_rgba(27,57,245,0.5)] sm:rounded-[32px] sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2.5 text-[16px] font-bold text-[#0a1b33]">
                <span className="h-4 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
                امتیاز و نظرات خریداران
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF7E2] px-3 py-1 text-[11.5px] font-bold text-[#9A6321]">
                <Star className="h-3.5 w-3.5 fill-[#EAC26B] text-[#EAC26B]" />
                <span className="num">{product.rating}</span> از ۵
              </span>
            </div>

            {/* نمودار توزیع امتیازها */}
            <div className="mt-4 grid items-center gap-4 rounded-2xl border border-slate-100 bg-[#f8faff] p-4 sm:grid-cols-[120px_1fr]">
              <div className="text-center">
                <div className="num text-[30px] font-extrabold leading-none text-[#0a1b33]">
                  {product.rating}
                </div>
                <div className="mt-1.5 flex items-center justify-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#EAC26B] text-[#EAC26B]" />
                  ))}
                </div>
                <div className="mt-1 text-[10.5px] text-slate-400">
                  از <span className="num">{toman(product.sold)}</span> سفارش
                </div>
              </div>

              <div className="space-y-1.5">
                {RATING_BREAKDOWN.map((row) => (
                  <div key={row.stars} className="flex items-center gap-2 text-[11px]">
                    <span className="num w-7 shrink-0 font-semibold text-slate-500">{row.stars} ★</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200/70">
                      <div
                        className="h-full rounded-full bg-[#1b39f5]"
                        style={{ width: `${row.percent}%` }}
                      />
                    </div>
                    <span className="num w-8 shrink-0 text-left text-[10.5px] text-slate-400">
                      {num(row.percent)}٪
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {DEFAULT_PRODUCT_REVIEWS.map((review) => (
                <div
                  key={review.name}
                  className="rounded-2xl border border-[#1b39f5]/10 bg-[#1b39f5]/4 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-[#0a1b33]">{review.name}</span>
                      <span className="rounded-full bg-[#46A171]/12 px-2 py-0.5 text-[9.5px] font-bold text-[#2f7a55]">
                        خریدار تاییدشده
                      </span>
                    </div>
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-[#EAC26B] text-[#EAC26B]" />
                      ))}
                    </span>
                  </div>
                  <p className="mt-2 text-[12px] leading-7 text-slate-600">{review.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="flex min-w-0 flex-col rounded-[26px] border border-[#1b39f5]/10 bg-white p-5 shadow-[0_22px_48px_-36px_rgba(27,57,245,0.5)] sm:rounded-[32px] sm:p-7">
            <div className="flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2.5 text-[16px] font-bold text-[#0a1b33]">
                <span className="h-4 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
                سوالات متداول {product.brand}
              </h2>
              <Link
                href="/faq"
                className="text-[11.5px] font-semibold text-[#1b39f5] hover:underline"
              >
                همهٔ سوالات
              </Link>
            </div>
            <div className="mt-4 divide-y divide-slate-100">
              {product.faq.map((item) => (
                <details key={item.q} className="group py-3.5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[13px] font-semibold text-[#0a1b33] transition-colors group-open:text-[#1b39f5]">
                    <span>{item.q}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180 group-open:text-[#1b39f5]" />
                  </summary>
                  <p className="mt-2.5 text-[12px] leading-7 text-slate-500">{item.a}</p>
                </details>
              ))}
            </div>

            <div className="mt-auto pt-4">
              <div className="rounded-2xl border border-[#1b39f5]/10 bg-[#f8faff] p-4 text-[12px] leading-6 text-slate-600">
                نیاز به راهنمایی برای انتخاب پلن مناسب دارید؟ از{" "}
                <Link href="/dashboard/tickets" className="font-bold text-[#1b39f5] hover:underline">
                  تیکت پشتیبانی
                </Link>{" "}
                یا باکس پشتیبانی آنلاین پیام دهید.
              </div>
            </div>
          </section>
        </div>

        {related.length ? (
          <section className="mt-10 sm:mt-14">
            <h2 className="mb-4 flex items-center gap-3 font-display text-[18px] font-semibold text-[#0a1b33] sm:mb-5 sm:text-[20px]">
              <span className="h-5 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
              محصولات مرتبط
            </h2>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </Shell>
    </>
  )
}

function Assurance({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2.5 sm:gap-3">
      <span className="glass-plate grid h-8 w-8 shrink-0 place-items-center rounded-[10px] sm:h-9 sm:w-9 sm:rounded-[12px]">
        {icon}
      </span>
      <span>
        <span className="block text-[12px] font-bold text-[#0a1b33] sm:text-[12.5px]">{title}</span>
        <span className="mt-0.5 block text-[11px] leading-5 text-slate-500 sm:mt-1 sm:text-[11.5px] sm:leading-6">
          {children}
        </span>
      </span>
    </div>
  )
}
