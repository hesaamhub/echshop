"use client"

import { useState } from "react"
import { ArrowLeft, Check, PackageSearch } from "lucide-react"

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

export default function ProductRequestForm() {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [category, setCategory] = useState("")
  const [productName, setProductName] = useState("")
  const [plan, setPlan] = useState("")
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [note, setNote] = useState("")

  const canNext =
    (step === 0 && category !== "") ||
    (step === 1 && productName.trim() !== "") ||
    (step === 2 && name.trim() !== "" && contact.trim() !== "")

  function next() {
    if (!canNext) return
    if (step === STEPS - 1) {
      setDone(true)
      return
    }
    setStep((current) => Math.min(current + 1, STEPS - 1))
  }

  function back() {
    setStep((current) => Math.max(current - 1, 0))
  }

  function reset() {
    setStep(0)
    setDone(false)
    setCategory("")
    setProductName("")
    setPlan("")
    setName("")
    setContact("")
    setNote("")
  }

  return (
    <div className="relative h-full">
      {/* کارت‌های پشتی برای حس عمق */}
      <div className="absolute inset-x-5 top-4 -bottom-2 rounded-[30px] bg-white/45" aria-hidden />
      <div className="absolute inset-x-2.5 top-2 -bottom-1 rounded-[32px] bg-white/70" aria-hidden />

      <div className="relative flex h-full min-h-[380px] flex-col rounded-[32px] border border-black/5 bg-white p-7 shadow-[0_30px_70px_-40px_rgba(10,21,45,0.55)]">
        {done ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-[#1b39f5]/10 text-[#1b39f5]">
              <Check className="h-8 w-8" />
            </span>
            <h3 className="font-display mt-4 text-[20px] font-bold text-[#0a152d]">درخواستت ثبت شد</h3>
            <p className="mx-auto mt-2 max-w-xs text-[13px] leading-7 text-[#0a152d]/60">
              تیم اچ‌شاپ درخواستت را بررسی می‌کند و به‌زودی از راه ارتباطی‌ای که دادی با تو تماس می‌گیرد.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-5 rounded-full bg-[#0a152d] px-6 py-2.5 text-[12.5px] font-bold text-white transition-colors hover:bg-[#1b39f5]"
            >
              ثبت درخواست جدید
            </button>
          </div>
        ) : (
          <>
            {/* نوار پیشرفت */}
            <div className="flex items-center gap-2">
              {Array.from({ length: STEPS }).map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    index <= step ? "bg-[#0a152d]" : "bg-[#0a152d]/12"
                  }`}
                />
              ))}
              <span className="ms-1 grid h-7 w-7 place-items-center rounded-full bg-[#1b39f5]/10 text-[#1b39f5]">
                <PackageSearch className="h-4 w-4" />
              </span>
            </div>

            <p className="mt-6 text-[11px] font-bold tracking-[0.18em] text-[#0a152d]/40">
              درخواست محصول · <span className="font-latin">{stepLabel(step)}</span>
            </p>

            {/* مرحلهٔ ۱: دسته‌بندی */}
            {step === 0 ? (
              <div className="mt-2">
                <h3 className="font-display text-[21px] leading-8 font-bold text-[#0a152d] md:text-[23px]">
                  چه نوع محصولی می‌خواهی؟
                </h3>
                <p className="mt-4 text-[11px] font-bold tracking-[0.14em] text-[#0a152d]/40">یک گزینه را انتخاب کن</p>
                <div className="mt-3 space-y-2">
                  {CATEGORIES.map((option) => {
                    const active = category === option.value
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setCategory(option.value)}
                        className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-right transition-all ${
                          active
                            ? "border-[#1b39f5] bg-[#1b39f5]/6"
                            : "border-black/8 hover:border-[#1b39f5]/40 hover:bg-[#1b39f5]/4"
                        }`}
                      >
                        <span
                          className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
                            active ? "border-[#1b39f5]" : "border-black/20"
                          }`}
                        >
                          {active ? <span className="h-2.5 w-2.5 rounded-full bg-[#1b39f5]" /> : null}
                        </span>
                        <span className="text-[13px] font-semibold text-[#0a152d]">{option.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : null}

            {/* مرحلهٔ ۲: مشخصات محصول */}
            {step === 1 ? (
              <div className="mt-2">
                <h3 className="font-display text-[21px] leading-8 font-bold text-[#0a152d] md:text-[23px]">
                  چه محصولی را دقیقاً لازم داری؟
                </h3>
                <label className="mt-5 block">
                  <span className="mb-1.5 block text-[12px] font-semibold text-[#0a152d]/70">نام محصول یا سرویس</span>
                  <input
                    value={productName}
                    onChange={(event) => setProductName(event.target.value)}
                    placeholder="مثلاً Midjourney یا اشتراک Spotify"
                    className="w-full rounded-2xl border border-black/8 bg-[#f7f8fc] px-4 py-3 text-[13px] text-[#0a152d] outline-none transition-all placeholder:text-[#0a152d]/30 focus:border-[#1b39f5] focus:bg-white"
                  />
                </label>
                <label className="mt-3 block">
                  <span className="mb-1.5 block text-[12px] font-semibold text-[#0a152d]/70">پلن یا مدت اشتراک <span className="font-normal text-[#0a152d]/40">(اختیاری)</span></span>
                  <input
                    value={plan}
                    onChange={(event) => setPlan(event.target.value)}
                    placeholder="مثلاً ۱‌ماهه، سالانه یا پلن حرفه‌ای"
                    className="w-full rounded-2xl border border-black/8 bg-[#f7f8fc] px-4 py-3 text-[13px] text-[#0a152d] outline-none transition-all placeholder:text-[#0a152d]/30 focus:border-[#1b39f5] focus:bg-white"
                  />
                </label>
              </div>
            ) : null}

            {/* مرحلهٔ ۳: راه ارتباطی */}
            {step === 2 ? (
              <div className="mt-2">
                <h3 className="font-display text-[21px] leading-8 font-bold text-[#0a152d] md:text-[23px]">
                  چطور با تو در تماس باشیم؟
                </h3>
                <label className="mt-5 block">
                  <span className="mb-1.5 block text-[12px] font-semibold text-[#0a152d]/70">نام</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="نام و نام خانوادگی"
                    className="w-full rounded-2xl border border-black/8 bg-[#f7f8fc] px-4 py-3 text-[13px] text-[#0a152d] outline-none transition-all placeholder:text-[#0a152d]/30 focus:border-[#1b39f5] focus:bg-white"
                  />
                </label>
                <label className="mt-3 block">
                  <span className="mb-1.5 block text-[12px] font-semibold text-[#0a152d]/70">ایمیل یا شماره تماس</span>
                  <input
                    dir="ltr"
                    value={contact}
                    onChange={(event) => setContact(event.target.value)}
                    placeholder="you@email.com یا 0912..."
                    className="w-full rounded-2xl border border-black/8 bg-[#f7f8fc] px-4 py-3 text-right text-[13px] text-[#0a152d] outline-none transition-all placeholder:text-[#0a152d]/30 focus:border-[#1b39f5] focus:bg-white"
                  />
                </label>
                <label className="mt-3 block">
                  <span className="mb-1.5 block text-[12px] font-semibold text-[#0a152d]/70">توضیح بیشتر <span className="font-normal text-[#0a152d]/40">(اختیاری)</span></span>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="هر توضیحی که به سفارش کمک می‌کند"
                    className="w-full resize-none rounded-2xl border border-black/8 bg-[#f7f8fc] px-4 py-3 text-[13px] text-[#0a152d] outline-none transition-all placeholder:text-[#0a152d]/30 focus:border-[#1b39f5] focus:bg-white"
                  />
                </label>
              </div>
            ) : null}

            {/* دکمه‌ها */}
            <div className="mt-auto flex items-center justify-end gap-3 pt-6">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={back}
                  className="rounded-full px-4 py-2.5 text-[13px] font-semibold text-[#0a152d]/60 transition-colors hover:text-[#0a152d]"
                >
                  بازگشت
                </button>
              ) : null}
              <button
                type="button"
                onClick={next}
                disabled={!canNext}
                className="inline-flex items-center gap-2 rounded-full bg-[#1b39f5] px-6 py-3 text-[13px] font-bold text-white shadow-[0_18px_36px_-20px_rgba(27,57,245,0.9)] transition-all duration-500 hover:-translate-y-0.5 hover:bg-[#1226c4] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
              >
                {step === STEPS - 1 ? "ثبت درخواست" : "بعدی"}
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
