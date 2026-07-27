import { Badge, Button, Card, Field, Table, Td } from "@/components/panel/Ui"
import { posts } from "@/lib/data"
import { faDate } from "@/lib/utils"

export default function AdminBlogPage() {
  return (
    <div className="space-y-5">
      <Card title="نوشته‌های بلاگ" action={<Button>نوشتهٔ جدید</Button>}>
        <Table head={["عنوان", "نشانی یکتا", "دسته", "تاریخ", "وضعیت", "عملیات"]}>
          {posts.map((post) => (
            <tr key={post.slug}>
              <Td className="font-semibold text-[#0a1b33]">{post.title}</Td>
              <Td className="font-latin text-slate-400">{post.slug}</Td>
              <Td>{post.category}</Td>
              <Td className="text-slate-400">{faDate(post.publishedAt)}</Td>
              <Td>
                <Badge tone="green">منتشر شده</Badge>
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

      <Card title="نوشتن / ویرایش مقاله">
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="عنوان" placeholder="مانند: راهنمای خرید اکانت امن" />
          <Field label="نشانی یکتا" placeholder="how-to-buy-safe-account" latin />
          <Field label="دسته‌بندی" placeholder="راهنمای خرید" />
          <Field label="زمان مطالعه (دقیقه)" placeholder="۶" />
          <div className="lg:col-span-2">
            <Field label="خلاصه" textarea rows={3} placeholder="خلاصهٔ کوتاه برای نمایش در فهرست…" />
          </div>
          <div className="lg:col-span-2">
            <Field label="متن کامل" textarea rows={10} placeholder="متن مقاله…" />
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <Button>انتشار</Button>
          <Button variant="ghost">ذخیره به عنوان پیش‌نویس</Button>
        </div>
      </Card>
    </div>
  )
}
