import Link from "next/link"
import {
  ArrowLeft,
  BadgeCheck,
  Globe,
  Headphones,
  Paperclip,
  Send,
  Users,
  Zap,
} from "lucide-react"
import Header from "@/components/site/Header"
import Hero from "@/components/site/Hero"
import Footer from "@/components/site/Footer"
import BrandIcon from "@/components/site/BrandIcon"
import ProductCard from "@/components/site/ProductCard"
import ShowcaseDeck from "@/components/site/ShowcaseDeck"
import NewArrivalBanner from "@/components/site/NewArrivalBanner"
import PosterGrid from "@/components/site/PosterGrid"
import QuickOrder from "@/components/site/QuickOrder"
import CurrencyPay from "@/components/site/CurrencyPay"
import NewsletterCTA from "@/components/site/NewsletterCTA"
import ProductRequestForm from "@/components/site/ProductRequestForm"
import { brandLogos } from "@/lib/brands"
import { categories, posts, products, siteContent } from "@/lib/data"
import { newArrivals } from "@/lib/newArrivals"
import { faDate } from "@/lib/utils"

/** همان ۶ محصولی که در دک بالای صفحه نمایش داده می‌شوند */
const deckIds = new Set(
  [...products]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 6)
    .map((product) => product.id),
)

/** آیکون هر کاشی آمار */
const statIcons = [BadgeCheck, Zap, Users, Headphones]

/** تبدیل ارقام فارسی و عربی به لاتین */
function latinDigits(value: string | number) {
  const fa = "\u06f0\u06f1\u06f2\u06f3\u06f4\u06f5\u06f6\u06f7\u06f8\u06f9"
  const ar = "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669"

  return String(value)
    .split("")
    .map((char) => {
      const faIndex = fa.indexOf(char)
      if (faIndex > -1) return String(faIndex)
      const arIndex = ar.indexOf(char)
      if (arIndex > -1) return String(arIndex)
      return char
    })
    .join("")
}

export default function HomePage() {
  // اکانت‌های پرکاربرد، بدون تکرار محصولات دک
  const essentials = [...products]
    .filter((product) => !deckIds.has(product.id))
    .sort((a, b) => b.sold - a.sold)
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

        {/* پوسترهای پیشنهادی */}
        <Section>
          <PosterGrid />
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
          <StatsPanel />
        </Section>

        {/* پرداخت ارزی */}
        <Section>
          <CurrencyPay />
        </Section>

        {/* محصولات جدید با بنر تصویری */}
        <Section title="جدیدترین محصولات" href="/products" linkLabel="مشاهدهٔ همه">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {newArrivals.map((item) => (
              <NewArrivalBanner key={item.slug} item={item} />
            ))}
          </div>
        </Section>

        {/* سفارش سریع */}
        <Section>
          <QuickOrder />
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
                      <span className="font-latin">{latinDigits(post.readMinutes)}</span> دقیقه مطالعه
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        {/* خبرنامه و درخواست محصول */}
        <Section>
          <div className="grid items-stretch gap-4 lg:grid-cols-2">
            <NewsletterCTA />
            <ProductRequestForm />
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}

/** پنل شیشه‌ای آمار */
function StatsPanel() {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[#f2f4fb] p-3 shadow-[0_30px_70px_-50px_rgba(10,21,45,0.8)] md:p-5">
      {/* پس‌زمینهٔ مش رنگی نرم */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 12% 0%, rgba(27,57,245,0.16) 0%, rgba(27,57,245,0) 55%), radial-gradient(100% 80% at 95% 10%, rgba(129,88,245,0.16) 0%, rgba(129,88,245,0) 60%), radial-gradient(90% 90% at 70% 110%, rgba(10,21,45,0.10) 0%, rgba(10,21,45,0) 60%)",
        }}
        aria-hidden
      />

      {/* پنل بالا: کاشی‌های آمار */}
      <div className="relative rounded-[28px] border border-white/80 bg-white/55 p-3 backdrop-blur-xl md:p-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {siteContent.stats.map((stat, index) => {
            const Icon = statIcons[index % statIcons.length]
            const featured = index === 1

            return (
              <div
                key={stat.label}
                className={`group relative overflow-hidden rounded-[22px] px-4 py-6 text-center transition-all duration-500 hover:-translate-y-1 ${
                  featured
                    ? "bg-gradient-to-b from-[#2a49ff] to-[#1226c4] shadow-[0_26px_46px_-26px_rgba(27,57,245,0.9)]"
                    : "border border-white bg-white shadow-[0_18px_40px_-32px_rgba(10,21,45,0.9)]"
                }`}
              >
                {featured ? (
                  <span
                    className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/25 to-transparent"
                    aria-hidden
                  />
                ) : null}

                <span
                  className={`relative mx-auto grid h-11 w-11 place-items-center rounded-2xl transition-all duration-500 ${
                    featured
                      ? "bg-white/20 text-white ring-1 ring-white/40"
                      : "bg-[#1b39f5]/8 text-[#1b39f5] group-hover:bg-[#1b39f5] group-hover:text-white"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
                </span>

                <div
                  className={`font-latin relative mt-3 font-display text-[28px] font-semibold leading-9 tracking-tight md:text-[32px] ${
                    featured ? "text-white" : "text-[#0a1b33]"
                  }`}
                  dir="ltr"
                >
                  {latinDigits(stat.value)}
                </div>

                <div
                  className={`relative mt-1 text-[11.5px] font-semibold leading-5 ${
                    featured ? "text-white/80" : "text-slate-500"
                  }`}
                >
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* پنل پایین: پیام و اقدام‌ها */}
      <div className="relative mt-3 flex flex-col gap-5 rounded-[28px] border border-white/80 bg-white/55 px-5 py-6 backdrop-blur-xl md:flex-row md:items-center md:justify-between md:px-7">
        <div>
          <p className="text-[16px] font-bold leading-8 text-[#0a1b33] md:text-[19px]">
            هر اکانت و لایسنسی که لازم داری، اورجینال و با فعال‌سازی فوری.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border border-white bg-white/80 px-4 py-2 text-[12.5px] font-semibold text-[#0a1b33] shadow-[0_10px_24px_-20px_rgba(10,21,45,0.9)] transition-all hover:-translate-y-0.5 hover:bg-white"
            >
              <Paperclip className="h-4 w-4 text-[#1b39f5]" />
              همهٔ محصولات
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-white bg-white/80 px-4 py-2 text-[12.5px] font-semibold text-[#0a1b33] shadow-[0_10px_24px_-20px_rgba(10,21,45,0.9)] transition-all hover:-translate-y-0.5 hover:bg-white"
            >
              <Globe className="h-4 w-4 text-[#1b39f5]" />
              راهنمای خرید
            </Link>
          </div>
        </div>

        <Link
          href="/contact"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#0a152d] px-6 py-3.5 text-[13px] font-semibold text-white shadow-[0_20px_40px_-24px_rgba(10,21,45,1)] transition-all duration-500 hover:-translate-y-0.5 hover:bg-[#1b39f5]"
        >
          <Send className="h-4 w-4 -scale-x-100" />
          گفت‌وگو با پشتیبانی
        </Link>
      </div>
    </div>
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
