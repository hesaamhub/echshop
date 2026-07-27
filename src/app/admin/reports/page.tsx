import { Badge, Card, StatCard, Table, Td } from "@/components/panel/Ui"
import { deliveryLabels } from "@/lib/types"
import { toman } from "@/lib/utils"

const byDelivery = [
  { key: "stock", orders: 412, revenue: 184200000 },
  { key: "api", orders: 268, revenue: 231400000 },
  { key: "upgrade", orders: 154, revenue: 96800000 },
  { key: "gift_code", orders: 92, revenue: 41300000 },
  { key: "manual", orders: 61, revenue: 58700000 },
  { key: "scheduled", orders: 24, revenue: 12900000 },
] as const

const logs = [
  { time: "۰۲:۱۴", actor: "مدیر کل", action: "تغییر متن هیرو صفحهٔ اصلی", tone: "blue" },
  { time: "۰۱:۵۲", actor: "کارشناس پشتیبانی", action: "تحویل دستی سفارش ECH-10480", tone: "green" },
  { time: "۰۱:۱۰", actor: "سامانه", action: "تحویل خودکار از API تامین‌کننده موفق بود", tone: "green" },
  { time: "۰۰:۴۱", actor: "انباردار", action: "افزودن ۵۰ اکانت به انبار اسپاتیفای", tone: "blue" },
  { time: "۲۳:۵۸", actor: "سامانه", action: "پرداخت ناموفق برای سفارش ECH-10479", tone: "red" },
] as const

export default function AdminReportsPage() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="درآمد این ماه" value={`${toman(625300000)} تومان`} tone="up" hint="۱۸٪ رشد" />
        <StatCard label="تعداد سفارش" value={`${toman(1011)} سفارش`} tone="up" />
        <StatCard label="نرخ تبدیل سبد" value="۶٫۴٪" />
        <StatCard label="نرخ مرجوعی" value="۰٫۹٪" tone="down" hint="در محدودهٔ قابل قبول" />
      </div>

      <Card title="عملکرد بر اساس روش تحویل">
        <Table head={["روش تحویل", "تعداد سفارش", "درآمد", "سهم از فروش"]}>
          {byDelivery.map((row) => (
            <tr key={row.key}>
              <Td className="font-semibold text-[#0a1b33]">{deliveryLabels[row.key]}</Td>
              <Td className="num">{toman(row.orders)}</Td>
              <Td className="num">{toman(row.revenue)}</Td>
              <Td>
                <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#2783de]"
                    style={{ width: `${Math.round((row.revenue / 231400000) * 100)}%` }}
                  />
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card title="لاگ فعالیت‌ها">
        <div className="space-y-3">
          {logs.map((log, index) => (
            <div key={index} className="flex items-center gap-3 rounded-2xl border border-slate-200/70 px-4 py-3.5">
              <span className="num text-[11px] text-slate-400">{log.time}</span>
              <Badge tone={log.tone}>{log.actor}</Badge>
              <span className="flex-1 text-[11.5px] text-slate-600">{log.action}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
