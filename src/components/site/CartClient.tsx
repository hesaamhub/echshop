"use client"

import { useState } from "react"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react"
import BrandIcon from "@/components/site/BrandIcon"
import { useFirebase } from "@/components/providers/FirebaseProvider"
import { useCart } from "@/lib/cartStore"
import { lookupDiscount } from "@/lib/firebase/repository"
import { useCatalog } from "@/lib/firebase/useCatalog"
import { computeDiscountAmount } from "@/lib/firebase/validators"
import { deliveryLabels } from "@/lib/types"
import { num, toman } from "@/lib/utils"

export default function CartClient() {
  const { user } = useFirebase()
  const { products } = useCatalog()
  const { lines, subtotal, discount, total, appliedDiscount, updateQty, remove, applyDiscount } =
    useCart(products)
  const [codeInput, setCodeInput] = useState(appliedDiscount?.code ?? "")
  const [discountMsg, setDiscountMsg] = useState("")
  const [discountError, setDiscountError] = useState("")
  const [checkingCode, setCheckingCode] = useState(false)

  async function handleApplyDiscount() {
    setDiscountMsg("")
    setDiscountError("")
    const clean = codeInput.trim().toUpperCase()
    if (!clean) {
      setDiscountError("کد تخفیف را وارد کنید.")
      return
    }
    if (!user) {
      setDiscountError("برای بررسی کد تخفیف، ابتدا وارد حساب کاربری شوید.")
      return
    }
    setCheckingCode(true)
    try {
      const found = await lookupDiscount(clean)
      if (!found || !found.isActive) {
        setDiscountError("کد تخفیف معتبر نیست یا منقضی شده است.")
        return
      }
      const computed = computeDiscountAmount(subtotal, found)
      if (computed <= 0) {
        setDiscountError(`حداقل مبلغ سبد برای این کد ${toman(found.minOrder)} تومان است.`)
        return
      }
      applyDiscount({
        code: found.code,
        type: found.type,
        value: found.value,
        minOrder: found.minOrder,
      })
      setDiscountMsg(`کد ${found.code} با موفقیت اعمال شد (${toman(computed)} تومان تخفیف).`)
    } catch {
      setDiscountError("بررسی کد تخفیف ممکن نشد. دوباره تلاش کنید.")
    } finally {
      setCheckingCode(false)
    }
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-3xl border border-[#1b39f5]/10 bg-white p-12 text-center shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)]">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#1b39f5]/8 text-[#1b39f5]">
          <ShoppingBag className="h-6 w-6" />
        </span>
        <h2 className="mt-4 font-display text-[18px] font-bold text-[#0a1b33]">سبد خرید شما خالی است</h2>
        <p className="mt-2 text-[12.5px] text-slate-500">
          محصول و پلن دلخواه خود را انتخاب کنید تا در این بخش نمایش داده شود.
        </p>
        <Link
          href="/products"
          className="glass-solid mt-5 inline-flex rounded-full px-6 py-3 text-[13px] font-semibold"
        >
          مشاهدهٔ محصولات
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-3">
        {lines.map((line) => (
          <div
            key={`${line.product.id}-${line.plan.id}`}
            className="flex flex-wrap items-center gap-3 rounded-3xl border border-[#1b39f5]/10 bg-white p-4 shadow-[0_18px_40px_-34px_rgba(27,57,245,0.5)] sm:gap-4 sm:p-5"
          >
            <div
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br sm:h-16 sm:w-16 ${line.product.gradient}`}
            >
              <BrandIcon slug={line.product.logo} size={24} color="#ffffff" />
            </div>

            <div className="min-w-0 flex-1 basis-[140px]">
              <Link
                href={`/products/${line.product.slug}`}
                className="block truncate text-[13px] font-bold text-[#0a1b33] transition-colors hover:text-[#1b39f5] sm:text-[13.5px]"
              >
                {line.product.title}
              </Link>
              <p className="mt-1 truncate text-[11px] text-slate-500 sm:mt-1.5 sm:text-[11.5px]">{line.plan.title}</p>
              <span className="mt-1.5 inline-flex rounded-full bg-[#1b39f5]/8 px-2.5 py-0.5 text-[10px] font-semibold text-[#1b39f5] sm:mt-2 sm:py-1">
                {deliveryLabels[line.plan.delivery]}
              </span>
            </div>

            <div className="glass-plate flex items-center gap-1 rounded-full p-1">
              <button
                type="button"
                aria-label={`افزایش تعداد ${line.product.title}`}
                onClick={() => updateQty(line.product.id, line.plan.id, line.quantity + 1)}
                className="grid h-7 w-7 place-items-center rounded-full transition-colors hover:bg-white/70"
              >
                <Plus className="h-3.5 w-3.5 text-[#1b39f5]" />
              </button>
              <span className="num w-7 text-center text-[12px] font-bold text-[#0a1b33] sm:w-8">
                {num(line.quantity)}
              </span>
              <button
                type="button"
                aria-label={`کاهش تعداد ${line.product.title}`}
                onClick={() => updateQty(line.product.id, line.plan.id, line.quantity - 1)}
                className="grid h-7 w-7 place-items-center rounded-full transition-colors hover:bg-white/70"
              >
                <Minus className="h-3.5 w-3.5 text-[#1b39f5]" />
              </button>
            </div>

            <div className="min-w-[84px] text-left sm:w-28">
              <span className="num text-[13px] font-bold text-[#0a1b33] sm:text-[13.5px]">
                {toman(line.plan.price * line.quantity)}
              </span>
              <span className="block text-[10px] text-slate-400">تومان</span>
            </div>

            <button
              type="button"
              onClick={() => remove(line.product.id, line.plan.id)}
              className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-[#E56458]"
              aria-label={`حذف ${line.product.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        <div className="rounded-3xl border border-[#1b39f5]/10 bg-white p-4 shadow-[0_18px_40px_-34px_rgba(27,57,245,0.5)] sm:p-5">
          <label className="block text-[12.5px] font-bold text-[#0a1b33]">کد تخفیف</label>
          <div className="mt-3 flex gap-2">
            <input
              value={codeInput}
              onChange={(event) => setCodeInput(event.target.value)}
              placeholder="کد تخفیف (مثلاً ECH20)"
              dir="ltr"
              className="font-latin min-w-0 flex-1 rounded-full border border-[#1b39f5]/12 bg-[#1b39f5]/4 px-3.5 py-2.5 text-right text-[12px] outline-none transition-all focus:border-[#1b39f5]/45 focus:bg-white focus:shadow-[0_0_0_4px_rgba(27,57,245,0.1)] sm:px-4"
            />
            <button
              type="button"
              onClick={() => void handleApplyDiscount()}
              disabled={checkingCode}
              className="glass-solid shrink-0 rounded-full px-4 text-[12px] font-semibold disabled:opacity-60 sm:px-6"
            >
              {checkingCode ? "بررسی…" : "اعمال"}
            </button>
            {appliedDiscount ? (
              <button
                type="button"
                aria-label="حذف کد تخفیف"
                onClick={() => {
                  applyDiscount(null)
                  setCodeInput("")
                  setDiscountMsg("")
                }}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-[#A8382C]"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
          {discountMsg ? (
            <p className="mt-2.5 text-[11.5px] font-semibold text-[#2F7A50]">{discountMsg}</p>
          ) : null}
          {discountError ? (
            <p className="mt-2.5 text-[11.5px] font-semibold text-[#A8382C]">{discountError}</p>
          ) : null}
        </div>
      </div>

      <aside className="h-fit rounded-3xl border border-[#1b39f5]/10 bg-white p-6 shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)] lg:sticky lg:top-24">
        <h2 className="flex items-center gap-2.5 text-[14px] font-bold text-[#0a1b33]">
          <span className="h-4 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
          خلاصهٔ سفارش
        </h2>
        <dl className="mt-4 space-y-3 text-[12.5px]">
          <Row label="جمع محصولات" value={`${toman(subtotal)} تومان`} />
          <Row label="تخفیف" value={`${toman(discount)} تومان`} accent />
          <Row label="کارمزد" value={`${num(0)} تومان`} />
        </dl>
        <div className="mt-5 flex items-center justify-between border-t border-[#1b39f5]/10 pt-4">
          <span className="text-[12.5px] font-bold text-[#0a1b33]">مبلغ نهایی</span>
          <span className="text-[17px] font-bold text-[#0a1b33]">
            <span className="num">{toman(total)}</span>
            <span className="mr-1 text-[11px] font-medium text-slate-500">تومان</span>
          </span>
        </div>
        <Link
          href="/checkout"
          className="glass-solid mt-5 block rounded-full py-3.5 text-center text-[13px] font-semibold"
        >
          ادامهٔ فرایند خرید
        </Link>
        <Link
          href="/products"
          className="glass-plate glass-plate-hover mt-3 block rounded-full py-3 text-center text-[12px] font-semibold text-[#1b39f5]"
        >
          ادامهٔ خرید
        </Link>
      </aside>
    </div>
  )
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className={accent ? "num font-semibold text-[#46A171]" : "num text-[#0a1b33]"}>{value}</dd>
    </div>
  )
}
