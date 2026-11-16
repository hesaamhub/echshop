"use client"

import { useCallback, useEffect, useState } from "react"
import { Badge, Button, Card, Field, Table, Td } from "@/components/panel/Ui"
import { deleteCategory, fetchCategories, upsertCategory } from "@/lib/firebase/repository"
import type { Category } from "@/lib/types"
import { toman } from "@/lib/utils"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<(Category & { isActive?: boolean; order?: number })[]>([])
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("Sparkles")
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchCategories(true)
      setCategories(res.items)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  function handleEdit(c: Category & { isActive?: boolean }) {
    setTitle(c.title)
    setSlug(c.slug)
    setDescription(c.description)
    setIcon(c.icon)
    setIsActive(c.isActive ?? true)
    setFeedback("")
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault()
    const cleanSlug = slug.trim().toLowerCase()
    if (!title.trim() || !cleanSlug) return
    setBusy(true)
    setFeedback("")
    try {
      const existing = categories.find((c) => c.slug === cleanSlug)
      await upsertCategory({
        slug: cleanSlug,
        title: title.trim(),
        description: description.trim(),
        icon: icon.trim() || "Sparkles",
        count: existing?.count ?? 0,
        order: existing?.order ?? categories.length + 1,
        isActive,
      })
      setFeedback(`دسته‌بندی «${title.trim()}» ذخیره شد.`)
      setTitle("")
      setSlug("")
      setDescription("")
      await load()
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(targetSlug: string) {
    setBusy(true)
    try {
      await deleteCategory(targetSlug)
      setCategories((prev) => prev.filter((c) => c.slug !== targetSlug))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
      <Card title="دسته‌بندی‌ها">
        {loading ? (
          <p className="py-8 text-center text-[12px] text-slate-400">در حال بارگذاری…</p>
        ) : (
          <Table head={["عنوان", "نشانی یکتا", "تعداد محصول", "وضعیت", "عملیات"]}>
            {categories.map((category) => (
              <tr key={category.slug}>
                <Td className="font-semibold text-[#0a1b33]">{category.title}</Td>
                <Td className="font-latin text-slate-400">{category.slug}</Td>
                <Td className="num">{toman(category.count)}</Td>
                <Td>
                  <Badge tone={category.isActive === false ? "gray" : "green"}>
                    {category.isActive === false ? "مخفی" : "نمایش در منو"}
                  </Badge>
                </Td>
                <Td>
                  <div className="flex gap-1.5">
                    <Button variant="ghost" onClick={() => handleEdit(category)}>
                      ویرایش
                    </Button>
                    <Button variant="danger" disabled={busy} onClick={() => void handleDelete(category.slug)}>
                      حذف
                    </Button>
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Card title="افزودن / ویرایش دسته‌بندی" className="h-fit">
        <form onSubmit={(e) => void handleSave(e)} className="space-y-4">
          <Field label="عنوان دسته" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مانند: هوش مصنوعی" required />
          <Field label="نشانی یکتا" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="ai-tools" latin required />
          <Field label="توضیح کوتاه" textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="معرفی کوتاه دسته" />
          <Field label="نام آیکون" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="Sparkles" latin hint="آیکون‌های Lucide (مثلاً Sparkles, Music)" />
          <label className="flex items-center justify-between rounded-2xl border border-slate-200/70 px-4 py-3.5">
            <span className="text-[12px] text-slate-600">نمایش در منو</span>
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 accent-[#1b39f5]" />
          </label>
          {feedback ? <p className="text-[11.5px] font-semibold text-[#2F7A50]">{feedback}</p> : null}
          <Button type="submit" disabled={busy}>
            {busy ? "در حال ذخیره…" : "ذخیره دسته"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
