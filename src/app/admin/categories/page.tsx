import { Badge, Button, Card, Field, Table, Td } from "@/components/panel/Ui"
import { categories } from "@/lib/data"
import { toman } from "@/lib/utils"

export default function AdminCategoriesPage() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
      <Card title="دسته‌بندی‌ها" action={<Button variant="ghost">مرتب‌سازی</Button>}>
        <Table head={["عنوان", "نشانی یکتا", "تعداد محصول", "وضعیت", "عملیات"]}>
          {categories.map((category) => (
            <tr key={category.slug}>
              <Td className="font-semibold text-[#0a1b33]">{category.title}</Td>
              <Td className="font-latin text-slate-400">{category.slug}</Td>
              <Td className="num">{toman(category.count)}</Td>
              <Td>
                <Badge tone="green">نمایش در منو</Badge>
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

      <Card title="افزودن دسته‌بندی" className="h-fit">
        <div className="space-y-4">
          <Field label="عنوان دسته" placeholder="مانند: ابزارهای هوش مصنوعی" />
          <Field label="نشانی یکتا" placeholder="ai-tools" latin />
          <Field label="توضیح کوتاه" textarea rows={3} placeholder="در یک یا دو خط دسته را معرفی کنید" />
          <Field label="نام آیکون" placeholder="Sparkles" latin hint="از مجموعه آیکون‌های lucide استفاده می‌شود." />
          <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 px-4 py-3.5">
            <span className="text-[12px] text-slate-600">نمایش در نوار دسته‌بندی هدر</span>
            <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#2783de]" />
          </div>
          <Button>ذخیره دسته</Button>
        </div>
      </Card>
    </div>
  )
}
