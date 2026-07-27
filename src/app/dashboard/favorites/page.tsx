import Link from "next/link"
import { Heart, Trash2 } from "lucide-react"
import { Button, Card } from "@/components/panel/Ui"
import { products } from "@/lib/data"
import { lowestPrice, toman } from "@/lib/utils"

export default function FavoritesPage() {
  const favorites = [products[1], products[2], products[5]]

  return (
    <div className="space-y-4">
      <Card title="علاقه‌مندی‌های من">
        <div className="space-y-3">
          {favorites.map((product) => (
            <div
              key={product.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200/70 p-4"
            >
              <div
                className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${product.gradient}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.logo}
                  alt={product.brand}
                  className="h-5 w-auto max-w-[40px] object-contain brightness-0 invert"
                />
              </div>

              <div className="min-w-[160px] flex-1">
                <Link
                  href={`/products/${product.slug}`}
                  className="text-[13px] font-bold text-[#0a1b33] hover:text-[#2783de]"
                >
                  {product.title}
                </Link>
                <p className="mt-1 text-[11.5px] text-slate-500">
                  شروع از <span className="num">{toman(lowestPrice(product))}</span> تومان
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/products/${product.slug}`}
                  className="rounded-full bg-[#0a152d] px-5 py-2.5 text-[11.5px] font-semibold text-white"
                >
                  خرید
                </Link>
                <button
                  type="button"
                  className="grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-red-50 hover:text-[#E56458]"
                  aria-label="حذف از علاقه‌مندی‌ها"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#FCEAE8] text-[#A8382C]">
              <Heart className="h-4 w-4" />
            </span>
            <p className="text-[12px] leading-6 text-slate-600">
              برای محصولات علاقه‌مندی خود اطلاع‌رسانی تخفیف فعال کنید.
            </p>
          </div>
          <Button variant="ghost">فعال‌سازی اطلاع‌رسانی</Button>
        </div>
      </Card>
    </div>
  )
}
