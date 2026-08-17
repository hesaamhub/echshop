import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { BadgeCheck, Clock, ShieldCheck, Star } from "lucide-react"
import Shell from "@/components/site/Shell"
import ProductCard from "@/components/site/ProductCard"
import PlanPicker from "@/components/site/PlanPicker"
import ProductPoster from "@/components/site/ProductPoster"
import { getCategory, getProduct, lowestPrice, products } from "@/lib/data"
import { num, toman } from "@/lib/utils"

const SITE_URL = "https://echshop.ir"

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
    },
  }
}

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

  // دادهٔ ساخت‌یافتهٔ محصول — کارت قیمت و امتیاز در نتایج گوگل
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand },
    category: category?.title,
    url: `${SITE_URL}/products/${product.slug}`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      bestRating: 5,
      ratingCount: product.sold,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "IRR",
      lowPrice: lowestPrice(product) * 10,
      highPrice: Math.max(...product.plans.map((plan) => plan.price)) * 10,
      offerCount: product.plans.length,
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/products/${product.slug}`,
    },
  }

  // دادهٔ ساخت‌یافتهٔ سوالات متداول
  const faqLd =
    product.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: product.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }
      : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      {faqLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      ) : null}

      <Shell
        breadcrumb={[
          { label: "صفحه اصلی", href: "/" },
          { label: "محصولات", href: "/products" },
          ...(category ? [{ label: category.title, href: `/category/${category.slug}` }] : []),
          { label: product.title },
        ]}
      >
        {/* کلاژ بنتو هیروی محصول — الهام از چینش کارتهای نرم طرح مرجع، با زبان شیشه‌ای اچ‌شاپ */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* قاب پوستر برند — تایل بصری بزرگ */}
          <div className="relative min-h-[280px] overflow-hidden rounded-[32px] border border-black/5 shadow-[0_30px_60px_-38px_rgba(10,21,45,0.55)] sm:min-h-[340px] lg:col-span-4 lg:row-span-2 lg:min-h-[560px]">
            <ProductPoster slug={product.logo} brand={product.brand} />

            {product.badge ? (
              <span className="absolute left-4 top-4 z-10 rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-extrabold text-white backdrop-blur-md">
                {product.badge}
              </span>
            ) : null}
            <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-black/40 px-3 py-1.5 text-[11.5px] font-extrabold text-[#fbbf24] backdrop-blur-md">
              ★ <span className="font-latin">{num(product.rating)}</span>
            </span>

            {/* شریط عنوان و قیمت پایین پوستر */}
            <span className="absolute inset-x-0 bottom-0 z-10 block border-t border-white/12 bg-[#060b1a]/70 px-5 py-3.5 backdrop-blur-md">
              <span className="flex items-center justify-between gap-3">
                <span className="truncate text-[13px] font-bold text-white">{product.title}</span>
                <span className="shrink-0 text-[11px] font-semibold text-white/60">
                  از <span className="font-latin">{toman(lowestPrice(product))}</span> تومان
                </span>
              </span>
            </span>
          </div>

          {/* کارت عنوان و معرفی */}
          <div className="order-first flex flex-col rounded-[32px] border border-[#1b39f5]/10 bg-white p-7 shadow-[0_22px_48px_-36px_rgba(27,57,245,0.5)] lg:order-none lg:col-span-5">
            <div className="flex flex-wrap items-center gap-2">
              {category ? (
                <Link
                  href={`/category/${category.slug}`}
                  className="rounded-full bg-[#1b39f5]/8 px-3 py-1.5 text-[11px] font-bold text-[#1b39f5] transition-colors hover:bg-[#1b39f5]/15"
                >
                  {category.title}
                </Link>
              ) : null}
              <span className="rounded-full bg-[#46A171]/10 px-3 py-1.5 text-[11px] font-bold text-[#2f7a55]">
                موجود و آمادهٔ تحویل
              </span>
            </div>

            <h1 className="mt-4 font-display text-[26px] font-bold leading-[1.5] text-[#0a1b33] md:text-[30px]">
              {product.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-[#EAC26B] text-[#EAC26B]" />
                <span className="num font-bold text-[#0a1b33]">{product.rating}</span> از ۵
              </span>
              <span aria-hidden>·</span>
              <span>
                <span className="num font-bold text-[#0a1b33]">{toman(product.sold)}</span> فروش موفق
              </span>
              <span aria-hidden>·</span>
              <span className="font-latin font-semibold">{product.brand}</span>
            </div>

            <p className="mt-5 text-[13px] leading-8 text-slate-600">{product.description}</p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {product.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 rounded-2xl border border-[#1b39f5]/10 bg-[#1b39f5]/5 px-4 py-3 text-[12px] leading-6 text-slate-600"
                >
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1b39f5]" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* باکس خرید */}
          <div className="space-y-4 lg:col-span-3 lg:row-span-2">
            <PlanPicker plans={product.plans} />

            <div className="space-y-4 rounded-3xl border border-[#1b39f5]/10 bg-white p-6 shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)]">
              <Assurance icon={<ShieldCheck className="h-4 w-4 text-[#1b39f5]" />} title="گارانتی کامل مدت اشتراک">
                در صورت قطع شدن سرویس، جایگزین یا مبلغ بازگردانده می‌شود.
              </Assurance>
              <Assurance icon={<Clock className="h-4 w-4 text-[#1b39f5]" />} title="میانگین تحویل ۲ دقیقه">
                اشتراک شما بلافاصله بعد از پرداخت به‌صورت خودکار فعال می‌شود.
              </Assurance>
              <Assurance icon={<BadgeCheck className="h-4 w-4 text-[#1b39f5]" />} title="اشتراک اورجینال">
                تمام اکانت‌ها روی سرویس رسمی خود برند فعال می‌شوند.
              </Assurance>
            </div>

            <Link
              href="/dashboard/tickets"
              className="block rounded-3xl border border-dashed border-[#1b39f5]/30 bg-[#1b39f5]/4 p-5 text-center text-[12px] text-[#1b39f5] transition-all hover:bg-[#1b39f5]/8"
            >
              سوالی دارید؟ پیش از خرید تیکت بزنید
            </Link>
          </div>

          {/* ردیف اعتماد — سه کارت سفید + تایل تیرهٔ آمار */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:col-span-5">
            <TrustTile icon={<ShieldCheck className="h-4 w-4" />} title="گارانتی کامل" note="کل مدت اشتراک" />
            <TrustTile icon={<Clock className="h-4 w-4" />} title="تحویل فوری" note="میانگین ۲ دقیقه" />
            <TrustTile icon={<BadgeCheck className="h-4 w-4" />} title="اورجینال" note="فعال‌سازی رسمی" />

            {/* تایل تیرهٔ آمار فروش — همتای دایرهٔ مشکی طرح مرجع */}
            <div className="flex flex-col items-center justify-center gap-1 rounded-[26px] bg-[#0a152d] p-5 text-center shadow-[0_22px_44px_-30px_rgba(10,21,45,0.7)]">
              <span className="font-latin text-[22px] font-extrabold text-white">{num(product.sold)}</span>
              <span className="text-[10.5px] font-semibold text-white/55">فروش موفق</span>
              <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-[#fbbf24]">
                ★ {num(product.rating)} از ۵
              </span>
            </div>
          </div>
        </div>

        {/* سوالات متداول و نظرات */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[32px] border border-[#1b39f5]/10 bg-white p-7 shadow-[0_22px_48px_-36px_rgba(27,57,245,0.5)]">
            <h2 className="flex items-center gap-2.5 text-[16px] font-bold text-[#0a1b33]">
              <span className="h-4 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
              سوالات متداول
            </h2>
            <div className="mt-4 divide-y divide-slate-100">
              {product.faq.map((item) => (
                <details key={item.q} className="group py-4">
                  <summary className="cursor-pointer list-none text-[13px] font-semibold text-[#0a1b33] transition-colors group-open:text-[#1b39f5]">
                    {item.q}
                  </summary>
                  <p className="mt-2.5 text-[12px] leading-7 text-slate-500">{item.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-[#1b39f5]/10 bg-white p-7 shadow-[0_22px_48px_-36px_rgba(27,57,245,0.5)]">
            <h2 className="flex items-center gap-2.5 text-[16px] font-bold text-[#0a1b33]">
              <span className="h-4 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
              نظرات خریداران
            </h2>
            <div className="mt-4 space-y-4">
              {[
                { name: "مریم ا.", body: "خیلی سریع تحویل گرفتم، زیر ده دقیقه. همه‌چیز درست کار کرد.", rating: 5 },
                { name: "سینا ک.", body: "پشتیبانی در تیکت سریع جواب داد و مشکل من حل شد.", rating: 5 },
                { name: "نگار م.", body: "قیمت منطقی و روند خرید ساده. دوباره خرید می‌کنم.", rating: 4 },
              ].map((review) => (
                <div
                  key={review.name}
                  className="rounded-2xl border border-[#1b39f5]/10 bg-[#1b39f5]/4 p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-[#0a1b33]">{review.name}</span>
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
          </div>
        </div>

        {related.length ? (
          <section className="mt-14">
            <h2 className="mb-5 flex items-center gap-3 font-display text-[20px] font-semibold text-[#0a1b33]">
              <span className="h-5 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
              محصولات مرتبط
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
    <div className="flex items-start gap-3">
      <span className="glass-plate grid h-9 w-9 shrink-0 place-items-center rounded-[12px]">
        {icon}
      </span>
      <span>
        <span className="block text-[12.5px] font-bold text-[#0a1b33]">{title}</span>
        <span className="mt-1 block text-[11.5px] leading-6 text-slate-500">{children}</span>
      </span>
    </div>
  )
}

/** کارت کوچک اعتماد در ردیف بنتو */
function TrustTile({
  icon,
  title,
  note,
}: {
  icon: React.ReactNode
  title: string
  note: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-[26px] border border-[#1b39f5]/10 bg-white p-5 text-center shadow-[0_18px_40px_-34px_rgba(27,57,245,0.5)] transition-all hover:-translate-y-0.5 hover:border-[#1b39f5]/25">
      <span className="glass-plate grid h-10 w-10 place-items-center rounded-[14px] text-[#1b39f5]">
        {icon}
      </span>
      <span className="text-[12px] font-bold text-[#0a1b33]">{title}</span>
      <span className="-mt-1 text-[10.5px] font-medium text-slate-400">{note}</span>
    </div>
  )
}
