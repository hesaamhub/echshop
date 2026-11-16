"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle2, CreditCard, ShoppingBag, Wallet } from "lucide-react"
import { useFirebase } from "@/components/providers/FirebaseProvider"
import { useCart } from "@/lib/cartStore"
import { createOrder } from "@/lib/firebase/repository"
import { useCatalog } from "@/lib/firebase/useCatalog"
import { toman } from "@/lib/utils"

export default function CheckoutClient() {
  const { user, authReady, publicProfile, privateProfile, signInWithGoogle } = useFirebase()
  const { products, fromFirestore } = useCatalog()
  const { lines, subtotal, discount, total, appliedDiscount, clear } = useCart(products)

  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [confirmEmail, setConfirmEmail] = useState("")
  const [note, setNote] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [createdOrders, setCreatedOrders] = useState<string[]>([])

  useEffect(() => {
    if (publicProfile?.displayName && !customerName) {
      setCustomerName(publicProfile.displayName)
    }
    if (privateProfile?.phone && !customerPhone) {
      setCustomerPhone(privateProfile.phone)
    }
    const email = privateProfile?.email || user?.email || ""
    if (email && !customerEmail) {
      setCustomerEmail(email)
      setConfirmEmail(email)
    }
  }, [publicProfile?.displayName, privateProfile?.phone, privateProfile?.email, user?.email, customerName, customerPhone, customerEmail])

  async function handleCheckout() {
    setError("")
    if (!user) {
      setError("برای ثبت سفارش ابتدا وارد حساب کاربری شوید.")
      return
    }
    if (lines.length === 0) {
      setError("سبد خرید شما خالی است.")
      return
    }
    if (!customerName.trim() || !customerEmail.trim()) {
      setError("نام و ایمیل دریافت اکانت را وارد کنید.")
      return
    }
    if (confirmEmail.trim().toLowerCase() !== customerEmail.trim().toLowerCase()) {
      setError("ایمیل و تکرار ایمیل یکسان نیستند.")
      return
    }
    if (!acceptedTerms) {
      setError("پذیرش قوانین و شرایط گارانتی الزامی است.")
      return
    }
    if (!fromFirestore) {
      setError("کاتالوگ محصولات هنوز در دیتابیس ثبت نشده است. مدیر سایت باید از بخش مدیریت، مقداردهی اولیه دیتابیس را اجرا کند.")
      return
    }

    setBusy(true)
    try {
      const orderNumbers: string[] = []
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const lineSubtotal = line.plan.price * line.quantity
        const lineDiscount = i === 0 ? Math.min(lineSubtotal, discount) : 0
        const orderId = await createOrder({
          userId: user.uid,
          customerName,
          customerEmail,
          customerPhone,
          productId: line.product.id,
          productTitle: line.product.title,
          planId: line.plan.id,
          planTitle: line.plan.title,
          delivery: line.plan.delivery,
          quantity: line.quantity,
          amount: Math.max(0, lineSubtotal - lineDiscount),
          discountAmount: lineDiscount,
          discountCode: appliedDiscount?.code ?? "",
          paymentMethod: "gateway",
        })
        orderNumbers.push(orderId)
      }
      clear()
      setCreatedOrders(orderNumbers)
    } catch (err) {
      const msg = err instanceof Error ? err.message : ""
      setError(
        msg.includes("permission-denied")
          ? "ثبت سفارش در سرور مجاز نشد. مطمئن شوید محصولات در دیتابیس مقداردهی شده‌اند."
          : "خطا در ثبت سفارش. دوباره تلاش کنید.",
      )
    } finally {
      setBusy(false)
    }
  }

  if (createdOrders.length > 0) {
    return (
      <div className="mx-auto max-w-lg rounded-[32px] border border-[#1b39f5]/12 bg-white p-8 text-center shadow-[0_22px_48px_-36px_rgba(27,57,245,0.5)]">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#E7F4EC] text-[#2F7A50]">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h2 className="mt-4 font-display text-[20px] font-bold text-[#0a1b33]">سفارش شما ثبت شد</h2>
        <p className="mt-2 text-[12.5px] leading-7 text-slate-500">
          کد سفارش:{" "}
          <span className="font-latin font-bold text-[#0a1b33]" dir="ltr">
            {createdOrders.join(" , ")}
          </span>
        </p>
        <p className="mt-1 text-[12px] text-slate-400">
          وضعیت سفارش و اطلاعات تحویل در پنل کاربری قابل مشاهده است.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard/orders" className="glass-solid rounded-full px-6 py-3 text-[13px] font-semibold">
            مشاهدهٔ سفارش‌ها
          </Link>
          <Link href="/products" className="glass-plate rounded-full px-6 py-3 text-[13px] font-semibold text-[#1b39f5]">
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    )
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-3xl border border-[#1b39f5]/10 bg-white p-12 text-center shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)]">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#1b39f5]/8 text-[#1b39f5]">
          <ShoppingBag className="h-6 w-6" />
        </span>
        <h2 className="mt-4 font-display text-[18px] font-bold text-[#0a1b33]">سبد خرید خالی است</h2>
        <p className="mt-2 text-[12.5px] text-slate-500">ابتدا محصول مورد نظر خود را به سبد خرید اضافه کنید.</p>
        <Link href="/products" className="glass-solid mt-5 inline-flex rounded-full px-6 py-3 text-[13px] font-semibold">
          مشاهدهٔ محصولات
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        {authReady && !user ? (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#f2e2c6] bg-[#fdf8ef] p-5">
            <div>
              <p className="text-[13px] font-bold text-[#9A6321]">برای ثبت سفارش وارد حساب کاربری شوید</p>
              <p className="mt-1 text-[11.5px] text-[#9A6321]/80">
                سفارش و اطلاعات اکانت تحویلی در حساب شما ذخیره می‌شود.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void signInWithGoogle()}
              className="glass-solid rounded-full px-5 py-2.5 text-[12px] font-semibold"
            >
              ورود با حساب گوگل
            </button>
          </div>
        ) : null}

        <div className="rounded-3xl border border-[#1b39f5]/10 bg-white p-6 shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)]">
          <h2 className="flex items-center gap-2.5 text-[14px] font-bold text-[#0a1b33]">
            <span className="h-4 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
            اطلاعات خریدار
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="نام و نام خانوادگی" placeholder="مانند: سارا رضایی" value={customerName} onChange={setCustomerName} />
            <Field label="شماره موبایل" placeholder="۰۹۱۲۳۴۵۶۷۸۹" value={customerPhone} onChange={setCustomerPhone} />
            <Field label="ایمیل دریافت اکانت" placeholder="you@example.com" value={customerEmail} onChange={setCustomerEmail} latin />
            <Field label="تکرار ایمیل" placeholder="you@example.com" value={confirmEmail} onChange={setConfirmEmail} latin />
          </div>
          <label className="mt-4 block">
            <span className="text-[12px] font-semibold text-[#0a1b33]">یادداشت برای پشتیبانی (اختیاری)</span>
            <textarea
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="مانند: اشتراک را روی ایمیل دوم فعال کنید"
              className="mt-2 w-full rounded-2xl border border-[#1b39f5]/12 bg-[#1b39f5]/4 px-4 py-3 text-[12px] outline-none transition-all focus:border-[#1b39f5]/45 focus:bg-white focus:shadow-[0_0_0_4px_rgba(27,57,245,0.1)]"
            />
          </label>
        </div>

        <div className="rounded-3xl border border-[#1b39f5]/10 bg-white p-6 shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)]">
          <h2 className="flex items-center gap-2.5 text-[14px] font-bold text-[#0a1b33]">
            <span className="h-4 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
            روش پرداخت
          </h2>
          <div className="mt-4 space-y-3">
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#1b39f5]/35 bg-[#1b39f5]/8 p-4">
              <input type="radio" name="pay" defaultChecked className="mt-1 h-4 w-4 accent-[#1b39f5]" />
              <span className="flex-1">
                <span className="flex items-center gap-2 text-[12.5px] font-bold text-[#0a1b33]">
                  <CreditCard className="h-4 w-4 text-[#1b39f5]" /> ثبت سفارش و پرداخت از درگاه
                </span>
                <span className="mt-1.5 block text-[11.5px] leading-6 text-slate-600">
                  سفارش با وضعیت «در انتظار تایید/پرداخت» ثبت می‌شود و از پنل مدیریت قابل تحویل است.
                </span>
              </span>
            </label>

            <div className="flex items-start gap-3 rounded-2xl border border-[#1b39f5]/10 bg-slate-50/70 p-4 opacity-70">
              <input type="radio" name="pay" disabled className="mt-1 h-4 w-4 accent-[#1b39f5]" />
              <span className="flex-1">
                <span className="flex items-center gap-2 text-[12.5px] font-bold text-[#0a1b33]">
                  <Wallet className="h-4 w-4 text-[#1b39f5]" /> کیف پول اچ‌شاپ
                </span>
                <span className="mt-1.5 block text-[11.5px] leading-6 text-slate-600">
                  موجودی فعلی: <span className="num">{toman(publicProfile?.walletBalance ?? 0)}</span> تومان (کسر خودکار پس از اتصال سرور پرداخت فعال می‌شود)
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <aside className="h-fit rounded-3xl border border-[#1b39f5]/10 bg-white p-6 shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)] lg:sticky lg:top-24">
        <h2 className="flex items-center gap-2.5 text-[14px] font-bold text-[#0a1b33]">
          <span className="h-4 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
          پرداخت نهایی
        </h2>
        <div className="mt-4 space-y-2 border-b border-slate-100 pb-3 text-[12px] text-slate-500">
          {lines.map((line) => (
            <div key={`${line.product.id}-${line.plan.id}`} className="flex justify-between gap-2">
              <span className="truncate">{line.product.title} ({line.quantity}×)</span>
              <span className="num shrink-0 font-semibold text-[#0a1b33]">{toman(line.plan.price * line.quantity)}</span>
            </div>
          ))}
        </div>
        {discount > 0 ? (
          <div className="mt-3 flex items-center justify-between text-[12px] text-[#46A171]">
            <span>تخفیف ({appliedDiscount?.code})</span>
            <span className="num">−{toman(discount)} تومان</span>
          </div>
        ) : null}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[12.5px] text-slate-500">مبلغ قابل پرداخت</span>
          <span className="text-[17px] font-bold text-[#0a1b33]">
            <span className="num">{toman(total || subtotal)}</span>
            <span className="mr-1 text-[11px] font-medium text-slate-500">تومان</span>
          </span>
        </div>
        <label className="mt-5 flex items-start gap-2 text-[11.5px] leading-6 text-slate-500">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
            className="mt-1 h-4 w-4 accent-[#1b39f5]"
          />
          <span>قوانین و مقررات و شرایط گارانتی را می‌پذیرم.</span>
        </label>

        {error ? (
          <p role="alert" className="mt-3 rounded-2xl bg-[#FDF1EF] px-3.5 py-2 text-[11.5px] font-semibold text-[#A8382C]">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => void handleCheckout()}
          disabled={busy || !user}
          className="glass-solid mt-5 w-full rounded-full py-3.5 text-[13px] font-semibold disabled:opacity-50"
        >
          {busy ? "در حال ثبت سفارش…" : "ثبت سفارش"}
        </button>
        <Link
          href="/cart"
          className="mt-3 block text-center text-[11.5px] text-slate-400 transition-colors hover:text-[#1b39f5]"
        >
          بازگشت به سبد خرید
        </Link>
      </aside>
    </div>
  )
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  latin,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (val: string) => void
  latin?: boolean
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold text-[#0a1b33]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        dir={latin ? "ltr" : undefined}
        className="mt-2 w-full rounded-2xl border border-[#1b39f5]/12 bg-[#1b39f5]/4 px-4 py-3 text-[12px] outline-none transition-all focus:border-[#1b39f5]/45 focus:bg-white focus:shadow-[0_0_0_4px_rgba(27,57,245,0.1)]"
      />
    </label>
  )
}
