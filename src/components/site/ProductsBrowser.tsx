"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import ProductCard from "@/components/site/ProductCard"
import { deliveryLabels, type Category, type DeliveryMethod, type Product } from "@/lib/types"
import { num } from "@/lib/utils"

type SortKey = "newest" | "bestselling" | "cheapest" | "priciest"

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "newest", label: "جدیدترین" },
  { key: "bestselling", label: "پرفروش‌ترین" },
  { key: "cheapest", label: "ارزان‌ترین" },
  { key: "priciest", label: "گران‌ترین" },
]

type PriceRange = { id: string; label: string; test: (price: number) => boolean }

const priceRanges: PriceRange[] = [
  { id: "all", label: "همهٔ قیمت‌ها", test: () => true },
  { id: "lt-500", label: "تا ۵۰۰ هزار تومان", test: (price) => price < 500_000 },
  {
    id: "500-1000",
    label: "۵۰۰ هزار تا ۱ میلیون",
    test: (price) => price >= 500_000 && price < 1_000_000,
  },
  {
    id: "1000-3000",
    label: "۱ تا ۳ میلیون",
    test: (price) => price >= 1_000_000 && price < 3_000_000,
  },
  { id: "gt-3000", label: "بیش از ۳ میلیون", test: (price) => price >= 3_000_000 },
]

/** کمترین قیمت میان پلن‌های محصول — مبنای فیلتر و مرتب‌سازی قیمت */
function minPrice(product: Product) {
  return Math.min(...product.plans.map((plan) => plan.price))
}

export default function ProductsBrowser({
  products,
  categories,
}: {
  products: Product[]
  categories: Category[]
}) {
  const [deliveries, setDeliveries] = useState<DeliveryMethod[]>([])
  const [priceRangeId, setPriceRangeId] = useState("all")
  const [sort, setSort] = useState<SortKey>("newest")

  const visible = useMemo(() => {
    const range = priceRanges.find((item) => item.id === priceRangeId) ?? priceRanges[0]

    const filtered = products.filter((product) => {
      const matchesDelivery =
        deliveries.length === 0 ||
        product.plans.some((plan) => deliveries.includes(plan.delivery))
      return matchesDelivery && range.test(minPrice(product))
    })

    switch (sort) {
      case "bestselling":
        return [...filtered].sort((a, b) => b.sold - a.sold)
      case "cheapest":
        return [...filtered].sort((a, b) => minPrice(a) - minPrice(b))
      case "priciest":
        return [...filtered].sort((a, b) => minPrice(b) - minPrice(a))
      default:
        // «جدیدترین» تا اتصال دیتابیس همان ترتیب فهرست داده است
        return filtered
    }
  }, [products, deliveries, priceRangeId, sort])

  const toggleDelivery = (method: DeliveryMethod) => {
    setDeliveries((current) =>
      current.includes(method)
        ? current.filter((item) => item !== method)
        : [...current, method],
    )
  }

  const resetFilters = () => {
    setDeliveries([])
    setPriceRangeId("all")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      {/* فیلترها */}
      <aside className="space-y-4">
        <FilterCard title="دسته‌بندی">
          <div className="space-y-1">
            <Link
              href="/products"
              className="glass-solid block rounded-xl px-3 py-2 text-[12px] font-semibold"
            >
              همهٔ محصولات
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-[12px] text-slate-600 transition-all hover:bg-[#1b39f5]/8 hover:text-[#1b39f5]"
              >
                {category.title}
                <span className="num text-[10px] text-slate-400">{num(category.count)}</span>
              </Link>
            ))}
          </div>
        </FilterCard>

        <FilterCard title="نوع تحویل">
          <div className="space-y-2.5">
            {(Object.entries(deliveryLabels) as [DeliveryMethod, string][]).map(([key, label]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-2 text-[12px] text-slate-600"
              >
                <input
                  type="checkbox"
                  checked={deliveries.includes(key)}
                  onChange={() => toggleDelivery(key)}
                  className="h-4 w-4 rounded border-slate-300 accent-[#1b39f5]"
                />
                {label}
              </label>
            ))}
          </div>
        </FilterCard>

        <FilterCard title="محدودهٔ قیمت">
          <div className="space-y-2.5">
            {priceRanges.map((range) => (
              <label
                key={range.id}
                className="flex cursor-pointer items-center gap-2 text-[12px] text-slate-600"
              >
                <input
                  type="radio"
                  name="price"
                  checked={priceRangeId === range.id}
                  onChange={() => setPriceRangeId(range.id)}
                  className="h-4 w-4 accent-[#1b39f5]"
                />
                {range.label}
              </label>
            ))}
          </div>
        </FilterCard>
      </aside>

      {/* لیست */}
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#1b39f5]/10 bg-white px-4 py-3 shadow-[0_18px_40px_-34px_rgba(27,57,245,0.5)]">
          <span className="text-[12px] text-slate-500">
            <span className="num">{num(visible.length)}</span> محصول یافت شد
          </span>
          <div className="flex items-center gap-1.5">
            {sortOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setSort(option.key)}
                aria-pressed={sort === option.key}
                className={
                  sort === option.key
                    ? "glass-solid rounded-full px-3.5 py-1.5 text-[11px] font-semibold"
                    : "rounded-full px-3.5 py-1.5 text-[11px] font-medium text-slate-500 transition-all hover:bg-[#1b39f5]/8 hover:text-[#1b39f5]"
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {visible.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#1b39f5]/30 bg-[#1b39f5]/4 p-12 text-center">
            <p className="text-[14px] font-semibold text-[#0a1b33]">
              محصولی با این فیلترها پیدا نشد
            </p>
            <p className="mt-2 text-[12px] text-slate-500">
              فیلتر دیگری را امتحان کنید یا همهٔ فیلترها را حذف کنید.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="glass-plate glass-plate-hover mt-5 rounded-full px-5 py-2 text-[12px] font-semibold text-[#1b39f5]"
            >
              حذف فیلترها
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function FilterCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-[#1b39f5]/10 bg-white p-5 shadow-[0_18px_40px_-34px_rgba(27,57,245,0.5)]">
      <h3 className="mb-3 flex items-center gap-2 text-[13px] font-bold text-[#0a1b33]">
        <span className="h-3.5 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
        {title}
      </h3>
      {children}
    </div>
  )
}
