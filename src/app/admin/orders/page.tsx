"use client"

import { useCallback, useEffect, useState } from "react"
import { AdminTableSkeleton } from "@/components/panel/AdminSkeletons"
import { Badge, Button, Card, Table, Td } from "@/components/panel/Ui"
import { deliverOrderAsAdmin, fetchAllOrders, type FirestoreOrder } from "@/lib/firebase/repository"
import { deliveryLabels, orderStatusLabels, type OrderStatus } from "@/lib/types"
import { resolveLoadingPhase } from "@/lib/ui/loadingState"
import { faDate, toman } from "@/lib/utils"

const statusTone = {
  pending:"amber",
  paid:"blue",
  delivered:"green",
  failed:"red",
  refunded:"gray",
} as const

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<FirestoreOrder[]>([])
  const [filter, setFilter] = useState<"all" | OrderStatus>("all")
  const [selectedOrderId, setSelectedOrderId] = useState("")
  const [status, setStatus] = useState<OrderStatus>("delivered")
  const [credentialsText, setCredentialsText] = useState("")
  const [deliveryNote, setDeliveryNote] = useState("")
  const [loading, setLoading] = useState(true)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const list = await fetchAllOrders()
      setOrders(list)
      if (list.length > 0 && !selectedOrderId) {
        setSelectedOrderId(list[0].id)
      }
    } finally {
      setHasLoadedOnce(true)
      setLoading(false)
    }
  }, [selectedOrderId])

  useEffect(() => {
    void load()
  }, [load])

  function selectOrder(order: FirestoreOrder) {
    setSelectedOrderId(order.id)
    setStatus(order.status === "pending" || order.status === "paid" ? "delivered" : order.status)
    setCredentialsText(order.deliveryCredentialsText ?? "")
    setDeliveryNote(order.deliveryNote ?? "")
    setFeedback("")
  }

  async function handleDeliver(event: React.FormEvent) {
    event.preventDefault()
    if (!selectedOrderId) return
    setBusy(true)
    setFeedback("")
    try {
      await deliverOrderAsAdmin(selectedOrderId, {
        status,
        deliveryCredentialsText: credentialsText,
        deliveryNote,
      })
      setFeedback(`سفارش ${selectedOrderId} به‌روزرسانی شد.`)
      await load()
    } finally {
      setBusy(false)
    }
  }

  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter)
  const loadingPhase = resolveLoadingPhase({ isLoading: loading, hasData: hasLoadedOnce })
  const initialLoading = loadingPhase === "initial-skeleton"
  const isRefreshing = loadingPhase === "refresh-overlay"

  return (
    <div className="space-y-5" data-loading-phase={loadingPhase}>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={
            filter === "all"
              ? "rounded-full bg-[#0a152d] px-4 py-2 text-[11.5px] font-semibold text-white"
              : "rounded-full border border-slate-200 bg-white px-4 py-2 text-[11.5px] font-semibold text-slate-500 hover:border-slate-300"
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
                : "rounded-full border border-slate-200 bg-white px-4 py-2 text-[11.5px] font-semibold text-slate-500 hover:border-slate-300"
            }
          >
            {label}
          </button>
        ))}
      </div>

      <Card
        title="مدیریت سفارش‌ها"
        refreshing={isRefreshing}
        refreshLabel="در حال بروزرسانی سفارش‌ها…"
      >
        {initialLoading ? (
          <AdminTableSkeleton columns={9} rows={6} />
        ) : visible.length === 0 ? (
          <p className="py-8 text-center text-[12px] text-slate-400">سفارشی در این فیلتر ثبت نشده است.</p>
        ) : (
          <Table head={["شماره", "کاربر", "محصول", "پلن", "تحویل", "مبلغ", "وضعیت", "تاریخ", "عملیات"]}>
            {visible.map((order) => (
              <tr key={order.id}>
                <Td className="num font-semibold text-[#0a1b33]">{order.orderNumber}</Td>
                <Td>
                  <div className="font-semibold text-[#0a1b33]">{order.customerName}</div>
                  <div dir="ltr" className="font-latin text-right text-[10.5px] text-slate-400">{order.customerEmail}</div>
                </Td>
                <Td>{order.productTitle}</Td>
                <Td>{order.planTitle}</Td>
                <Td>
                  <Badge tone="blue">{deliveryLabels[order.delivery]}</Badge>
                </Td>
                <Td className="num">{toman(order.amount)}</Td>
                <Td>
                  <Badge tone={statusTone[order.status]}>{orderStatusLabels[order.status]}</Badge>
                </Td>
                <Td className="text-slate-400">{faDate(order.createdAt)}</Td>
                <Td>
                  <Button variant="ghost" onClick={() => selectOrder(order)}>
                    تحویل / ویرایش
                  </Button>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Card title="تحویل و تغییر وضعیت سفارش">
        <form onSubmit={(e) => void handleDeliver(e)} className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block">
              <span className="text-[12px] font-semibold text-[#0a1b33]">سفارش</span>
              <select
                value={selectedOrderId}
                onChange={(e) => {
                  const found = orders.find((o) => o.id === e.target.value)
                  if (found) selectOrder(found)
                  else setSelectedOrderId(e.target.value)
                }}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-[#0a1b33] outline-none focus:border-[#1b39f5]"
              >
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.orderNumber} — {order.productTitle}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-[12px] font-semibold text-[#0a1b33]">وضعیت جدید</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-[#0a1b33] outline-none focus:border-[#1b39f5]"
              >
                {(Object.entries(orderStatusLabels) as [OrderStatus, string][]).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-[12px] font-semibold text-[#0a1b33]">اطلاعات اکانت یا کد تحویل</span>
            <textarea
              rows={4}
              dir="ltr"
              value={credentialsText}
              onChange={(e) => setCredentialsText(e.target.value)}
              placeholder={"email: user@mail.com\npassword: ******"}
              className="font-latin mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-[12px] text-[#0a1b33] placeholder:text-slate-400 outline-none focus:border-[#1b39f5]"
            />
          </label>

          <label className="block">
            <span className="text-[12px] font-semibold text-[#0a1b33]">توضیح تحویل برای مشتری</span>
            <input
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
              placeholder="مانند: رمز اکانت را تغییر ندهید"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-[#0a1b33] placeholder:text-slate-400 outline-none focus:border-[#1b39f5]"
            />
          </label>

          {feedback ? <p className="text-[12px] font-semibold text-[#2F7A50]">{feedback}</p> : null}

          <Button type="submit" disabled={busy || !selectedOrderId}>
            {busy ? "در حال ثبت…" : "ذخیره وضعیت و تحویل"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
