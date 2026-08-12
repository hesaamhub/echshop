import Shell from "@/components/site/Shell"
import ProductsBrowser from "@/components/site/ProductsBrowser"
import { categories, products } from "@/lib/data"

export const metadata = { title: "همهٔ محصولات" }

export default function ProductsPage() {
  return (
    <Shell
      title="همهٔ محصولات"
      subtitle="اکانت‌ها و لایسنس‌های اورجینال با تحویل فوری، خودکار یا دستی — همه با گارانتی."
      breadcrumb={[{ label: "صفحه اصلی", href: "/" }, { label: "محصولات" }]}
    >
      <ProductsBrowser products={products} categories={categories} />
    </Shell>
  )
}
