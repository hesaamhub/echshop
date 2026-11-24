"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Check, Copy } from "lucide-react"
import { useFirebase } from "@/components/providers/FirebaseProvider"
import OrderStatusTracker from "@/components/panel/OrderStatusTracker"
import { Badge, Card } from "@/components/panel/Ui"
import { fetchUserOrders, type FirestoreOrder } from "@/lib/firebase/repository"
import { deliveryLabels, orderStatusLabels, type OrderStatus } from "@/lib/types"
import { faDate, toman } from "@/lib/utils"

const statusTone = {
  pending:"amber",
  paid:"blue",
  delivered:"green",
  failed:"red",
  refunded:"gray",
} as const

export default function OrdersPage() {
  const { user } = useFirebase()
  const [orders, setOrders] = useState<FirestoreOrder[]>([])
  const [filter, setFilter] = useState<"all" | OrderStatus>("all")
  const [loading, setLoading] = useState(true)
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null)

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

  async function copyCredentials(orderId: string, text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedOrderId(orderId)
      window.setTimeout(() => {
        setCopiedOrderId((prev) => (prev === orderId ? null : prev))
      }, 2000)
    } catch {
      // Clipboard blocked in restricted contexts
    }
  }

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
                ? "num whitespace-nowrap shrink-0 rounded-full bg-[#0a152d] px-4 py-2 text-[11.5px] font-semibold text-white"
                : "num whitespace-nowrap shrink-0 rounded-full border border-slate-200 px-4 py-2 text-[11.5px] font-medium text-slate-600 hover:border-slate-300"
            }
          >
            همه ({orders.length})
          </button>
          {(Object.entries(orderStatusLabels) as [OrderStatus, string][]).map(([key, label]) => {
            const count = orders.filter((o) => o.status === key).length
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={
                  filter === key
                    ? "num whitespace-nowrap shrink-0 rounded-full bg-[#0a152d] px-4 py-2 text-[11.5px] font-semibold text-white"
                    : "num whitespace-nowrap shrink-0 rounded-full border border-slate-200 px-4 py-2 text-[11.5px] font-medium text-slate-600 hover:border-slate-300"
                }
              >
                {label} ({count})
              </button>
            )
          })}
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
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="num text-[13px] font-bold text-[#0a1b33]">{order.orderNumber}</span>
                  <Badge tone={statusTone[order.status]}>{orderStatusLabels[order.status]}</Badge>
                  <Badge tone="blue">{deliveryLabels[order.delivery]}</Badge>
                </div>
                <h3 className="mt-2.5 text-[14px] font-bold text-[#0a1b33]">
                  {order.productTitle} {order.quantity > 1 ? `(${order.quantity}×)` : ""}
                </h3>
                <p className="mt-1 text-[11.5px] text-slate-500">{order.planTitle}</p>
                <p className="mt-1.5 text-[11px] text-slate-400">ثبت سفارش: {faDate(order.createdAt)}</p>
              </div>
              <div className="text-left">
                <span className="num text-[15px] font-bold text-[#0a1b33]">{toman(order.amount)}</span>
                <span className="block text-[10.5px] text-slate-400">تومان</span>
              </div>
            </div>

            <OrderStatusTracker
              status={order.status}
              delivery={order.delivery}
              createdAt={order.createdAt}
              deliveryNote={order.deliveryNote}
              statusLabels={orderStatusLabels}
            />

            {order.status === "delivered" && order.deliveryCredentialsText ? (
              <div className="mt-4 rounded-2xl border border-[#cfe6f7] bg-[#f2f9fe] p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-[12.5px] font-bold text-[#1c5f9e]">اطلاعات تحویل</h4>
                  <button
                    type="button"
                    onClick={() => void copyCredentials(order.id, order.deliveryCredentialsText!)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#1c5f9e]/20 bg-white px-3 py-1.5 text-[11px] font-semibold text-[#1c5f9e] transition-colors hover:bg-[#e5f2fc]"
                  >
                    {copiedOrderId === order.id ? (
                      <>
                        <Check className="h-3.5 w-3.5" aria-hidden />
                        کپی شد
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden />
                        کپی اطلاعات
                      </>
                    )}
                  </button>
                </div>
                <pre
                  dir="ltr"
                  className="font-latin mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-white px-4 py-3 text-left text-[12px] leading-6 text-[#0a1b33]"
                >
                  {order.deliveryCredentialsText}
                </pre>
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href={`/dashboard/tickets?order=${order.orderNumber}`}
                className="glass-plate glass-plate-hover whitespace-nowrap rounded-full px-5 py-2 text-[12px] font-semibold text-[#1b39f5]"
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

