import Link from "next/link"
import { ArrowLeft, Star } from "lucide-react"
import type { Product } from "@/lib/types"
import { deliveryLabels } from "@/lib/types"
import { discountPercent } from "@/lib/utils"
import ProductPoster, { brandTone } from "@/components/site/ProductPoster"

type Props = { product: Product }

/** اعداد همیشه لاتین نمایش داده می‌شوند */
function latin(value: number) {
  return value.toLocaleString("en-US")
}

export default function ProductCard({ product }: Props) {
  const cheapest = product.plans.reduce((a, b) => (a.price <= b.price ? a : b))
  const off = discountPercent(cheapest.price, cheapest.compareAt)
  const tone = brandTone(product.logo)

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[26px] border border-white/8 bg-[#0f1017] p-2.5 shadow-[0_22px_50px_-34px_rgba(10,27,51,0.7)] transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_32px_64px_-32px_rgba(10,27,51,0.65)]"
    >
      {/* قاب پوستر محصول */}
      <div className="relative h-[188px] overflow-hidden rounded-[19px]">
        <ProductPoster slug={product.logo} brand={product.brand} />

        {/* برچسب بالای پوستر */}
        {product.badge ? (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-[15px] bg-[#0f1017] px-1.5 pb-1.5">
            <span
              className="block rounded-full px-3.5 py-1 text-[10px] font-bold text-white"
              style={{ background: tone }}
            >
              {product.badge}
            </span>
          </div>
        ) : null}

        {/* درصد تخفیف */}
        {off > 0 ? (
          <span className="font-latin absolute top-3 right-3 rounded-lg bg-black/55 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md">
            {latin(off)}%
          </span>
        ) : null}

        {/* قیمت */}
        <div className="absolute bottom-0 right-0 rounded-tl-[15px] bg-[#0f1017] pt-1.5 pl-1.5">
          <span className="block rounded-xl bg-white/[0.07] px-3 py-1.5 text-[13px] font-bold text-white">
            <span className="font-latin">{latin(cheapest.price)}</span>
            <span className="mr-1 text-[9.5px] font-medium text-white/50">تومان</span>
          </span>
        </div>
      </div>

      {/* متن کارت */}
      <div className="flex flex-1 flex-col px-2.5 pt-3.5 pb-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[14.5px] font-bold leading-6 text-white">{product.title}</h3>
          <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-lg bg-white/[0.07] px-2 py-1 text-[10.5px] font-bold text-white/80">
            <Star className="h-3 w-3 fill-[#EAC26B] text-[#EAC26B]" />
            <span className="font-latin">{product.rating}</span>
          </span>
        </div>

        <p className="mt-1.5 line-clamp-2 min-h-[34px] text-[11.5px] leading-5 text-white/40">
          {product.excerpt}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span
            className="rounded-lg px-2.5 py-1 text-[10px] font-semibold"
            style={{ background: `${tone}26`, color: "#ffffff" }}
          >
            {deliveryLabels[cheapest.delivery]}
          </span>
          <span className="rounded-lg bg-white/[0.06] px-2.5 py-1 text-[10px] font-semibold text-white/55">
            <span className="font-latin">{latin(product.sold)}</span> فروش
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3">
          <div className="flex items-baseline gap-2">
            {cheapest.compareAt ? (
              <span className="font-latin text-[11px] text-white/30 line-through">
                {latin(cheapest.compareAt)}
              </span>
            ) : (
              <span className="text-[10.5px] text-white/35">شروع قیمت</span>
            )}
          </div>
          <span
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold text-white transition-transform duration-500 group-hover:-translate-x-0.5"
            style={{ background: tone }}
          >
            خرید و فعال‌سازی
            <ArrowLeft className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}
