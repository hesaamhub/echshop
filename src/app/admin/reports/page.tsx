"use client"

import { useCallback, useEffect, useState } from "react"
import { Badge, Card, StatCard, Table, Td } from "@/components/panel/Ui"
import {
  fetchAllOrders,
  fetchAllTickets,
  fetchAllUsersAsAdmin,
  fetchInventoryItems,
  type FirestoreInventoryItem,
  type FirestoreOrder,
  type FirestoreTicket,
} from "@/lib/firebase/repository"
import { deliveryLabels, orderStatusLabels, ticketStatusLabels, type DeliveryMethod } from "@/lib/types"
import { faDate, toman } from "@/lib/utils"

const deliveryOrder: DeliveryMethod[] = ["stock", "api", "upgrade", "gift_code", "manual", "scheduled"]

export default function AdminReportsPage() {
  const [orders, setOrders] = useState<FirestoreOrder[]>([])
  const [tickets, setTickets] = useState<FirestoreTicket[]>([])
  const [inventory, setInventory] = useState<FirestoreInventoryItem[]>([])
  const [userCount, setUserCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [ordersData, ticketsData, invData, usersData] = await Promise.all([
        fetchAllOrders(),
        fetchAllTickets(),
        fetchInventoryItems(),
        fetchAllUsersAsAdmin(),
      ])
      setOrders(ordersData)
      setTickets(ticketsData)
      setInventory(invData)
      setUserCount(usersData.length)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const paidOrDelivered = orders.filter((o) => o.status === "delivered" || o.status === "paid")
  const totalRevenue = paidOrDelivered.reduce((sum, o) => sum + o.amount, 0)
  const deliveredRate =
    orders.length > 0 ? Math.round((orders.filter((o) => o.status === "delivered").length / orders.length) * 100) : 0
  const availableStock = inventory.filter((i) => i.status === "available").length

  const byDelivery = deliveryOrder.map((key) => {
    const matched = orders.filter((o) => o.delivery === key)
    return {
      key,
      orders: matched.length,
      revenue: matched
        .filter((o) => o.status === "delivered" || o.status === "paid")
        .reduce((sum, o) => sum + o.amount, 0),
    }
  })

  const maxDeliveryRevenue = Math.max(1, ...byDelivery.map((r) => r.revenue))

  const activityItems = [
    ...orders.slice(0, 6).map((order) => ({
      id: `ord-${order.id}`,
      date: order.createdAt,
      badge: orderStatusLabels[order.status],
      tone: (order.status === "delivered" ? "green" : order.status === "failed" ? "red" : "blue") as
        | "green"
        | "red"
        | "blue",
      text: `سفارش ${order.orderNumber} (${order.productTitle}) — ${toman(order.amount)} تومان`,
    })),
    ...tickets.slice(0, 4).map((ticket) => ({
      id: `tk-${ticket.id}`,
      date: ticket.updatedAt,
      badge: ticketStatusLabels[ticket.status],
      tone: (ticket.status === "answered" ? "green" : "amber") as "green" | "amber",
      text: `تیکت ${ticket.id}: ${ticket.subject}`,
    })),
  ].slice(0, 8)

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="مجموع درآمد تاییدشده" value={`${toman(totalRevenue)} تومان`} tone="up" />
        <StatCard label="کل سفارش‌ها" value={`${toman(orders.length)} سفارش`} hint={`${toman(deliveredRate)}٪ تحویل‌شده`} tone="up" />
        <StatCard label="کاربران ثبت‌شده" value={`${toman(userCount)} کاربر`} />
        <StatCard label="موجودی انبار آماده" value={`${toman(availableStock)} مورد`} />
      </div>

      <Card title="عملکرد بر اساس روش تحویل">
        {loading ? (
          <p className="py-8 text-center text-[12px] text-slate-400">در حال محاسبهٔ گزارش‌ها…</p>
        ) : (
          <Table head={["روش تحویل", "تعداد سفارش", "درآمد", "سهم از فروش"]}>
            {byDelivery.map((row) => (
              <tr key={row.key}>
                <Td className="font-semibold text-[#0a1b33]">{deliveryLabels[row.key]}</Td>
                <Td className="num">{toman(row.orders)}</Td>
                <Td className="num">{toman(row.revenue)}</Td>
                <Td>
                  <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#1b39f5]"
                      style={{ width: `${Math.round((row.revenue / maxDeliveryRevenue) * 100)}%` }}
                    />
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Card title="رویدادهای اخیر سامانه">
        {activityItems.length === 0 ? (
          <p className="py-8 text-center text-[12px] text-slate-400">هنوز رویدادی ثبت نشده است.</p>
        ) : (
          <div className="space-y-3">
            {activityItems.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/70 px-4 py-3.5">
                <span className="num text-[11px] text-slate-400">{faDate(item.date)}</span>
                <Badge tone={item.tone}>{item.badge}</Badge>
                <span className="flex-1 text-[11.5px] text-slate-600">{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
