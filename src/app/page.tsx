import Link from "next/link"
import {
  ArrowLeft,
  BadgeCheck,
  Gamepad2,
  Headphones,
  MessageCircle,
  MonitorSmartphone,
  Music,
  PenTool,
  ShieldCheck,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react"
import Header from "@/components/site/Header"
import Hero from "@/components/site/Hero"
import PromoBanner from "@/components/site/PromoBanner"
import Footer from "@/components/site/Footer"
import GlassIcon from "@/components/site/GlassIcon"
import ProductCard from "@/components/site/ProductCard"
import { categories, posts, products, siteContent } from "@/lib/data"
import { faDate } from "@/lib/utils"

const icons = {
  Zap,
  ShieldCheck,
  Headphones,
  BadgeCheck,
  Music,
  Sparkles,
  PenTool,
  Gamepad2,
  MonitorSmartphone,
  MessageCircle,
} as const

function iconFor(name: string): LucideIcon {
  return icons[name as keyof typeof icons] ?? Sparkles
}

export default function HomePage() {
  const bestSellers = [...products].sort((a, b) => b.sold - a.sold).slice(0, 4)
  const newest = products.slice(4, 8)

  return (
    <>
      <Header />
      <main>
        <PromoBanner />
        <Hero />

        {/* مزایا */}
        <Section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {siteContent.features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-3xl border border-[#1b39f5]/10 bg-white p-6 shadow-[0_18px_40px_-34px_rgba(27,57,245,0.5)] transition-all hover:border-[#1b39f5]/25 hover:shadow-[0_20px_44px_-28px_rgba(27,57,245,0.45)]"
              >
                <GlassIcon icon={iconFor(feature.icon)} size="md" />
                <h3 className="mt-4 text-[14px] font-bold text-[#0a1b33]">{feature.title}</h3>
                <p className="mt-2 text-[12px] leading-6 text-slate-500">{feature.body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* دسته‌بندی‌ها */}
        <Section
          title="دسته‌بندی محصولات"
          subtitle="از اشتراک‌های استریم تا لایسنس‌های حرفه‌ای طراحی و هوش مصنوعی"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group flex items-start gap-4 rounded-3xl border border-[#1b39f5]/10 bg-white p-6 shadow-[0_18px_40px_-34px_rgba(27,57,245,0.5)] transition-all hover:border-[#1b39f5]/25 hover:shadow-[0_20px_44px_-28px_rgba(27,57,245,0.45)]"
              >
                <GlassIcon icon={iconFor(category.icon)} size="lg" />
                <span className="flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-[14px] font-bold text-[#0a1b33]">{category.title}</span>
                    <span className="num rounded-full bg-[#1b39f5]/8 px-2 py-0.5 text-[10px] text-[#1b39f5]">
                      {category.count}
                    </span>
                  </span>
                  <span className="mt-2 block text-[12px] leading-6 text-slate-500">
                    {category.description}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Section>

        {/* پرفروش‌ترین‌ها */}
        <Section title="پرفروش‌ترین محصولات" href="/products" linkLabel="همهٔ محصولات">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellers.map((product) => (
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
