import { Badge, Button, Card, Field } from "@/components/panel/Ui"

export default function ProfilePage() {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Card title="اطلاعات شخصی">
        <div className="space-y-4">
          <Field label="نام و نام خانوادگی" defaultValue="حسام رضایی" />
          <Field label="شماره موبایل" defaultValue="۰۹۱۲۳۴۵۶۷۸۹" hint="شمارهٔ تاییدشده برای ورود و پیامک" />
          <Field label="ایمیل" defaultValue="hesaam@example.com" latin />
          <Field label="کد ملی (اختیاری)" placeholder="برای صدور فاکتور رسمی" />
          <Button>ذخیرهٔ تغییرات</Button>
        </div>
      </Card>

      <div className="space-y-5">
        <Card title="تغییر کلمهٔ عبور">
          <div className="space-y-4">
            <Field label="کلمهٔ عبور فعلی" placeholder="••••••••" />
            <Field label="کلمهٔ عبور جدید" placeholder="حداقل ۸ کاراکتر" />
            <Field label="تکرار کلمهٔ عبور جدید" placeholder="••••••••" />
            <Button>به‌روزرسانی کلمهٔ عبور</Button>
          </div>
        </Card>

        <Card title="امنیت حساب">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 px-4 py-3.5">
              <span className="text-[12px] text-slate-600">ورود دومرحله‌ای با پیامک</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#2783de]" />
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 px-4 py-3.5">
              <span className="text-[12px] text-slate-600">اطلاع‌رسانی ورود از دستگاه جدید</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#2783de]" />
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] font-bold text-[#0a1b33]">نشست‌های فعال</span>
                <Badge tone="green">۲ دستگاه</Badge>
              </div>
              <ul className="mt-3 space-y-2 text-[11.5px] text-slate-500">
                <li className="flex items-center justify-between">
                  <span>Chrome — تهران</span>
                  <span className="text-slate-400">دستگاه فعلی</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>موبایل — اندروید</span>
                  <span className="text-slate-400">۲ روز پیش</span>
                </li>
              </ul>
            </div>

            <Button variant="danger">خروج از همهٔ دستگاه‌ها</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
