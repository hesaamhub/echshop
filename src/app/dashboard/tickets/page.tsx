import { Badge, Button, Card, Field } from "@/components/panel/Ui"
import { tickets } from "@/lib/data"
import { ticketStatusLabels } from "@/lib/types"
import { faDate } from "@/lib/utils"

const tone = {
  open: "amber",
  answered: "green",
  pending_user: "blue",
  closed: "gray",
} as const

export default function TicketsPage() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="num text-[12.5px] font-bold text-[#0a1b33]">{ticket.id}</span>
                <Badge tone={tone[ticket.status]}>{ticketStatusLabels[ticket.status]}</Badge>
                <Badge tone="gray">{ticket.department}</Badge>
              </div>
              <span className="text-[10.5px] text-slate-400">{faDate(ticket.updatedAt)}</span>
            </div>

            <h3 className="mt-3 text-[13.5px] font-bold text-[#0a1b33]">{ticket.subject}</h3>

            <div className="mt-4 space-y-3">
              {ticket.messages.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.from === "support"
                      ? "rounded-2xl border border-[#cfe6f7] bg-[#f2f9fe] p-4"
                      : "rounded-2xl bg-slate-50 p-4"
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11.5px] font-bold text-[#0a1b33]">
                      {message.from === "support" ? "پشتیبانی اچ‌شاپ" : "شما"}
                    </span>
                    <span className="text-[10px] text-slate-400">{faDate(message.at)}</span>
                  </div>
                  <p className="mt-2 text-[11.5px] leading-7 text-slate-600">{message.body}</p>
                </div>
              ))}
            </div>

            {ticket.status !== "closed" ? (
              <div className="mt-4 flex gap-2">
                <input
                  placeholder="پاسخ خود را بنویسید…"
                  className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-[11.5px] outline-none focus:border-[#2783de]"
                />
                <Button>ارسال</Button>
              </div>
            ) : null}
          </Card>
        ))}
      </div>

      <Card title="ثبت تیکت جدید" className="h-fit">
        <div className="space-y-4">
          <Field label="موضوع" placeholder="مانند: مشکل در ورود به اکانت" />
          <label className="block">
            <span className="text-[12px] font-semibold text-[#0a1b33]">دپارتمان</span>
            <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] outline-none focus:border-[#2783de]">
              {["پشتیبانی فنی", "مالی و پرداخت", "گارانتی و تعویض", "پیش از خرید"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[12px] font-semibold text-[#0a1b33]">اولویت</span>
            <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] outline-none focus:border-[#2783de]">
              {["عادی", "مهم", "فوری"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <Field label="شرح مشکل" textarea rows={5} placeholder="جزئیات را کامل بنویسید تا سریع‌تر بررسی شود…" />
          <Field label="شمارهٔ سفارش مرتبط (اختیاری)" placeholder="ECH-10477" latin />
          <Button>ارسال تیکت</Button>
        </div>
      </Card>
    </div>
  )
}
