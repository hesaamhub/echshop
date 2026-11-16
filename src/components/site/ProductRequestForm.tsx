"use client"

import { useState } from "react"
import { ArrowLeft, Check, PackageSearch } from "lucide-react"
import { useFirebase } from "@/components/providers/FirebaseProvider"
import { submitProductRequest } from "@/lib/firebase/repository"

/** دسته‌بندیهای درخواست */
const CATEGORIES = [
  { value: "ai", label: "اکانت هوش مصنوعی" },
  { value: "stream", label: "استریم، فیلم و موسیقی" },
  { value: "gaming", label: "گیمینگ و کنسول" },
  { value: "design", label: "طراحی و خلاقیت" },
  { value: "work", label: "کار، آموزش و بهره‌وری" },
  { value: "other", label: "موردی دیگر" },
]

const STEPS = 3

/** شمارهٔ دورقمی لاتین */
function stepLabel(index: number) {
  return (index + 1).toString().padStart(2, "0")
}

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[13px] text-white outline-none transition-all placeholder:text-white/25 focus:border-[#7d92ff] focus:bg-white/10"

export default function ProductRequestForm() {
  const { user } = useFirebase()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [category, setCategory] = useState("")
  const [productName, setProductName] = useState("")
  const [plan, setPlan] = useState("")
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [note, setNote] = useState("")

  const canNext =
    (step === 0 && category !== "") ||
    (step === 1 && productName.trim() !== "") ||
    (step === 2 && name.trim() !== "" && contact.trim().length >= 3)

  async function next() {
    if (!canNext || submitting) return
    setError("")
    if (step === STEPS - 1) {
      setSubmitting(true)
      try {
        await submitProductRequest({
          userId: user?.uid || "",
          category,
          productName,
          plan,
          name,
          contact,
          note,
        })
        setDone(true)
      } catch {
        setError("ثبت درخواست انجام نشد. دوباره تلاش کنید.")
      } finally {
        setSubmitting(false)
      }
      return
    }
    setStep((current) => Math.min(current + 1, STEPS - 1))
  }

  function back() {
    setError("")
    setStep((current) => Math.max(current - 1, 0))
  }

  function reset() {
    setStep(0)
    setDone(false)
    setError("")
    setCategory("")
    setProductName("")
    setPlan("")
    setName("")
    setContact("")
    setNote("")
  }

  return (
    <div
      className="relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-[26px] bg-gradient-to-b from-[#0d1c3f] to-[#0a152d] p-6 shadow-[0_30px_70px_-40px_rgba(10,21,45,0.85)]"
    >
      {/* هالهٔ نرم بالای کارت */}
      <span
        className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[420px] -translate-x-1/2 rounded-full bg-[#1b39f5]/25 blur-3xl"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-[#7d92ff]/15 blur-3xl"
        aria-hidden
      />

      {done ? (
        <div className="relative flex flex-1 flex-col items-center justify-center text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-[#3ff0a5]/15 text-[#3ff0a5]">
            <Check className="h-8 w-8" />
          </span>
          <h3 className="font-display mt-4 text-[18px] font-bold text-white">درخواستت ثبت شد</h3>
          <p className="mx-auto mt-2 max-w-xs text-[13px] leading-7 text-white/55">
            تیم اچ‌شاپ درخواستت را بررسی می‌کند و به‌زودی از راه ارتباطی‌ای که دادی با تو تماس می‌گیرد.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-5 rounded-full bg-white px-6 py-2.5 text-[12.5px] font-bold text-[#0a152d] transition-colors hover:bg-[#7d92ff] hover:text-white"
          >
            ثبت درخواست جدید
          </button>
        </div>
      ) : (
        <>
          {/* سربرگ */}
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-[18px] font-bold text-white md:text-[20px]">
                محصولت را پیدا نکردی؟
              </h3>
              <p className="mt-1.5 text-[12px] leading-6 text-white/50">
                بگو چی لازم داری — ما پیدا و شارژش می‌کنیم.
              </p>
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#1b39f5] to-[#7d92ff] text-white shadow-[0_14px_28px_-12px_rgba(27,57,245,0.9)]">
              <PackageSearch className="h-5 w-5" />
            </span>
          </div>

          {/* نوار پیشرفت */}
          <div className="relative mt-5 flex items-center gap-2">
            {Array.from({ length: STEPS }).map((_, index) => (
              <span
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                  index <= step ? "bg-[#7d92ff]" : "bg-white/10"
                }`}
              />
            ))}
            <span className="ms-1 text-[10px] font-bold tracking-[0.18em] text-white/35">
              مرحلهٔ <span className="font-latin">{stepLabel(step)}</span>
            </span>
          </div>

          {/* مرحلهٔ ۱: دسته‌بندی */}
          {step === 0 ? (
            <div className="relative mt-5">
              <p className="text-[11px] font-bold tracking-[0.14em] text-white/35">یک گزینه را انتخاب کن</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {CATEGORIES.map((option) => {
                  const active = category === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setCategory(option.value)}
                      className={`flex items-center gap-2.5 rounded-2xl border px-3.5 py-3 text-right transition-all ${
                        active
                          ? "border-[#7d92ff]/70 bg-[#1b39f5]/20"
                          : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                      }`}
                    >
                      <span
                        className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border-2 ${
                          active ? "border-[#7d92ff]" : "border-white/25"
                        }`}
                      >
                        {active ? <span className="h-2 w-2 rounded-full bg-[#7d92ff]" /> : null}
                      </span>
                      <span className={`text-[12px] font-semibold leading-5 ${active ? "text-white" : "text-white/65"}`}>
                        {option.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : null}

          {/* مرحلهٔ ۲: مشخصات محصول */}
          {step === 1 ? (
            <div className="relative mt-5">
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-semibold text-white/60">نام محصول یا سرویس</span>
                <input
                  value={productName}
                  onChange={(event) => setProductName(event.target.value)}
                  placeholder="مثلاً Midjourney یا اشتراک Spotify"
                  className={inputClass}
                />
              </label>
              <label className="mt-3 block">
                <span className="mb-1.5 block text-[12px] font-semibold text-white/60">
                  پلن یا مدت اشتراک <span className="font-normal text-white/30">(اختیاری)</span>
                </span>
                <input
                  value={plan}
                  onChange={(event) => setPlan(event.target.value)}
                  placeholder="مثلاً ۱‌ماهه، سالانه یا پلن حرفه‌ای"
                  className={inputClass}
                />
              </label>
            </div>
          ) : null}

          {/* مرحلهٔ ۳: راه ارتباطی */}
          {step === 2 ? (
            <div className="relative mt-5">
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-semibold text-white/60">نام</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="نام و نام خانوادگی"
                  className={inputClass}
                />
              </label>
              <label className="mt-3 block">
                <span className="mb-1.5 block text-[12px] font-semibold text-white/60">ایمیل یا شماره تماس</span>
                <input
                  dir="ltr"
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                  placeholder="you@email.com یا 0912..."
                  className={`${inputClass} text-right`}
                />
              </label>
              <label className="mt-3 block">
                <span className="mb-1.5 block text-[12px] font-semibold text-white/60">
                  توضیح بیشتر <span className="font-normal text-white/30">(اختیاری)</span>
                </span>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="هر توضیحی که به سفارش کمک می‌کند"
                  className={`${inputClass} resize-none`}
                />
              </label>
            </div>
          ) : null}

          {error ? (
            <p className="relative mt-4 rounded-xl bg-[#A8382C]/20 px-3 py-2 text-[11.5px] font-semibold text-[#fca5a5]">
              {error}
            </p>
          ) : null}

          {/* دکمه‌ها */}
          <div className="relative mt-auto flex items-center justify-end gap-3 pt-6">
            {step > 0 ? (
              <button
                type="button"
                onClick={back}
                className="rounded-full px-4 py-2.5 text-[13px] font-semibold text-white/50 transition-colors hover:text-white"
              >
                بازگشت
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => void next()}
              disabled={!canNext || submitting}
              className="inline-flex items-center gap-2 rounded-full bg-[#1b39f5] px-6 py-2.5 text-[12.5px] font-bold text-white shadow-[0_18px_36px_-18px_rgba(27,57,245,1)] transition-all duration-500 hover:-translate-y-0.5 hover:bg-[#2a49ff] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              {submitting ? "در حال ثبت…" : step === STEPS - 1 ? "ثبت درخواست" : "بعدی"}
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
