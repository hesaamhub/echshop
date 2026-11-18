"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Database, RefreshCw } from "lucide-react"
import { Badge, Button, Card, StatCard, Table, Td } from "@/components/panel/Ui"
import {
  fetchAllOrders,
  fetchAllUsersAsAdmin,
  fetchContactMessages,
  fetchInventoryItems,
  fetchProductRequests,
  fetchProducts,
  updateContactMessageStatus,
  updateProductRequestStatus,
  type FirestoreContactMessage,
  type FirestoreOrder,
  type FirestoreProductRequest,
} from "@/lib/firebase/repository"
import { seedInitialDatabase } from "@/lib/firebase/seed"
import { deliveryLabels, orderStatusLabels, type Product } from "@/lib/types"
import { faDate, toman } from "@/lib/utils"

const statusTone = {
  pending: "amber",
  paid: "blue",
  delivered: "green",
  failed: "red",
  refunded: "gray",
} as const

export default function AdminDashboard() {
  const [orders, setOrders] = useState<FirestoreOrder[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [fromFirestore, setFromFirestore] = useState(false)
  const [userCount, setUserCount] = useState(0)
  const [availableStock, setAvailableStock] = useState(0)
  const [requests, setRequests] = useState<FirestoreProductRequest[]>([])
  const [contacts, setContacts] = useState<FirestoreContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [seedMessage, setSeedMessage] = useState("")

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [ordersData, prodRes, usersData, invData, reqData, contactData] = await Promise.all([
        fetchAllOrders(),
        fetchProducts(true),
        fetchAllUsersAsAdmin(),
        fetchInventoryItems(),
        fetchProductRequests(),
        fetchContactMessages(),
      ])
      setOrders(ordersData)
      setProducts(prodRes.items)
      setFromFirestore(prodRes.fromFirestore)
      setUserCount(usersData.length)
      setAvailableStock(invData.filter((i) => i.status === "available").length)
      setRequests(reqData)
      setContacts(contactData)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  async function handleSeedDatabase() {
    setSeeding(true)
    setSeedMessage("")
    try {
      const summary = await seedInitialDatabase()
      setSeedMessage(
        `دیتابیس با موفقیت مقداردهی شد: ${summary.categories} دسته، ${summary.products} محصول، ${summary.posts} مقاله و ${summary.discounts} کد تخفیف.`,
      )
      await loadData()
    } catch {
      setSeedMessage("مقداردهی دیتابیس با خطا مواجه شد.")
    } finally {
      setSeeding(false)
    }
  }

  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "paid")
  const totalRevenue = orders
    .filter((o) => o.status === "delivered" || o.status === "paid")
    .reduce((sum, o) => sum + o.amount, 0)
  const top = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5)

  return (
    <div className="space-y-5">
      <Card
        title="وضعیت دیتابیس Firestore"
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" disabled={loading} onClick={() => void loadData()}>
              <span className="inline-flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" />
                بروزرسانی
              </span>
            </Button>
            <Button disabled={seeding} onClick={() => void handleSeedDatabase()}>
              <span className="inline-flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5" />
                {seeding ? "در حال مقداردهی…" : fromFirestore ? "همگام‌سازی مجدد داده‌های پایه" : "مقداردهی اولیه دیتابیس"}
              </span>
            </Button>
          </div>
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-[12px]">
          <div className="flex items-center gap-2.5">
            <Badge tone={fromFirestore ? "green" : "amber"}>
              {fromFirestore ? "کاتالوگ متصل به Firestore" : "کاتالوگ هنوز در Firestore ثبت نشده"}
            </Badge>
            <span className="text-slate-500">
              {fromFirestore
                ? `${toman(products.length)} محصول در دیتابیس فعال است.`
                : "برای ثبت سفارش واقعی مشتریان، ابتدا دکمهٔ مقداردهی اولیه دیتابیس را بزنید."}
            </span>
          </div>
        </div>
        {seedMessage ? (
          <p className="mt-3 text-[12px] font-semibold text-[#2F7A50]">{seedMessage}</p>
        ) : null}
      </Card>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-4">
        <StatCard label="مجموع فروش ثبت‌شده" value={`${toman(totalRevenue)} تومان`} tone="up" />
        <StatCard
          label="سفارش در انتظار تحویل"
          value={`${toman(pendingOrders.length)} سفارش`}
          tone={pendingOrders.length > 0 ? "down" : "neutral"}
        />
        <StatCard label="کاربران ثبت‌شده" value={`${toman(userCount)} کاربر`} tone="up" />
        <StatCard label="موجودی انبار دیجیتال" value={`${toman(availableStock)} مورد`} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card
          title="آخرین سفارش‌ها"
          action={
            <Link href="/admin/orders" className="text-[11.5px] font-semibold text-[#1b39f5]">
              مدیریت همه
            </Link>
          }
        >
          {orders.length === 0 ? (
            <p className="py-8 text-center text-[12px] text-slate-400">هنوز سفارشی در Firestore ثبت نشده است.</p>
          ) : (
            <Table head={["شماره", "خریدار", "محصول", "تحویل", "مبلغ", "وضعیت", "تاریخ"]}>
              {orders.slice(0, 6).map((order) => (
                <tr key={order.id}>
                  <Td className="num font-semibold text-[#0a1b33]">{order.orderNumber}</Td>
                  <Td>{order.customerName}</Td>
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

        <Card title="پرفروش‌ترین محصولات">
          <div className="space-y-3">
            {top.map((product, index) => (
              <div key={product.id} className="flex items-center gap-3">
                <span className="num grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-500">
                  {index + 1}
                </span>
                <span className="flex-1 truncate text-[12px] font-semibold text-[#0a1b33]">
                  {product.title}
                </span>
                <span className="num text-[11.5px] text-slate-400">{toman(product.sold)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card title="درخواست‌های محصول مشتریان">
          {requests.length === 0 ? (
            <p className="py-6 text-center text-[12px] text-slate-400">درخواست جدیدی ثبت نشده است.</p>
          ) : (
            <div className="space-y-3">
              {requests.slice(0, 6).map((req) => (
                <div key={req.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/70 p-4">
                  <div>
                    <p className="text-[12.5px] font-bold text-[#0a1b33]">
                      {req.productName} {req.plan ? `(${req.plan})` : ""}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {req.name} — {req.contact}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={req.status === "fulfilled" ? "green" : req.status === "reviewed" ? "blue" : "amber"}>
                      {req.status === "fulfilled" ? "تامین شد" : req.status === "reviewed" ? "بررسی شد" : "جدید"}
                    </Badge>
                    {req.status !== "fulfilled" ? (
                      <Button
                        variant="ghost"
                        onClick={() =>
                          void updateProductRequestStatus(req.id, "fulfilled").then(() => loadData())
                        }
                      >
                        تکمیل
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="پیام‌های تماس با ما">
          {contacts.length === 0 ? (
            <p className="py-6 text-center text-[12px] text-slate-400">پیامی ثبت نشده است.</p>
          ) : (
            <div className="space-y-3">
              {contacts.slice(0, 6).map((msg) => (
                <div key={msg.id} className="rounded-2xl border border-slate-200/70 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12.5px] font-bold text-[#0a1b33]">{msg.subject}</span>
                    <Badge tone={msg.status === "replied" ? "green" : "amber"}>
                      {msg.status === "replied" ? "پاسخ‌داده‌شده" : "جدید"}
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-[11.5px] text-slate-600">{msg.message}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      {msg.name} {msg.phone ? `· ${msg.phone}` : ""} {msg.email ? `· ${msg.email}` : ""}
                    </span>
                    {msg.status === "new" ? (
                      <button
                        type="button"
                        onClick={() =>
                          void updateContactMessageStatus(msg.id, "replied").then(() => loadData())
                        }
                        className="font-semibold text-[#1b39f5] hover:underline"
                      >
                        علامت‌گذاری بررسی‌شده
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
