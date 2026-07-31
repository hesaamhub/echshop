import Link from "next/link"
import { ArrowLeft, ArrowUpLeft } from "lucide-react"
import Header from "@/components/site/Header"
import Hero from "@/components/site/Hero"
import Footer from "@/components/site/Footer"
import BrandIcon from "@/components/site/BrandIcon"
import ProductCard from "@/components/site/ProductCard"
import ShowcaseDeck from "@/components/site/ShowcaseDeck"
import { categories, posts, products, siteContent } from "@/lib/data"
import { faDate, num } from "@/lib/utils"

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

/** پوشهٔ دسته‌بندی: سه لوگوی بادبزنی پشت شیشهٔ مات با نام دسته روی پوشه */
function CategoryFolder({ category }: { category: (typeof categories)[number] }) {
  const picks = products.filter((product) => product.categorySlug === category.slug).slice(0, 3)

  const tilePosition = [
    "right-2 top-8 -rotate-[13deg]",
    "left-1/2 top-3 -translate-x-1/2",
    "left-2 top-8 rotate-[13deg]",
  ]

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex flex-col items-center rounded-[24px] bg-[#f4f5f7] px-3 pb-4 pt-4 transition-all duration-500 hover:-translate-y-1 hover:bg-[#f8f9fb] hover:shadow-[0_24px_50px_-34px_rgba(10,27,51,0.55)]"
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
        {picks.map((product, position) => (
          <span
            key={product.id}
            className={`absolute grid h-[92px] w-[68px] place-items-center rounded-[16px] border-4 border-white bg-gradient-to-br shadow-[0_14px_28px_-18px_rgba(10,27,51,0.6)] transition-transform duration-500 group-hover:-translate-y-1 ${product.gradient} ${tilePosition[position]}`}
          >
            <BrandIcon slug={product.logo} size={26} color="#ffffff" />
          </span>
        ))}

        {/* دربٔ شیشه‌ای پوشه با نام دسته */}
        <span className="absolute inset-x-1 bottom-0 z-10 flex h-[74px] items-end justify-between gap-2 rounded-[18px] border border-white/70 bg-white/60 px-3 pb-3 shadow-[0_16px_34px_-24px_rgba(10,27,51,0.55)] backdrop-blur-md">
          <span className="line-clamp-2 text-right text-[12.5px] font-extrabold leading-5 text-[#0a1b33]">
            {category.title}
          </span>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0a152d] text-white transition-all duration-500 group-hover:scale-110 group-hover:bg-[#1b39f5]">
            <ArrowUpLeft className="h-4 w-4" />
          </span>
        </span>
      </div>

      <span className="mt-3 rounded-full bg-[#0a1b33]/6 px-3 py-1 text-[10.5px] font-semibold text-slate-500">
        <span className="num">{num(category.count)}</span> محصول
      </span>
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
