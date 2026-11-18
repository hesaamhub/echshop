import Link from "next/link"
import { ArrowLeft, Star, Zap } from "lucide-react"
import type { Product } from "@/lib/types"
import { deliveryLabels } from "@/lib/types"
import { discountPercent, num } from "@/lib/utils"
import ProductPoster, { brandTone } from "@/components/site/ProductPoster"

type Props = { product: Product }

export default function ProductCard({ product }: Props) {
  const cheapest = product.plans.reduce((a, b) => (a.price <= b.price ? a : b))
  const off = discountPercent(cheapest.price, cheapest.compareAt)
  const saving = cheapest.compareAt ? cheapest.compareAt - cheapest.price : 0
  const tone = brandTone(product.logo)

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-white/10 bg-[#0f1017] p-2 shadow-[0_22px_50px_-34px_rgba(10,27,51,0.7)] transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_32px_64px_-32px_rgba(10,27,51,0.65)] sm:rounded-[22px] sm:p-2.5"
    >
      {/* قاب پوستر محصول */}
      <div className="relative h-[120px] overflow-hidden rounded-[13px] sm:h-[168px] sm:rounded-[16px]">
        <ProductPoster slug={product.logo} brand={product.brand} />

        {/* برچسب محصول */}
        {product.badge ? (
          <span
            className="absolute top-2 left-2 z-10 rounded-full px-2 py-0.5 text-[9px] font-bold text-white shadow-[0_10px_20px_-12px_rgba(0,0,0,0.95)] sm:top-2.5 sm:left-2.5 sm:px-3 sm:py-1 sm:text-[10px]"
            style={{ background: tone }}
          >
            {product.badge}
          </span>
        ) : null}

        {/* نشان تخفیف — محرک خرید */}
        {off > 0 ? (
          <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-1 sm:top-2.5 sm:right-2.5">
            <span className="flex items-center gap-0.5 rounded-lg bg-gradient-to-b from-[#ff5f43] to-[#e5232a] px-1.5 py-1 text-[9.5px] font-extrabold text-white shadow-[0_10px_22px_-10px_rgba(229,35,42,0.95)] sm:gap-1 sm:rounded-xl sm:px-2.5 sm:py-1.5 sm:text-[11px]">
              <Zap className="h-2.5 w-2.5 fill-white sm:h-3 sm:w-3" />
              <span className="font-latin">{num(off)}%</span>
              <span className="hidden text-[9.5px] font-bold sm:inline">تخفیف</span>
            </span>
            {saving > 0 ? (
              <span className="hidden rounded-lg bg-black/55 px-2 py-[3px] text-[9px] font-bold text-white/90 backdrop-blur-md sm:block">
                <span className="font-latin">{num(saving)}</span> تومان ارزان‌تر
              </span>
            ) : null}
          </div>
        ) : null}

        {/* قیمت — گوشهٔ پایین قاب، بدون ارتفاع اضافی */}
        <div className="absolute right-0 bottom-0 z-10 rounded-tl-[13px] bg-[#0f1017] pt-1 pl-1 sm:rounded-tl-[16px] sm:pt-1.5 sm:pl-1.5">
          <span className="block rounded-[10px] bg-white/[0.08] px-2 py-1 text-[11px] font-bold text-white sm:rounded-[12px] sm:px-3 sm:py-1.5 sm:text-[13px]">
            <span className="font-latin">{num(cheapest.price)}</span>
            <span className="mr-0.5 text-[8.5px] font-medium text-white/50 sm:mr-1 sm:text-[9.5px]">تومان</span>
          </span>
        </div>
      </div>

      {/* متن کارت */}
      <div className="flex flex-1 flex-col px-1 pt-2.5 pb-1 sm:px-2.5 sm:pt-3.5 sm:pb-1.5">
        <div className="flex items-start justify-between gap-1.5 sm:gap-2">
          <h3 className="line-clamp-1 text-[11.5px] leading-5 font-bold text-white sm:text-[13.5px] sm:leading-6">{product.title}</h3>
          <span className="mt-0.5 inline-flex shrink-0 items-center gap-0.5 rounded-md bg-white/[0.07] px-1.5 py-0.5 text-[9.5px] font-bold text-white/80 sm:gap-1 sm:rounded-lg sm:px-2 sm:py-1 sm:text-[10.5px]">
            <Star className="h-2.5 w-2.5 fill-[#EAC26B] text-[#EAC26B] sm:h-3 sm:w-3" />
            <span className="font-latin">{product.rating}</span>
          </span>
        </div>

        <p className="mt-1.5 hidden min-h-[34px] text-[11.5px] leading-5 text-white/40 sm:line-clamp-2">
          {product.excerpt}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:mt-3">
          <span
            className="rounded-md px-2 py-0.5 text-[9.5px] font-semibold text-white sm:rounded-lg sm:px-2.5 sm:py-1 sm:text-[10px]"
            style={{ background: `${tone}26` }}
          >
            {deliveryLabels[cheapest.delivery]}
          </span>
          <span className="hidden rounded-lg bg-white/[0.06] px-2.5 py-1 text-[10px] font-semibold text-white/55 sm:inline-block">
            <span className="font-latin">{num(product.sold)}</span> فروش
          </span>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-white/8 pt-2.5 sm:mt-auto sm:pt-3">
          {cheapest.compareAt ? (
            <span className="hidden items-baseline gap-1.5 sm:flex">
              <span className="text-[9.5px] font-medium text-white/35">قیمت پیشین</span>
              <span className="font-latin text-[11px] text-white/30 line-through">
                {num(cheapest.compareAt)}
              </span>
            </span>
          ) : (
            <span className="hidden text-[10px] font-medium text-white/35 sm:inline">کمترین قیمت پلان‌ها</span>
          )}
          <span
            className="inline-flex w-full shrink-0 items-center justify-center gap-1 rounded-lg px-2.5 py-1.5 text-[10.5px] font-bold text-white transition-transform duration-500 group-hover:-translate-x-0.5 sm:w-auto sm:gap-1.5 sm:rounded-xl sm:px-3 sm:text-[11px]"
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
