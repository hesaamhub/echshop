import { notFound } from "next/navigation"
import Link from "next/link"
import { BadgeCheck, Clock, ShieldCheck, Star } from "lucide-react"
import Shell from "@/components/site/Shell"
import ProductCard from "@/components/site/ProductCard"
import PlanPicker from "@/components/site/PlanPicker"
import BrandIcon from "@/components/site/BrandIcon"
import { getCategory, getProduct, products } from "@/lib/data"
import { toman } from "@/lib/utils"

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
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

  return (
    <Shell
      breadcrumb={[
        { label: "صفحه اصلی", href: "/" },
        { label: "محصولات", href: "/products" },
        ...(category ? [{ label: category.title, href: `/category/${category.slug}` }] : []),
        { label: product.title },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* معرفی محصول */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[32px] border border-[#1b39f5]/10 bg-white shadow-[0_22px_48px_-36px_rgba(27,57,245,0.5)]">
            <div className={`relative h-56 bg-gradient-to-br ${product.gradient}`}>
              <div className="absolute inset-0 grid place-items-center">
                <BrandIcon
                  slug={product.logo}
                  size={56}
                  color="#ffffff"
                  className="opacity-95"
                />
              </div>
              {product.badge ? (
                <span className="glass absolute top-5 right-5 rounded-full px-3.5 py-1.5 text-[11px] font-bold text-[#0a1b33]">
                  {product.badge}
                </span>
              ) : null}
            </div>

            <div className="p-7">
              <h1 className="font-display text-[24px] md:text-[28px] font-semibold text-[#0a1b33]">
                {product.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-[12px] text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-[#EAC26B] text-[#EAC26B]" />
                  <span className="num">{product.rating}</span> از ۵
                </span>
                <span>·</span>
                <span>
                  <span className="num">{toman(product.sold)}</span> فروش موفق
                </span>
                <span>·</span>
                <span className="font-latin">{product.brand}</span>
              </div>

              <p className="mt-5 text-[13px] leading-8 text-slate-600">{product.description}</p>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {product.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 rounded-2xl border border-[#1b39f5]/10 bg-[#1b39f5]/5 px-4 py-3 text-[12px] text-slate-600"
                  >
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1b39f5]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* سوالات متداول */}
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

          {/* نظرات */}
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

        {/* باکس خرید */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-4">
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
        </aside>
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
