"use client"

import { useCallback, useEffect, useState } from "react"
import { Badge, Button, Card, Field, Table, Td } from "@/components/panel/Ui"
import {
  deleteDiscount,
  fetchDiscounts,
  upsertDiscount,
  type FirestoreDiscount,
} from "@/lib/firebase/repository"
import { toman } from "@/lib/utils"

const EMPTY_FORM: FirestoreDiscount = {
  code: "",
  type: "percent",
  value: 20,
  limit: 100,
  used: 0,
  minOrder: 0,
  expiresAt: "",
  firstPurchaseOnly: false,
  isActive: true,
}

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<FirestoreDiscount[]>([])
  const [form, setForm] = useState<FirestoreDiscount>(EMPTY_FORM)
  const [editingCode, setEditingCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const list = await fetchDiscounts()
      setDiscounts(list)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  function startEdit(item: FirestoreDiscount) {
    setEditingCode(item.code)
    setForm({
      code: item.code,
      type: item.type,
      value: item.value,
      limit: item.limit,
      used: item.used,
      minOrder: item.minOrder,
      expiresAt: item.expiresAt ?? "",
      firstPurchaseOnly: Boolean(item.firstPurchaseOnly),
      isActive: item.isActive,
    })
    setFeedback("")
    setError("")
  }

  function resetForm() {
    setEditingCode(null)
    setForm(EMPTY_FORM)
    setError("")
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setFeedback("")
    setError("")

    const code = form.code.trim().toUpperCase()
    if (!/^[A-Z0-9_-]{2,32}$/.test(code)) {
      setError("کد تخفیف باید شامل ۲ تا ۳۲ کاراکتر حروف بزرگ انگلیسی، عدد، خط تیره یا زیرخط باشد.")
      return
    }
    const value = Math.max(0, Number(form.value) || 0)
    if (form.type === "percent" && value > 100) {
      setError("درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد.")
      return
    }

    setBusy(true)
    try {
      await upsertDiscount({
        code,
        type: form.type,
        value,
        limit: Math.max(0, Number(form.limit) || 0),
        used: Math.max(0, Number(form.used) || 0),
        minOrder: Math.max(0, Number(form.minOrder) || 0),
        expiresAt: (form.expiresAt ?? "").trim().slice(0, 40),
        firstPurchaseOnly: Boolean(form.firstPurchaseOnly),
        isActive: Boolean(form.isActive),
      })
      setFeedback(`کد تخفیف ${code} در دیتابیس ذخیره شد.`)
      resetForm()
      await load()
    } catch {
      setError("ذخیرهٔ کد تخفیف با خطا مواجه شد.")
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(code: string) {
    setFeedback("")
    setError("")
    try {
      await deleteDiscount(code)
      if (editingCode === code) resetForm()
      setFeedback(`کد ${code} حذف شد.`)
      await load()
    } catch {
      setError("حذف کد تخفیف انجام نشد.")
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
      <Card
        title="کدهای تخفیف"
        action={
          editingCode ? (
            <Button variant="ghost" onClick={resetForm}>
              انصراف از ویرایش
            </Button>
          ) : null
        }
      >
        {loading ? (
          <p className="py-8 text-center text-[12px] text-slate-400">در حال بارگذاری کدهای تخفیف…</p>
        ) : discounts.length === 0 ? (
          <p className="py-8 text-center text-[12px] text-slate-400">هنوز کد تخفیفی در Firestore ثبت نشده است.</p>
        ) : (
          <Table head={["کد", "نوع", "مقدار", "سقف", "استفاده", "حداقل سبد", "انقضا", "وضعیت", "عملیات"]}>
            {discounts.map((item) => {
              const exhausted = item.limit > 0 && item.used >= item.limit
              const active = item.isActive && !exhausted
              return (
                <tr key={item.code}>
                  <Td className="font-latin font-bold text-[#0a1b33]">{item.code}</Td>
                  <Td>{item.type === "percent" ? "درصدی" : "مبلغ ثابت"}</Td>
                  <Td className="num">
                    {item.type === "percent" ? `${toman(item.value)}٪` : `${toman(item.value)} تومان`}
                  </Td>
                  <Td className="num">{item.limit === 0 ? "نامحدود" : toman(item.limit)}</Td>
                  <Td className="num">{toman(item.used)}</Td>
                  <Td className="num">{toman(item.minOrder)}</Td>
                  <Td className="font-latin text-slate-400">{item.expiresAt || "بدون محدودیت"}</Td>
                  <Td>
                    <Badge tone={active ? "green" : "gray"}>
                      {exhausted ? "تکمیل ظرفیت" : item.isActive ? "فعال" : "غیرفعال"}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="flex gap-1.5">
                      <Button variant="ghost" onClick={() => startEdit(item)}>
                        ویرایش
                      </Button>
                      <Button variant="danger" onClick={() => void handleDelete(item.code)}>
                        حذف
                      </Button>
                    </div>
                  </Td>
                </tr>
              )
            })}
          </Table>
        )}
      </Card>

      <Card title={editingCode ? `ویرایش کد ${editingCode}` : "ایجاد کد تخفیف"} className="h-fit">
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <Field
            label="کد تخفیف (حروف بزرگ انگلیسی)"
            placeholder="ECHSHOP25"
            latin
            value={form.code}
            disabled={Boolean(editingCode)}
            onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
            required
          />

          <label className="block">
            <span className="text-[12px] font-semibold text-[#0a1b33]">نوع تخفیف</span>
            <select
              value={form.type}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, type: e.target.value as "percent" | "fixed" }))
              }
              className="mt-2 w-full rounded-2xl border border-[#1b39f5]/12 bg-[#1b39f5]/4 px-4 py-3 text-[12px] outline-none focus:border-[#1b39f5]/45 focus:bg-white"
            >
              <option value="percent">درصدی</option>
              <option value="fixed">مبلغ ثابت (تومان)</option>
            </select>
          </label>

          <Field
            label={form.type === "percent" ? "درصد تخفیف" : "مبلغ تخفیف (تومان)"}
            type="number"
            latin
            value={String(form.value)}
            onChange={(e) => setForm((prev) => ({ ...prev, value: Number(e.target.value) }))}
            required
          />

          <Field
            label="سقف استفاده (۰ = نامحدود)"
            type="number"
            latin
            value={String(form.limit)}
            onChange={(e) => setForm((prev) => ({ ...prev, limit: Number(e.target.value) }))}
          />

          <Field
            label="حداقل مبلغ سبد (تومان)"
            type="number"
            latin
            value={String(form.minOrder)}
            onChange={(e) => setForm((prev) => ({ ...prev, minOrder: Number(e.target.value) }))}
          />

          <Field
            label="تاریخ انقضا (اختیاری)"
            placeholder="2027-03-20"
            latin
            value={form.expiresAt ?? ""}
            onChange={(e) => setForm((prev) => ({ ...prev, expiresAt: e.target.value }))}
          />

          <label className="flex items-center justify-between rounded-2xl border border-slate-200/70 px-4 py-3.5">
            <span className="text-[12px] text-slate-600">فقط برای اولین خرید</span>
            <input
              type="checkbox"
              checked={Boolean(form.firstPurchaseOnly)}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, firstPurchaseOnly: e.target.checked }))
              }
              className="h-4 w-4 accent-[#1b39f5]"
            />
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-slate-200/70 px-4 py-3.5">
            <span className="text-[12px] text-slate-600">کد فعال است</span>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 accent-[#1b39f5]"
            />
          </label>

          {error ? <p className="text-[12px] font-semibold text-[#A8382C]">{error}</p> : null}
          {feedback ? <p className="text-[12px] font-semibold text-[#2F7A50]">{feedback}</p> : null}

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "در حال ذخیره…" : editingCode ? "به‌روزرسانی کد تخفیف" : "ایجاد کد تخفیف"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
