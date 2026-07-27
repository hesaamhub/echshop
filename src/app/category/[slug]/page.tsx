import { notFound } from "next/navigation"
import Shell from "@/components/site/Shell"
import ProductCard from "@/components/site/ProductCard"
import { categories, getCategory, productsByCategory } from "@/lib/data"

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }))
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

  return (
    <Shell
      title={category.title}
      subtitle={category.description}
      breadcrumb={[
        { label: "صفحه اصلی", href: "/" },
        { label: "دسته‌بندی‌ها", href: "/products" },
        { label: category.title },
      ]}
    >
      {items.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-[14px] font-semibold text-[#0a1b33]">
            هنوز محصولی در این دسته ثبت نشده است
          </p>
          <p className="mt-2 text-[12px] text-slate-500">
            به‌زودی محصولات این دسته اضافه می‌شوند.
          </p>
        </div>
      )}
    </Shell>
  )
}
