"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useFirebase } from "@/components/providers/FirebaseProvider"
import { Badge, Card } from "@/components/panel/Ui"
import { fetchUserOrders, type FirestoreOrder } from "@/lib/firebase/repository"
import { deliveryLabels, orderStatusLabels, type OrderStatus } from "@/lib/types"
import { faDate, toman } from "@/lib/utils"

const statusTone = {
  pending: "amber",
  paid: "blue",
  delivered: "green",
  failed: "red",
  refunded: "gray",
} as const

export default function OrdersPage() {
  const { user } = useFirebase()
  const [orders, setOrders] = useState<FirestoreOrder[]>([])
  const [filter, setFilter] = useState<"all" | OrderStatus>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.uid) return
    let active = true
    setLoading(true)
    fetchUserOrders(user.uid)
      .then((data) => {
        if (active) setOrders(data)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [user?.uid])

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter)

  return (
    <div className="space-y-4">
      <Card title="فیلتر سفارش‌ها">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={
              filter === "all"
                ? "rounded-full bg-[#0a152d] px-4 py-2 text-[11.5px] font-semibold text-white"
                : "rounded-full border border-slate-200 px-4 py-2 text-[11.5px] font-medium text-slate-600 hover:border-slate-300"
            }
          >
            همه ({orders.length})
          </button>
          {(Object.entries(orderStatusLabels) as [OrderStatus, string][]).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={
                filter === key
                  ? "rounded-full bg-[#0a152d] px-4 py-2 text-[11.5px] font-semibold text-white"
                  : "rounded-full border border-slate-200 px-4 py-2 text-[11.5px] font-medium text-slate-600 hover:border-slate-300"
              }
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      {loading ? (
        <Card>
          <p className="py-8 text-center text-[12.5px] text-slate-400">در حال بارگذاری سفارش‌ها…</p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <div className="py-8 text-center">
            <p className="text-[13px] font-semibold text-slate-500">سفارشی در این بخش وجود ندارد.</p>
            <Link href="/products" className="glass-solid mt-4 inline-flex rounded-full px-5 py-2 text-[12px] font-semibold">
              مشاهدهٔ محصولات
            </Link>
          </div>
        </Card>
      ) : (
        filtered.map((order) => (
          <Card key={order.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="num text-[13px] font-bold text-[#0a1b33]">{order.orderNumber}</span>
                  <Badge tone={statusTone[order.status]}>{orderStatusLabels[order.status]}</Badge>
                  <Badge tone="blue">{deliveryLabels[order.delivery]}</Badge>
                </div>
                <h3 className="mt-2.5 text-[13.5px] font-bold text-[#0a1b33]">
                  {order.productTitle} {order.quantity > 1 ? `(${order.quantity}×)` : ""}
                </h3>
                <p className="mt-1 text-[11.5px] text-slate-500">{order.planTitle}</p>
                <p className="mt-2 text-[11px] text-slate-400">ثبت سفارش: {faDate(order.createdAt)}</p>
              </div>
              <div className="text-left">
                <span className="num text-[15px] font-bold text-[#0a1b33]">{toman(order.amount)}</span>
                <span className="block text-[10.5px] text-slate-400">تومان</span>
              </div>
            </div>

            {order.status === "delivered" && (order.deliveryCredentialsText || order.deliveryNote) ? (
              <div className="mt-5 rounded-2xl border border-[#cfe6f7] bg-[#f2f9fe] p-5">
                <h4 className="text-[12.5px] font-bold text-[#1c5f9e]">اطلاعات تحویل</h4>
                {order.deliveryCredentialsText ? (
                  <pre
                    dir="ltr"
                    className="font-latin mt-3 whitespace-pre-wrap rounded-xl bg-white px-4 py-3 text-left text-[12px] leading-6 text-[#0a1b33]"
                  >
                    {order.deliveryCredentialsText}
                  </pre>
                ) : null}
                {order.deliveryNote ? (
                  <p className="mt-3 text-[11.5px] leading-6 text-slate-600">{order.deliveryNote}</p>
                ) : null}
              </div>
            ) : order.status === "pending" || order.status === "paid" ? (
              <div className="mt-5 rounded-2xl border border-[#f2e2c6] bg-[#fdf8ef] p-5 text-[11.5px] leading-6 text-[#9A6321]">
                {order.deliveryNote || "سفارش شما در صف تحویل است و به‌زودی تکمیل می‌شود."}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl bg-slate-50 p-5 text-[11.5px] leading-6 text-slate-500">
                {order.deliveryNote || "جزئیات بیشتری برای این سفارش ثبت نشده است."}
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href={`/dashboard/tickets?order=${order.orderNumber}`}
                className="glass-plate glass-plate-hover rounded-full px-5 py-2 text-[12px] font-semibold text-[#1b39f5]"
              >
                ثبت تیکت برای این سفارش
              </Link>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
