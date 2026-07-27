import { Badge, Button, Card, Field, StatCard, Table, Td } from "@/components/panel/Ui"
import { toman } from "@/lib/utils"

const users = [
  { name: "حسام رضایی", phone: "09120000001", orders: 14, spent: 12480000, wallet: 320000, level: "طلایی", tone: "amber" },
  { name: "مریم کریمی", phone: "09120000002", orders: 6, spent: 4150000, wallet: 0, level: "نقره‌ای", tone: "gray" },
  { name: "علی محمدی", phone: "09120000003", orders: 21, spent: 19870000, wallet: 1250000, level: "طلایی", tone: "amber" },
  { name: "سارا نوری", phone: "09120000004", orders: 2, spent: 780000, wallet: 50000, level: "عادی", tone: "blue" },
  { name: "رضا احمدی", phone: "09120000005", orders: 9, spent: 7320000, wallet: 0, level: "نقره‌ای", tone: "gray" },
] as const

export default function AdminUsersPage() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="کل کاربران" value={`${toman(8421)} نفر`} tone="up" hint="۱۲۴ عضو جدید این هفته" />
        <StatCard label="خریداران فعال" value={`${toman(2148)} نفر`} />
        <StatCard label="موجودی کل کیف پول‌ها" value={`${toman(148920000)} تومان`} />
        <StatCard label="میانگین سبد خرید" value={`${toman(940000)} تومان`} tone="up" hint="۶٪ رشد" />
      </div>

      <Card
        title="فهرست کاربران"
        action={
          <div className="w-56">
            <input
              placeholder="جستجوی نام یا شماره…"
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11.5px] outline-none focus:border-[#2783de]"
            />
          </div>
        }
      >
        <Table head={["کاربر", "شماره موبایل", "سفارش‌ها", "مجموع خرید", "کیف پول", "سطح", "عملیات"]}>
          {users.map((user) => (
            <tr key={user.phone}>
              <Td className="font-semibold text-[#0a1b33]">{user.name}</Td>
              <Td className="font-latin text-slate-500">{user.phone}</Td>
              <Td className="num">{toman(user.orders)}</Td>
              <Td className="num">{toman(user.spent)}</Td>
              <Td className="num">{toman(user.wallet)}</Td>
              <Td>
                <Badge tone={user.tone}>{user.level}</Badge>
              </Td>
              <Td>
                <div className="flex gap-1.5">
                  <Button variant="ghost">پروفایل</Button>
                  <Button variant="ghost">شارژ کیف پول</Button>
                  <Button variant="danger">مسدود</Button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card title="شارژ دستی کیف پول">
          <div className="space-y-4">
            <Field label="شماره موبایل کاربر" placeholder="09120000001" latin />
            <Field label="مبلغ (تومان)" placeholder="۵۰۰٬۰۰۰" />
            <Field label="توضیح" placeholder="دلیل شارژ یا جبران خسارت" />
            <Button>ثبت شارژ</Button>
          </div>
        </Card>

        <Card title="نقش‌ها و دسترسی‌ها">
          <div className="space-y-3">
            {[
              { role: "مدیر کل", access: "دسترسی کامل به تمام بخش‌ها" },
              { role: "کارشناس پشتیبانی", access: "تیکت‌ها، سفارش‌ها و تحویل دستی" },
              { role: "انباردار", access: "موجودی اکانت و لایسنس" },
              { role: "نویسندهٔ محتوا", access: "بلاگ و مدیریت متن‌های سایت" },
            ].map((item) => (
              <div
                key={item.role}
                className="flex items-center justify-between rounded-2xl border border-slate-200/70 px-4 py-3.5"
              >
                <div>
                  <p className="text-[12px] font-bold text-[#0a1b33]">{item.role}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{item.access}</p>
                </div>
                <Button variant="ghost">ویرایش</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
