"use client"

import { useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { submitContactMessage } from "@/lib/firebase/repository"

export default function ContactForm() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)
  const [sentId, setSentId] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError("")
    if (!name.trim() || !subject.trim() || !message.trim()) {
      setError("نام، موضوع و متن پیام را کامل کنید.")
      return
    }
    setBusy(true)
    try {
      const id = await submitContactMessage({
        name,
        phone,
        email,
        subject,
        message,
      })
      setSentId(id)
      setName("")
      setPhone("")
      setEmail("")
      setSubject("")
      setMessage("")
    } catch {
      setError("ارسال پیام انجام نشد. دوباره تلاش کنید.")
    } finally {
      setBusy(false)
    }
  }

  if (sentId) {
    return (
      <div className="rounded-[32px] border border-[#1b39f5]/10 bg-white p-8 text-center shadow-[0_22px_48px_-36px_rgba(27,57,245,0.5)]">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#E7F4EC] text-[#2F7A50]">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h2 className="mt-4 font-display text-[18px] font-bold text-[#0a1b33]">پیام شما ثبت شد</h2>
        <p className="mt-2 text-[12.5px] leading-7 text-slate-500">
          پیام شما با کد <span className="font-latin font-bold text-[#0a1b33]">{sentId}</span> ثبت شد و کارشناسان پشتیبانی بررسی می‌کنند.
        </p>
        <button
          type="button"
          onClick={() => setSentId("")}
          className="glass-solid mt-5 rounded-full px-6 py-2.5 text-[12.5px] font-semibold"
        >
          ارسال پیام جدید
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="rounded-[32px] border border-[#1b39f5]/10 bg-white p-8 shadow-[0_22px_48px_-36px_rgba(27,57,245,0.5)]"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="نام و نام خانوادگی" placeholder="مانند: زهرا موسوی" value={name} onChange={setName} required />
        <Field label="شماره تماس" placeholder="۰۹۱۲۳۴۵۶۷۸۹" value={phone} onChange={setPhone} />
        <Field label="ایمیل" placeholder="you@example.com" value={email} onChange={setEmail} latin />
        <Field label="موضوع" placeholder="مانند: همکاری عمده" value={subject} onChange={setSubject} required />
      </div>
      <label className="mt-4 block">
        <span className="text-[12px] font-semibold text-[#0a1b33]">متن پیام</span>
        <textarea
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
          placeholder="توضیح درخواست خود را بنویسید…"
          className="mt-2 w-full rounded-2xl border border-[#1b39f5]/12 bg-[#1b39f5]/4 px-4 py-3 text-[12.5px] leading-7 text-[#0a1b33] outline-none transition-all placeholder:text-slate-400 focus:border-[#1b39f5]/45 focus:bg-white focus:shadow-[0_0_0_4px_rgba(27,57,245,0.1)]"
        />
      </label>

      {error ? (
        <p role="alert" className="mt-3 rounded-2xl bg-[#FDF1EF] px-4 py-2.5 text-[12px] font-semibold text-[#A8382C]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="glass-solid mt-5 rounded-full px-8 py-3.5 text-[13px] font-semibold disabled:opacity-60"
      >
        {busy ? "در حال ارسال…" : "ارسال پیام"}
      </button>
    </form>
  )
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  latin,
  required,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (val: string) => void
  latin?: boolean
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold text-[#0a1b33]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        dir={latin ? "ltr" : undefined}
        className="mt-2 w-full rounded-2xl border border-[#1b39f5]/12 bg-[#1b39f5]/4 px-4 py-3 text-[12.5px] text-[#0a1b33] outline-none transition-all placeholder:text-slate-400 focus:border-[#1b39f5]/45 focus:bg-white focus:shadow-[0_0_0_4px_rgba(27,57,245,0.1)]"
      />
    </label>
  )
}
