"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Button, Card, Field } from "@/components/panel/Ui"
import RichTextEditor from "@/components/panel/RichTextEditor"
import BrandIcon from "@/components/site/BrandIcon"
import {
  fetchProducts,
  fetchSiteSettings,
  updateSiteSettings,
  upsertProduct,
  type FirestoreSiteSettings,
} from "@/lib/firebase/repository"
import { siteContent } from "@/lib/data"
import { hasVisibleRichText, sanitizeRichHtml } from "@/lib/richText"
import type { Product } from "@/lib/types"

const DEFAULT_SETTINGS: FirestoreSiteSettings = {
  brandNameFa: siteContent.brand.nameFa,
  brandNameEn: siteContent.brand.nameEn,
  tagline: siteContent.brand.tagline,
  logoMark: siteContent.brand.logoMark,
  heroBadge: siteContent.hero.badge,
  heroHeadlineLead: siteContent.hero.headlineLead,
  heroHeadlineTail: siteContent.hero.headlineTail,
  heroSubheadline: siteContent.hero.subheadline,
  contactPhone: siteContent.contact.phone,
  contactEmail: siteContent.contact.email,
  contactTelegram: siteContent.contact.telegram,
  contactAddress: siteContent.contact.address,
  contactHours: siteContent.contact.hours,
  footerAbout: siteContent.footer.about,
  aboutDescription: siteContent.about.description,
  maintenanceMode: false,
}

