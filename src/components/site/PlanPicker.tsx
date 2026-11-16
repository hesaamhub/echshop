"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { Check, Heart, ShoppingCart, Zap } from "lucide-react"
import { useFirebase } from "@/components/providers/FirebaseProvider"
import { useCart } from "@/lib/cartStore"
import { toggleUserFavorite } from "@/lib/firebase/repository"
import type { Plan } from "@/lib/types"
import { deliveryLabels } from "@/lib/types"
import { cn, discountPercent, toman } from "@/lib/utils"

export default function PlanPicker({ productId, plans }: { productId: string; plans: Plan[] }) {
  const router = useRouter()
  const { add } = useCart()
  const { user, publicProfile, refreshProfile } = useFirebase()
  const [selectedId, setSelectedId] = useState(plans[0]?.id)
  const [favBusy, setFavBusy] = useState(false)

  const selected = plans.find((plan) => plan.id === selectedId) ?? plans[0]
  const off = discountPercent(selected.price, selected.compareAt)
  const isFav = Boolean(publicProfile?.favorites?.includes(productId))

  function handleAddToCart() {
    add(productId, selected.id, 1)
    router.push("/cart")
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
    <div className="rounded-3xl border border-[#1b39f5]/10 bg-white p-6 shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)]">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2.5 text-[14px] font-bold text-[#0a1b33]">
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
            "grid h-8 w-8 place-items-center rounded-full border transition-colors",
            isFav
              ? "border-[#E56458]/30 bg-[#FDF1EF] text-[#E56458]"
              : "border-slate-200 text-slate-400 hover:border-[#1b39f5]/30 hover:text-[#1b39f5]",
          )}
        >
          <Heart className={cn("h-4 w-4", isFav && "fill-current")} />
        </button>
      </div>

      <div className="mt-4 space-y-2.5">
        {plans.map((plan) => {
          const active = plan.id === selected.id
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedId(plan.id)}
              className={cn(
                "w-full rounded-2xl border p-4 text-right transition-all",
                active
                  ? "border-[#1b39f5]/40 bg-[#1b39f5]/8 shadow-[0_14px_30px_-22px_rgba(27,57,245,0.7)]"
                  : "border-[#1b39f5]/10 bg-white hover:border-[#1b39f5]/25 hover:bg-[#1b39f5]/4",
              )}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-[12.5px] font-semibold text-[#0a1b33]">
                  <span
                    className={cn(
                      "grid h-4 w-4 place-items-center rounded-full border",
                      active ? "border-[#1b39f5] bg-[#1b39f5]" : "border-slate-300",
                    )}
                  >
                    {active ? <Check className="h-2.5 w-2.5 text-white" /> : null}
                  </span>
                  {plan.title}
                </span>
                <span className="num shrink-0 text-[13px] font-bold text-[#0a1b33]">
                  {toman(plan.price)}
                </span>
              </span>
              <span className="mt-2 flex items-center gap-1.5 pr-6 text-[10.5px] text-slate-500">
                <Zap className="h-3 w-3 text-[#1b39f5]" />
                {deliveryLabels[plan.delivery]}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-[#1b39f5]/10 bg-[#1b39f5]/5 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-slate-500">مبلغ قابل پرداخت</span>
          <span className="text-[18px] font-bold text-[#0a1b33]">
            <span className="num">{toman(selected.price)}</span>
            <span className="mr-1 text-[11px] font-medium text-slate-500">تومان</span>
          </span>
        </div>
        {off > 0 ? (
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">قیمت پیش از تخفیف</span>
            <span className="num text-slate-400 line-through">{toman(selected.compareAt!)}</span>
          </div>
        ) : null}
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-4">
        <button
          type="button"
          onClick={handleAddToCart}
          className="glass-solid flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[13px] font-semibold"
        >
          <ShoppingCart className="h-4 w-4" />
          افزودن به سبد خرید
        </button>
      </motion.div>

      <p className="mt-3 text-center text-[10.5px] text-slate-400">
        پرداخت امن از طریق درگاه رسمی یا کیف پول اچ‌شاپ
      </p>
    </div>
  )
}
