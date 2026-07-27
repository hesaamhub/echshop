import Link from "next/link"
import Shell from "@/components/site/Shell"
import ProductCard from "@/components/site/ProductCard"
import { categories, products } from "@/lib/data"
import { deliveryLabels } from "@/lib/types"

export const metadata = { title: "همهٔ محصولات" }

export default function ProductsPage() {
  return (
    <Shell
      title="همهٔ محصولات"
      subtitle="اکانت‌ها و لایسنس‌های اورجینال با تحویل فوری، خودکار یا دستی — همه با گارانتی."
      breadcrumb={[{ label: "صفحه اصلی", href: "/" }, { label: "محصولات" }]}
    >
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* فیلترها */}
        <aside className="space-y-4">
          <FilterCard title="دسته‌بندی">
            <div className="space-y-1">
              <Link
                href="/products"
                className="block rounded-xl bg-[#0a152d] px-3 py-2 text-[12px] font-semibold text-white"
              >
                همهٔ محصولات
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-[12px] text-slate-600 hover:bg-slate-50"
                >
                  {category.title}
                  <span className="num text-[10px] text-slate-400">{category.count}</span>
                </Link>
              ))}
            </div>
          </FilterCard>

          <FilterCard title="نوع تحویل">
            <div className="space-y-2.5">
              {Object.entries(deliveryLabels).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-[12px] text-slate-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 accent-[#2783de]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </FilterCard>

          <FilterCard title="محدودهٔ قیمت">
            <div className="space-y-2.5">
              {["تا ۵۰۰ هزار تومان", "۵۰۰ هزار تا ۱ میلیون", "۱ تا ۳ میلیون", "بیش از ۳ میلیون"].map(
                (range) => (
                  <label key={range} className="flex items-center gap-2 text-[12px] text-slate-600">
                    <input type="radio" name="price" className="h-4 w-4 accent-[#2783de]" />
                    {range}
                  </label>
                ),
              )}
            </div>
          </FilterCard>
        </aside>

        {/* لیست */}
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white px-4 py-3">
            <span className="text-[12px] text-slate-500">
              <span className="num">{products.length}</span> محصول یافت شد
            </span>
            <div className="flex items-center gap-1.5">
              {["جدیدترین", "پرفروش‌ترین", "ارزان‌ترین", "گران‌ترین"].map((sort, index) => (
                <button
                  key={sort}
                  type="button"
                  className={
                    index === 0
                      ? "rounded-full bg-[#0a152d] px-3.5 py-1.5 text-[11px] font-semibold text-white"
                      : "rounded-full px-3.5 py-1.5 text-[11px] font-medium text-slate-500 hover:bg-slate-50"
                  }
                >
                  {sort}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </Shell>
  )
}

function FilterCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white p-5">
      <h3 className="mb-3 text-[13px] font-bold text-[#0a1b33]">{title}</h3>
      {children}
    </div>
  )
}
