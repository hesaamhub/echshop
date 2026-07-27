import Link from "next/link"
import { Star } from "lucide-react"
import type { Product } from "@/lib/types"
import { deliveryLabels } from "@/lib/types"
import { discountPercent, toman } from "@/lib/utils"

type Props = { product: Product }

export default function ProductCard({ product }: Props) {
  const cheapest = product.plans.reduce((a, b) => (a.price <= b.price ? a : b))
  const off = discountPercent(cheapest.price, cheapest.compareAt)

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm transition-all hover:border-slate-300 hover:shadow-[0_18px_40px_-24px_rgba(10,27,51,0.25)]"
    >
      <div className={`relative h-36 bg-gradient-to-br ${product.gradient}`}>
        <div className="absolute inset-0 grid place-items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.logo}
            alt={product.brand}
            loading="lazy"
            className="h-10 w-auto max-w-[120px] object-contain brightness-0 invert opacity-95 transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        {product.badge ? (
          <span className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold text-[#0a1b33]">
            {product.badge}
          </span>
        ) : null}
        {off > 0 ? (
          <span className="absolute top-3 left-3 rounded-full bg-[#E56458] px-2.5 py-1 text-[10px] font-bold text-white">
            {toman(off)}٪ تخفیف
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[14px] font-bold leading-6 text-[#0a1b33]">{product.title}</h3>
        <p className="mt-2 line-clamp-2 text-[12px] leading-6 text-slate-500">{product.excerpt}</p>

        <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-[#EAC26B] text-[#EAC26B]" />
            <span className="num">{product.rating}</span>
          </span>
          <span>·</span>
          <span>
            <span className="num">{toman(product.sold)}</span> فروش
          </span>
        </div>

        <span className="mt-3 inline-flex w-fit rounded-full bg-[#E5F2FC] px-2.5 py-1 text-[10px] font-semibold text-[#1c5f9e]">
          {deliveryLabels[cheapest.delivery]}
        </span>

        <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
          <div>
            <span className="block text-[10px] text-slate-400">شروع قیمت از</span>
            <span className="text-[15px] font-bold text-[#0a1b33]">
              <span className="num">{toman(cheapest.price)}</span>
              <span className="mr-1 text-[11px] font-medium text-slate-500">تومان</span>
            </span>
          </div>
          {cheapest.compareAt ? (
            <span className="num text-[11px] text-slate-400 line-through">
              {toman(cheapest.compareAt)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  )
}
