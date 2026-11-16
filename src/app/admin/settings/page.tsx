"use client"

import { useCallback, useEffect, useState } from "react"
import { Badge, Button, Card, Field } from "@/components/panel/Ui"
import { siteContent } from "@/lib/data"
import {
  fetchSiteSettings,
  updateSiteSettings,
  type FirestoreSiteSettings,
} from "@/lib/firebase/repository"
import { deliveryLabels } from "@/lib/types"

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
  maintenanceMode: false,
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<FirestoreSiteSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchSiteSettings()
      setSettings(res.data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function handleSaveGeneral(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setFeedback("")
    setError("")
    try {
      await updateSiteSettings({
        brandNameFa: settings.brandNameFa.trim().slice(0, 80),
        brandNameEn: settings.brandNameEn.trim().slice(0, 80),
        tagline: settings.tagline.trim().slice(0, 160),
        logoMark: settings.logoMark.trim().slice(0, 20),
        heroBadge: settings.heroBadge.trim().slice(0, 80),
        heroHeadlineLead: settings.heroHeadlineLead.trim().slice(0, 120),
        heroHeadlineTail: settings.heroHeadlineTail.trim().slice(0, 120),
        heroSubheadline: settings.heroSubheadline.trim().slice(0, 2500),
        contactPhone: settings.contactPhone.trim().slice(0, 40),
        contactEmail: settings.contactEmail.trim().slice(0, 120),
        contactTelegram: settings.contactTelegram.trim().slice(0, 80),
        contactAddress: settings.contactAddress.trim().slice(0, 240),
        contactHours: settings.contactHours.trim().slice(0, 120),
        footerAbout: settings.footerAbout.trim().slice(0, 4000),
        ...(settings.aboutDescription
          ? { aboutDescription: settings.aboutDescription.trim().slice(0, 8000) }
          : {}),
        maintenanceMode: Boolean(settings.maintenanceMode),
      })
      setFeedback("تنظیمات فروشگاه با موفقیت ذخیره شد.")
    } catch {
      setError("ذخیرهٔ تنظیمات انجام نشد.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-2">
        <Card title="تنظیمات عمومی فروشگاه">
          {loading ? (
            <p className="py-8 text-center text-[12px] text-slate-400">در حال بارگذاری تنظیمات…</p>
          ) : (
            <form onSubmit={(e) => void handleSaveGeneral(e)} className="space-y-4">
              <Field
                label="نام فروشگاه"
                value={settings.brandNameFa}
                onChange={(e) => setSettings((s) => ({ ...s, brandNameFa: e.target.value }))}
                required
              />
              <Field
                label="شعار سایت"
                value={settings.tagline}
                onChange={(e) => setSettings((s) => ({ ...s, tagline: e.target.value }))}
                required
              />
              <Field
                label="توضیح متا و فوتر"
                textarea
                rows={3}
                value={settings.footerAbout}
                onChange={(e) => setSettings((s) => ({ ...s, footerAbout: e.target.value }))}
                required
              />
              <Field
                label="ایمیل پشتیبانی"
                value={settings.contactEmail}
                latin
                onChange={(e) => setSettings((s) => ({ ...s, contactEmail: e.target.value }))}
                required
              />
              <label className="flex items-center justify-between rounded-2xl border border-slate-200/70 px-4 py-3.5">
                <span className="text-[12px] text-slate-600">حالت تعمیر و نگهداری</span>
                <input
                  type="checkbox"
                  checked={Boolean(settings.maintenanceMode)}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, maintenanceMode: e.target.checked }))
                  }
                  className="h-4 w-4 accent-[#1b39f5]"
                />
              </label>

              {error ? <p className="text-[12px] font-semibold text-[#A8382C]">{error}</p> : null}
              {feedback ? <p className="text-[12px] font-semibold text-[#2F7A50]">{feedback}</p> : null}

              <Button type="submit" disabled={busy}>
                {busy ? "در حال ذخیره…" : "ذخیرهٔ تنظیمات عمومی"}
              </Button>
            </form>
          )}
        </Card>

        <Card title="درگاه پرداخت و تسویه">
          <div className="rounded-2xl border border-[#f2e2c6] bg-[#fdf8ef] p-4">
            <div className="flex items-center gap-2">
              <Badge tone="amber">اتصال بانکی سمت سرور</Badge>
            </div>
            <p className="mt-2 text-[11.5px] leading-6 text-slate-600">
              برای امنیت کلیدها، اتصال درگاه شتابی (زرین‌پال، آیدی‌پی یا زیبال) پس از دریافت Merchant ID در Route سمت سرور انجام می‌شود. در حال حاضر ثبت سفارش از طریق سیستم سفارش Firestore فعال است.
            </p>
          </div>
          <div className="mt-4 space-y-3 text-[12px] text-slate-600">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 px-4 py-3.5">
              <span>ثبت سفارش در انتظار پرداخت (Firestore)</span>
              <Badge tone="green">فعال</Badge>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 px-4 py-3.5">
              <span>شارژ و مدیریت موجودی کیف پول از پنل مدیر</span>
              <Badge tone="green">فعال</Badge>
            </div>
          </div>
        </Card>
      </div>

      <Card title="روش‌های تحویل پشتیبانی‌شده در کاتالوگ">
        <p className="text-[11.5px] leading-6 text-slate-500">
          هر پلن محصول در صفحهٔ مدیریت محصولات می‌تواند یکی از این شش روش تحویل را انتخاب کند.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Object.entries(deliveryLabels).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between rounded-2xl border border-slate-200/70 px-4 py-3.5">
              <div>
                <p className="text-[12px] font-bold text-[#0a1b33]">{label}</p>
                <p className="font-latin mt-1 text-[10.5px] text-slate-400">{key}</p>
              </div>
              <Badge tone="blue">پشتیبانی‌شده</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
