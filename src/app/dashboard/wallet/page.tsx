import { Badge, Button, Card, Field, StatCard, Table, Td } from "@/components/panel/Ui"
import { toman } from "@/lib/utils"

const transactions = [
  { id: "TRX-8841", type: "شارژ کیف پول", amount: 2000000, status: "موفق", tone: "green", date: "۱۴۰۵/۰۴/۲۹" },
  { id: "TRX-8836", type: "خرید اشتراک اسپاتیفای", amount: -890000, status: "موفق", tone: "green", date: "۱۴۰۵/۰۴/۲۷" },
  { id: "TRX-8829", type: "بازگشت وجه سفارش ناموفق", amount: 640000, status: "موفق", tone: "blue", date: "۱۴۰۵/۰۴/۲۱" },
  { id: "TRX-8820", type: "خرید لایسنس ادوبی", amount: -3200000, status: "موفق", tone: "green", date: "۱۴۰۵/۰۴/۱۵" },
  { id: "TRX-8814", type: "شارژ کیف پول", amount: 1500000, status: "ناموفق", tone: "red", date: "۱۴۰۵/۰۴/۱۱" },
] as const

export default function WalletPage() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="موجودی فعلی" value={`${toman(1250000)} تومان`} hint="قابل استفاده در خرید" />
        <StatCard label="مجموع شارژ" value={`${toman(9400000)} تومان`} />
        <StatCard label="مجموع خرید" value={`${toman(8150000)} تومان`} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1.6fr]">
        <Card title="شارژ کیف پول">
          <Field label="مبلغ شارژ (تومان)" placeholder="۵۰۰٬۰۰۰" hint="حداقل مبلغ شارژ ۵۰ هزار تومان است." />
          <div className="mt-4 flex flex-wrap gap-2">
            {["۲۰۰ هزار", "۵۰۰ هزار", "۱ میلیون", "۲ میلیون"].map((amount) => (
              <button
                key={amount}
                type="button"
                className="rounded-full border border-slate-200 px-3.5 py-2 text-[11.5px] text-slate-600 hover:border-slate-300"
              >
                {amount}
              </button>
            ))}
          </div>
          <div className="mt-5">
            <Button>پرداخت و شارژ</Button>
          </div>
          <p className="mt-4 text-[10.5px] leading-6 text-slate-400">
            درگاه پرداخت در بخش تنطیمات پنل مدیریت متصل می‌شود؛ در این نسخه فرایند به صورت نمایشی است.
          </p>
        </Card>

        <Card title="تاریخچهٔ تراکنش‌ها">
          <Table head={["شناسه", "شرح", "مبلغ", "وضعیت", "تاریخ"]}>
            {transactions.map((item) => (
              <tr key={item.id}>
                <Td className="num font-semibold text-[#0a1b33]">{item.id}</Td>
                <Td>{item.type}</Td>
                <Td
                  className={
                    item.amount > 0 ? "num text-[#46A171] font-semibold" : "num text-[#0a1b33]"
                  }
                >
                  {item.amount > 0 ? "+" : "−"}
                  {toman(Math.abs(item.amount))}
                </Td>
                <Td>
                  <Badge tone={item.tone}>{item.status}</Badge>
                </Td>
                <Td className="num text-slate-400">{item.date}</Td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </div>
  )
}
