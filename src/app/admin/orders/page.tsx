import { Badge, Button, Card, Table, Td } from "@/components/panel/Ui"
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

const filters = ["همهٔ سفارش‌ها", "در انتطار پرداخت", "پرداخت شده", "تحویل شده", "ناموفق", "مرجوعی"]

export default function AdminOrdersPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter, index) => (
          <button
            key={filter}
            className={
              index === 0
                ? "rounded-full bg-[#0a152d] px-4 py-2 text-[11.5px] font-semibold text-white"
                : "rounded-full border border-slate-200 bg-white px-4 py-2 text-[11.5px] font-semibold text-slate-500 hover:border-slate-300"
            }
          >
            {filter}
          </button>
        ))}
      </div>

      <Card title="مدیریت سفارش‌ها" action={<Button variant="ghost">خروجی اکسل</Button>}>
        <Table
          head={["شماره", "کاربر", "محصول", "پلن", "روش تحویل", "مبلغ", "وضعیت", "تاریخ", "عملیات"]}
        >
          {orders.map((order) => (
            <tr key={order.id}>
              <Td className="num font-semibold text-[#0a1b33]">{order.id}</Td>
              <Td>{order.customer}</Td>
              <Td>{order.product}</Td>
              <Td>{order.plan}</Td>
              <Td>
                <Badge tone="blue">{deliveryLabels[order.delivery]}</Badge>
              </Td>
              <Td className="num">{toman(order.amount)}</Td>
              <Td>
                <Badge tone={statusTone[order.status]}>{orderStatusLabels[order.status]}</Badge>
              </Td>
              <Td className="text-slate-400">{faDate(order.createdAt)}</Td>
              <Td>
                <div className="flex gap-1.5">
                  <Button variant="ghost">جزئیات</Button>
                  {order.status === "paid" || order.status === "pending" ? (
                    <Button>تحویل دستی</Button>
                  ) : (
                    <Button variant="danger">مرجوع</Button>
                  )}
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card title="تحویل دستی سفارش">
        <p className="text-[11.5px] leading-6 text-slate-500">
          برای سفارش‌هایی که روش تحویل آن‌ها دستی است، پس از انجام کار اطلاعات تحویل را در این بخش ثبت کنید. پیامک
          و اطلاع‌رسانی در پنل کاربر به صورت خودکار ارسال می‌شود.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <label className="block">
            <span className="text-[12px] font-semibold text-[#0a1b33]">شمارهٔ سفارش</span>
            <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] outline-none focus:border-[#2783de]">
              {orders.map((order) => (
                <option key={order.id}>{order.id}</option>
              ))}
            </select>
          </label>
          <label className="block lg:col-span-2">
            <span className="text-[12px] font-semibold text-[#0a1b33]">اطلاعات تحویل</span>
            <textarea
              rows={4}
              className="font-latin mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-[12px] outline-none focus:border-[#2783de]"
              dir="ltr"
              placeholder={"email: user@mail.com\npassword: ******\nnote: do not change the password"}
            />
          </label>
        </div>
        <div className="mt-4 flex gap-2">
          <Button>ثبت تحویل و اطلاع‌رسانی</Button>
          <Button variant="ghost">تخصیص خودکار از انبار</Button>
        </div>
      </Card>
    </div>
  )
}
