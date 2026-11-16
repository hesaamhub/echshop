"use client"

import { useCallback, useEffect, useState } from "react"
import { Badge, Button, Card, Field, Table, Td } from "@/components/panel/Ui"
import { useFirebase } from "@/components/providers/FirebaseProvider"
import {
  addTicketMessage,
  fetchAllTickets,
  fetchTicketMessages,
  updateTicketStatusAsAdmin,
  type FirestoreTicket,
  type FirestoreTicketMessage,
} from "@/lib/firebase/repository"
import { ticketStatusLabels } from "@/lib/types"
import { faDate } from "@/lib/utils"

const tone = {
  open: "amber",
  answered: "green",
  pending_user: "blue",
  closed: "gray",
} as const

const CANNED_REPLIES: { label: string; text: string }[] = [
  {
    label: "راهنمای ورود به اکانت تحویل‌داده‌شده",
    text: "اطلاعات اکانت شما در بخش جزئیات سفارش در داشبورد کاربری قرار گرفته است. لطفاً مطابق دستورالعمل وارد شوید و در صورت نیاز به کد تایید همین تیکت را پاسخ دهید.",
  },
  {
    label: "مراحل تعویض اکانت دارای اشکال",
    text: "سفارش شما تحت گارانتی فعال است. اکانت جایگزین در حال آماده‌سازی است و به‌زودی در جزئیات سفارش شما به‌روزرسانی می‌شود.",
  },
  {
    label: "شرایط گارانتی و مرجوعی",
    text: "تمام اکانت‌های ارائه‌شده در اچ‌شاپ تا پایان دورهٔ اشتراک دارای گارانتی پشتیبانی هستند. تنها تغییر ندادن اطلاعات ایمیل و رمز اکانت اشتراکی شرط حفظ گارانتی است.",
  },
  {
    label: "راهنمای پرداخت ناموفق و بازگشت وجه",
    text: "مبلغ سفارش‌های ناموفق به‌صورت خودکار ظرف ۲۴ تا ۷۲ ساعت کاری توسط شبکهٔ بانکی به حساب مبدا بازگردانده می‌شود.",
  },
]

