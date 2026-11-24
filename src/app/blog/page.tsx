import type { Metadata } from "next"
import Link from "next/link"
import Shell from "@/components/site/Shell"
import { posts } from "@/lib/data"
import { faDate } from "@/lib/utils"

export const metadata: Metadata = {
  title:"بلاگ — راهنمای خرید اکانت و مقایسهٔ سرویس‌ها",
  description:
    "راهنمای خرید امن اکانت‌های پرمیوم، مقایسهٔ دقیق اشتراک‌ها و لایسنس‌ها، و نکات امنیتی حساب‌های دیجیتال از تحریریهٔ اچ‌شاپ.",
  keywords: ["بلاگ اچ‌شاپ", "راهنمای خرید اکانت", "مقایسه اشتراک", "امنیت اکانت"],
  alternates: { canonical:"/blog" },
  openGraph: {
    title:"بلاگ اچ‌شاپ",
    description:"راهنمای خرید امن اکانت‌های پرمیوم و مقایسهٔ سرویس‌ها.",
    url:"/blog",
  },
}

export default function BlogPage() {
  const [featured, ...rest] = posts

  return (
    <Shell
      title="بلاگ اچ‌شاپ"
      subtitle="راهنمای خرید اکانت، مقایسهٔ سرویس‌ها و نکات امنیتی حساب‌های دیجیتال."
      breadcrumb={[{ label:"صفحه اصلی", href:"/" }, { label:"بلاگ" }]}
    >
      <Link
        href={`/blog/${featured.slug}`}
        className="group grid overflow-hidden rounded-[24px] sm:rounded-[32px] border border-[#1b39f5]/10 bg-white shadow-[0_22px_48px_-36px_rgba(27,57,245,0.5)] transition-all hover:border-[#1b39f5]/25 md:grid-cols-2"
      >
        <div className="h-44 sm:h-56 md:h-full" style={{ background: featured.cover }} />
        <div className="p-5 sm:p-8">
          <span className="rounded-full bg-[#1b39f5]/8 px-3 py-1 text-[10.5px] font-bold text-[#1b39f5]">
            {featured.category}
          </span>
          <h2 className="mt-3 sm:mt-4 font-display text-[18px] sm:text-[22px] font-semibold leading-8 sm:leading-9 text-[#0a1b33] transition-colors group-hover:text-[#1b39f5]">
            {featured.title}
          </h2>
          <p className="mt-2.5 sm:mt-3 text-[12.5px] sm:text-[13px] leading-7 text-slate-500">{featured.excerpt}</p>
          <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3 text-[11px] sm:text-[11.5px] text-slate-400">
            <span>{featured.author}</span>
            <span>·</span>
            <span>{faDate(featured.publishedAt)}</span>
            <span>·</span>
            <span>
              <span className="num">{featured.readMinutes}</span> دقیقه
            </span>
          </div>
        </div>
      </Link>

      <div className="mt-5 sm:mt-6 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group overflow-hidden rounded-3xl border border-[#1b39f5]/10 bg-white shadow-[0_18px_40px_-34px_rgba(27,57,245,0.5)] transition-all hover:-translate-y-0.5 hover:border-[#1b39f5]/25 hover:shadow-[0_24px_50px_-28px_rgba(27,57,245,0.45)]"
          >
            <div className="h-28 sm:h-32" style={{ background: post.cover }} />
            <div className="p-4 sm:p-6">
              <span className="rounded-full bg-[#1b39f5]/8 px-2.5 py-1 text-[10px] font-semibold text-[#1b39f5]">
                {post.category}
              </span>
              <h3 className="mt-2.5 sm:mt-3 text-[13.5px] sm:text-[14px] font-bold leading-7 text-[#0a1b33] transition-colors group-hover:text-[#1b39f5]">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-[12px] leading-7 text-slate-500">{post.excerpt}</p>
              <div className="mt-4 sm:mt-5 flex items-center justify-between border-t border-[#1b39f5]/10 pt-3.5 sm:pt-4 text-[11px] text-slate-400">
                <span>{faDate(post.publishedAt)}</span>
                <span>
                  <span className="num">{post.readMinutes}</span> دقیقه مطالعه
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Shell>
  )
}
