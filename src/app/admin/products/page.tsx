"use client"

import { useCallback, useEffect, useState } from "react"
import { Badge, Button, Card, Field, Table, Td } from "@/components/panel/Ui"
import { deleteProduct, fetchCategories, fetchProducts, upsertProduct } from "@/lib/firebase/repository"
import { deliveryLabels, type Category, type DeliveryMethod, type Plan, type Product } from "@/lib/types"
import { toman } from "@/lib/utils"

function createEmptyPlan(): Plan {
  return {
    id: `pl-${Date.now().toString().slice(-5)}`,
    title: "",
    price: 0,
    delivery: "stock",
    stock: 25,
  }
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<(Product & { isActive?: boolean })[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState("")

  const [editingId, setEditingId] = useState("")
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [brand, setBrand] = useState("")
  const [logo, setLogo] = useState("spotify")
  const [categorySlug, setCategorySlug] = useState("ai-tools")
  const [badge, setBadge] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [description, setDescription] = useState("")
  const [gradient, setGradient] = useState("from-[#1b39f5] to-[#0a152d]")
  const [plans, setPlans] = useState<Plan[]>([createEmptyPlan()])

  const loadAll = useCallback(async () => {
    setLoading(true)
    try {
      const [prodRes, catRes] = await Promise.all([fetchProducts(true), fetchCategories(true)])
      setProducts(prodRes.items)
      setCategories(catRes.items)
      if (catRes.items.length > 0) {
        setCategorySlug((prev) => prev || catRes.items[0].slug)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadAll()
  }, [loadAll])

  function startNew() {
    setEditingId("")
    setTitle("")
    setSlug("")
    setBrand("")
    setLogo("spotify")
    setCategorySlug(categories[0]?.slug ?? "ai-tools")
    setBadge("")
    setExcerpt("")
    setDescription("")
    setGradient("from-[#1b39f5] to-[#0a152d]")
    setPlans([createEmptyPlan()])
    setFeedback("")
    setError("")
  }

  function startEdit(p: Product) {
    setEditingId(p.id)
    setTitle(p.title)
    setSlug(p.slug)
    setBrand(p.brand)
    setLogo(p.logo)
    setCategorySlug(p.categorySlug)
    setBadge(p.badge ?? "")
    setExcerpt(p.excerpt)
    setDescription(p.description)
    setGradient(p.gradient)
    setPlans(p.plans.length ? p.plans : [createEmptyPlan()])
    setFeedback("")
    setError("")
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault()
    setFeedback("")
    setError("")
    const cleanSlug = slug.trim().toLowerCase()
    if (!title.trim() || !cleanSlug || !brand.trim() || !excerpt.trim() || !description.trim()) {
      setError("عنوان، slug، برند و توضیحات را کامل کنید.")
      return
    }
    const cleanPlans = plans
      .filter((pl) => pl.title.trim() && pl.price >= 0)
      .map((pl) => ({
        id: pl.id || `pl-${Date.now()}`,
        title: pl.title.trim(),
        price: Number(pl.price) || 0,
        ...(pl.compareAt ? { compareAt: Number(pl.compareAt) } : {}),
        delivery: pl.delivery,
        stock: Number(pl.stock) || 0,
      }))
    if (cleanPlans.length === 0) {
      setError("حداقل یک پلن معتبر وارد کنید.")
      return
    }

    const existing = products.find((p) => p.id === editingId)
    const id = editingId || `p-${Date.now().toString().slice(-6)}`
    setBusy(true)
    try {
      await upsertProduct({
        id,
        slug: cleanSlug,
        title: title.trim(),
        brand: brand.trim(),
        logo: logo.trim() || "openai",
        categorySlug,
        excerpt: excerpt.trim(),
        description: description.trim(),
        ...(badge.trim() ? { badge: badge.trim() } : {}),
        rating: existing?.rating ?? 4.8,
        sold: existing?.sold ?? 0,
        gradient: gradient.trim() || "from-[#1b39f5] to-[#0a152d]",
        plans: cleanPlans,
        features: existing?.features ?? ["تحویل فوری و گارانتی کامل"],
        faq: existing?.faq ?? [],
        isActive: true,
      })
      setFeedback(`محصول «${title.trim()}» در Firestore ذخیره شد.`)
      await loadAll()
      if (!editingId) startNew()
    } catch {
      setError("ذخیرهٔ محصول انجام نشد. مقادیر slug و شناسه‌ها را بررسی کنید.")
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(productId: string) {
    setBusy(true)
    try {
      await deleteProduct(productId)
      setProducts((prev) => prev.filter((p) => p.id !== productId))
      setFeedback("محصول از دیتابیس حذف شد.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <Card
        title="فهرست محصولات"
        action={<Button onClick={startNew}>افزودن محصول جدید</Button>}
      >
        {loading ? (
          <p className="py-8 text-center text-[12px] text-slate-400">در حال بارگذاری محصولات…</p>
        ) : (
          <Table head={["محصول", "دسته", "پلن‌ها", "کمترین قیمت", "ظرفیت", "فروش", "وضعیت", "عملیات"]}>
            {products.map((product) => {
              const cheapest = product.plans.reduce((a, b) => (a.price <= b.price ? a : b))
              const capacity = product.plans.reduce((sum, plan) => sum + plan.stock, 0)
              return (
                <tr key={product.id}>
                  <Td className="font-semibold text-[#0a1b33]">{product.title}</Td>
                  <Td>{categories.find((c) => c.slug === product.categorySlug)?.title ?? product.categorySlug}</Td>
                  <Td className="num">{product.plans.length}</Td>
                  <Td className="num">{toman(cheapest.price)}</Td>
                  <Td>
                    <Badge tone={capacity > 50 ? "green" : capacity > 10 ? "amber" : "red"}>
                      {toman(capacity)}
                    </Badge>
                  </Td>
                  <Td className="num">{toman(product.sold)}</Td>
                  <Td>
                    <Badge tone={product.isActive === false ? "gray" : "green"}>
                      {product.isActive === false ? "غیرفعال" : "فعال"}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="flex gap-1.5">
                      <Button variant="ghost" onClick={() => startEdit(product)}>
                        ویرایش
                      </Button>
                      <Button variant="danger" disabled={busy} onClick={() => void handleDelete(product.id)}>
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

      <Card title={editingId ? `ویرایش محصول (${editingId})` : "افزودن محصول جدید"}>
        <form onSubmit={(event) => void handleSave(event)}>
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="عنوان محصول" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مانند: اشتراک پریمیوم اسپاتیفای" required />
            <Field label="نشانی یکتا (slug)" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="spotify-premium" latin required />
            <Field label="نام برند" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Spotify" latin required />
            <Field label="شناسهٔ لوگوی داخلی" value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="spotify" latin hint="نام کلید برند در BrandIcon" />
            <label className="block">
              <span className="text-[12px] font-semibold text-[#0a1b33]">دسته‌بندی</span>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] outline-none focus:border-[#1b39f5]"
              >
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.title}
                  </option>
                ))}
              </select>
            </label>
            <Field label="برچسب ویژه (اختیاری)" value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="پرفروش‌ترین" />
            <div className="lg:col-span-2">
              <Field label="توضیح کوتاه" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="در یک خط محصول را معرفی کنید" required />
            </div>
            <div className="lg:col-span-2">
              <Field label="توضیح کامل" textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="متن کامل صفحهٔ محصول…" required />
            </div>
          </div>

          <h3 className="mt-7 text-[13px] font-bold text-[#0a1b33]">پلن‌ها و روش فعال‌سازی هر پلن</h3>
          <div className="mt-4 space-y-3">
            {plans.map((pl, index) => (
              <div
                key={pl.id || index}
                className="grid gap-3 rounded-2xl border border-slate-200/70 p-4 lg:grid-cols-5"
              >
                <Field
                  label="عنوان پلن"
                  value={pl.title}
                  onChange={(e) =>
                    setPlans((prev) => prev.map((item, i) => (i === index ? { ...item, title: e.target.value } : item)))
                  }
                  placeholder="۱ ماهه"
                />
                <Field
                  label="قیمت (تومان)"
                  type="number"
                  latin
                  value={String(pl.price)}
                  onChange={(e) =>
                    setPlans((prev) =>
                      prev.map((item, i) => (i === index ? { ...item, price: Number(e.target.value) || 0 } : item)),
                    )
                  }
                />
                <Field
                  label="قیمت قبل تخفیف"
                  type="number"
                  latin
                  value={pl.compareAt ? String(pl.compareAt) : ""}
                  onChange={(e) =>
                    setPlans((prev) =>
                      prev.map((item, i) =>
                        i === index
                          ? { ...item, compareAt: e.target.value ? Number(e.target.value) : undefined }
                          : item,
                      ),
                    )
                  }
                />
                <label className="block">
                  <span className="text-[12px] font-semibold text-[#0a1b33]">روش فعال‌سازی</span>
                  <select
                    value={pl.delivery}
                    onChange={(e) =>
                      setPlans((prev) =>
                        prev.map((item, i) =>
                          i === index ? { ...item, delivery: e.target.value as DeliveryMethod } : item,
                        ),
                      )
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] outline-none focus:border-[#1b39f5]"
                  >
                    {(Object.entries(deliveryLabels) as [DeliveryMethod, string][]).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <Field
                  label="ظرفیت"
                  type="number"
                  latin
                  value={String(pl.stock)}
                  onChange={(e) =>
                    setPlans((prev) =>
                      prev.map((item, i) => (i === index ? { ...item, stock: Number(e.target.value) || 0 } : item)),
                    )
                  }
                />
              </div>
            ))}
          </div>

          {feedback ? <p className="mt-4 text-[12px] font-semibold text-[#2F7A50]">{feedback}</p> : null}
          {error ? <p className="mt-4 text-[12px] font-semibold text-[#A8382C]">{error}</p> : null}

          <div className="mt-5 flex flex-wrap gap-2">
            <Button type="submit" disabled={busy}>
              {busy ? "در حال ذخیره…" : "ذخیرهٔ محصول"}
            </Button>
            <Button variant="ghost" onClick={() => setPlans((prev) => [...prev, createEmptyPlan()])}>
              افزودن پلن جدید
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
