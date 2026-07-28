import Link from "next/link"
import { ChevronLeft, ShoppingBag, Trash2 } from "lucide-react"
import { cartCount, cartDiscount, cartLines, cartTotal } from "@/lib/cart"
import { deliveryLabels } from "@/lib/types"
import { num, toman } from "@/lib/utils"

export default function CartMenu({ onNavigate }: { onNavigate?: () => void }) {
  if (cartLines.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#1b39f5]/8 text-[#1b39f5]">
          <ShoppingBag className="h-5 w-5" />
        </span>
        <p className="mt-3 text-[12.5px] font-bold text-[#0a1b33]">سبد خرید شما خالی است</p>
        <Link
          href="/products"
          onClick={onNavigate}
          className="glass-solid mt-4 inline-flex rounded-full px-5 py-2 text-[12px] font-semibold"
        >
          دیدن محصولات
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {/* سربرگ */}
      <div className="flex items-center justify-between gap-2 border-b border-[#1b39f5]/10 px-2.5 pb-2.5 pt-1.5">
        <span className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-[14px] bg-gradient-to-br from-[#1b39f5] to-[#7d92ff] text-white shadow-[0_10px_22px_-14px_rgba(27,57,245,0.9)]">
            <ShoppingBag className="h-4 w-4" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[13px] font-bold text-[#0a1b33]">سبد خرید</span>
            <span className="text-[10.5px] text-slate-400">
              <span className="num">{num(cartCount)}</span> محصول در سبد
            </span>
          </span>
        </span>

        <Link
          href="/cart"
          onClick={onNavigate}
          className="rounded-full bg-[#1b39f5]/8 px-2.5 py-1.5 text-[10px] font-bold text-[#1b39f5] transition-colors hover:bg-[#1b39f5]/14"
        >
          ویرایش سبد
        </Link>
      </div>

      {/* قلم‌ها */}
      <div className="space-y-0.5 rounded-[20px] bg-[#f3f5fb] p-1">
        {cartLines.map((line) => (
          <div
            key={`${line.product.id}-${line.plan.id}`}
            className="group flex items-center gap-2.5 rounded-[16px] px-2.5 py-2 transition-all hover:bg-white hover:shadow-[0_12px_26px_-20px_rgba(10,27,51,0.75)]"
          >
            <span
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${line.product.gradient}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={line.product.logo}
                alt={line.product.brand}
                className="h-4 w-4 object-contain brightness-0 invert"
              />
            </span>

            <Link
              href={`/products/${line.product.slug}`}
              onClick={onNavigate}
              className="min-w-0 flex-1"
            >
              <span className="block truncate text-[12px] font-bold text-[#0a1b33] group-hover:text-[#1b39f5]">
                {line.product.title}
              </span>
              <span className="mt-0.5 flex items-center gap-1.5">
                <span className="truncate text-[10.5px] text-slate-400">{line.plan.title}</span>
                <span className="shrink-0 rounded-full bg-[#1b39f5]/8 px-1.5 py-0.5 text-[9px] font-bold text-[#1b39f5]">
                  {deliveryLabels[line.plan.delivery]}
                </span>
              </span>
            </Link>

            <span className="shrink-0 text-left">
              <span className="num block text-[12px] font-bold text-[#0a1b33]">
                {toman(line.plan.price * line.quantity)}
              </span>
              <span className="block text-[9.5px] text-slate-400">
                <span className="num">{num(line.quantity)}</span> × تومان
              </span>
            </span>

            <button
              type="button"
              aria-label="حذف"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-slate-300 transition-colors hover:bg-[#FDF1EF] hover:text-[#A8382C]"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* جمع کل */}
      <div className="rounded-[20px] bg-gradient-to-l from-[#1b39f5] to-[#4c63ff] px-3.5 py-3 text-white shadow-[0_18px_36px_-24px_rgba(27,57,245,0.95)]">
        <div className="flex items-center justify-between text-[11px] text-white/75">
          <span>تخفیف اعمال‌شده</span>
          <span className="num">{toman(cartDiscount)}</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[12px] font-semibold">مبلغ قابل پرداخت</span>
          <span className="text-[15px] font-bold">
            <span className="num">{toman(cartTotal)}</span>
            <span className="mr-1 text-[10px] font-medium text-white/75">تومان</span>
          </span>
        </div>
      </div>

      {/* دکمه‌ها */}
      <div className="flex gap-1.5 pt-0.5">
        <Link
          href="/checkout"
          onClick={onNavigate}
          className="glass-solid flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-[12px] font-semibold"
        >
          تکمیل خرید
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <Link
          href="/cart"
          onClick={onNavigate}
          className="glass-plate glass-plate-hover flex items-center justify-center rounded-full px-4 text-[12px] font-semibold text-[#1b39f5]"
        >
          سبد خرید
        </Link>
      </div>
    </div>
  )
}
