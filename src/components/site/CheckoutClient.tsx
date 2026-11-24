"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  Wallet,
  Zap,
} from "lucide-react"
import { useFirebase } from "@/components/providers/FirebaseProvider"
import { useCart } from "@/lib/cartStore"
import { createOrder } from "@/lib/firebase/repository"
import { useCatalog } from "@/lib/firebase/useCatalog"
import type { PaymentGatewayId } from "@/lib/payments/types"
import { toman } from "@/lib/utils"

type GatewayStatusMap = {
  tetrapay: {
    configured: boolean
    sandbox: boolean
  }
}

export default function CheckoutClient() {
  const { user, authReady, publicProfile, privateProfile, signInWithGoogle } = useFirebase()
  const { products, fromFirestore } = useCatalog()
  const { lines, subtotal, discount, total, appliedDiscount, clear } = useCart(products)

  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [confirmEmail, setConfirmEmail] = useState("")
  const [note, setNote] = useState("")
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayId>("tetrapay")
  const [gatewayStatus, setGatewayStatus] = useState<GatewayStatusMap | null>(null)
  const [acceptedTerms, setAcceptedTerms] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [gatewayNotice, setGatewayNotice] = useState("")
  const [createdOrders, setCreatedOrders] = useState<string[]>([])

  useEffect(() => {
    let active = true
    fetch("/api/payments/gateways", { cache:"no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data?.gateways) return
        setGatewayStatus({
          tetrapay: {
            configured: Boolean(data.gateways.tetrapay?.configured),
            sandbox: Boolean(data.gateways.tetrapay?.sandbox),
          },
        })
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

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
  }, [
    publicProfile?.displayName,
    privateProfile?.phone,
    privateProfile?.email,
    user?.email,
    customerName,
    customerPhone,
    customerEmail,
  ])

  async function handleCheckout() {
    setError("")
    setGatewayNotice("")
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
      setError(
        "کاتالوگ محصولات هنوز در دیتابیس ثبت نشده است. مدیر سایت باید از بخش مدیریت، مقداردهی اولیه دیتابیس را اجرا کند.",
      )
      return
    }

    setBusy(true)
    try {
      const orderNumbers: string[] = []
      const payableAmount = total || subtotal
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
          paymentMethod:"gateway",
        })
        orderNumbers.push(orderId)
      }

      const primaryOrderId = orderNumbers[0] || `ECH-${Date.now()}`
      const payRes = await fetch("/api/payments/create", {
        method:"POST",
        headers: {"Content-Type":"application/json" },
        credentials:"include",
        body: JSON.stringify({
          gateway: selectedGateway,
          orderId: primaryOrderId,
          amountToman: payableAmount,
          payerName: customerName.trim(),
          payerEmail: customerEmail.trim(),
          payerPhone: customerPhone.trim(),
          description:`خرید ${lines.map((l) => l.product.title).join("،").slice(0, 180)}`,
        }),
      })

      const payData = (await payRes.json().catch(() => ({}))) as {
        ok?: boolean
        code?: string
        paymentUrl?: string
        error?: string
      }

      clear()

      if (payRes.ok && payData.ok && payData.paymentUrl) {
        window.location.assign(payData.paymentUrl)
        return
      }

      setCreatedOrders(orderNumbers)
      if (payData.code === "GATEWAY_NOT_CONFIGURED") {
        setGatewayNotice(
          payData.error ||
            "سفارش شما ثبت شد؛ برای انتقال مستقیم به صفحهٔ پرداخت بانکی، کلید API درگاه انتخاب‌شده را در تنظیمات سرور وارد کنید.",
        )
      } else if (payData.error) {
        setGatewayNotice(
          `سفارش شما با موفقیت ثبت شد، اما اتصال به درگاه پرداخت برقرار نشد: ${payData.error}`,
        )
      }
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
        <h2 className="mt-4 font-display text-[20px] font-bold text-[#0a1b33]">
          سفارش شما ثبت شد
        </h2>
        <p className="mt-2 text-[12.5px] leading-7 text-slate-500">
          کد سفارش:{""}
          <span className="font-latin font-bold text-[#0a1b33]" dir="ltr">
            {createdOrders.join(" , ")}
          </span>
        </p>
        {gatewayNotice ? (
          <p className="mt-3 rounded-2xl border border-amber-400/30 bg-amber-50/90 px-4 py-3 text-[11.5px] leading-6 text-amber-800">
            {gatewayNotice}
          </p>
        ) : (
          <p className="mt-1 text-[12px] text-slate-400">
            وضعیت سفارش و اطلاعات تحویل در پنل کاربری قابل مشاهده است.
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard/orders" className="glass-solid rounded-full px-6 py-3 text-[13px] font-semibold">
            مشاهدهٔ سفارش‌ها
          </Link>
          <Link
            href="/products"
            className="glass-plate rounded-full px-6 py-3 text-[13px] font-semibold text-[#1b39f5]"
          >
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
        <h2 className="mt-4 font-display text-[18px] font-bold text-[#0a1b33]">
          سبد خرید خالی است
        </h2>
        <p className="mt-2 text-[12.5px] text-slate-500">
          ابتدا محصول مورد نظر خود را به سبد خرید اضافه کنید.
        </p>
        <Link href="/products" className="glass-solid mt-5 inline-flex rounded-full px-6 py-3 text-[13px] font-semibold">
          مشاهدهٔ محصولات
        </Link>
      </div>
    )
  }

  const selectedGatewayLabel ="پرداخت با درگاه تتراپی"

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        {authReady && !user ? (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#f2e2c6] bg-[#fdf8ef] p-4 sm:p-5">
            <div>
              <p className="text-[13px] font-bold text-[#9A6321]">
                برای ثبت سفارش وارد حساب کاربری شوید
              </p>
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

        <div className="rounded-3xl border border-[#1b39f5]/10 bg-white p-4 shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)] sm:p-6">
          <h2 className="flex items-center gap-2.5 text-[14px] font-bold text-[#0a1b33]">
            <span className="h-4 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
            اطلاعات خریدار
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field
              label="نام و نام خانوادگی"
              placeholder="مانند: سارا رضایی"
              value={customerName}
              onChange={setCustomerName}
            />
            <Field
              label="شماره موبایل"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              value={customerPhone}
              onChange={setCustomerPhone}
            />
            <Field
              label="ایمیل دریافت اکانت"
              placeholder="you@example.com"
              value={customerEmail}
              onChange={setCustomerEmail}
              latin
            />
            <Field
              label="تکرار ایمیل"
              placeholder="you@example.com"
              value={confirmEmail}
              onChange={setConfirmEmail}
              latin
            />
          </div>
          <label className="mt-4 block">
            <span className="text-[12px] font-semibold text-[#0a1b33]">
              یادداشت برای پشتیبانی (اختیاری)
            </span>
            <textarea
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="مانند: اشتراک را روی ایمیل دوم فعال کنید"
              className="mt-2 w-full rounded-2xl border border-[#1b39f5]/12 bg-[#1b39f5]/4 px-4 py-3 text-[12px] text-[#0a1b33] outline-none transition-all placeholder:text-slate-400 focus:border-[#1b39f5]/45 focus:bg-white focus:shadow-[0_0_0_4px_rgba(27,57,245,0.1)]"
            />
          </label>
        </div>

        <div
          data-testid="checkout-payment-gateways"
          className="rounded-3xl border border-[#1b39f5]/10 bg-white p-4 shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)] sm:p-6"
        >
          <h2 className="flex items-center gap-2.5 text-[14px] font-bold text-[#0a1b33]">
            <span className="h-4 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
            انتخاب درگاه پرداخت
          </h2>
          <div className="mt-4 space-y-3">
            {/* TetraPay Gateway */}
            <label
              data-testid="gateway-option-tetrapay"
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${
                selectedGateway === "tetrapay"
                  ? "border-[#1b39f5]/45 bg-[#1b39f5]/8"
                  : "border-slate-200/80 bg-white hover:border-[#1b39f5]/25"
              }`}
            >
              <input
                type="radio"
                name="paymentGateway"
                value="tetrapay"
                checked={selectedGateway === "tetrapay"}
                onChange={() => setSelectedGateway("tetrapay")}
                className="mt-1 h-4 w-4 accent-[#1b39f5]"
              />
              <span className="flex-1">
                <span className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-[12.5px] font-bold text-[#0a1b33]">
                    <Zap className="h-4 w-4 text-emerald-600" />
                    درگاه پرداخت تتراپی (TetraPay)
                  </span>
                  <span className="flex items-center gap-1.5">
                    {gatewayStatus?.tetrapay.sandbox ? (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                        سندباکس
                      </span>
                    ) : null}
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold ${
                        gatewayStatus?.tetrapay.configured
                          ? "bg-emerald-500/15 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {gatewayStatus?.tetrapay.configured ? "متصل (API v1)" : "آمادهٔ اتصال"}
                    </span>
                  </span>
                </span>
                <span className="mt-1.5 block text-[11.5px] leading-6 text-slate-600">
                  پرداخت آنلاین و کارت به کارت هوشمند با تایید خودکار سمت سرور و وب‌هوک امضاشده (تبدیل خودکار تومان به ریال).
                </span>
              </span>
            </label>

            {/* Wallet (informational) */}
            <div className="flex items-start gap-3 rounded-2xl border border-[#1b39f5]/10 bg-slate-50/70 p-4 opacity-70">
              <input type="radio" name="paymentGateway" disabled className="mt-1 h-4 w-4 accent-[#1b39f5]" />
              <span className="flex-1">
                <span className="flex items-center gap-2 text-[12.5px] font-bold text-[#0a1b33]">
                  <Wallet className="h-4 w-4 text-[#1b39f5]" /> کیف پول اچ‌شاپ
                </span>
                <span className="mt-1.5 block text-[11.5px] leading-6 text-slate-600">
                  موجودی فعلی: <span className="num">{toman(publicProfile?.walletBalance ?? 0)}</span> تومان
                </span>
              </span>
            </div>
          </div>

          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
            تمام تراکنش‌ها با تایید سرور به سرور (Verify) بررسی می‌شوند و هیچ کلیدی در مرورگر ذخیره نمی‌شود.
          </p>
        </div>
      </div>

      <aside className="h-fit rounded-3xl border border-[#1b39f5]/10 bg-white p-4 shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)] sm:p-6 lg:sticky lg:top-36">
        <h2 className="flex items-center gap-2.5 text-[14px] font-bold text-[#0a1b33]">
          <span className="h-4 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
          پرداخت نهایی
        </h2>
        <div className="mt-4 space-y-2 border-b border-slate-100 pb-3 text-[12px] text-slate-500">
          {lines.map((line) => (
            <div key={`${line.product.id}-${line.plan.id}`} className="flex justify-between gap-2">
              <span className="truncate">
                {line.product.title} ({line.quantity}×)
              </span>
              <span className="num shrink-0 font-semibold text-[#0a1b33]">
                {toman(line.plan.price * line.quantity)}
              </span>
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
          <p
            role="alert"
            className="mt-3 rounded-2xl bg-[#FDF1EF] px-3.5 py-2 text-[11.5px] font-semibold text-[#A8382C]"
          >
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => void handleCheckout()}
          disabled={busy || !user}
          className="glass-solid mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[13px] font-semibold disabled:opacity-50"
        >
          {busy ? "در حال اتصال به درگاه…" : selectedGatewayLabel}
          {!busy ? <ExternalLink className="h-3.5 w-3.5" /> : null}
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
        className="mt-2 w-full rounded-2xl border border-[#1b39f5]/12 bg-[#1b39f5]/4 px-4 py-3 text-[12px] text-[#0a1b33] outline-none transition-all placeholder:text-slate-400 focus:border-[#1b39f5]/45 focus:bg-white focus:shadow-[0_0_0_4px_rgba(27,57,245,0.1)]"
      />
    </label>
  )
}
