import { Badge, Button, Card, Field, Table, Td } from "@/components/panel/Ui"
import { toman } from "@/lib/utils"

const codes = [
  { code: "ECH20", type: "درصدی", value: "۲۰٪", limit: 500, used: 318, expire: "۱۴۰۵/۰۶/۱۵", tone: "green", status: "فعال" },
  { code: "WELCOME", type: "مبلغ ثابت", value: "۵۰٬۰۰۰ تومان", limit: 1000, used: 742, expire: "بدون محدودیت", tone: "green", status: "فعال" },
  { code: "AI15", type: "درصدی", value: "۱۵٪", limit: 200, used: 200, expire: "۱۴۰۵/۰۴/۳۱", tone: "gray", status: "پایان یافته" },
  { code: "NOWRUZ", type: "درصدی", value: "۳۰٪", limit: 300, used: 291, expire: "۱۴۰۵/۰۱/۱۵", tone: "gray", status: "منقضی شده" },
] as const

export default function AdminDiscountsPage() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
      <Card title="کدهای تخفیف">
        <Table head={["کد", "نوع", "مقدار", "سقف استفاده", "استفاده‌شده", "انقضا", "وضعیت", "عملیات"]}>
          {codes.map((item) => (
            <tr key={item.code}>
              <Td className="font-latin font-bold text-[#0a1b33]">{item.code}</Td>
              <Td>{item.type}</Td>
              <Td className="num">{item.value}</Td>
              <Td className="num">{toman(item.limit)}</Td>
              <Td className="num">{toman(item.used)}</Td>
              <Td className="num text-slate-400">{item.expire}</Td>
              <Td>
                <Badge tone={item.tone}>{item.status}</Badge>
              </Td>
              <Td>
                <div className="flex gap-1.5">
                  <Button variant="ghost">ویرایش</Button>
                  <Button variant="danger">حذف</Button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card title="ایجاد کد تخفیف" className="h-fit">
        <div className="space-y-4">
          <Field label="کد" placeholder="ECHSHOP25" latin />
          <label className="block">
            <span className="text-[12px] font-semibold text-[#0a1b33]">نوع تخفیف</span>
            <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] outline-none focus:border-[#2783de]">
              <option>درصدی</option>
              <option>مبلغ ثابت</option>
              <option>ارسال رایگان تحویل فوری</option>
            </select>
          </label>
          <Field label="مقدار" placeholder="۲۵" />
          <Field label="سقف استفاده" placeholder="۵۰۰" />
          <Field label="حداقل مبلغ سبد (تومان)" placeholder="۲۰۰٬۰۰۰" />
          <Field label="تاریخ انقضا" placeholder="۱۴۰۵/۰۸/۰۱" />
          <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 px-4 py-3.5">
            <span className="text-[12px] text-slate-600">فقط برای اولین خرید</span>
            <input type="checkbox" className="h-4 w-4 accent-[#2783de]" />
          </div>
          <Button>ایجاد کد</Button>
        </div>
      </Card>
    </div>
  )
}
