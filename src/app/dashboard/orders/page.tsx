import { Badge, Button, Card } from "@/components/panel/Ui"
import { orders } from "@/lib/data"
import { deliveryLabels, orderStatusLabels } from "@/lib/types"
import { faDate, toman } from "@/lib/utils"

const statusTone = {
  pending: "amber",
  paid: "blue",
  delivered: "green",
  failed: "red",
  refunded: "gray",
} as const

/** اطلاعات تحویل نمایشی — در نسخهٔ متصل به دیتابیس از انبار خوانده می‌شود */
const credentialsById: Record<string, Array<{ label: string; value: string }>> = {
  "ECH-10482": [
    { label: "ایمیل اکانت", value: "echshop.user4821@mailbox.com" },
    { label: "کلمهٔ عبور", value: "Ech-9f21!kQ" },
  ],
  "ECH-10480": [
    { label: "لینک فعال‌سازی", value: "https://t.me/premium/activate/8f21" },
  ],
}

const notesById: Record<string, string> = {
  "ECH-10482": "لطفاً پس از ورود، کلمهٔ عبور را تغییر ندهید تا گارانتی باقی بماند.",
  "ECH-10481": "درخواست ارتقای اکانت شما به تامین‌کننده ارسال شده است.",
  "ECH-10479": "کارشناس در حال تهیهٔ لایسنس است؛ نتیجه با پیامک اطلاع داده می‌شود.",
  "ECH-10478": "پرداخت ناموفق بود؛ در صورت کسر مبلغ، تا ۷۲ ساعت بازگردانده می‌شود.",
  "ECH-10477": "مبلغ این سفارش به کیف پول شما بازگردانده شد.",
}

export default function OrdersPage() {
  return (
    <div className="space-y-4">
      <Card title="فیلتر سفارش‌ها">
        <div className="flex flex-wrap gap-2">
          {["همه", ...Object.values(orderStatusLabels)].map((label, index) => (
            <button
              key={label}
              type="button"
              className={
                index === 0
                  ? "rounded-full bg-[#0a152d] px-4 py-2 text-[11.5px] font-semibold text-white"
                  : "rounded-full border border-slate-200 px-4 py-2 text-[11.5px] font-medium text-slate-600 hover:border-slate-300"
              }
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      {orders.map((order) => {
        const credentials = credentialsById[order.id]
        const note = notesById[order.id]

        return (
          <Card key={order.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="num text-[13px] font-bold text-[#0a1b33]">{order.id}</span>
                  <Badge tone={statusTone[order.status]}>{orderStatusLabels[order.status]}</Badge>
                  <Badge tone="blue">{deliveryLabels[order.delivery]}</Badge>
                </div>
                <h3 className="mt-2.5 text-[13.5px] font-bold text-[#0a1b33]">{order.product}</h3>
                <p className="mt-1 text-[11.5px] text-slate-500">{order.plan}</p>
                <p className="mt-2 text-[11px] text-slate-400">ثبت سفارش: {faDate(order.createdAt)}</p>
              </div>
              <div className="text-left">
                <span className="num text-[15px] font-bold text-[#0a1b33]">{toman(order.amount)}</span>
                <span className="block text-[10.5px] text-slate-400">تومان</span>
              </div>
            </div>

            {order.status === "delivered" && credentials ? (
              <div className="mt-5 rounded-2xl border border-[#cfe6f7] bg-[#f2f9fe] p-5">
                <h4 className="text-[12.5px] font-bold text-[#1c5f9e]">اطلاعات تحویل</h4>
                <dl className="mt-3 space-y-2.5">
                  {credentials.map((item) => (
                    <div key={item.label} className="flex flex-wrap items-center justify-between gap-2">
                      <dt className="text-[11.5px] text-slate-500">{item.label}</dt>
                      <dd className="font-latin rounded-xl bg-white px-3 py-1.5 text-[11.5px] text-[#0a1b33]" dir="ltr">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                {note ? <p className="mt-3 text-[11px] leading-6 text-slate-500">{note}</p> : null}
              </div>
            ) : order.status === "pending" || order.status === "paid" ? (
              <div className="mt-5 rounded-2xl border border-[#f2e2c6] bg-[#fdf8ef] p-5 text-[11.5px] leading-6 text-[#9A6321]">
                {note ?? "سفارش شما در صف تحویل است و به‌زودی تکمیل می‌شود."}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl bg-slate-50 p-5 text-[11.5px] leading-6 text-slate-500">
                {note ?? "جزئیات بیشتری برای این سفارش ثبت نشده است."}
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="ghost">دانلود فاکتور</Button>
              <Button variant="ghost">ثبت تیکت برای این سفارش</Button>
              {order.status === "delivered" ? <Button variant="ghost">درخواست گارانتی</Button> : null}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
