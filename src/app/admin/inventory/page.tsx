"use client"

import { useCallback, useEffect, useState } from "react"
import { Badge, Button, Card, StatCard, Table, Td } from "@/components/panel/Ui"
import {
  addInventoryBulk,
  deleteInventoryItem,
  fetchInventoryItems,
  fetchProducts,
  type FirestoreInventoryItem,
} from "@/lib/firebase/repository"
import { deliveryLabels, type Product } from "@/lib/types"
import { toman } from "@/lib/utils"

const statusMeta = {
  available: { label:"آماده تحویل", tone:"green" },
  reserved: { label:"رزرو", tone:"amber" },
  delivered: { label:"تحویل شده", tone:"gray" },
} as const

export default function AdminInventoryPage() {
  const [items, setItems] = useState<FirestoreInventoryItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState("")
  const [selectedPlanId, setSelectedPlanId] = useState("")
  const [bulkLines, setBulkLines] = useState("")
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState("")

  const loadAll = useCallback(async () => {
    setLoading(true)
    try {
      const [invData, prodRes] = await Promise.all([fetchInventoryItems(), fetchProducts(true)])
      setItems(invData)
      setProducts(prodRes.items)
      if (prodRes.items.length > 0 && !selectedProductId) {
        const first = prodRes.items[0]
        setSelectedProductId(first.id)
        setSelectedPlanId(first.plans[0]?.id ?? "")
      }
    } finally {
      setLoading(false)
    }
  }, [selectedProductId])

  useEffect(() => {
    void loadAll()
  }, [loadAll])

  const selectedProduct = products.find((p) => p.id === selectedProductId) ?? products[0]
  const selectedPlan =
    selectedProduct?.plans.find((pl) => pl.id === selectedPlanId) ?? selectedProduct?.plans[0]

  async function handleBulkAdd(event: React.FormEvent) {
    event.preventDefault()
    if (!selectedProduct || !selectedPlan) return
    const lines = bulkLines
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
    if (lines.length === 0) return

    setBusy(true)
    setFeedback("")
    try {
      const count = await addInventoryBulk({
        productId: selectedProduct.id,
        productTitle: selectedProduct.title,
        planId: selectedPlan.id,
        planTitle: selectedPlan.title,
        deliveryType: selectedPlan.delivery,
        lines,
      })
      setBulkLines("")
      setFeedback(`${toman(count)} مورد به انبار دیجیتال اضافه شد.`)
      await loadAll()
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(id: string) {
    setBusy(true)
    try {
      await deleteInventoryItem(id)
      setItems((prev) => prev.filter((item) => item.id !== id))
    } finally {
      setBusy(false)
    }
  }

  const availableCount = items.filter((i) => i.status === "available").length
  const deliveredCount = items.filter((i) => i.status === "delivered").length
  const reservedCount = items.filter((i) => i.status === "reserved").length

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-4">
        <StatCard label="آمادهٔ تحویل" value={`${toman(availableCount)} مورد`} tone="up" />
        <StatCard label="تحویل‌شده" value={`${toman(deliveredCount)} مورد`} />
        <StatCard label="رزروشده" value={`${toman(reservedCount)} مورد`} />
        <StatCard label="کل اقلام انبار" value={`${toman(items.length)} مورد`} />
      </div>

      <Card title="انبار اکانت و لایسنس">
        {loading ? (
          <p className="py-8 text-center text-[12px] text-slate-400">در حال بارگذاری انبار…</p>
        ) : items.length === 0 ? (
          <p className="py-8 text-center text-[12px] text-slate-400">هنوز اکانت یا لایسنسی در انبار ثبت نشده است.</p>
        ) : (
          <Table head={["شناسه", "محصول", "پلن", "روش تحویل", "مقدار", "وضعیت", "عملیات"]}>
            {items.map((item) => {
              const meta = statusMeta[item.status]
              return (
                <tr key={item.id}>
                  <Td className="num font-semibold text-[#0a1b33]">{item.id}</Td>
                  <Td>{item.productTitle}</Td>
                  <Td>{item.planTitle}</Td>
                  <Td>
                    <Badge tone="blue">{deliveryLabels[item.deliveryType]}</Badge>
                  </Td>
                  <Td className="font-latin max-w-[220px] truncate">{item.credentialValue}</Td>
                  <Td>
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                  </Td>
                  <Td>
                    <Button variant="danger" disabled={busy} onClick={() => void handleDelete(item.id)}>
                      حذف
                    </Button>
                  </Td>
                </tr>
              )
            })}
          </Table>
        )}
      </Card>

      <Card title="افزودن گروهی ظرفیت به انبار">
        <form onSubmit={(event) => void handleBulkAdd(event)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-[12px] font-semibold text-[#0a1b33]">محصول</span>
              <select
                value={selectedProduct?.id ?? ""}
                onChange={(e) => {
                  const nextProd = products.find((p) => p.id === e.target.value)
                  setSelectedProductId(e.target.value)
                  setSelectedPlanId(nextProd?.plans[0]?.id ?? "")
                }}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-[#0a1b33] outline-none focus:border-[#1b39f5]"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-[12px] font-semibold text-[#0a1b33]">پلن</span>
              <select
                value={selectedPlan?.id ?? ""}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-[#0a1b33] outline-none focus:border-[#1b39f5]"
              >
                {(selectedProduct?.plans ?? []).map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-[12px] font-semibold text-[#0a1b33]">فهرست اشتراک‌ها یا کدها (هر خط یک مورد)</span>
            <textarea
              rows={6}
              dir="ltr"
              value={bulkLines}
              onChange={(e) => setBulkLines(e.target.value)}
              placeholder={"user1@mail.com:Pass1234\nNITRO-AAAA-1111"}
              className="font-latin mt-2 w-full rounded-2xl border border-[#1b39f5]/12 bg-[#1b39f5]/4 px-4 py-3 text-left text-[12px] text-[#0a1b33] placeholder:text-slate-400 outline-none focus:border-[#1b39f5]/45 focus:bg-white"
            />
          </label>

          {feedback ? <p className="text-[12px] font-semibold text-[#2F7A50]">{feedback}</p> : null}

          <Button type="submit" disabled={busy || !bulkLines.trim()}>
            {busy ? "در حال ثبت…" : "ثبت در انبار"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
