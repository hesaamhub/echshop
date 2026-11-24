"use client"

import { useCallback, useEffect, useState } from "react"
import { Copy, Check } from "lucide-react"
import { Badge, Button, Card, Field } from "@/components/panel/Ui"
import { siteContent } from "@/lib/data"
import {
  fetchSiteSettings,
  updateSiteSettings,
  type FirestoreSiteSettings,
} from "@/lib/firebase/repository"
import { deliveryLabels } from "@/lib/types"

type GatewaysInfo = {
  gateways: {
    tetrapay: { configured: boolean; webhookConfigured: boolean; sandbox: boolean }
  }
  callbacks: {
    tetrapayPaymentCallback: string
    tetrapayWebhook: string
  }
}

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
  const [gatewaysInfo, setGatewaysInfo] = useState<GatewaysInfo | null>(null)
  const [copiedKey, setCopiedKey] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [res, gwRes] = await Promise.all([
        fetchSiteSettings(),
        fetch("/api/payments/gateways", { cache:"no-store" })
          .then((r) => (r.ok ? (r.json() as Promise<GatewaysInfo>) : null))
          .catch(() => null),
      ])
      setSettings(res.data)
      if (gwRes) setGatewaysInfo(gwRes)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  function handleCopyUrl(key: string, value: string) {
    if (!navigator.clipboard) return
    void navigator.clipboard.writeText(value).then(() => {
      setCopiedKey(key)
      window.setTimeout(() => setCopiedKey(""), 1800)
    })
  }

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

        <Card title="درگاه پرداخت (TetraPay)">
          <div className="space-y-3 text-[12px] text-slate-600">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 px-4 py-3">
              <div>
                <p className="font-bold text-[#0a1b33]">تتراپی — درگاه پرداخت (Tetra98 API v1)</p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  متغیرها: TETRAPAY_API_KEY و TETRAPAY_WEBHOOK_SECRET
                  {gatewaysInfo?.gateways.tetrapay.sandbox ? "(حالت سندباکس)" : ""}
                </p>
              </div>
              <Badge tone={gatewaysInfo?.gateways.tetrapay.configured ? "green" : "amber"}>
                {gatewaysInfo?.gateways.tetrapay.configured ? "متصل" : "در انتظار کلید"}
              </Badge>
            </div>

            {gatewaysInfo?.callbacks ? (
              <div className="space-y-2 rounded-2xl border border-slate-200/70 bg-slate-50/75 p-3.5">
                <p className="text-[11px] font-bold text-[#0a1b33]">
                  آدرس‌های بازگشت (Callback & Webhook URLs)
                </p>
                {(
                  [
                    ["tp", "TetraPay Callback URL", gatewaysInfo.callbacks.tetrapayPaymentCallback],
                    ["tpw", "TetraPay Webhook URL", gatewaysInfo.callbacks.tetrapayWebhook],
                  ] as const
                ).map(([key, label, url]) => (
                  <div key={key} className="flex items-center justify-between gap-2 text-[11px]">
                    <div className="min-w-0 flex-1">
                      <span className="block text-[10px] text-slate-400">{label}</span>
                      <code dir="ltr" className="font-latin block truncate text-left text-[10.5px] text-slate-600">
                        {url}
                      </code>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(key, url)}
                      aria-label={`کپی ${label}`}
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-slate-200/80 bg-white text-slate-500 hover:text-[#1b39f5]"
                    >
                      {copiedKey === key ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
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
