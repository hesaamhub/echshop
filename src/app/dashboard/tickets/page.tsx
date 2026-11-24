"use client"

import { Suspense, useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useFirebase } from "@/components/providers/FirebaseProvider"
import { Badge, Button, Card, Field } from "@/components/panel/Ui"
import {
  addTicketMessage,
  createTicket,
  fetchTicketMessages,
  fetchUserTickets,
  type FirestoreTicket,
  type FirestoreTicketMessage,
} from "@/lib/firebase/repository"
import { ticketStatusLabels } from "@/lib/types"
import { faDate } from "@/lib/utils"

const tone = {
  open:"amber",
  answered:"green",
  pending_user:"blue",
  closed:"gray",
} as const

type Department ="پشتیبانی فنی" |"مالی و پرداخت" |"پیش از خرید"
type Priority ="کم" |"متوسط" |"زیاد"

function TicketsInner() {
  const searchParams = useSearchParams()
  const { user, publicProfile } = useFirebase()

  const [tickets, setTickets] = useState<FirestoreTicket[]>([])
  const [messagesByTicket, setMessagesByTicket] = useState<Record<string, FirestoreTicketMessage[]>>({})
  const [replyByTicket, setReplyByTicket] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  const [subject, setSubject] = useState("")
  const [department, setDepartment] = useState<Department>("پشتیبانی فنی")
  const [priority, setPriority] = useState<Priority>("متوسط")
  const [body, setBody] = useState("")
  const [orderId, setOrderId] = useState(searchParams.get("order") ?? "")
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState("")

  const loadTickets = useCallback(async () => {
    if (!user?.uid) return
    setLoading(true)
    try {
      const list = await fetchUserTickets(user.uid)
      setTickets(list)
      const entries = await Promise.all(
        list.map(async (t) => [t.id, await fetchTicketMessages(t.id, user.uid, false)] as const),
      )
      setMessagesByTicket(Object.fromEntries(entries))
    } finally {
      setLoading(false)
    }
  }, [user?.uid])

  useEffect(() => {
    void loadTickets()
  }, [loadTickets])

  async function handleCreateTicket(event: React.FormEvent) {
    event.preventDefault()
    if (!user) return
    setError("")
    setFeedback("")
    if (!subject.trim() || !body.trim()) {
      setError("موضوع و شرح مشکل را کامل کنید.")
      return
    }
    setBusy(true)
    try {
      const id = await createTicket({
        userId: user.uid,
        userName: publicProfile?.displayName || user.displayName || "کاربر",
        subject,
        department,
        priority,
        body,
        orderId,
      })
      setSubject("")
      setBody("")
      setOrderId("")
      setFeedback(`تیکت ${id} با موفقیت ثبت شد.`)
      await loadTickets()
    } catch {
      setError("ثبت تیکت انجام نشد. دوباره تلاش کنید.")
    } finally {
      setBusy(false)
    }
  }

  async function handleReply(ticket: FirestoreTicket) {
    if (!user) return
    const text = (replyByTicket[ticket.id] ?? "").trim()
    if (!text) return
    setBusy(true)
    try {
      await addTicketMessage({
        ticketId: ticket.id,
        ticketOwnerId: ticket.userId,
        senderId: user.uid,
        senderRole:"user",
        body: text,
        nextStatus:"open",
      })
      setReplyByTicket((prev) => ({ ...prev, [ticket.id]:"" }))
      await loadTickets()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
      <div className="space-y-4">
        {loading ? (
          <Card>
            <p className="py-8 text-center text-[12.5px] text-slate-400">در حال بارگذاری تیکت‌ها…</p>
          </Card>
        ) : tickets.length === 0 ? (
          <Card>
            <p className="py-8 text-center text-[12.5px] text-slate-500">هنوز تیکتی ثبت نکرده‌اید.</p>
          </Card>
        ) : (
          tickets.map((ticket) => {
            const messages = messagesByTicket[ticket.id] ?? []
            return (
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
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={
                        message.senderRole === "support"
                          ? "rounded-2xl border border-[#cfe6f7] bg-[#f2f9fe] p-4"
                          : "rounded-2xl bg-slate-50 p-4"
                      }
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11.5px] font-bold text-[#0a1b33]">
                          {message.senderRole === "support" ? "پشتیبانی اچ‌شاپ" : "شما"}
                        </span>
                        <span className="text-[10px] text-slate-400">{faDate(message.createdAt)}</span>
                      </div>
                      <p className="mt-2 text-[11.5px] leading-7 text-slate-600">{message.body}</p>
                    </div>
                  ))}
                </div>

                {ticket.status !== "closed" ? (
                  <div className="mt-4 flex gap-2">
                    <input
                      value={replyByTicket[ticket.id] ?? ""}
                      onChange={(event) =>
                        setReplyByTicket((prev) => ({ ...prev, [ticket.id]: event.target.value }))
                      }
                      placeholder="پاسخ خود را بنویسید…"
                      className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-[11.5px] text-[#0a1b33] placeholder:text-slate-400 outline-none focus:border-[#1b39f5]"
                    />
                    <Button disabled={busy} onClick={() => void handleReply(ticket)}>
                      ارسال
                    </Button>
                  </div>
                ) : null}
              </Card>
            )
          })
        )}
      </div>

      <Card title="ثبت تیکت جدید" className="h-fit">
        <form className="space-y-4" onSubmit={(event) => void handleCreateTicket(event)}>
          <Field
            label="موضوع"
            placeholder="مانند: مشکل در ورود به اکانت"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            required
          />
          <label className="block">
            <span className="text-[12px] font-semibold text-[#0a1b33]">دپارتمان</span>
            <select
              value={department}
              onChange={(event) => setDepartment(event.target.value as Department)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-[#0a1b33] outline-none focus:border-[#1b39f5]"
            >
              <option value="پشتیبانی فنی">پشتیبانی فنی</option>
              <option value="مالی و پرداخت">مالی و پرداخت</option>
              <option value="پیش از خرید">پیش از خرید</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[12px] font-semibold text-[#0a1b33]">اولویت</span>
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value as Priority)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-[#0a1b33] outline-none focus:border-[#1b39f5]"
            >
              <option value="کم">کم</option>
              <option value="متوسط">متوسط</option>
              <option value="زیاد">زیاد</option>
            </select>
          </label>
          <Field
            label="شرح مشکل"
            textarea
            rows={5}
            placeholder="جزئیات را کامل بنویسید تا سریع‌تر بررسی شود…"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            required
          />
          <Field
            label="شمارهٔ سفارش مرتبط (اختیاری)"
            placeholder="ECH-10477"
            latin
            value={orderId}
            onChange={(event) => setOrderId(event.target.value)}
          />
          {feedback ? <p className="text-[11.5px] font-semibold text-[#2F7A50]">{feedback}</p> : null}
          {error ? <p className="text-[11.5px] font-semibold text-[#A8382C]">{error}</p> : null}
          <Button type="submit" disabled={busy}>
            {busy ? "در حال ارسال…" : "ارسال تیکت"}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default function TicketsPage() {
  return (
    <Suspense fallback={<Card><p className="py-8 text-center text-[12px] text-slate-400">در حال بارگذاری…</p></Card>}>
      <TicketsInner />
    </Suspense>
  )
}
