import Link from "next/link"
import { CheckCircle2, Clock, CreditCard, ShieldCheck, XCircle } from "lucide-react"
import Footer from "@/components/site/Footer"
import Header from "@/components/site/Header"
import { toman } from "@/lib/utils"

type SearchParams = Promise<{
  gateway?: string
  status?: string
  orderId?: string
  refId?: string
  amount?: string
  method?: string
  card?: string
  reason?: string
}>

export default async function CheckoutResultPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const status = params.status || "failed"
  const orderId = params.orderId || ""
  const refId = params.refId || ""
  const amount = Math.round(Number(params.amount || 0) || 0)
  const method = params.method || ""
  const card = params.card || ""
  const reason = params.reason || ""

  const gatewayTitle ="درگاه پرداخت تتراپی (TetraPay)"

  const isPaid = status === "paid"
  const isPending = status === "pending"
  const isExpired = status === "expired"

  return (
    <div className="min-h-screen bg-[#f6f8ff]">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
        <div
          data-testid="payment-result-card"
          className="rounded-[32px] border border-[#1b39f5]/12 bg-white p-6 text-center shadow-[0_24px_56px_-36px_rgba(27,57,245,0.45)] sm:p-10"
        >
          <span
            className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${
              isPaid
                ? "bg-emerald-500/15 text-emerald-600"
                : isPending
                  ? "bg-amber-500/15 text-amber-600"
                  : "bg-rose-500/15 text-rose-600"
            }`}
          >
            {isPaid ? (
              <CheckCircle2 className="h-8 w-8" />
            ) : isPending ? (
              <Clock className="h-8 w-8" />
            ) : (
              <XCircle className="h-8 w-8" />
            )}
          </span>

          <h1 className="mt-5 font-display text-[22px] font-bold text-[#0a1b33]">
            {isPaid
              ? "پرداخت شما با موفقیت تایید شد"
              : isPending
                ? "پرداخت در حال بررسی است"
                : isExpired
                  ? "مهلت پرداخت به پایان رسید"
                  : "پرداخت ناموفق بود"}
          </h1>

          <p className="mt-2 text-[13px] leading-7 text-slate-500">
            {isPaid
              ? "تراکنش به صورت سرور به سرور تایید شد و سفارش شما در صف تحویل قرار گرفت."
              : reason ||
                (isPending
                  ? "نتیجهٔ نهایی پس از تایید بانک / درگاه در پنل کاربری شما نمایش داده می‌شود."
                  : "در صورت کسر وجه از حساب شما، مبلغ طی ۷۲ ساعت به صورت خودکار توسط شبکه بانکی بازگردانده می‌شود.")}
          </p>

          <div className="mt-6 space-y-2.5 rounded-2xl border border-slate-200/75 bg-slate-50/75 p-4 text-right text-[12px]">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 text-slate-500">
                <CreditCard className="h-3.5 w-3.5" />
                درگاه پرداخت
              </span>
              <span className="font-bold text-[#0a1b33]">{gatewayTitle}</span>
            </div>

            {orderId ? (
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">شناسه سفارش</span>
                <span dir="ltr" className="font-latin font-bold text-[#0a1b33]">
                  {orderId}
                </span>
              </div>
            ) : null}

            {refId ? (
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">کد رهگیری / توکن</span>
                <span dir="ltr" className="font-latin font-bold text-[#1b39f5]">
                  {refId}
                </span>
              </div>
            ) : null}

            {amount > 0 ? (
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">مبلغ تاییدشده</span>
                <span className="num font-bold text-[#0a1b33]">
                  {toman(amount)} تومان
                </span>
              </div>
            ) : null}

            {method ? (
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">روش پرداخت</span>
                <span className="font-semibold text-[#0a1b33]">
                  {method === "card" ? "کارت به کارت هوشمند" : "پرداخت آنلاین"}
                </span>
              </div>
            ) : null}

            {card ? (
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">شماره کارت</span>
                <span dir="ltr" className="font-latin font-semibold text-[#0a1b33]">
                  {card}
                </span>
              </div>
            ) : null}
          </div>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            تایید نهایی تراکنش منحصراً از طریق سرور انجام شده است.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard/orders"
              className="glass-solid rounded-full px-6 py-3 text-[13px] font-semibold"
            >
              پیگیری سفارش در پنل کاربری
            </Link>
            <Link
              href={isPaid ? "/products" : "/checkout"}
              className="glass-plate rounded-full px-6 py-3 text-[13px] font-semibold text-[#1b39f5]"
            >
              {isPaid ? "بازگشت به فروشگاه" : "تلاش مجدد برای پرداخت"}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
