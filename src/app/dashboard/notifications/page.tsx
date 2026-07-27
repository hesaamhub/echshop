import { Badge, Button, Card } from "@/components/panel/Ui"
import { notifications } from "@/lib/data"
import { faDate } from "@/lib/utils"

export default function NotificationsPage() {
  return (
    <div className="space-y-4">
      <Card
        title="اطلاع‌رسانی‌ها"
        action={<Button variant="ghost">خوانده شدن همه</Button>}
      >
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={
                item.unread
                  ? "rounded-2xl border border-[#cfe6f7] bg-[#f2f9fe] p-5"
                  : "rounded-2xl bg-slate-50 p-5"
              }
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-[13px] font-bold text-[#0a1b33]">{item.title}</span>
                  {item.unread ? <Badge tone="blue">جدید</Badge> : null}
                </div>
                <span className="text-[10.5px] text-slate-400">{faDate(item.at)}</span>
              </div>
              <p className="mt-2.5 text-[12px] leading-7 text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="تنطیمات اطلاع‌رسانی">
        <div className="space-y-3">
          {[
            "اطلاع‌رسانی تحویل سفارش با پیامک",
            "اطلاع‌رسانی پاسخ تیکت با ایمیل",
            "هشدار نزدیک شدن پایان اشتراک",
            "دریافت پیشنهادهای تخفیف و کمپین‌ها",
          ].map((label, index) => (
            <label
              key={label}
              className="flex items-center justify-between rounded-2xl border border-slate-200/70 px-4 py-3.5"
            >
              <span className="text-[12px] text-slate-600">{label}</span>
              <input
                type="checkbox"
                defaultChecked={index < 3}
                className="h-4 w-4 accent-[#2783de]"
              />
            </label>
          ))}
        </div>
      </Card>
    </div>
  )
}
