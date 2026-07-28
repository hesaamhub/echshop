import Link from "next/link"
import type { Product } from "@/lib/types"
import { bestDiscount } from "@/lib/collections"
import { lowestPrice } from "@/lib/data"
import { cn, num, toman } from "@/lib/utils"

/**
 * فهرست کوتاه محصولات برای منوی بازشونده.
 * meta مشخص می‌کند سمت چپ ردیف چه چیزی نشان داده شود.
 */
export default function ProductMiniList({
  items,
  meta = "price",
  onNavigate,
}: {
  items: Product[]
  meta?: "price" | "new" | "discount"
  onNavigate?: () => void
}) {
  return (
    <div className="space-y-0.5">
      {items.map((product) => {
        const discount = bestDiscount(product)

        return (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            onClick={onNavigate}
            className="group flex items-center gap-2.5 rounded-2xl px-2.5 py-2 transition-colors hover:bg-[#1b39f5]/6"
          >
            <span
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br",
                product.gradient,
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.logo}
                alt={product.title}
                className="h-4 w-4 object-contain brightness-0 invert"
              />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12px] font-semibold text-[#0a1b33] group-hover:text-[#1b39f5]">
                {product.title}
              </span>
              <span className="block text-[10px] text-slate-400">
                شروع قیمت از <span className="num">{toman(lowestPrice(product))}</span> تومان
              </span>
            </span>

            {meta === "new" ? (
              <span className="shrink-0 rounded-full bg-[#1b39f5]/8 px-2 py-0.5 text-[9.5px] font-bold text-[#1b39f5]">
                جدید
              </span>
            ) : null}

            {meta === "discount" && discount > 0 ? (
              <span className="num shrink-0 rounded-full bg-[#e8f7ef] px-2 py-0.5 text-[9.5px] font-bold text-[#137a4b]">
                {num(discount)}%
              </span>
            ) : null}
          </Link>
        )
      })}
    </div>
  )
}
