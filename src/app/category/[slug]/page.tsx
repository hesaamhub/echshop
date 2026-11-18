import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Shell from "@/components/site/Shell"
import ProductCard from "@/components/site/ProductCard"
import { categories, getCategory, productsByCategory } from "@/lib/data"

const SITE_URL = "https://echshop.ir"

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = getCategory(slug)
  if (!category) return { title: "دسته‌بندی یافت نشد" }

  return {
    title: `${category.title} — خرید اکانت و اشتراک`,
    description: `${category.description} خرید با تحویل فوری، گارانتی کامل و پشتیبانی فارسی از اچ‌شاپ.`,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: {
      title: `${category.title} | اچ‌شاپ`,
      description: category.description,
      url: `/category/${category.slug}`,
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = getCategory(slug)
  if (!category) notFound()

  const items = productsByCategory(slug)

  // دادهٔ ساخت‌یافتهٔ صفحهٔ دسته — فهرست محصولات برای گوگل
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.title,
    description: category.description,
    url: `${SITE_URL}/category/${category.slug}`,
    inLanguage: "fa-IR",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        url: `${SITE_URL}/products/${item.slug}`,
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Shell
        title={category.title}
        subtitle={category.description}
        breadcrumb={[
          { label: "صفحه اصلی", href: "/" },
          { label: "دسته‌بندی‌ها", href: "/categories" },
          { label: category.title },
        ]}
      >
        {items.length ? (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#1b39f5]/30 bg-[#1b39f5]/4 p-12 text-center">
            <p className="text-[14px] font-semibold text-[#0a1b33]">
              هنوز محصولی در این دسته ثبت نشده است
            </p>
            <p className="mt-2 text-[12px] text-slate-500">
              به‌زودی محصولات این دسته اضافه می‌شوند.
            </p>
          </div>
        )}
      </Shell>
    </>
  )
}
