import { Suspense } from "react"
import Shell from "@/components/site/Shell"
import ProductsHero from "@/components/site/ProductsHero"
import ProductsBrowser from "@/components/site/ProductsBrowser"
import { categories, products } from "@/lib/data"

export const metadata = { title: "همهٔ محصولات" }

export default function ProductsPage() {
  return (
    <Shell breadcrumb={[{ label: "صفحه اصلی", href: "/" }, { label: "محصولات" }]}>
      <ProductsHero />
      <div className="mt-10">
        {/* ProductsBrowser برای خواندن پارامتر جستجو به Suspense نیاز دارد */}
        <Suspense fallback={null}>
          <ProductsBrowser products={products} categories={categories} />
        </Suspense>
      </div>
    </Shell>
  )
}