export default function AdminTicketsPage() {
  const { user } = useFirebase()
  const [tickets, setTickets] = useState<FirestoreTicket[]>([])
  const [selected, setSelected] = useState<FirestoreTicket | null>(null)
  const [messages, setMessages] = useState<FirestoreTicketMessage[]>([])
  const [replyBody, setReplyBody] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState("")

  const selectTicket = useCallback(async (ticket: FirestoreTicket) => {
    setSelected(ticket)
    setFeedback("")
    setError("")
    setLoadingMessages(true)
    try {
      const list = await fetchTicketMessages(ticket.id, ticket.userId, true)
      setMessages(list)
    } finally {
      setLoadingMessages(false)
    }
  }, [])

  const loadTickets = useCallback(async () => {
    setLoading(true)
    try {
      const list = await fetchAllTickets()
      setTickets(list)
      if (list.length > 0 && !selected) {
        await selectTicket(list[0])
      } else if (selected) {
        const fresh = list.find((t) => t.id === selected.id)
        if (fresh) {
          setSelected(fresh)
        }
      }
    } finally {
      setLoading(false)
    }
  }, [selectTicket, selected])

  useEffect(() => {
    void loadTickets()
  }, [loadTickets])

  async function handleSendReply(event: React.FormEvent) {
    event.preventDefault()
    if (!user || !selected || !replyBody.trim()) return
    setBusy(true)
    setFeedback("")
    setError("")
    try {
      await addTicketMessage({
        ticketId: selected.id,
        ticketOwnerId: selected.userId,
        senderId: user.uid,
        senderRole: "support",
        body: replyBody,
        nextStatus: "answered",
      })
      setReplyBody("")
      setFeedback(`پاسخ برای تیکت ${selected.id} ثبت شد.`)
      await selectTicket(selected)
      await loadTickets()
    } catch {
      setError("ارسال پاسخ با خطا مواجه شد.")
    } finally {
      setBusy(false)
    }
  }

  async function handleCloseTicket() {
    if (!selected) return
    setBusy(true)
    setFeedback("")
    setError("")
    try {
      await updateTicketStatusAsAdmin(selected.id, "closed")
      setFeedback(`تیکت ${selected.id} بسته شد.`)
      await loadTickets()
    } catch {
      setError("بستن تیکت انجام نشد.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <Card title="تیکت‌های پشتیبانی">
        {loading ? (
          <p className="py-8 text-center text-[12px] text-slate-400">در حال بارگذاری تیکت‌ها…</p>
        ) : tickets.length === 0 ? (
          <p className="py-8 text-center text-[12px] text-slate-400">تیکتی ثبت نشده است.</p>
        ) : (
          <Table head={["شماره", "کاربر", "موضوع", "دپارتمان", "اولویت", "وضعیت", "به‌روزرسانی", "عملیات"]}>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <Td className="num font-semibold text-[#0a1b33]">{ticket.id}</Td>
                <Td>{ticket.userName}</Td>
                <Td>{ticket.subject}</Td>
                <Td>{ticket.department}</Td>
                <Td>{ticket.priority}</Td>
                <Td>
                  <Badge tone={tone[ticket.status]}>{ticketStatusLabels[ticket.status]}</Badge>
                </Td>
                <Td className="text-slate-400">{faDate(ticket.updatedAt)}</Td>
                <Td>
                  <Button variant="ghost" onClick={() => void selectTicket(ticket)}>
                    مشاهده و پاسخ
                  </Button>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Card title={selected ? `گفت‌وگو و پاسخ به ${selected.id}` : "پاسخ به تیکت"}>
          {selected ? (
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-[12px]">
                <p className="font-bold text-[#0a1b33]">{selected.subject}</p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {selected.userName} · {selected.department}
                  {selected.orderId ? ` · سفارش ${selected.orderId}` : ""}
                </p>
              </div>

              <div className="max-h-72 space-y-2.5 overflow-y-auto rounded-2xl border border-slate-200/70 p-4">
                {loadingMessages ? (
                  <p className="text-center text-[12px] text-slate-400">در حال بارگذاری پیام‌ها…</p>
                ) : messages.length === 0 ? (
                  <p className="text-center text-[12px] text-slate-400">پیامی ثبت نشده است.</p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={
                        msg.senderRole === "support"
                          ? "rounded-2xl bg-[#1b39f5]/8 p-3.5 text-[12px] text-[#0a1b33]"
                          : "rounded-2xl bg-slate-50 p-3.5 text-[12px] text-slate-700"
                      }
                    >
                      <div className="mb-1 flex items-center justify-between text-[10.5px] text-slate-400">
                        <span className="font-bold text-[#0a1b33]">
                          {msg.senderRole === "support" ? "پشتیبانی" : selected.userName}
                        </span>
                        <span>{faDate(msg.createdAt)}</span>
                      </div>
                      <p className="leading-6">{msg.body}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={(e) => void handleSendReply(e)} className="space-y-4">
                <Field
                  label="متن پاسخ پشتیبانی"
                  textarea
                  rows={5}
                  placeholder="پاسخ خود را بنویسید…"
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  required
                />
                {error ? <p className="text-[12px] font-semibold text-[#A8382C]">{error}</p> : null}
                {feedback ? <p className="text-[12px] font-semibold text-[#2F7A50]">{feedback}</p> : null}
                <div className="flex flex-wrap gap-2">
                  <Button type="submit" disabled={busy || !replyBody.trim()}>
                    {busy ? "در حال ارسال…" : "ارسال پاسخ"}
                  </Button>
                  {selected.status !== "closed" ? (
                    <Button variant="ghost" disabled={busy} onClick={() => void handleCloseTicket()}>
                      بستن تیکت
                    </Button>
                  ) : null}
                </div>
              </form>
            </div>
          ) : (
            <p className="py-8 text-center text-[12px] text-slate-400">
              یک تیکت را از جدول بالا انتخاب کنید تا پیام‌ها و فرم پاسخ نمایش داده شود.
            </p>
          )}
        </Card>

        <Card title="پاسخ‌های آماده">
          <div className="space-y-3">
            {CANNED_REPLIES.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200/70 px-4 py-3.5"
              >
                <span className="text-[11.5px] text-slate-600">{item.label}</span>
                <Button variant="ghost" onClick={() => setReplyBody(item.text)}>
                  درج
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
