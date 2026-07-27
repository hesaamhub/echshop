import { Badge, Button, Card, Field, Table, Td } from "@/components/panel/Ui"
import { tickets } from "@/lib/data"
import { ticketStatusLabels } from "@/lib/types"
import { faDate } from "@/lib/utils"

const tone = {
  open: "amber",
  answered: "green",
  pending_user: "blue",
  closed: "gray",
} as const

export default function AdminTicketsPage() {
  return (
    <div className="space-y-5">
      <Card title="تیکت‌های پشتیبانی">
        <Table head={["شماره", "موضوع", "دپارتمان", "وضعیت", "آخرین پیام", "عملیات"]}>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <Td className="num font-semibold text-[#0a1b33]">{ticket.id}</Td>
              <Td>{ticket.subject}</Td>
              <Td>{ticket.department}</Td>
              <Td>
                <Badge tone={tone[ticket.status]}>{ticketStatusLabels[ticket.status]}</Badge>
              </Td>
              <Td className="text-slate-400">{faDate(ticket.updatedAt)}</Td>
              <Td>
                <div className="flex gap-1.5">
                  <Button variant="ghost">مشاهده</Button>
                  <Button>پاسخ</Button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Card title="پاسخ سریع">
          <div className="space-y-4">
            <Field label="شمارهٔ تیکت" placeholder="TK-2091" latin />
            <Field label="متن پاسخ" textarea rows={6} placeholder="پاسخ خود را بنویسید…" />
            <div className="flex gap-2">
              <Button>ارسال پاسخ</Button>
              <Button variant="ghost">بستن تیکت</Button>
            </div>
          </div>
        </Card>

        <Card title="پاسخ‌های آماده">
          <div className="space-y-3">
            {[
              "راهنمای ورود به اکانت تحویل‌داده‌شده",
              "مراحل تعویض اکانت دارای اشکال",
              "شرایط گارانتی و مرجوعی",
              "راهنمای پرداخت ناموفق و بازگشت وجه",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl border border-slate-200/70 px-4 py-3.5"
              >
                <span className="text-[11.5px] text-slate-600">{item}</span>
                <Button variant="ghost">درج</Button>
              </div>
            ))}
            <Button variant="ghost">افزودن پاسخ آماده</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
