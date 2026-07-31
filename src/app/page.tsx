import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Header from "@/components/site/Header"
import Hero from "@/components/site/Hero"
import Footer from "@/components/site/Footer"
import BrandIcon from "@/components/site/BrandIcon"
import ProductCard from "@/components/site/ProductCard"
import ShowcaseDeck from "@/components/site/ShowcaseDeck"
import { brandLogos } from "@/lib/brands"
import { categories, posts, products, siteContent } from "@/lib/data"
import { faDate } from "@/lib/utils"

/** همان ۶ محصولی که در دک بالای صفحه نمایش داده می‌شوند */
const deckIds = new Set(
  [...products]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 6)
    .map((product) => product.id),
)

export default function HomePage() {
  // اکانت‌های پرکاربرد، بدون تکرار محصولات دک
  const essentials = [...products]
    .filter((product) => !deckIds.has(product.id))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 4)

  const essentialIds = new Set(essentials.map((product) => product.id))

  // جدیدترین‌ها، بدون تکرار دو بخش قبلی
  const newest = [...products]
    .reverse()
    .filter((product) => !deckIds.has(product.id) && !essentialIds.has(product.id))
    .slice(0, 4)

  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* دک معرفی محصولات */}
        <ShowcaseDeck />

        {/* دسته‌بندی‌ها */}
        <Section
          title="دسته‌بندی محصولات"
          subtitle="از اشتراک‌های استریم تا لایسنس‌های حرفه‌ای طراحی و هوش مصنوعی"
        >
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-6">
            {categories.map((category) => (
              <CategoryFolder key={category.slug} category={category} />
            ))}
          </div>
        </Section>

        {/* اکانت‌های پرکاربرد */}
        <Section title="اکانت‌هایی که لازم داری" href="/products" linkLabel="همهٔ محصولات">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {essentials.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Section>

        {/* آمار */}
        <Section>
          <div className="grid gap-4 rounded-[40px] border border-[#1b39f5]/10 bg-white p-8 shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)] sm:grid-cols-2 lg:grid-cols-4">
            {siteContent.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-[26px] font-bold text-[#0a1b33]">{stat.value}</div>
                <div className="mt-1 text-[12px] text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* محصولات جدید */}
        <Section title="جدیدترین محصولات" href="/products" linkLabel="مشاهدهٔ همه">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {newest.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Section>

        {/* بلاگ */}
        <Section title="از بلاگ اچ‌شاپ" href="/blog" linkLabel="همهٔ مقالات">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-3xl border border-[#1b39f5]/10 bg-white shadow-[0_18px_40px_-34px_rgba(27,57,245,0.5)] transition-all hover:-translate-y-0.5 hover:border-[#1b39f5]/25"
              >
                <div className="h-28" style={{ background: post.cover }} />
                <div className="p-5">
                  <span className="rounded-full bg-[#1b39f5]/8 px-2.5 py-1 text-[10px] font-semibold text-[#1b39f5]">
                    {post.category}
                  </span>
                  <h3 className="mt-3 text-[13px] font-bold leading-6 text-[#0a1b33] transition-colors group-hover:text-[#1b39f5]">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[12px] leading-6 text-slate-500">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{faDate(post.publishedAt)}</span>
                    <span>
                      <span className="num">{post.readMinutes}</span> دقیقه مطالعه
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        {/* دعوت به اقدام */}
        <Section>
          <div className="relative overflow-hidden rounded-[40px] bg-[#0a152d] px-8 py-14 text-center">
            <div className="absolute -top-24 -left-16 h-64 w-64 rounded-full bg-[#1b39f5]/35 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-[#1b39f5]/20 blur-3xl" />
            <div className="relative">
              <h2 className="font-display text-[28px] md:text-[34px] font-medium text-white">
                هنوز محصول مورد نظرت را پیدا نکردی؟
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[13px] leading-7 text-white/70">
                کافی است یک تیکت باز کنید؛ تیم اچ‌شاپ هر اکانت یا لایسنسی را که لازم دارید
                برایتان تهیه می‌کند.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/dashboard/tickets"
                  className="glass-solid rounded-full px-7 py-3 text-[13px] font-semibold"
                >
                  ارسال تیکت
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-white/25 px-7 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-white/10"
                >
                  تماس با ما
                </Link>
              </div>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}

/** رنگ برند برای سایهٔ رنگی لوگو */
function brandColor(slug: string) {
  return brandLogos.find((brand) => brand.slug === slug)?.color ?? "1b39f5"
}

/** پوشهٔ دسته‌بندی: سه لوگوی بادبزنی پشت شیشهٔ مات با نام دسته روی پوشه */
function CategoryFolder({ category }: { category: (typeof categories)[number] }) {
  const picks = products.filter((product) => product.categorySlug === category.slug).slice(0, 3)

  const tileStyle = [
    {
      position: "right-0 top-10 -rotate-[16deg] group-hover:-rotate-[21deg] group-hover:-translate-y-2",
      size: "h-[86px] w-[64px] rounded-[18px]",
    },
    {
      position: "left-1/2 top-1 -translate-x-1/2 group-hover:-translate-y-2.5",
      size: "h-[100px] w-[74px] rounded-[20px]",
    },
    {
      position: "left-0 top-10 rotate-[16deg] group-hover:rotate-[21deg] group-hover:-translate-y-2",
      size: "h-[86px] w-[64px] rounded-[18px]",
    },
  ]

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex flex-col items-center rounded-[24px] bg-[#f4f5f7] px-3 pb-3 pt-4 transition-all duration-500 hover:-translate-y-1 hover:bg-[#f8f9fb] hover:shadow-[0_24px_50px_-34px_rgba(10,27,51,0.55)]"
    >
      <div className="relative h-[152px] w-full max-w-[190px]">
        {/* زبانهٔ پوشه */}
        <span
          className="absolute right-4 top-0 h-6 w-[72px] rounded-t-[12px] bg-[#e3e5e9]"
          aria-hidden
        />
        {/* بدنهٔ پوشه */}
        <span
          className="absolute inset-x-0 bottom-3 top-4 rounded-[20px] bg-[#e3e5e9]"
          aria-hidden
        />

        {/* لوگوی برندهای داخل پوشه */}
        {picks.map((product, position) => {
          const color = brandColor(product.logo)
          const style = tileStyle[position]

          return (
            <span
              key={product.id}
              style={{ boxShadow: `0 16px 30px -14px #${color}9e` }}
              className={`absolute grid place-items-center overflow-hidden border-[3px] border-white bg-gradient-to-br ring-1 ring-black/5 transition-transform duration-500 ease-out ${product.gradient} ${style.size} ${style.position}`}
            >
              {/* برق شیشه‌ای روی کاشی */}
              <span
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(140deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.08) 42%, rgba(0,0,0,0.12) 100%)",
                }}
                aria-hidden
              />
              <span
                className="pointer-events-none absolute -right-5 -top-6 h-16 w-16 rounded-full bg-white/30 blur-lg"
                aria-hidden
              />
              <span className="relative drop-shadow-[0_3px_6px_rgba(10,27,51,0.35)]">
                <BrandIcon slug={product.logo} size={position === 1 ? 30 : 26} color="#ffffff" />
              </span>
            </span>
          )
        })}

        {/* درِ شیشه‌ای پوشه با نام دسته */}
        <span className="absolute inset-x-1 bottom-0 z-10 flex h-[74px] items-end rounded-[18px] border border-white/70 bg-white/60 px-3 pb-3 shadow-[0_16px_34px_-24px_rgba(10,27,51,0.55)] backdrop-blur-md">
          <span className="line-clamp-2 text-right text-[13px] font-extrabold leading-5 text-[#0a1b33] transition-colors duration-500 group-hover:text-[#1b39f5]">
            {category.title}
          </span>
        </span>
      </div>
    </Link>
  )
}

function Section({
  title,
  subtitle,
  href,
  linkLabel,
  children,
}: {
  title?: string
  subtitle?: string
  href?: string
  linkLabel?: string
  children: React.ReactNode
}) {
  return (
    <section className="mx-auto max-w-[1400px] px-4 md:px-6 mt-16">
      {title ? (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-3 font-display text-[22px] md:text-[26px] font-semibold text-[#0a1b33]">
              <span className="h-6 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
              {title}
            </h2>
            {subtitle ? <p className="mt-2 text-[13px] text-slate-500">{subtitle}</p> : null}
          </div>
          {href && linkLabel ? (
            <Link
              href={href}
              className="glass-plate glass-plate-hover inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-semibold text-[#1b39f5]"
            >
              {linkLabel}
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  )
}
