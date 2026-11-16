"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useFirebase } from "@/components/providers/FirebaseProvider"
import { Badge, Card, StatCard, Table, Td } from "@/components/panel/Ui"
import { fetchWalletTransactions, type FirestoreWalletTx } from "@/lib/firebase/repository"
import { faDate, toman } from "@/lib/utils"

const toneMap = {
  success: "green",
  failed: "red",
  pending: "amber",
} as const

const statusLabelMap = {
  success: "موفق",
  failed: "ناموفق",
  pending: "در انتظار",
} as const

export default function WalletPage() {
  const { user, publicProfile } = useFirebase()
  const [transactions, setTransactions] = useState<FirestoreWalletTx[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.uid) return
    let active = true
    setLoading(true)
    fetchWalletTransactions(user.uid)
      .then((data) => {
        if (active) setTransactions(data)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [user?.uid])

  const totalCredit = transactions
    .filter((tx) => tx.status === "success" && tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0)
  const totalDebit = transactions
    .filter((tx) => tx.status === "success" && tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="موجودی فعلی"
          value={`${toman(publicProfile?.walletBalance ?? 0)} تومان`}
          hint="قابل استفاده پس از اتصال درگاه"
        />
        <StatCard label="مجموع واریز و شارژ" value={`${toman(totalCredit)} تومان`} />
        <StatCard label="مجموع برداشت" value={`${toman(totalDebit)} تومان`} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1.6fr]">
        <Card title="افزایش موجودی کیف پول">
          <div className="rounded-2xl border border-[#cfe6f7] bg-[#f2f9fe] p-5 text-[12px] leading-7 text-[#1c5f9e]">
            شارژ خودکار آنلاین پس از اتصال درگاه بانکی فعال می‌شود. تا آن زمان می‌توانید از طریق ثبت تیکت یا پنل مدیریت کیف پول را شارژ کنید.
          </div>
          <div className="mt-4">
            <Link
              href="/dashboard/tickets"
              className="glass-solid inline-flex rounded-full px-5 py-2.5 text-[12px] font-semibold"
            >
              درخواست شارژ از پشتیبانی
            </Link>
          </div>
        </Card>

        <Card title="تاریخچهٔ تراکنش‌ها">
          {loading ? (
            <p className="py-8 text-center text-[12px] text-slate-400">در حال بارگذاری تراکنش‌ها…</p>
          ) : transactions.length === 0 ? (
            <p className="py-8 text-center text-[12px] text-slate-400">هنوز تراکنشی در کیف پول ثبت نشده است.</p>
          ) : (
            <Table head={["شناسه", "شرح", "مبلغ", "وضعیت", "تاریخ"]}>
              {transactions.map((item) => (
                <tr key={item.id}>
                  <Td className="num font-semibold text-[#0a1b33]">{item.id}</Td>
                  <Td>{item.type}</Td>
                  <Td className={item.amount > 0 ? "num font-semibold text-[#46A171]" : "num text-[#0a1b33]"}>
                    {item.amount > 0 ? "+" : "−"}
                    {toman(Math.abs(item.amount))}
                  </Td>
                  <Td>
                    <Badge tone={toneMap[item.status]}>{statusLabelMap[item.status]}</Badge>
                  </Td>
                  <Td className="num text-slate-400">{faDate(item.createdAt)}</Td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      </div>
    </div>
  )
}
