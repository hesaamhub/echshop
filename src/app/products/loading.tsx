import Shell from "@/components/site/Shell"
import ProductsHero from "@/components/site/ProductsHero"
import { ProductsBrowserSkeleton } from "@/components/site/ProductListSkeleton"

export default function ProductsLoading() {
  return (
    <Shell
      breadcrumb={[
        { label: "صفحه اصلی", href: "/" },
        { label: "محصولات" },
      ]}
      includeBreadcrumbSchema={false}
    >
      <ProductsHero />
      <div className="mt-10">
        <ProductsBrowserSkeleton count={6} />
      </div>
    </Shell>
  )
}
