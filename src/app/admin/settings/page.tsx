import { Badge, Button, Card, Field } from "@/components/panel/Ui"
import { deliveryLabels } from "@/lib/types"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-2">
        <Card title="تنطیمات عمومی">
          <div className="space-y-4">
            <Field label="عنوان سایت" defaultValue="اچ‌شاپ | فروشگاه اکانت و لایسنس" />
            <Field label="توضیح متا (SEO)" textarea rows={3} defaultValue="خرید امن اکانت و لایسنس اریجینال با تحویل فوری و گارانتی معتبر." />
            <Field label="دامنه" defaultValue="echshop.ir" latin />
            <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 px-4 py-3.5">
              <span className="text-[12px] text-slate-600">حالت تعمیر و نگهداری</span>
              <input type="checkbox" className="h-4 w-4 accent-[#2783de]" />
            </div>
            <Button>ذخیره</Button>
          </div>
        </Card>

        <Card title="درگاه پرداخت">
          <div className="rounded-2xl border border-[#f2e2c6] bg-[#fdf8ef] p-4">
            <div className="flex items-center gap-2">
              <Badge tone="amber">بعدتر تنطیم می‌شود</Badge>
            </div>
            <p className="mt-2 text-[11.5px] leading-6 text-slate-600">
              طبق خواستهٔ شما درگاه پرداخت در این مرحله فعال نشده است. ساختار فیلدها آماده است و هر زمان کلیدهای
              درگاه (زرین‌پال، آیدی‌پی، نخوا، پی‌پینگ یا هر درگاه دیگر) را داشتید وارد می‌کنید.
            </p>
          </div>
          <div className="mt-4 space-y-4 opacity-70">
            <label className="block">
              <span className="text-[12px] font-semibold text-[#0a1b33]">درگاه فعال</span>
              <select disabled className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] outline-none">
                <option>هنوز انتخاب نشده</option>
              </select>
            </label>
            <Field label="کلید درگاه (Merchant ID)" placeholder="بعدتر تکمیل می‌شود" latin />
            <Field label="نشانی بازگشت (Callback URL)" placeholder="https://echshop.ir/api/payment/callback" latin />
            <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 px-4 py-3.5">
              <span className="text-[12px] text-slate-600">پرداخت از کیف پول داخلی (فعال)</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#2783de]" />
            </div>
          </div>
        </Card>
      </div>

      <Card title="روش‌های تحویل فعال فروشگاه">
        <p className="text-[11.5px] leading-6 text-slate-500">
          می‌توانید هر روش را جداگانه خاموش یا روشن کنید. هر پلن محصول می‌تواند روش مختص خود را داشته باشد.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Object.entries(deliveryLabels).map(([key, label], index) => (
            <div key={key} className="flex items-center justify-between rounded-2xl border border-slate-200/70 px-4 py-3.5">
              <div>
                <p className="text-[12px] font-bold text-[#0a1b33]">{label}</p>
                <p className="font-latin mt-1 text-[10.5px] text-slate-400">{key}</p>
              </div>
              <input type="checkbox" defaultChecked={index !== 5} className="h-4 w-4 accent-[#2783de]" />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card title="پیامک و ایمیل">
          <div className="space-y-4">
            <Field label="سرویس پیامک" placeholder="Kavenegar / SMS.ir" latin />
            <Field label="کلید API پیامک" placeholder="************" latin />
            <Field label="ایمیل ارسال‌کننده" placeholder="no-reply@echshop.ir" latin />
            <Button>ذخیره</Button>
          </div>
        </Card>

        <Card title="قوانین و گارانتی">
          <div className="space-y-4">
            <Field label="مدت گارانتی پیش‌فرض (روز)" defaultValue="۳۰" />
            <Field label="متن قوانین و مقررات" textarea rows={6} placeholder="متن کامل قوانین فروشگاه…" />
            <Button>ذخیره</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
