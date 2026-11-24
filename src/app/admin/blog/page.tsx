"use client"

import { useCallback, useEffect, useState } from "react"
import { Badge, Button, Card, Field, Table, Td } from "@/components/panel/Ui"
import { deletePost, fetchPosts, upsertPost } from "@/lib/firebase/repository"
import type { Post } from "@/lib/types"
import { faDate } from "@/lib/utils"

type EditablePost = Post & { isPublished: boolean }

const EMPTY_POST: EditablePost = {
  slug:"",
  title:"",
  excerpt:"",
  body:"",
  category:"راهنمای خرید",
  author:"تحریریه اچ‌شاپ",
  readMinutes: 5,
  publishedAt: new Date().toISOString().slice(0, 10),
  cover:"linear-gradient(135deg, #1b39f5 0%, #3b5bff 100%)",
  isPublished: true,
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<EditablePost[]>([])
  const [form, setForm] = useState<EditablePost>(EMPTY_POST)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchPosts(true)
      setPosts(
        res.items.map((item) => ({
          ...item,
          isPublished: (item as EditablePost).isPublished ?? true,
        })),
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  function startNew() {
    setEditingSlug(null)
    setForm({
      ...EMPTY_POST,
      publishedAt: new Date().toISOString().slice(0, 10),
    })
    setFeedback("")
    setError("")
  }

  function startEdit(post: EditablePost) {
    setEditingSlug(post.slug)
    setForm({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      body: post.body,
      category: post.category,
      author: post.author,
      readMinutes: post.readMinutes,
      publishedAt: post.publishedAt,
      cover: post.cover,
      isPublished: post.isPublished ?? true,
    })
    setFeedback("")
    setError("")
  }

  async function handleSave(publish: boolean) {
    setFeedback("")
    setError("")

    const slug = form.slug.trim().toLowerCase()
    if (!/^[a-z0-9-]{1,100}$/.test(slug)) {
      setError("نشانی یکتا (slug) باید فقط شامل حروف کوچک انگلیسی، عدد و خط تیره باشد.")
      return
    }
    if (!form.title.trim() || !form.excerpt.trim() || !form.body.trim()) {
      setError("عنوان، خلاصه و متن کامل مقاله الزامی هستند.")
      return
    }

    setBusy(true)
    try {
      await upsertPost({
        slug,
        title: form.title.trim().slice(0, 160),
        excerpt: form.excerpt.trim().slice(0, 400),
        body: form.body.trim().slice(0, 20000),
        category: (form.category || "راهنمای خرید").trim().slice(0, 60),
        author: (form.author || "تحریریه اچ‌شاپ").trim().slice(0, 80),
        readMinutes: Math.max(1, Math.min(120, Number(form.readMinutes) || 5)),
        publishedAt: (form.publishedAt || new Date().toISOString().slice(0, 10)).trim().slice(0, 40),
        cover: (form.cover || "linear-gradient(135deg, #1b39f5 0%, #3b5bff 100%)").trim().slice(0, 240),
        isPublished: publish,
      })
      setFeedback(`مقاله «${form.title.trim()}» ${publish ? "منتشر" : "به‌عنوان پیش‌نویس ذخیره"} شد.`)
      startNew()
      await load()
    } catch {
      setError("ذخیرهٔ مقاله با خطا مواجه شد.")
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(slug: string) {
    setFeedback("")
    setError("")
    try {
      await deletePost(slug)
      if (editingSlug === slug) startNew()
      setFeedback(`مقالهٔ ${slug} حذف شد.`)
      await load()
    } catch {
      setError("حذف مقاله انجام نشد.")
    }
  }

  return (
    <div className="space-y-5">
      <Card title="نوشته‌های بلاگ" action={<Button onClick={startNew}>نوشتهٔ جدید</Button>}>
        {loading ? (
          <p className="py-8 text-center text-[12px] text-slate-400">در حال بارگذاری نوشته‌ها…</p>
        ) : posts.length === 0 ? (
          <p className="py-8 text-center text-[12px] text-slate-400">مقاله‌ای ثبت نشده است.</p>
        ) : (
          <Table head={["عنوان", "نشانی یکتا", "دسته", "تاریخ", "وضعیت", "عملیات"]}>
            {posts.map((post) => (
              <tr key={post.slug}>
                <Td className="font-semibold text-[#0a1b33]">{post.title}</Td>
                <Td className="font-latin text-slate-400">{post.slug}</Td>
                <Td>{post.category}</Td>
                <Td className="text-slate-400">{faDate(post.publishedAt)}</Td>
                <Td>
                  <Badge tone={post.isPublished ? "green" : "amber"}>
                    {post.isPublished ? "منتشر شده" : "پیش‌نویس"}
                  </Badge>
                </Td>
                <Td>
                  <div className="flex gap-1.5">
                    <Button variant="ghost" onClick={() => startEdit(post)}>
                      ویرایش
                    </Button>
                    <Button variant="danger" onClick={() => void handleDelete(post.slug)}>
                      حذف
                    </Button>
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Card title={editingSlug ? `ویرایش مقاله: ${editingSlug}` : "نوشتن مقالهٔ جدید"}>
        <div className="grid gap-4 lg:grid-cols-2">
          <Field
            label="عنوان"
            placeholder="مانند: راهنمای خرید اکانت امن"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
          <Field
            label="نشانی یکتا"
            placeholder="how-to-buy-safe-account"
            latin
            value={form.slug}
            disabled={Boolean(editingSlug)}
            onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value.toLowerCase() }))}
            required
          />
          <Field
            label="دسته‌بندی"
            placeholder="راهنمای خرید"
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
          />
          <Field
            label="نویسنده"
            placeholder="تحریریه اچ‌شاپ"
            value={form.author}
            onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
          />
          <Field
            label="زمان مطالعه (دقیقه)"
            type="number"
            latin
            value={String(form.readMinutes)}
            onChange={(e) => setForm((prev) => ({ ...prev, readMinutes: Number(e.target.value) }))}
          />
          <Field
            label="رنگ یا تصویر کاور"
            latin
            value={form.cover}
            onChange={(e) => setForm((prev) => ({ ...prev, cover: e.target.value }))}
          />
          <div className="lg:col-span-2">
            <Field
              label="خلاصه"
              textarea
              rows={3}
              placeholder="خلاصهٔ کوتاه برای نمایش در فهرست…"
              value={form.excerpt}
              onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
              required
            />
          </div>
          <div className="lg:col-span-2">
            <Field
              label="متن کامل"
              textarea
              rows={10}
              placeholder="متن مقاله…"
              value={form.body}
              onChange={(e) => setForm((prev) => ({ ...prev, body: e.target.value }))}
              required
            />
          </div>
        </div>
        {error ? <p className="mt-3 text-[12px] font-semibold text-[#A8382C]">{error}</p> : null}
        {feedback ? <p className="mt-3 text-[12px] font-semibold text-[#2F7A50]">{feedback}</p> : null}
        <div className="mt-5 flex flex-wrap gap-2">
          <Button disabled={busy} onClick={() => void handleSave(true)}>
            {busy ? "در حال ذخیره…" : "انتشار مقاله"}
          </Button>
          <Button variant="ghost" disabled={busy} onClick={() => void handleSave(false)}>
            ذخیره به عنوان پیش‌نویس
          </Button>
        </div>
      </Card>
    </div>
  )
}
