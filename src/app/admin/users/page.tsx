"use client"

import { useCallback, useEffect, useState } from "react"
import { Badge, Button, Card, Field, StatCard, Table, Td } from "@/components/panel/Ui"
import {
  creditWalletAsAdmin,
  fetchAllUsersAsAdmin,
  updateUserPlanAsAdmin,
  type UserPublicProfile,
} from "@/lib/firebase/repository"
import { toman } from "@/lib/utils"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserPublicProfile[]>([])
  const [search, setSearch] = useState("")
  const [selectedUid, setSelectedUid] = useState("")
  const [creditAmount, setCreditAmount] = useState("")
  const [creditNote, setCreditNote] = useState("")
  const [planValue, setPlanValue] = useState("طلایی")
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const list = await fetchAllUsersAsAdmin()
      setUsers(list)
      if (list.length > 0 && !selectedUid) {
        setSelectedUid(list[0].uid)
      }
    } finally {
      setLoading(false)
    }
  }, [selectedUid])

  useEffect(() => {
    void load()
  }, [load])

  async function handleCredit(event: React.FormEvent) {
    event.preventDefault()
    const amount = Number(creditAmount)
    if (!selectedUid || !amount) return
    setBusy(true)
    setFeedback("")
    try {
      await creditWalletAsAdmin(selectedUid, amount, creditNote)
      setCreditAmount("")
      setCreditNote("")
      setFeedback("تراکنش کیف پول با موفقیت ثبت شد.")
      await load()
    } finally {
      setBusy(false)
    }
  }

  async function handlePlanSave(event: React.FormEvent) {
    event.preventDefault()
    if (!selectedUid) return
    setBusy(true)
    setFeedback("")
    try {
      await updateUserPlanAsAdmin(selectedUid, planValue)
      setFeedback("سطح کاربری به‌روزرسانی شد.")
      await load()
    } finally {
      setBusy(false)
    }
  }

  const totalWallet = users.reduce((sum, u) => sum + (u.walletBalance || 0), 0)
  const filtered = search.trim()
    ? users.filter((u) => u.displayName.includes(search.trim()) || u.uid.includes(search.trim()))
    : users

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="کل کاربران" value={`${toman(users.length)} نفر`} tone="up" />
        <StatCard label="موجودی کل کیف پول‌ها" value={`${toman(totalWallet)} تومان`} />
        <StatCard
          label="کاربران ویژه"
          value={`${toman(users.filter((u) => u.plan !== "عادی").length)} نفر`}
        />
      </div>

      <Card
        title="فهرست کاربران"
        action={
          <div className="w-56">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی نام یا شناسه…"
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11.5px] text-[#0a1b33] placeholder:text-slate-400 outline-none focus:border-[#1b39f5]"
            />
          </div>
        }
      >
        {loading ? (
          <p className="py-8 text-center text-[12px] text-slate-400">در حال بارگذاری…</p>
        ) : (
          <Table head={["نام", "شناسه", "کیف پول", "علاقه‌مندی", "سطح", "عملیات"]}>
            {filtered.map((user) => (
              <tr key={user.uid}>
                <Td className="font-semibold text-[#0a1b33]">{user.displayName}</Td>
                <Td className="font-latin text-[11px] text-slate-400">{user.uid.slice(0, 12)}…</Td>
                <Td className="num">{toman(user.walletBalance)}</Td>
                <Td className="num">{toman(user.favorites?.length ?? 0)}</Td>
                <Td>
                  <Badge tone={user.plan === "طلایی" ? "amber" : user.plan === "نقره‌ای" ? "blue" : "gray"}>
                    {user.plan}
                  </Badge>
                </Td>
                <Td>
                  <Button variant="ghost" onClick={() => setSelectedUid(user.uid)}>
                    انتخاب
                  </Button>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card title="شارژ / اصلاح کیف پول کاربر">
          <form onSubmit={(e) => void handleCredit(e)} className="space-y-4">
            <label className="block">
              <span className="text-[12px] font-semibold text-[#0a1b33]">کاربر</span>
              <select
                value={selectedUid}
                onChange={(e) => setSelectedUid(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-[#0a1b33] outline-none focus:border-[#1b39f5]"
              >
                {users.map((u) => (
                  <option key={u.uid} value={u.uid}>
                    {u.displayName} ({toman(u.walletBalance)} تومان)
                  </option>
                ))}
              </select>
            </label>
            <Field label="مبلغ (تومان)" type="number" latin value={creditAmount} onChange={(e) => setCreditAmount(e.target.value)} placeholder="500000" required />
            <Field label="شرح تراکنش" value={creditNote} onChange={(e) => setCreditNote(e.target.value)} placeholder="شارژ هدیه یا جبران خسارت" />
            <Button type="submit" disabled={busy || !selectedUid}>
              ثبت شارژ
            </Button>
          </form>
        </Card>

        <Card title="تغییر سطح کاربری">
          <form onSubmit={(e) => void handlePlanSave(e)} className="space-y-4">
            <label className="block">
              <span className="text-[12px] font-semibold text-[#0a1b33]">سطح جدید</span>
              <select
                value={planValue}
                onChange={(e) => setPlanValue(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-[#0a1b33] outline-none focus:border-[#1b39f5]"
              >
                <option value="عادی">عادی</option>
                <option value="نقره‌ای">نقره‌ای</option>
                <option value="طلایی">طلایی</option>
              </select>
            </label>
            {feedback ? <p className="text-[12px] font-semibold text-[#2F7A50]">{feedback}</p> : null}
            <Button type="submit" disabled={busy || !selectedUid}>
              ذخیرهٔ سطح کاربر
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
