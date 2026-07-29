import { Badge, Button, Card, Field, Table, Td } from "@/components/panel/Ui"
import { categories, products } from "@/lib/data"
import { deliveryLabels } from "@/lib/types"
import { toman } from "@/lib/utils"

export default function AdminProductsPage() {
  return (
    <div className="space-y-5">
      <Card
        title="فهرست محصولات"
        action={
          <div className="flex gap-2">
            <Button variant="ghost">خروجی اکسل</Button>
            <Button>افزودن محصول</Button>
          </div>
        }
      >
        <Table head={["محصول", "دسته", "پلن‌ها", "کمترین قیمت", "ظرفیت فعال‌سازی", "فروش", "وضعیت", "عملیات"]}>
          {products.map((product) => {
            const cheapest = product.plans.reduce((a, b) => (a.price <= b.price ? a : b))
            const capacity = product.plans.reduce((sum, plan) => sum + plan.stock, 0)
            return (
              <tr key={product.id}>
                <Td className="font-semibold text-[#0a1b33]">{product.title}</Td>
                <Td>{categories.find((c) => c.slug === product.categorySlug)?.title}</Td>
                <Td className="num">{product.plans.length}</Td>
                <Td className="num">{toman(cheapest.price)}</Td>
                <Td>
                  <Badge tone={capacity > 50 ? "green" : capacity > 10 ? "amber" : "red"}>
                    {toman(capacity)}
                  </Badge>
                </Td>
                <Td className="num">{toman(product.sold)}</Td>
                <Td>
                  <Badge tone="green">فعال</Badge>
                </Td>
                <Td>
                  <div className="flex gap-1.5">
                    <Button variant="ghost">ویرایش</Button>
                    <Button variant="danger">غیرفعال</Button>
                  </div>
                </Td>
              </tr>
            )
          })}
        </Table>
      </Card>

      <Card title="افزودن / ویرایش محصول">
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="عنوان محصول" placeholder="مانند: اشتراک پریمیوم اسپاتیفای" />
          <Field label="نشانی یکتا (slug)" placeholder="spotify-premium" latin />
          <Field label="نام برند" placeholder="Spotify" latin />
          <Field label="شناسهٔ لوگوی داخلی" placeholder="spotify" latin hint="لوگوها از پک داخلی سایت خوانده می‌شوند؛ فقط شناسه را بنویسید." />
          <label className="block">
            <span className="text-[12px] font-semibold text-[#0a1b33]">دسته‌بندی</span>
            <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] outline-none focus:border-[#2783de]">
              {categories.map((category) => (
                <option key={category.slug}>{category.title}</option>
              ))}
            </select>
          </label>
          <Field label="برچسب ویژه (اختیاری)" placeholder="پرفروش‌ترین" />
          <div className="lg:col-span-2">
            <Field label="توضیح کوتاه" placeholder="در یک خط محصول را معرفی کنید" />
          </div>
          <div className="lg:col-span-2">
            <Field label="توضیح کامل" textarea rows={5} placeholder="متن کامل صفحهٔ محصول…" />
          </div>
        </div>

        <h3 className="mt-7 text-[13px] font-bold text-[#0a1b33]">پلن‌ها و روش فعال‌سازی هر پلن</h3>
        <p className="mt-1.5 text-[11px] leading-6 text-slate-400">
          برای هر پلن می‌توانید روش فعال‌سازی جداگانه تعیین کنید: فعال‌سازی خودکار، تحویل فوری، ارتقای اکانت شخصی، کد فعال‌سازی یا فعال‌سازی توسط پشتیبانی.
        </p>
        <div className="mt-4 space-y-3">
          {[1, 2].map((row) => (
            <div
              key={row}
              className="grid gap-3 rounded-2xl border border-slate-200/70 p-4 lg:grid-cols-5"
            >
              <Field label="عنوان پلن" placeholder="۱ ماهه" />
              <Field label="قیمت" placeholder="۸۹۰٬۰۰۰" />
              <Field label="قیمت پیش از تخفیف" placeholder="۱٬۱۰۰٬۰۰۰" />
              <label className="block">
                <span className="text-[12px] font-semibold text-[#0a1b33]">روش فعال‌سازی</span>
                <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] outline-none focus:border-[#2783de]">
                  {Object.entries(deliveryLabels).map(([key, label]) => (
                    <option key={key}>{label}</option>
                  ))}
                </select>
              </label>
              <Field label="ظرفیت" placeholder="۲۵" />
            </div>
          ))}
        </div>

        <div className="mt-5 flex gap-2">
          <Button>ذخیرهٔ محصول</Button>
          <Button variant="ghost">افزودن پلن جدید</Button>
        </div>
      </Card>
    </div>
  )
}
