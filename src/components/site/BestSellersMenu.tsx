import Link from "next/link"
import { bestSellers, lowestPrice } from "@/lib/data"
import { toman } from "@/lib/utils"

/** فهرست پرفروش‌ترین محصول‌ها برای منوی محصولات */
export default function BestSellersMenu({
  limit = 5,
  onNavigate,
}: {
  limit?: number
  onNavigate?: () => void
}) {
  return (
    <div className="space-y-0.5">
      {bestSellers(limit).map((product, index) => (
        <Link
          key={product.id}
          href={`/products/${product.slug}`}
          onClick={onNavigate}
          className="group flex items-center gap-2.5 rounded-2xl px-2.5 py-2 transition-colors hover:bg-[#1b39f5]/6"
        >
          <span
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${product.gradient}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.logo}
              alt={product.brand}
              className="h-4 w-4 object-contain brightness-0 invert"
            />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-semibold text-[#0a1b33] group-hover:text-[#1b39f5]">
              {product.title}
            </span>
            <span className="num block text-[10.5px] text-slate-400">
              از {toman(lowestPrice(product))}
            </span>
          </span>

          <span className="num grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#1b39f5]/8 text-[10px] font-bold text-[#1b39f5]">
            {index + 1}
          </span>
        </Link>
      ))}
    </div>
  )
}
