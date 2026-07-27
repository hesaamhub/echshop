import { Badge, Button, Card, Field, Table, Td } from "@/components/panel/Ui"
import { notifications } from "@/lib/data"
import { faDate } from "@/lib/utils"

export default function AdminNotificationsPage() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
      <Card title="ارسال اطلاع‌رسانی همگانی">
        <div className="space-y-4">
          <Field label="عنوان پیام" placeholder="مانند: جشنوارهٔ تخفیف تابستانه" />
          <Field label="متن پیام" textarea rows={6} placeholder="متن کامل اطلاعیه…" />
          <label className="block">
            <span className="text-[12px] font-semibold text-[#0a1b33]">مخاطبان</span>
            <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] outline-none focus:border-[#2783de]">
              <option>همهٔ کاربران</option>
              <option>خریداران فعال ۳۰ روز گذشته</option>
              <option>کاربران بدون خرید</option>
              <option>خریداران یک محصول خاص</option>
            </select>
          </label>
          <div className="space-y-2.5">
            {["نمایش در پنل کاربری", "ارسال پیامک", "ارسال ایمیل", "نمایش به عنوان نوار بالای سایت"].map((item, index) => (
              <div key={item} className="flex items-center justify-between rounded-2xl border border-slate-200/70 px-4 py-3.5">
                <span className="text-[12px] text-slate-600">{item}</span>
                <input type="checkbox" defaultChecked={index === 0} className="h-4 w-4 accent-[#2783de]" />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button>ارسال پیام</Button>
            <Button variant="ghost">زمان‌بندی ارسال</Button>
          </div>
        </div>
      </Card>

      <Card title="اطلاعیه‌های ارسال‌شده">
        <Table head={["عنوان", "تاریخ", "وضعیت", "عملیات"]}>
          {notifications.map((item) => (
            <tr key={item.id}>
              <Td className="font-semibold text-[#0a1b33]">{item.title}</Td>
              <Td className="text-slate-400">{faDate(item.at)}</Td>
              <Td>
                <Badge tone="green">ارسال شده</Badge>
              </Td>
              <Td>
                <div className="flex gap-1.5">
                  <Button variant="ghost">مشاهده</Button>
                  <Button variant="danger">حذف</Button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}
