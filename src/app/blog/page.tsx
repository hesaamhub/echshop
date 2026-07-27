import Link from "next/link"
import Shell from "@/components/site/Shell"
import { posts } from "@/lib/data"
import { faDate } from "@/lib/utils"

export const metadata = { title: "بلاگ" }

export default function BlogPage() {
  const [featured, ...rest] = posts

  return (
    <Shell
      title="بلاگ اچ‌شاپ"
      subtitle="راهنمای خرید اکانت، مقایسهٔ سرویس‌ها و نکات امنیتی حساب‌های دیجیتال."
      breadcrumb={[{ label: "صفحه اصلی", href: "/" }, { label: "بلاگ" }]}
    >
      <Link
        href={`/blog/${featured.slug}`}
        className="group grid overflow-hidden rounded-[32px] border border-slate-200/70 bg-white md:grid-cols-2"
      >
        <div className="h-56 md:h-full" style={{ background: featured.cover }} />
        <div className="p-8">
          <span className="rounded-full bg-[#E5F2FC] px-3 py-1 text-[10.5px] font-bold text-[#1c5f9e]">
            {featured.category}
          </span>
          <h2 className="mt-4 font-display text-[22px] font-semibold leading-9 text-[#0a1b33]">
            {featured.title}
          </h2>
          <p className="mt-3 text-[13px] leading-7 text-slate-500">{featured.excerpt}</p>
          <div className="mt-6 flex items-center gap-3 text-[11.5px] text-slate-400">
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

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group overflow-hidden rounded-3xl border border-slate-200/70 bg-white transition-all hover:border-slate-300"
          >
            <div className="h-32" style={{ background: post.cover }} />
            <div className="p-6">
              <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                {post.category}
              </span>
              <h3 className="mt-3 text-[14px] font-bold leading-7 text-[#0a1b33]">{post.title}</h3>
              <p className="mt-2 line-clamp-3 text-[12px] leading-7 text-slate-500">{post.excerpt}</p>
              <div className="mt-5 flex items-center justify-between text-[11px] text-slate-400">
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
