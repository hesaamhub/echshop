import Link from "next/link"
import { Star } from "lucide-react"
import type { Product } from "@/lib/types"
import { deliveryLabels } from "@/lib/types"
import { discountPercent } from "@/lib/utils"
import BrandIcon from "@/components/site/BrandIcon"

type Props = { product: Product }

/** اعداد همیشه لاتین نمایش داده می‌شوند */
function latin(value: number) {
  return value.toLocaleString("en-US")
}

export default function ProductCard({ product }: Props) {
  const cheapest = product.plans.reduce((a, b) => (a.price <= b.price ? a : b))
  const off = discountPercent(cheapest.price, cheapest.compareAt)

  return (
    <Link
      href={`/products/${product.slug}`}
      className={`group relative block overflow-hidden rounded-[30px] bg-gradient-to-br p-3 shadow-[0_26px_60px_-38px_rgba(10,27,51,0.75)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_34px_70px_-34px_rgba(10,27,51,0.7)] ${product.gradient}`}
    >
      {/* بافت تکرارشوندهٔ پس‌زمینه */}
      <span
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.85) 1.4px, transparent 1.4px)",
          backgroundSize: "18px 18px",
        }}
        aria-hidden
      />

      {/* نوار بالایی کارت */}
      <div className="relative mb-2.5 flex items-center justify-between px-2 pt-1">
        <span className="font-latin text-[10px] font-bold tracking-[0.16em] text-white/80 uppercase">
          {product.brand}
        </span>
        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-white/85">
          <Star className="h-3 w-3 fill-white text-white" />
          <span className="font-latin">{product.rating}</span>
        </span>
      </div>

      {/* کارت تیرهٔ داخلی */}
      <div className="relative rounded-[24px] bg-[#111218] p-2.5">
        {/* قاب تصویر محصول */}
        <div className={`relative h-44 overflow-hidden rounded-[18px] bg-gradient-to-br ${product.gradient}`}>
          <span
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1.6px, transparent 1.6px)",
              backgroundSize: "22px 22px",
            }}
            aria-hidden
          />
          <span className="pointer-events-none absolute -bottom-10 -left-8 h-32 w-32 rounded-full bg-white/25 blur-[46px]" aria-hidden />

          <div className="absolute inset-0 grid place-items-center">
            <BrandIcon
              slug={product.logo}
              size={62}
              color="#ffffff"
              className="drop-shadow-[0_14px_26px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* برچسب بالای تصویر */}
          {product.badge ? (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-[16px] bg-[#111218] px-2 pb-1.5">
              <span className="block rounded-full bg-white/15 px-3.5 py-1 text-[10.5px] font-bold text-white backdrop-blur-md">
                {product.badge}
              </span>
            </div>
          ) : null}

          {/* تخفیف */}
          {off > 0 ? (
            <span className="font-latin absolute top-3 right-3 rounded-lg bg-[#111218]/85 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md">
              {latin(off)}%
            </span>
          ) : null}

          {/* لوگوی شیشه‌ای */}
          <span className="absolute top-3 left-3 grid h-8 w-8 place-items-center rounded-[10px] border border-white/25 bg-white/15 backdrop-blur-md">
            <BrandIcon slug={product.logo} size={16} color="#ffffff" />
          </span>

          {/* قیمت */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-[16px] bg-[#111218] px-2.5 pt-1.5">
            <span className="block px-3 pb-0.5 text-[13px] font-bold text-white">
              <span className="font-latin">{latin(cheapest.price)}</span>
              <span className="mr-1 text-[10px] font-medium text-white/60">تومان</span>
            </span>
          </div>
        </div>

        {/* متن کارت */}
        <div className="px-2 pt-3.5">
          <h3 className="text-[15px] font-bold leading-6 text-white">{product.title}</h3>
          <p className="mt-1.5 line-clamp-1 text-[11.5px] leading-5 text-white/45">{product.excerpt}</p>

          <div className="mt-3 flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10">
              <BrandIcon slug={product.logo} size={12} color="#ffffff" />
            </span>
            <span className="font-latin text-[11px] font-semibold tracking-wide text-white/65 uppercase">
              {product.brand}
            </span>
          </div>

          {/* جعبهٔ اطلاعات */}
          <div className="mt-3 flex items-center justify-between rounded-[16px] bg-white/[0.06] px-3.5 py-2.5">
            <div>
              <span className="block text-[9.5px] text-white/40">نحوهٔ تحویل</span>
              <span className="mt-0.5 block text-[11px] font-semibold text-white/85">
                {deliveryLabels[cheapest.delivery]}
              </span>
            </div>
            <div className="text-left">
              <span className="block text-[9.5px] text-white/40">فروش</span>
              <span className="font-latin mt-0.5 block text-[11px] font-semibold text-white/85">
                {latin(product.sold)}
              </span>
            </div>
          </div>

          {cheapest.compareAt ? (
            <span className="font-latin mt-2.5 block text-[10.5px] text-white/35 line-through">
              {latin(cheapest.compareAt)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  )
}
