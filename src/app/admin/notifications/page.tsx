"use client"

import { useCallback, useEffect, useState } from "react"
import { Badge, Button, Card, Field, Table, Td } from "@/components/panel/Ui"
import {
  createNotificationAsAdmin,
  deleteNotificationAsAdmin,
  fetchAllUsersAsAdmin,
  fetchUserNotifications,
  sendBroadcastNotificationAsAdmin,
  type FirestoreNotification,
  type UserPublicProfile,
} from "@/lib/firebase/repository"
import { faDate } from "@/lib/utils"

export default function AdminNotificationsPage() {
  const [users, setUsers] = useState<UserPublicProfile[]>([])
  const [targetUid, setTargetUid] = useState<string>("all")
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [inspectUid, setInspectUid] = useState<string>("")
  const [notifications, setNotifications] = useState<FirestoreNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState("")

  const loadNotificationsFor = useCallback(async (uid: string) => {
    if (!uid) {
      setNotifications([])
      return
    }
    const list = await fetchUserNotifications(uid)
    setNotifications(list)
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const usersList = await fetchAllUsersAsAdmin()
      setUsers(usersList)
      const initialInspect = inspectUid || usersList[0]?.uid || ""
      if (initialInspect) {
        setInspectUid(initialInspect)
        await loadNotificationsFor(initialInspect)
      }
    } finally {
      setLoading(false)
    }
  }, [inspectUid, loadNotificationsFor])

  useEffect(() => {
    void load()
  }, [load])

  async function handleSend(event: React.FormEvent) {
    event.preventDefault()
    if (!title.trim() || !body.trim()) return
    setBusy(true)
    setFeedback("")
    setError("")
    try {
      if (targetUid === "all") {
        const count = await sendBroadcastNotificationAsAdmin(title, body)
        setFeedback(`اطلاعیه برای ${count} کاربر ثبت‌شده ارسال شد.`)
      } else {
        await createNotificationAsAdmin(targetUid, title, body)
        setFeedback("اطلاعیه برای کاربر انتخاب‌شده ارسال شد.")
      }
      setTitle("")
      setBody("")
      if (inspectUid) {
        await loadNotificationsFor(inspectUid)
      }
    } catch {
      setError("ارسال اطلاعیه با خطا مواجه شد.")
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(notification: FirestoreNotification) {
    setFeedback("")
    setError("")
    try {
      await deleteNotificationAsAdmin(notification.userId, notification.id)
      await loadNotificationsFor(notification.userId)
      setFeedback("اطلاعیه حذف شد.")
    } catch {
      setError("حذف اطلاعیه انجام نشد.")
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_1.1fr]">
      <Card title="ارسال اطلاع‌رسانی به کاربران">
        <form onSubmit={(e) => void handleSend(e)} className="space-y-4">
          <Field
            label="عنوان پیام"
            placeholder="مانند: جشنوارهٔ تخفیف تابستانه"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Field
            label="متن پیام"
            textarea
            rows={5}
            placeholder="متن کامل اطلاعیه…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
          <label className="block">
            <span className="text-[12px] font-semibold text-[#0a1b33]">مخاطب</span>
            <select
              value={targetUid}
              onChange={(e) => setTargetUid(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-[#1b39f5]/12 bg-[#1b39f5]/4 px-4 py-3 text-[12px] text-[#0a1b33] outline-none focus:border-[#1b39f5]/45 focus:bg-white"
            >
              <option value="all">همهٔ کاربران ({users.length} نفر)</option>
              {users.map((u) => (
                <option key={u.uid} value={u.uid}>
                  {u.displayName}
                </option>
              ))}
            </select>
          </label>

          {error ? <p className="text-[12px] font-semibold text-[#A8382C]">{error}</p> : null}
          {feedback ? <p className="text-[12px] font-semibold text-[#2F7A50]">{feedback}</p> : null}

          <Button type="submit" disabled={busy || !title.trim() || !body.trim() || users.length === 0}>
            {busy ? "در حال ارسال…" : "ارسال اطلاعیه"}
          </Button>
        </form>
      </Card>

      <Card
        title="اطلاعیه‌های کاربر"
        action={
          users.length > 0 ? (
            <select
              value={inspectUid}
              onChange={(e) => {
                setInspectUid(e.target.value)
                void loadNotificationsFor(e.target.value)
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11.5px] text-[#0a1b33] outline-none focus:border-[#1b39f5]"
            >
              {users.map((u) => (
                <option key={u.uid} value={u.uid}>
                  {u.displayName}
                </option>
              ))}
            </select>
          ) : null
        }
      >
        {loading ? (
          <p className="py-8 text-center text-[12px] text-slate-400">در حال بارگذاری اطلاعیه‌ها…</p>
        ) : notifications.length === 0 ? (
          <p className="py-8 text-center text-[12px] text-slate-400">اطلاعیه‌ای برای این کاربر ثبت نشده است.</p>
        ) : (
          <Table head={["عنوان", "تاریخ", "وضعیت", "عملیات"]}>
            {notifications.map((item) => (
              <tr key={item.id}>
                <Td className="font-semibold text-[#0a1b33]">{item.title}</Td>
                <Td className="text-slate-400">{faDate(item.createdAt)}</Td>
                <Td>
                  <Badge tone={item.unread ? "blue" : "gray"}>
                    {item.unread ? "خوانده‌نشده" : "خوانده‌شده"}
                  </Badge>
                </Td>
                <Td>
                  <Button variant="danger" onClick={() => void handleDelete(item)}>
                    حذف
                  </Button>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  )
}
