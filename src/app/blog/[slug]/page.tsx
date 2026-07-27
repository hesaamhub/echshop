import Link from "next/link"
import { notFound } from "next/navigation"
import Shell from "@/components/site/Shell"
import { getPost, posts } from "@/lib/data"
import { faDate } from "@/lib/utils"

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const others = posts.filter((item) => item.slug !== post.slug).slice(0, 3)

  return (
    <Shell
      breadcrumb={[
        { label: "صفحه اصلی", href: "/" },
        { label: "بلاگ", href: "/blog" },
        { label: post.title },
      ]}
    >
      <article className="overflow-hidden rounded-[32px] border border-slate-200/70 bg-white">
        <div className="h-52" style={{ background: post.cover }} />
        <div className="p-8 md:p-12">
          <span className="rounded-full bg-[#E5F2FC] px-3 py-1 text-[10.5px] font-bold text-[#1c5f9e]">
            {post.category}
          </span>
          <h1 className="mt-4 font-display text-[26px] md:text-[32px] font-semibold leading-[1.6] text-[#0a1b33]">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-[11.5px] text-slate-400">
            <span>{post.author}</span>
            <span>·</span>
            <span>{faDate(post.publishedAt)}</span>
            <span>·</span>
            <span>
              <span className="num">{post.readMinutes}</span> دقیقه مطالعه
            </span>
          </div>

          <div className="mt-8 space-y-5">
            <blockquote className="border-r-4 border-[#2783de] bg-slate-50 py-4 pr-5 pl-4 text-[13px] leading-8 text-slate-600">
              {post.excerpt}
            </blockquote>
            {post.body
              .split("\n")
              .filter(Boolean)
              .map((paragraph, index) => (
                <p key={index} className="text-[13.5px] leading-9 text-slate-600">
                  {paragraph}
                </p>
              ))}
          </div>
        </div>
      </article>

      <section className="mt-12">
        <h2 className="mb-5 font-display text-[20px] font-semibold text-[#0a1b33]">
          مقالات دیگر
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {others.map((item) => (
            <Link
              key={item.slug}
              href={`/blog/${item.slug}`}
              className="rounded-3xl border border-slate-200/70 bg-white p-6 hover:border-slate-300"
            >
              <h3 className="text-[13.5px] font-bold leading-7 text-[#0a1b33]">{item.title}</h3>
              <p className="mt-2 line-clamp-2 text-[12px] leading-7 text-slate-500">{item.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </Shell>
  )
}
