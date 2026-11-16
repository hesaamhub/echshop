"use client"

import { useEffect, useState } from "react"
import { useFirebase } from "@/components/providers/FirebaseProvider"
import { Badge, Button, Card, Field } from "@/components/panel/Ui"
import { updateUserProfile } from "@/lib/firebase/repository"

export default function ProfilePage() {
  const { user, publicProfile, privateProfile, refreshProfile, signOutUser } = useFirebase()
  const [displayName, setDisplayName] = useState("")
  const [phone, setPhone] = useState("")
  const [nationalId, setNationalId] = useState("")
  const [busy, setBusy] = useState(false)
  const [savedMsg, setSavedMsg] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    setDisplayName(publicProfile?.displayName ?? user?.displayName ?? "")
    setPhone(privateProfile?.phone ?? "")
    setNationalId(privateProfile?.nationalId ?? "")
  }, [publicProfile?.displayName, privateProfile?.phone, privateProfile?.nationalId, user?.displayName])

  async function handleSave(event: React.FormEvent) {
    event.preventDefault()
    if (!user) return
    setSavedMsg("")
    setError("")
    if (!displayName.trim()) {
      setError("نام نمایشی را وارد کنید.")
      return
    }
    setBusy(true)
    try {
      await updateUserProfile(user.uid, { displayName, phone, nationalId })
      await refreshProfile()
      setSavedMsg("تغییرات پروفایل ذخیره شد.")
    } catch {
      setError("ذخیرهٔ پروفایل انجام نشد.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Card title="اطلاعات شخصی">
        <form className="space-y-4" onSubmit={(event) => void handleSave(event)}>
          <Field
            label="نام و نام خانوادگی"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            required
          />
          <Field
            label="شماره موبایل"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="0912..."
            latin
          />
          <Field
            label="ایمیل"
            value={privateProfile?.email || user?.email || ""}
            disabled
            latin
            hint="ایمیل از حساب گوگل خوانده می‌شود."
          />
          <Field
            label="کد ملی (اختیاری)"
            value={nationalId}
            onChange={(event) => setNationalId(event.target.value)}
            placeholder="برای صدور فاکتور رسمی"
            latin
          />
          {savedMsg ? <p className="text-[11.5px] font-semibold text-[#2F7A50]">{savedMsg}</p> : null}
          {error ? <p className="text-[11.5px] font-semibold text-[#A8382C]">{error}</p> : null}
          <Button type="submit" disabled={busy}>
            {busy ? "در حال ذخیره…" : "ذخیرهٔ تغییرات"}
          </Button>
        </form>
      </Card>

      <Card title="امنیت و وضعیت حساب">
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] font-bold text-[#0a1b33]">وضعیت احراز هویت</span>
              <Badge tone="green">متصل به گوگل</Badge>
            </div>
            <p className="mt-2 text-[11.5px] leading-6 text-slate-500">
              سطح حساب فعلی شما: <strong className="text-[#0a1b33]">{publicProfile?.plan || "عادی"}</strong>
            </p>
          </div>
          <Button variant="danger" onClick={() => void signOutUser()}>
            خروج از حساب کاربری
          </Button>
        </div>
      </Card>
    </div>
  )
}
