import { Badge, Card, StatCard, Table, Td } from "@/components/panel/Ui"
import { orders, products } from "@/lib/data"
import { deliveryLabels, orderStatusLabels } from "@/lib/types"
import { faDate, toman } from "@/lib/utils"

const statusTone = {
  pending: "amber",
  paid: "blue",
  delivered: "green",
  failed: "red",
  refunded: "gray",
} as const

const chart = [
  { day: "شنبه", value: 42 },
  { day: "یکشنبه", value: 58 },
  { day: "دوشنبه", value: 71 },
  { day: "سه‌شنبه", value: 64 },
  { day: "چهارشنبه", value: 88 },
  { day: "پنجشنبه", value: 96 },
  { day: "جمعه", value: 79 },
]

export default function AdminDashboard() {
  const top = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5)

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="فروش امروز" value={`${toman(18420000)} تومان`} hint="۱۲٪ بیشتر از دیروز" tone="up" />
        <StatCard label="سفارش در انتظار تحویل" value={`${toman(3)} سفارش`} hint="۲ مورد تحویل دستی" tone="down" />
        <StatCard label="کاربران فعال ماه" value={`${toman(2148)} کاربر`} hint="۸٪ رشد" tone="up" />
        <StatCard label="موجودی کم انبار" value={`${toman(4)} محصول`} hint="نیاز به شارژ انبار" tone="down" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card title="روند فروش هفتهٔ جاری">
          <div className="flex h-52 items-end justify-between gap-3">
            {chart.map((item) => (
              <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-2xl bg-gradient-to-t from-[#2783de] to-[#7cc0f5]"
                  style={{ height: `${item.value}%` }}
                />
                <span className="text-[10.5px] text-slate-400">{item.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="پرفروش‌ترین محصولات">
          <div className="space-y-3">
            {top.map((product, index) => (
              <div key={product.id} className="flex items-center gap-3">
                <span className="num grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-500">
                  {index + 1}
                </span>
                <span className="flex-1 truncate text-[12px] font-semibold text-[#0a1b33]">
                  {product.title}
                </span>
                <span className="num text-[11.5px] text-slate-400">{toman(product.sold)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="آخرین سفارش‌ها">
        <Table head={["شماره", "کاربر", "محصول", "نوع تحویل", "مبلغ", "وضعیت", "تاریخ"]}>
          {orders.map((order) => (
            <tr key={order.id}>
              <Td className="num font-semibold text-[#0a1b33]">{order.id}</Td>
              <Td>{order.customer}</Td>
              <Td>{order.product}</Td>
              <Td>{deliveryLabels[order.delivery]}</Td>
              <Td className="num">{toman(order.amount)}</Td>
              <Td>
                <Badge tone={statusTone[order.status]}>{orderStatusLabels[order.status]}</Badge>
              </Td>
              <Td className="text-slate-400">{faDate(order.createdAt)}</Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}