export default function AdminContentPage() {
  const [settings, setSettings] = useState<FirestoreSiteSettings>(DEFAULT_SETTINGS)
  const [products, setProducts] = useState<Product[]>([])
  const [logoEdits, setLogoEdits] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [settingsRes, prodRes] = await Promise.all([fetchSiteSettings(), fetchProducts(true)])
      setSettings(settingsRes.data)
      setProducts(prodRes.items)
      setLogoEdits(
        Object.fromEntries(prodRes.items.map((p) => [p.id, p.logo])),
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function saveAllSettings() {
    setBusy(true)
    setFeedback("")
    setError("")
    const cleanSubheadline = sanitizeRichHtml(settings.heroSubheadline).slice(0, 2500)
    const cleanFooterAbout = sanitizeRichHtml(settings.footerAbout).slice(0, 4000)
    const cleanAboutDescription = sanitizeRichHtml(settings.aboutDescription ?? "").slice(0, 8000)

    if (!hasVisibleRichText(cleanSubheadline) || !hasVisibleRichText(cleanFooterAbout)) {
      setError("زیرتیتر هیرو و متن معرفی فوتر نمی‌توانند خالی باشند.")
      setBusy(false)
      return
    }

    try {
      await updateSiteSettings({
        brandNameFa: settings.brandNameFa.trim().slice(0, 80),
        brandNameEn: settings.brandNameEn.trim().slice(0, 80),
        tagline: settings.tagline.trim().slice(0, 160),
        logoMark: settings.logoMark.trim().slice(0, 20),
        heroBadge: settings.heroBadge.trim().slice(0, 80),
        heroHeadlineLead: settings.heroHeadlineLead.trim().slice(0, 120),
        heroHeadlineTail: settings.heroHeadlineTail.trim().slice(0, 120),
        heroSubheadline: cleanSubheadline,
        contactPhone: settings.contactPhone.trim().slice(0, 40),
        contactEmail: settings.contactEmail.trim().slice(0, 120),
        contactTelegram: settings.contactTelegram.trim().slice(0, 80),
        contactAddress: settings.contactAddress.trim().slice(0, 240),
        contactHours: settings.contactHours.trim().slice(0, 120),
        footerAbout: cleanFooterAbout,
        ...(hasVisibleRichText(cleanAboutDescription)
          ? { aboutDescription: cleanAboutDescription }
          : {}),
        maintenanceMode: Boolean(settings.maintenanceMode),
      })
      setFeedback("تنظیمات و متن‌های غنی سایت با موفقیت در Firestore ذخیره شد.")
    } catch {
      setError("ذخیرهٔ محتوا با خطا مواجه شد. همهٔ فیلدهای ضروری را پر کنید.")
    } finally {
      setBusy(false)
    }
  }

  async function saveProductLogo(product: Product) {
    const nextLogo = (logoEdits[product.id] ?? product.logo).trim().slice(0, 60)
    if (!nextLogo) return
    setFeedback("")
    setError("")
    try {
      await upsertProduct({
        id: product.id,
        slug: product.slug,
        title: product.title,
        brand: product.brand,
        logo: nextLogo,
        categorySlug: product.categorySlug,
        excerpt: product.excerpt,
        description: product.description,
        ...(product.badge ? { badge: product.badge } : {}),
        rating: product.rating,
        sold: product.sold,
        gradient: product.gradient,
        plans: product.plans,
        features: product.features,
        faq: product.faq,
        isActive: true,
      })
      setFeedback(`لوگوی محصول «${product.title}» ذخیره شد.`)
      await load()
    } catch {
      setError("به‌روزرسانی لوگوی محصول انجام نشد.")
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-[#1b39f5]/15 bg-[#f2f6ff] p-5">
        <p className="text-[12.5px] font-bold text-[#1b39f5]">مدیریت محتوای سایت (با ویرایشگر متنی WYSIWYG)</p>
        <p className="mt-1.5 text-[11.5px] leading-6 text-slate-600">
          هویت فروشگاه، توضیحات هیرو، معرفی دربارهٔ ما در فوتر و صفحهٔ دربارهٔ ما با قالب‌بندی، تیتر، لینک و فهرست در سند`site_settings/main` روی Firestore ذخیره می‌شوند.
        </p>
      </div>

      {loading ? (
        <Card>
          <p className="py-8 text-center text-[12px] text-slate-400">در حال بارگذاری محتوا…</p>
        </Card>
      ) : (
        <>
          <Card title="هویت فروشگاه">
            <div className="grid gap-4 lg:grid-cols-2">
              <Field
                label="نام فارسی"
                value={settings.brandNameFa}
                onChange={(e) => setSettings((s) => ({ ...s, brandNameFa: e.target.value }))}
              />
              <Field
                label="نام لاتین"
                value={settings.brandNameEn}
                latin
                onChange={(e) => setSettings((s) => ({ ...s, brandNameEn: e.target.value }))}
              />
              <Field
                label="شعار فروشگاه"
                value={settings.tagline}
                onChange={(e) => setSettings((s) => ({ ...s, tagline: e.target.value }))}
              />
              <Field
                label="نشانهٔ لوگو"
                value={settings.logoMark}
                latin
                onChange={(e) => setSettings((s) => ({ ...s, logoMark: e.target.value }))}
              />
            </div>
            <div className="mt-4">
              <Button disabled={busy} onClick={() => void saveAllSettings()}>
                {busy ? "در حال ذخیره…" : "ذخیرهٔ هویت فروشگاه"}
              </Button>
            </div>
          </Card>

          <Card title="بخش هیرو صفحهٔ اصلی">
            <div className="grid gap-4 lg:grid-cols-2">
              <Field
                label="متن نشان بالای تیتر"
                value={settings.heroBadge}
                onChange={(e) => setSettings((s) => ({ ...s, heroBadge: e.target.value }))}
              />
              <Field
                label="تیتر — بخش نخست"
                value={settings.heroHeadlineLead}
                onChange={(e) => setSettings((s) => ({ ...s, heroHeadlineLead: e.target.value }))}
              />
              <Field
                label="تیتر — بخش پایانی"
                value={settings.heroHeadlineTail}
                hint="نام برندها به‌صورت چرخشی میان دو بخش تیتر نمایش داده می‌شود."
                onChange={(e) => setSettings((s) => ({ ...s, heroHeadlineTail: e.target.value }))}
              />
              <div className="lg:col-span-2">
                <RichTextEditor
                  label="زیرتیتر و توضیحات هیرو"
                  value={settings.heroSubheadline}
                  maxLength={2500}
                  minHeightClass="min-h-[120px]"
                  hint="می‌توانید کلمات مهم را برجسته کنید یا لینک مستقیم بگذارید."
                  onChange={(nextHtml) => setSettings((s) => ({ ...s, heroSubheadline: nextHtml }))}
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button disabled={busy} onClick={() => void saveAllSettings()}>
                {busy ? "در حال ذخیره…" : "ذخیرهٔ تغییرات هیرو"}
              </Button>
              <Link
                href="/"
                className="glass-plate glass-plate-hover rounded-full px-5 py-2.5 text-[12px] font-semibold text-[#1b39f5]"
              >
                مشاهدهٔ صفحهٔ اصلی
              </Link>
            </div>
          </Card>

          <Card title="معرفی فروشگاه و صفحهٔ دربارهٔ ما">
            <div className="space-y-6">
              <RichTextEditor
                label="متن کوتاه دربارهٔ ما (نمایش در فوتر سایت)"
                value={settings.footerAbout}
                maxLength={4000}
                minHeightClass="min-h-[130px]"
                hint="این متن در بخش پایانی (فوتر) تمام صفحات نمایش داده می‌شود."
                onChange={(nextHtml) => setSettings((s) => ({ ...s, footerAbout: nextHtml }))}
              />

              <RichTextEditor
                label="متن کامل دربارهٔ ما (نمایش در صفحهٔ /about)"
                value={settings.aboutDescription ?? siteContent.about.description}
                maxLength={8000}
                minHeightClass="min-h-[210px]"
                hint="می‌توانید تیتر، بولت، نقل‌قول و توضیحات جامع دربارهٔ فروشگاه، گارانتی و مسیر برند را بنویسید."
                onChange={(nextHtml) => setSettings((s) => ({ ...s, aboutDescription: nextHtml }))}
              />

              <div className="flex flex-wrap gap-2">
                <Button disabled={busy} onClick={() => void saveAllSettings()}>
                  {busy ? "در حال ذخیره…" : "ذخیرهٔ متون معرفی و دربارهٔ ما"}
                </Button>
                <Link
                  href="/about"
                  className="glass-plate glass-plate-hover rounded-full px-5 py-2.5 text-[12px] font-semibold text-[#1b39f5]"
                >
                  مشاهدهٔ صفحهٔ دربارهٔ ما
                </Link>
              </div>
            </div>
          </Card>

          <div className="grid gap-5 xl:grid-cols-1">
            <Card title="اطلاعات تماس">
              <div className="space-y-4">
                <Field
                  label="تلفن"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings((s) => ({ ...s, contactPhone: e.target.value }))}
                />
                <Field
                  label="ایمیل پشتیبانی"
                  value={settings.contactEmail}
                  latin
                  onChange={(e) => setSettings((s) => ({ ...s, contactEmail: e.target.value }))}
                />
                <Field
                  label="تلگرام پشتیبانی"
                  value={settings.contactTelegram}
                  latin
                  onChange={(e) => setSettings((s) => ({ ...s, contactTelegram: e.target.value }))}
                />
                <Field
                  label="نشانی"
                  value={settings.contactAddress}
                  onChange={(e) => setSettings((s) => ({ ...s, contactAddress: e.target.value }))}
                />
                <Field
                  label="ساعات پاسخ‌گویی"
                  value={settings.contactHours}
                  onChange={(e) => setSettings((s) => ({ ...s, contactHours: e.target.value }))}
                />
                <Button disabled={busy} onClick={() => void saveAllSettings()}>
                  {busy ? "در حال ذخیره…" : "ذخیرهٔ اطلاعات تماس"}
                </Button>
              </div>
            </Card>
          </div>

          {error ? <p className="text-[12px] font-semibold text-[#A8382C]">{error}</p> : null}
          {feedback ? <p className="text-[12px] font-semibold text-[#2F7A50]">{feedback}</p> : null}

          <Card title="لوگوی محصولات">
            <div className="space-y-3">
              {products.slice(0, 12).map((product) => (
                <div
                  key={product.id}
                  className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200/70 p-4"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-50">
                    <BrandIcon slug={logoEdits[product.id] ?? product.logo} size={26} color="#0a1b33" />
                  </div>
                  <div className="min-w-[180px] flex-1">
                    <p className="text-[12px] font-bold text-[#0a1b33]">{product.title}</p>
                    <p className="font-latin mt-1 text-[10.5px] text-slate-400">{product.slug}</p>
                  </div>
                  <input
                    dir="ltr"
                    value={logoEdits[product.id] ?? product.logo}
                    onChange={(e) =>
                      setLogoEdits((prev) => ({ ...prev, [product.id]: e.target.value }))
                    }
                    className="font-latin min-w-[220px] flex-[2] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-left text-[11.5px] text-[#0a1b33] outline-none focus:border-[#1b39f5]"
                  />
                  <Button variant="ghost" onClick={() => void saveProductLogo(product)}>
                    ثبت لوگو
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
