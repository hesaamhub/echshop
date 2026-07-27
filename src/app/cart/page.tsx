import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"
import Shell from "@/components/site/Shell"
import { products } from "@/lib/data"
import { deliveryLabels } from "@/lib/types"
import { toman } from "@/lib/utils"

export const metadata = { title: "سبد خرید" }

export default function CartPage() {
  const lines = [products[0], products[1], products[4]].map((product, index) => ({
    product,
    plan: product.plans[Math.min(index, product.plans.length - 1)],
    quantity: index === 2 ? 2 : 1,
  }))

  const subtotal = lines.reduce((sum, line) => sum + line.plan.price * line.quantity, 0)
  const discount = 180000
  const total = subtotal - discount

  return (
    <Shell
      title="سبد خرید"
      breadcrumb={[{ label: "صفحه اصلی", href: "/" }, { label: "سبد خرید" }]}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {lines.map((line) => (
            <div
              key={line.product.id}
              className="flex flex-wrap items-center gap-4 rounded-3xl border border-slate-200/70 bg-white p-5"
            >
              <div
                className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${line.product.gradient}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={line.product.logo}
                  alt={line.product.brand}
                  className="h-6 w-auto max-w-[44px] object-contain brightness-0 invert"
                />
              </div>

              <div className="min-w-[180px] flex-1">
                <Link
                  href={`/products/${line.product.slug}`}
                  className="text-[13.5px] font-bold text-[#0a1b33] hover:text-[#2783de]"
                >
                  {line.product.title}
                </Link>
                <p className="mt-1.5 text-[11.5px] text-slate-500">{line.plan.title}</p>
                <span className="mt-2 inline-flex rounded-full bg-[#E5F2FC] px-2.5 py-1 text-[10px] font-semibold text-[#1c5f9e]">
                  {deliveryLabels[line.plan.delivery]}
                </span>
              </div>

              <div className="flex items-center gap-1 rounded-full border border-slate-200 p-1">
                <button type="button" className="grid h-7 w-7 place-items-center rounded-full hover:bg-slate-50">
                  <Plus className="h-3.5 w-3.5 text-slate-500" />
                </button>
                <span className="num w-8 text-center text-[12px] font-bold text-[#0a1b33]">
                  {line.quantity}
                </span>
                <button type="button" className="grid h-7 w-7 place-items-center rounded-full hover:bg-slate-50">
                  <Minus className="h-3.5 w-3.5 text-slate-500" />
                </button>
              </div>

              <div className="w-28 text-left">
                <span className="num text-[13.5px] font-bold text-[#0a1b33]">
                  {toman(line.plan.price * line.quantity)}
                </span>
                <span className="block text-[10px] text-slate-400">تومان</span>
              </div>

              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-red-50 hover:text-[#E56458]"
                aria-label="حذف"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          <div className="rounded-3xl border border-slate-200/70 bg-white p-5">
            <label className="block text-[12.5px] font-bold text-[#0a1b33]">کد تخفیف</label>
            <div className="mt-3 flex gap-2">
              <input
                placeholder="کد تخفیف را وارد کنید"
                className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-[12px] outline-none focus:border-[#2783de]"
              />
              <button
                type="button"
                className="rounded-full bg-[#0a152d] px-6 text-[12px] font-semibold text-white"
              >
                اعمال
              </button>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-3xl border border-slate-200/70 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="text-[14px] font-bold text-[#0a1b33]">خلاصهٔ سفارش</h2>
          <dl className="mt-4 space-y-3 text-[12.5px]">
            <Row label="جمع محصولات" value={`${toman(subtotal)} تومان`} />
            <Row label="تخفیف" value={`${toman(discount)} تومان`} accent />
            <Row label="کارمزد" value="۰ تومان" />
          </dl>
          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-[12.5px] font-bold text-[#0a1b33]">مبلغ نهایی</span>
            <span className="text-[17px] font-bold text-[#0a1b33]">
              <span className="num">{toman(total)}</span>
              <span className="mr-1 text-[11px] font-medium text-slate-500">تومان</span>
            </span>
          </div>
          <Link
            href="/checkout"
            className="mt-5 block rounded-full bg-[#0a152d] py-3.5 text-center text-[13px] font-semibold text-white"
          >
            ادامهٔ فرایند خرید
          </Link>
          <Link
            href="/products"
            className="mt-3 block rounded-full border border-slate-200 py-3 text-center text-[12px] font-semibold text-[#0a1b33] hover:border-slate-300"
          >
            ادامهٔ خرید
          </Link>
        </aside>
      </div>
    </Shell>
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
