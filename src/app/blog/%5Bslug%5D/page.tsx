import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Shell from "@/components/site/Shell"
import { getPost, posts } from "@/lib/data"
import { faDate } from "@/lib/utils"
import { resolveSiteUrl } from "@/lib/seo/structuredData"

const SITE_URL = resolveSiteUrl()

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return { title:"مقاله یافت نشد" }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical:`/blog/${post.slug}` },
    openGraph: {
      title:`${post.title} | بلاگ اچ‌شاپ`,
      description: post.excerpt,
      url:`/blog/${post.slug}`,
      type:"article",
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const others = posts.filter((item) => item.slug !== post.slug).slice(0, 3)

  // دادهٔ ساخت‌یافتهٔ مقاله — نمایش نویسنده و تاریخ در نتایج گوگل
  const articleLd = {
    "@context":"https://schema.org",
    "@type":"Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    inLanguage:"fa-IR",
    author: {"@type":"Organization", name: post.author },
    publisher: {"@type":"Organization", name:"اچ‌شاپ" },
    mainEntityOfPage:`${SITE_URL}/blog/${post.slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      <Shell
        breadcrumb={[
          { label:"صفحه اصلی", href:"/" },
          { label:"بلاگ", href:"/blog" },
          { label: post.title },
        ]}
      >
        <article className="overflow-hidden rounded-[24px] sm:rounded-[32px] border border-[#1b39f5]/10 bg-white shadow-[0_22px_48px_-36px_rgba(27,57,245,0.5)]">
          <div className="h-40 sm:h-52" style={{ background: post.cover }} />
          <div className="p-5 sm:p-8 md:p-12">
            <span className="rounded-full bg-[#1b39f5]/8 px-3 py-1 text-[10.5px] font-bold text-[#1b39f5]">
              {post.category}
            </span>
            <h1 className="mt-3 sm:mt-4 font-display text-[21px] sm:text-[26px] md:text-[32px] font-semibold leading-[1.6] text-[#0a1b33]">
              {post.title}
            </h1>
            <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2.5 sm:gap-3 text-[11px] sm:text-[11.5px] text-slate-400">
              <span>{post.author}</span>
              <span>·</span>
              <span>{faDate(post.publishedAt)}</span>
              <span>·</span>
              <span>
                <span className="num">{post.readMinutes}</span> دقیقه مطالعه
              </span>
            </div>

            <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
              <blockquote className="rounded-2xl border-r-4 border-[#1b39f5] bg-[#1b39f5]/5 py-3.5 sm:py-4 pr-4 sm:pr-5 pl-3.5 sm:pl-4 text-[12.5px] sm:text-[13px] leading-7 sm:leading-8 text-slate-600">
                {post.excerpt}
              </blockquote>
              {post.body
                .split("\n")
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index} className="text-[13px] sm:text-[13.5px] leading-8 sm:leading-9 text-slate-600">
                    {paragraph}
                  </p>
                ))}
            </div>
          </div>
        </article>

        <section className="mt-8 sm:mt-12">
          <h2 className="mb-4 sm:mb-5 flex items-center gap-2.5 sm:gap-3 font-display text-[18px] sm:text-[20px] font-semibold text-[#0a1b33]">
            <span className="h-5 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
            مقالات دیگر
          </h2>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
            {others.map((item) => (
              <Link
                key={item.slug}
                href={`/blog/${item.slug}`}
                className="group rounded-3xl border border-[#1b39f5]/10 bg-white p-4 sm:p-6 shadow-[0_18px_40px_-34px_rgba(27,57,245,0.5)] transition-all hover:-translate-y-0.5 hover:border-[#1b39f5]/25"
              >
                <h3 className="text-[13px] sm:text-[13.5px] font-bold leading-7 text-[#0a1b33] transition-colors group-hover:text-[#1b39f5]">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-[12px] leading-7 text-slate-500">{item.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      </Shell>
    </>
  )
}
