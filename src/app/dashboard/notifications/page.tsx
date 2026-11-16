"use client"

import { useCallback, useEffect, useState } from "react"
import { useFirebase } from "@/components/providers/FirebaseProvider"
import { Badge, Button, Card } from "@/components/panel/Ui"
import {
  fetchUserNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type FirestoreNotification,
} from "@/lib/firebase/repository"
import { faDate } from "@/lib/utils"

export default function NotificationsPage() {
  const { user } = useFirebase()
  const [items, setItems] = useState<FirestoreNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    if (!user?.uid) return
    setLoading(true)
    try {
      setItems(await fetchUserNotifications(user.uid))
    } finally {
      setLoading(false)
    }
  }, [user?.uid])

  useEffect(() => {
    void load()
  }, [load])

  async function handleReadAll() {
    if (!user?.uid) return
    const unreadIds = items.filter((n) => n.unread).map((n) => n.id)
    if (unreadIds.length === 0) return
    setBusy(true)
    try {
      await markAllNotificationsRead(user.uid, unreadIds)
      setItems((prev) => prev.map((n) => ({ ...n, unread: false })))
    } finally {
      setBusy(false)
    }
  }

  async function handleReadOne(id: string) {
    if (!user?.uid) return
    await markNotificationRead(user.uid, id)
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)))
  }

  return (
    <div className="space-y-4">
      <Card
        title="اطلاع‌رسانی‌ها"
        action={
          items.some((n) => n.unread) ? (
            <Button variant="ghost" disabled={busy} onClick={() => void handleReadAll()}>
              خوانده شدن همه
            </Button>
          ) : undefined
        }
      >
        {loading ? (
          <p className="py-8 text-center text-[12px] text-slate-400">در حال بارگذاری اطلاع‌رسانی‌ها…</p>
        ) : items.length === 0 ? (
          <p className="py-8 text-center text-[12px] text-slate-400">اطلاعیه‌ای برای نمایش وجود ندارد.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => (item.unread ? void handleReadOne(item.id) : undefined)}
                className={
                  item.unread
                    ? "cursor-pointer rounded-2xl border border-[#cfe6f7] bg-[#f2f9fe] p-5"
                    : "rounded-2xl bg-slate-50 p-5"
                }
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[13px] font-bold text-[#0a1b33]">{item.title}</span>
                    {item.unread ? <Badge tone="blue">جدید</Badge> : null}
                  </div>
                  <span className="text-[10.5px] text-slate-400">{faDate(item.createdAt)}</span>
                </div>
                <p className="mt-2.5 text-[12px] leading-7 text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
