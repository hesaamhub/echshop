"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { ArrowLeft, Check, Heart, Minus, Plus, ShoppingCart, Sparkles, Zap } from "lucide-react"
import { useFirebase } from "@/components/providers/FirebaseProvider"
import { useCart } from "@/lib/cartStore"
import { toggleUserFavorite } from "@/lib/firebase/repository"
import type { Plan } from "@/lib/types"
import { deliveryLabels } from "@/lib/types"
import { cn, discountPercent, num, toman } from "@/lib/utils"

export default function PlanPicker({ productId, plans }: { productId: string; plans: Plan[] }) {
  const router = useRouter()
  const { add } = useCart()
  const { user, publicProfile, refreshProfile } = useFirebase()
  const [selectedId, setSelectedId] = useState(plans[0]?.id)
  const [quantity, setQuantity] = useState(1)
  const [favBusy, setFavBusy] = useState(false)

  const selected = plans.find((plan) => plan.id === selectedId) ?? plans[0]
  const off = discountPercent(selected.price, selected.compareAt)
  const unitSaving =
    selected.compareAt && selected.compareAt > selected.price
      ? selected.compareAt - selected.price
      : 0
  const totalPayable = selected.price * quantity
  const totalSaving = unitSaving * quantity
  const isFav = Boolean(publicProfile?.favorites?.includes(productId))

  function handleAddToCart(destination: "/cart" | "/checkout") {
    add(productId, selected.id, quantity)
    router.push(destination)
  }

  async function handleFavorite() {
    if (!user) {
      router.push("/login")
      return
    }
    setFavBusy(true)
    try {
      await toggleUserFavorite(user.uid, publicProfile?.favorites ?? [], productId)
      await refreshProfile()
    } finally {
      setFavBusy(false)
    }
  }

  return (
    <div
      data-testid="product-plan-picker"
      className="rounded-[24px] border border-[#1b39f5]/12 bg-white p-4 shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)] sm:rounded-[28px] sm:p-6"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-[13.5px] font-bold text-[#0a1b33] sm:text-[14.5px]">
          <span className="h-4 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
          انتخاب پلن و مدت اشتراک
        </h2>
        <button
          type="button"
          onClick={() => void handleFavorite()}
          disabled={favBusy}
          aria-label={isFav ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
          title={isFav ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
          className={cn(
            "grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors",
            isFav
              ? "border-[#E56458]/30 bg-[#FDF1EF] text-[#E56458]"
              : "border-slate-200 text-slate-400 hover:border-[#1b39f5]/30 hover:text-[#1b39f5]",
          )}
        >
          <Heart className={cn("h-4 w-4", isFav && "fill-current")} />
        </button>
      </div>

      <div className="mt-3.5 space-y-2 sm:mt-4 sm:space-y-2.5">
        {plans.map((plan) => {
          const active = plan.id === selected.id
          const planOff = discountPercent(plan.price, plan.compareAt)
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedId(plan.id)}
              aria-pressed={active}
              className={cn(
                "block w-full rounded-2xl border p-3 text-right transition-all sm:p-3.5",
                active
                  ? "border-[#1b39f5]/45 bg-[#1b39f5]/8 shadow-[0_14px_30px_-22px_rgba(27,57,245,0.75)]"
                  : "border-[#1b39f5]/10 bg-white hover:border-[#1b39f5]/25 hover:bg-[#1b39f5]/4",
              )}
            >
              <span className="flex items-start justify-between gap-2">
                <span className="flex min-w-0 flex-1 items-start gap-2 text-[12.5px] font-bold leading-5 text-[#0a1b33] sm:text-[13px]">
                  <span
                    className={cn(
                      "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                      active ? "border-[#1b39f5] bg-[#1b39f5]" : "border-slate-300",
                    )}
                  >
                    {active ? <Check className="h-2.5 w-2.5 text-white" /> : null}
                  </span>
                  <span className="min-w-0 break-words">{plan.title}</span>
                </span>
                {planOff > 0 ? (
                  <span className="num shrink-0 rounded-full bg-[#E56458]/12 px-2 py-0.5 text-[9.5px] font-extrabold text-[#C24539]">
                    {num(planOff)}٪ تخفیف
                  </span>
                ) : null}
              </span>

              <span className="mt-2 flex flex-wrap items-center justify-between gap-2 pr-6">
                <span className="inline-flex items-center gap-1 text-[10.5px] text-slate-500">
                  <Zap className="h-3 w-3 shrink-0 text-[#1b39f5]" />
                  {deliveryLabels[plan.delivery]}
                </span>
                <span className="flex items-baseline gap-1.5 text-left">
                  {plan.compareAt && plan.compareAt > plan.price ? (
                    <span className="num text-[10px] text-slate-400 line-through">
                      {toman(plan.compareAt)}
                    </span>
                  ) : null}
                  <span className="num text-[13.5px] font-extrabold text-[#1b39f5] sm:text-[14px]">
                    {toman(plan.price)}
                    <span className="mr-1 text-[10px] font-medium text-slate-500">تومان</span>
                  </span>
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* تعداد سفارش */}
      <div className="mt-3.5 flex items-center justify-between rounded-2xl border border-slate-100 bg-[#f8faff] px-3.5 py-2.5">
        <span className="text-[12px] font-semibold text-slate-600">تعداد</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="کاهش تعداد"
            className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 bg-white text-[#0a1b33] transition-colors hover:border-[#1b39f5]/40 disabled:opacity-40"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span data-testid="plan-quantity-value" className="num min-w-[20px] text-center text-[13px] font-bold text-[#0a1b33]">
            {num(quantity)}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            disabled={quantity >= 10}
            aria-label="افزایش تعداد"
            className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 bg-white text-[#0a1b33] transition-colors hover:border-[#1b39f5]/40 disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* خلاصه قیمت */}
      <div className="mt-3.5 rounded-2xl border border-[#1b39f5]/10 bg-[#1b39f5]/5 p-3.5 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-medium text-slate-500">مبلغ قابل پرداخت</span>
          <span data-testid="plan-total-price" className="text-[17px] font-extrabold text-[#0a1b33] sm:text-[18px]">
            <span className="num">{toman(totalPayable)}</span>
            <span className="mr-1 text-[11px] font-medium text-slate-500">تومان</span>
          </span>
        </div>
        {off > 0 && totalSaving > 0 ? (
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="inline-flex items-center gap-1 font-semibold text-[#2f7a55]">
              <Sparkles className="h-3 w-3" />
              سود شما از این انتخاب
            </span>
            <span className="num font-bold text-[#2f7a55]">{toman(totalSaving)} تومان</span>
          </div>
        ) : null}
      </div>

      <div className="mt-4 space-y-2">
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
          <button
            type="button"
            onClick={() => handleAddToCart("/cart")}
            className="glass-solid flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[13px] font-bold"
          >
            <ShoppingCart className="h-4 w-4" />
            افزودن به سبد خرید
          </button>
        </motion.div>

        <button
          type="button"
          onClick={() => handleAddToCart("/checkout")}
          className="flex w-full items-center justify-center gap-1.5 rounded-full border border-[#1b39f5]/20 bg-[#f4f7ff] py-3 text-[12px] font-bold text-[#1b39f5] transition-colors hover:bg-[#1b39f5]/10"
        >
          خرید مستقیم و پرداخت
          <ArrowLeft className="h-3.5 w-3.5" />
        </button>
      </div>

      <p className="mt-3 text-center text-[10.5px] leading-5 text-slate-400">
        پرداخت امن از طریق درگاه شتاب یا کیف پول اچ‌شاپ
      </p>
    </div>
  )
}
