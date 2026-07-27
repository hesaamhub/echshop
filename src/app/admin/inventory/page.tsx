import { Badge, Button, Card, Field, StatCard, Table, Td } from "@/components/panel/Ui"
import { deliveryLabels } from "@/lib/types"
import { toman } from "@/lib/utils"

const stock = [
  { id: "INV-5512", product: "اشتراک پریمیوم اسپاتیفای", plan: "۳ ماهه", type: "stock", value: "spoti_5512@mail.com", status: "آزاد", tone: "green" },
  { id: "INV-5513", product: "اشتراک پریمیوم اسپاتیفای", plan: "۳ ماهه", type: "stock", value: "spoti_5513@mail.com", status: "فروخته شده", tone: "gray" },
  { id: "INV-5601", product: "چت‌جی‌پی‌تی پلاس", plan: "۱ ماهه", type: "upgrade", value: "ارتقای ایمیل مشتری", status: "آزاد", tone: "green" },
  { id: "INV-5702", product: "لایسنس ادوبی کریتیو کلاد", plan: "۱۲ ماهه", type: "api", value: "از API تامین‌کننده", status: "نامحدود", tone: "blue" },
  { id: "INV-5810", product: "گیفت کارت دیسکورد نیترو", plan: "۱ ماهه", type: "gift_code", value: "NITRO-XXXX-1129", status: "آزاد", tone: "green" },
  { id: "INV-5811", product: "تلگرام پریمیوم", plan: "۳ ماهه", type: "manual", value: "در انتظار اقدام کارشناس", status: "رزرو", tone: "amber" },
] as const

export default function AdminInventoryPage() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="آیتم آزاد در انبار" value={`${toman(184)} آیتم`} />
        <StatCard label="فروخته شده این ماه" value={`${toman(412)} آیتم`} tone="up" hint="۱۵٪ رشد" />
        <StatCard label="محصولات با موجودی کم" value={`${toman(4)} محصول`} tone="down" hint="نیاز به شارژ فوری" />
        <StatCard label="تحویل خودکار موفق" value="۹۷٪" hint="۳٪ نیاز به دخالت دستی" />
      </div>

      <Card
        title="موجودی اکانت و لایسنس"
        action={
          <div className="flex gap-2">
            <Button variant="ghost">خروجی CSV</Button>
            <Button>افزودن گروهی</Button>
          </div>
        }
      >
        <Table head={["شناسه", "محصول", "پلن", "روش تحویل", "مقدار / اطلاعات", "وضعیت", "عملیات"]}>
          {stock.map((item) => (
            <tr key={item.id}>
              <Td className="num font-semibold text-[#0a1b33]">{item.id}</Td>
              <Td>{item.product}</Td>
              <Td>{item.plan}</Td>
              <Td>
                <Badge tone="blue">{deliveryLabels[item.type]}</Badge>
              </Td>
              <Td className="font-latin">{item.value}</Td>
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

      <div className="grid gap-5 xl:grid-cols-2">
        <Card title="افزودن گروهی موجودی">
          <p className="mb-4 text-[11.5px] leading-6 text-slate-500">
            هر خط یک آیتم است. برای اکانت‌ها از قالب «ایمیل:رمز» و برای کدهای هدیه فقط کد را وارد کنید.
          </p>
          <Field
            label="فهرست آیتم‌ها"
            textarea
            rows={7}
            placeholder={"user1@mail.com:Pass1234\nuser2@mail.com:Pass5678\nNITRO-AAAA-1111"}
          />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="محصول" placeholder="اشتراک پریمیوم اسپاتیفای" />
            <Field label="پلن" placeholder="۳ ماهه" />
          </div>
          <div className="mt-4">
            <Button>ثبت در انبار</Button>
          </div>
        </Card>

        <Card title="اتصال تحویل خودکار از API">
          <div className="space-y-4">
            <Field label="نام تامین‌کننده" placeholder="مثلاً Supplier-A" />
            <Field label="نشانی Endpoint" placeholder="https://api.supplier.com/v1/orders" latin />
            <Field label="کلید API" placeholder="sk_live_..." latin hint="کلیدها رمزنگاری‌شده ذخیره می‌شوند." />
            <Field
              label="قالب درخواست (JSON)"
              textarea
              rows={5}
              placeholder={'{ "sku": "PLAN_SKU", "email": "CUSTOMER_EMAIL" }'}
            />
            <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 px-4 py-3.5">
              <span className="text-[12px] text-slate-600">تحویل خودکار پس از پرداخت موفق</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#2783de]" />
            </div>
            <div className="flex gap-2">
              <Button>ذخیره اتصال</Button>
              <Button variant="ghost">تست اتصال</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
