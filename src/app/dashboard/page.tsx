import Link from "next/link"
import { Badge, Card, StatCard, Table, Td } from "@/components/panel/Ui"
import { notifications, orders } from "@/lib/data"
import { deliveryLabels, orderStatusLabels } from "@/lib/types"
import { faDate, toman } from "@/lib/utils"

const statusTone = {
  pending: "amber",
  paid: "blue",
  delivered: "green",
  failed: "red",
  refunded: "gray",
} as const

export default function DashboardHome() {
  const recent = orders.slice(0, 4)

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="سفارش‌های موفق" value={`${toman(18)} سفارش`} hint="۲ سفارش در ماه جاری" tone="up" />
        <StatCard label="موجودی کیف پول" value={`${toman(1250000)} تومان`} hint="قابل استفاده در خرید بعدی" />
        <StatCard label="اشتراک‌های فعال" value={`${toman(5)} اشتراک`} hint="نزدیک‌ترین انقضا: ۲۱ روز" />
        <StatCard label="تیکت‌های باز" value={`${toman(1)} تیکت`} hint="در انتظار پاسخ پشتیبانی" tone="down" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Card
          title="آخرین سفارش‌ها"
          action={
            <Link href="/dashboard/orders" className="text-[11.5px] font-semibold text-[#2783de]">
              مشاهدهٔ همه
            </Link>
          }
        >
          <Table head={["شماره سفارش", "محصول", "نوع تحویل", "مبلغ", "وضعیت", "تاریخ"]}>
            {recent.map((order) => (
              <tr key={order.id}>
                <Td className="num font-semibold text-[#0a1b33]">{order.id}</Td>
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

        <Card title="اطلاع‌رسانی‌ها">
          <div className="space-y-3">
            {notifications.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12.5px] font-bold text-[#0a1b33]">{item.title}</span>
                  <span className="text-[10.5px] text-slate-400">{faDate(item.at)}</span>
                </div>
                <p className="mt-2 text-[11.5px] leading-6 text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
