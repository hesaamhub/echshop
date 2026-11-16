"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useFirebase } from "@/components/providers/FirebaseProvider"
import { Badge, Card, StatCard, Table, Td } from "@/components/panel/Ui"
import {
  fetchUserNotifications,
  fetchUserOrders,
  fetchUserTickets,
  type FirestoreNotification,
  type FirestoreOrder,
  type FirestoreTicket,
} from "@/lib/firebase/repository"
import { deliveryLabels, orderStatusLabels } from "@/lib/types"
import { faDate, toman } from "@/lib/utils"

const statusTone = {
  pending: "amber",
  paid: "blue",
  delivered: "green",
  failed: "red",
  refunded: "gray",
} as const

export default function DashboardHome() {
  const { user, publicProfile } = useFirebase()
  const [orders, setOrders] = useState<FirestoreOrder[]>([])
  const [tickets, setTickets] = useState<FirestoreTicket[]>([])
  const [notifications, setNotifications] = useState<FirestoreNotification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.uid) return
    let active = true
    setLoading(true)
    Promise.all([
      fetchUserOrders(user.uid),
      fetchUserTickets(user.uid),
      fetchUserNotifications(user.uid),
    ])
      .then(([ordersData, ticketsData, notifData]) => {
        if (!active) return
        setOrders(ordersData)
        setTickets(ticketsData)
        setNotifications(notifData)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [user?.uid])

  const deliveredCount = orders.filter((o) => o.status === "delivered").length
  const activeOrdersCount = orders.filter((o) => o.status === "pending" || o.status === "paid").length
  const openTicketsCount = tickets.filter((t) => t.status !== "closed").length
  const recent = orders.slice(0, 5)

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="سفارش‌های تحویل‌شده"
          value={`${toman(deliveredCount)} سفارش`}
          hint={`از مجموع ${toman(orders.length)} سفارش`}
          tone="up"
        />
        <StatCard
          label="موجودی کیف پول"
          value={`${toman(publicProfile?.walletBalance ?? 0)} تومان`}
          hint="قابل استفاده در خرید"
        />
        <StatCard
          label="در انتظار تحویل"
          value={`${toman(activeOrdersCount)} سفارش`}
          hint="سفارش‌های در صف انجام"
        />
        <StatCard
          label="تیکت‌های باز"
          value={`${toman(openTicketsCount)} تیکت`}
          hint={openTicketsCount > 0 ? "در حال بررسی پشتیبانی" : "تیکت بازی ندارید"}
          tone={openTicketsCount > 0 ? "down" : "neutral"}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Card
          title="آخرین سفارش‌ها"
          action={
            <Link href="/dashboard/orders" className="text-[11.5px] font-semibold text-[#1b39f5]">
              مشاهدهٔ همه
            </Link>
          }
        >
          {loading ? (
            <p className="py-6 text-center text-[12px] text-slate-400">در حال دریافت سفارش‌ها…</p>
          ) : recent.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-[12.5px] text-slate-500">هنوز سفارشی ثبت نکرده‌اید.</p>
              <Link href="/products" className="mt-3 inline-block text-[12px] font-bold text-[#1b39f5]">
                مشاهدهٔ محصولات فروشگاه
              </Link>
            </div>
          ) : (
            <Table head={["شماره سفارش", "محصول", "نوع تحویل", "مبلغ", "وضعیت", "تاریخ"]}>
              {recent.map((order) => (
                <tr key={order.id}>
                  <Td className="num font-semibold text-[#0a1b33]">{order.orderNumber}</Td>
                  <Td>{order.productTitle}</Td>
                  <Td>{deliveryLabels[order.delivery]}</Td>
                  <Td className="num">{toman(order.amount)}</Td>
                  <Td>
                    <Badge tone={statusTone[order.status]}>{orderStatusLabels[order.status]}</Badge>
                  </Td>
                  <Td className="text-slate-400">{faDate(order.createdAt)}</Td>
                </tr>
              ))}
            </Table>
          )}
        </Card>

        <Card title="اطلاع‌رسانی‌ها">
          {loading ? (
            <p className="py-6 text-center text-[12px] text-slate-400">در حال بارگذاری…</p>
          ) : notifications.length === 0 ? (
            <p className="py-8 text-center text-[12px] text-slate-400">اطلاعیه‌ای برای شما ثبت نشده است.</p>
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 4).map((item) => (
                <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12.5px] font-bold text-[#0a1b33]">{item.title}</span>
                    <span className="text-[10.5px] text-slate-400">{faDate(item.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-[11.5px] leading-6 text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
