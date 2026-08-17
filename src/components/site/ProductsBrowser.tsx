"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "motion/react"
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react"
import ProductCard from "@/components/site/ProductCard"
import { deliveryLabels, type Category, type DeliveryMethod, type Product } from "@/lib/types"
import { cn, num } from "@/lib/utils"

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
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") ?? "")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [deliveries, setDeliveries] = useState<DeliveryMethod[]>([])
  const [priceRangeId, setPriceRangeId] = useState("all")
  const [sort, setSort] = useState<SortKey>("newest")
  const [filtersOpen, setFiltersOpen] = useState(false)

  const activeCount =
    (query.trim() ? 1 : 0) +
    selectedCategories.length +
    deliveries.length +
    (priceRangeId !== "all" ? 1 : 0)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const range = priceRanges.find((item) => item.id === priceRangeId) ?? priceRanges[0]

    const filtered = products.filter((product) => {
      const matchesQuery =
        !q ||
        [product.title, product.brand, product.excerpt].some((field) =>
          field.toLowerCase().includes(q),
        )
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.categorySlug)
      const matchesDelivery =
        deliveries.length === 0 ||
        product.plans.some((plan) => deliveries.includes(plan.delivery))
      return matchesQuery && matchesCategory && matchesDelivery && range.test(minPrice(product))
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
  }, [products, query, selectedCategories, deliveries, priceRangeId, sort])

  const toggle = <T,>(list: T[], item: T) =>
    list.includes(item) ? list.filter((entry) => entry !== item) : [...list, item]

  const resetFilters = () => {
    setQuery("")
    setSelectedCategories([])
    setDeliveries([])
    setPriceRangeId("all")
  }

  const activeBadges: { key: string; label: string; clear: () => void }[] = [
    ...(query.trim()
      ? [{ key: "q", label: `جستجو: ${query.trim()}`, clear: () => setQuery("") }]
      : []),
    ...selectedCategories.map((slug) => ({
      key: `cat-${slug}`,
      label: categories.find((category) => category.slug === slug)?.title ?? slug,
      clear: () => setSelectedCategories((current) => current.filter((item) => item !== slug)),
    })),
    ...deliveries.map((method) => ({
      key: `dl-${method}`,
      label: deliveryLabels[method],
      clear: () => setDeliveries((current) => current.filter((item) => item !== method)),
    })),
    ...(priceRangeId !== "all"
      ? [
          {
            key: "price",
            label: priceRanges.find((range) => range.id === priceRangeId)?.label ?? "",
            clear: () => setPriceRangeId("all"),
          },
        ]
      : []),
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      {/* دکمهٔ فیلترها در موبایل */}
      <button
        type="button"
        onClick={() => setFiltersOpen((value) => !value)}
        aria-expanded={filtersOpen}
        className="flex w-full items-center justify-between rounded-2xl border border-[#1b39f5]/10 bg-white px-4 py-3 text-[13px] font-bold text-[#0a1b33] shadow-[0_18px_40px_-34px_rgba(27,57,245,0.5)] lg:hidden"
      >
        <span className="inline-flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#1b39f5]" />
          فیلترها
          {activeCount > 0 ? (
            <span className="num grid h-5 min-w-5 place-items-center rounded-full bg-[#1b39f5] px-1.5 text-[10px] font-bold text-white">
              {num(activeCount)}
            </span>
          ) : null}
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", filtersOpen && "rotate-180")} />
      </button>

      {/* فیلترها */}
      <aside
        className={cn(
          "space-y-4 self-start lg:sticky lg:top-28 lg:block",
          filtersOpen ? "block" : "hidden",
        )}
      >
        <FilterCard title="دسته‌بندی">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((category) => {
              const active = selectedCategories.includes(category.slug)

              return (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => setSelectedCategories((current) => toggle(current, category.slug))}
                  aria-pressed={active}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition-all",
                    active
                      ? "glass-solid"
                      : "border border-[#1b39f5]/12 bg-white text-slate-600 hover:border-[#1b39f5]/30 hover:text-[#1b39f5]",
                  )}
                >
                  {category.title}
                  <span className={cn("num mr-1.5 text-[10px]", active ? "text-white/70" : "text-slate-400")}>
                    {num(category.count)}
                  </span>
                </button>
              )
            })}
          </div>
        </FilterCard>

        <FilterCard title="نوع تحویل">
          <div className="flex flex-wrap gap-1.5">
            {(Object.entries(deliveryLabels) as [DeliveryMethod, string][]).map(([key, label]) => {
              const active = deliveries.includes(key)

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDeliveries((current) => toggle(current, key))}
                  aria-pressed={active}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition-all",
                    active
                      ? "glass-solid"
                      : "border border-[#1b39f5]/12 bg-white text-slate-600 hover:border-[#1b39f5]/30 hover:text-[#1b39f5]",
                  )}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </FilterCard>

        <FilterCard title="محدودهٔ قیمت">
          <div className="flex flex-wrap gap-1.5">
            {priceRanges.map((range) => {
              const active = priceRangeId === range.id

              return (
                <button
                  key={range.id}
                  type="button"
                  onClick={() => setPriceRangeId(range.id)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition-all",
                    active
                      ? "glass-solid"
                      : "border border-[#1b39f5]/12 bg-white text-slate-600 hover:border-[#1b39f5]/30 hover:text-[#1b39f5]",
                  )}
                >
                  {range.label}
                </button>
              )
            })}
          </div>
        </FilterCard>
      </aside>

      {/* لیست */}
      <div>
        {/* جستجوی زنده + شمارش + مرتب‌سازی */}
        <div className="mb-4 space-y-3 rounded-2xl border border-[#1b39f5]/10 bg-white px-4 py-3 shadow-[0_18px_40px_-34px_rgba(27,57,245,0.5)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="relative min-w-[200px] flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute inset-y-0 start-3 my-auto h-4 w-4 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="جستجو در نتایج"
                placeholder="جستجو در نتایج…"
                className="h-9 w-full rounded-full border border-[#1b39f5]/12 bg-[#f8f9ff] ps-9 pe-3 text-[12.5px] font-semibold text-[#0a1b33] outline-none transition-colors placeholder:text-slate-400 focus:border-[#1b39f5]/40"
              />
            </span>

            <span className="text-[12px] text-slate-500">
              <span className="num">{num(visible.length)}</span> محصول یافت شد
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
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

          {/* بج‌های فیلتر فعال */}
          {activeBadges.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5 border-t border-[#1b39f5]/8 pt-3">
              {activeBadges.map((badge) => (
                <span
                  key={badge.key}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#1b39f5]/8 px-3 py-1 text-[11px] font-semibold text-[#1b39f5]"
                >
                  {badge.label}
                  <button
                    type="button"
                    onClick={badge.clear}
                    aria-label={`حذف فیلتر ${badge.label}`}
                    className="grid h-4 w-4 place-items-center rounded-full transition-colors hover:bg-[#1b39f5]/15"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-full px-3 py-1 text-[11px] font-bold text-[#E56458] transition-colors hover:bg-[#E56458]/8"
              >
                حذف همه
              </button>
            </div>
          ) : null}
        </div>

        {visible.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.4), ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <ProductCard product={product} />
              </motion.div>
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
