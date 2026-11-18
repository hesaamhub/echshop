"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  ArrowUp,
  Headphones,
  LifeBuoy,
  MessageSquareText,
  RotateCcw,
  Sparkles,
  X,
  Zap,
} from "lucide-react"
import {
  QUICK_QUESTIONS,
  SUPPORT_CHAT_MODELS,
  type ChatTurn,
  type SupportChatMode,
} from "@/lib/ai/supportChat"
import { cn } from "@/lib/utils"

type UIMessage = ChatTurn & {
  id: string
  error?: boolean
}

const WELCOME_MESSAGE: UIMessage = {
  id: "welcome",
  role: "model",
  text: "سلام! من دستیار هوشمند اچ‌شاپ هستم. دربارهٔ زمان تحویل، تفاوت پلن‌ها، خرید اکانت مناسب یا پیگیری گارانتی بپرسید تا راهنمایی‌تان کنم.",
}

/**
 * تبدیل لینک‌های داخلی داخل متن پاسخ هوش مصنوعی (/products یا /dashboard/tickets)
 * به لینک قابل کلیک بدون رندر HTML خام.
 */
function renderMessageContent(text: string) {
  const parts = text.split(/(\/(?:products(?:\/[a-z0-9-]+)?|category\/[a-z0-9-]+|dashboard\/tickets))/gi)
  return parts.map((part, idx) => {
    if (
      /^\/(?:products(?:\/[a-z0-9-]+)?|category\/[a-z0-9-]+|dashboard\/tickets)$/i.test(
        part,
      )
    ) {
      return (
        <Link
          key={`${part}-${idx}`}
          href={part}
          className="mx-0.5 inline-block font-semibold text-[#1b39f5] underline decoration-[#1b39f5]/40 underline-offset-4 hover:text-[#1530d8]"
          dir="ltr"
        >
          {part}
        </Link>
      )
    }
    return <span key={idx}>{part}</span>
  })
}

export default function SupportChatWidget() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<SupportChatMode>("smart")
  const [messages, setMessages] = useState<UIMessage[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showQuickDrawer, setShowQuickDrawer] = useState(true)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }, 60)
    return () => clearTimeout(timer)
  }, [open, messages.length, loading])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  async function sendMessage(rawText: string) {
    const trimmed = rawText.trim()
    if (!trimmed || loading) return

    setErrorMsg(null)
    setShowQuickDrawer(false)

    const userMsg: UIMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
    }

    const historyForApi = messages
      .filter((m) => m.id !== "welcome" && !m.error)
      .map((m) => ({ role: m.role, text: m.text }))

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/ai/support-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: historyForApi,
          mode,
        }),
      })

      const data = (await res.json()) as { reply?: string; error?: string }

      if (!res.ok || !data.reply) {
        const errText =
          data.error ||
          "پاسخگویی موقتاً با مشکل روبه‌رو شد. می‌توانید از بخش تیکت پشتیبانی کمک بگیرید."
        setErrorMsg(errText)
        setLoading(false)
        return
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          role: "model",
          text: data.reply as string,
        },
      ])
    } catch {
      setErrorMsg("اتصال به سرور برقرار نشد. لطفاً دوباره امتحان کنید.")
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setMessages([WELCOME_MESSAGE])
    setErrorMsg(null)
    setShowQuickDrawer(true)
    setInput("")
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end sm:bottom-5 sm:right-5">
      <AnimatePresence>
        {open ? (
          <motion.section
            role="dialog"
            aria-label="پشتیبانی هوشمند اچ‌شاپ"
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 flex h-[485px] max-h-[calc(100dvh-6rem)] w-[356px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[22px] border border-[#1b39f5]/15 bg-white shadow-[0_28px_70px_-22px_rgba(10,21,45,0.45)]"
          >
            {/* هدر پنجرهٔ چت */}
            <div className="flex items-center justify-between gap-2 bg-gradient-to-l from-[#0a152d] via-[#101f44] to-[#172c61] px-4 py-3 text-white">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/12 text-[#8ca0ff]">
                  <Sparkles className="h-4 w-4" />
                  <span
                    className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0a152d] bg-[#46A171]"
                    aria-hidden
                  />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-bold">پشتیبانی هوشمند اچ‌شاپ</p>
                  <p className="truncate text-[10.5px] text-white/65">
                    پاسخ خودکار سوالات و راهنمای خرید
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="شروع گفتگوی جدید"
                  title="شروع گفتگوی جدید"
                  className="grid h-7 w-7 place-items-center rounded-lg text-white/70 transition-colors hover:bg-white/12 hover:text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="بستن پشتیبانی"
                  className="grid h-7 w-7 place-items-center rounded-lg text-white/75 transition-colors hover:bg-white/12 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* نوار انتخاب سرعت/دقت پاسخگویی */}
            <div className="flex items-center justify-between gap-2 border-b border-[#1b39f5]/10 bg-[#f6f8ff] px-3.5 py-2 text-[11px]">
              <div className="flex items-center gap-1 rounded-xl bg-white p-0.5 shadow-xs border border-[#1b39f5]/10">
                {(["smart", "fast"] as const).map((key) => {
                  const active = mode === key
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setMode(key)}
                      className={cn(
                        "inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-1 text-[10.5px] font-bold transition-colors",
                        active
                          ? "bg-[#1b39f5] text-white"
                          : "text-slate-500 hover:text-[#0a1b33]",
                      )}
                    >
                      {key === "fast" ? (
                        <Zap className="h-3 w-3" />
                      ) : (
                        <Sparkles className="h-3 w-3" />
                      )}
                      {SUPPORT_CHAT_MODELS[key].label}
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={() => setShowQuickDrawer((v) => !v)}
                className="whitespace-nowrap rounded-lg px-2 py-1 text-[10.5px] font-semibold text-[#1b39f5] hover:bg-[#1b39f5]/8"
              >
                {showQuickDrawer ? "بستن سوالات آماده" : "سوالات آماده"}
              </button>
            </div>

            {/* بدنهٔ پیام‌ها */}
            <div
              ref={scrollRef}
              className="scrollbar-thin flex-1 space-y-2.5 overflow-y-auto bg-[#f8faff] px-3.5 py-3"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col gap-1.5",
                    msg.role === "user" ? "items-start" : "items-end",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[12px] leading-6 whitespace-pre-line",
                      msg.role === "user"
                        ? "rounded-tr-sm bg-[#1b39f5] text-white shadow-[0_8px_18px_-10px_rgba(27,57,245,0.7)]"
                        : "rounded-tl-sm border border-[#1b39f5]/10 bg-white text-[#0a1b33] shadow-[0_8px_20px_-14px_rgba(10,27,51,0.2)]",
                    )}
                  >
                    {msg.role === "model" ? renderMessageContent(msg.text) : msg.text}

                    {msg.id === "welcome" ? (
                      <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-slate-100 pt-2">
                        <Link
                          href="/products"
                          onClick={() => setOpen(false)}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#f3f6ff] px-2.5 py-1 text-[10.5px] font-bold text-[#1b39f5] transition-colors hover:bg-[#1b39f5]/12"
                        >
                          مشاهدهٔ محصولات
                        </Link>
                        <Link
                          href="/dashboard/tickets"
                          onClick={() => setOpen(false)}
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[10.5px] font-bold text-slate-700 transition-colors hover:bg-slate-200/70"
                        >
                          <LifeBuoy className="h-3 w-3" />
                          ثبت تیکت پشتیبانی
                        </Link>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}

              {/* سوالات آماده و راهنمایی سریع */}
              {showQuickDrawer ? (
                <div className="rounded-2xl border border-[#1b39f5]/12 bg-white p-2.5 shadow-[0_6px_16px_-12px_rgba(27,57,245,0.3)]">
                  <p className="mb-2 px-1 text-[10.5px] font-bold text-slate-400">
                    سوالات آماده — برای پاسخ فوری کلیک کنید:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_QUESTIONS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        disabled={loading}
                        onClick={() => void sendMessage(item.prompt)}
                        className="rounded-xl border border-[#1b39f5]/15 bg-[#f5f8ff] px-2.5 py-1.5 text-right text-[11px] font-semibold text-[#0a1b33] transition-colors hover:border-[#1b39f5]/40 hover:bg-[#eaf0ff] disabled:opacity-50"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {loading ? (
                <div className="flex justify-end">
                  <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-[#1b39f5]/10 bg-white px-3.5 py-2.5 text-[11.5px] text-slate-500">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#1b39f5]" />
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#1b39f5]"
                      style={{ animationDelay: "0.12s" }}
                    />
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#1b39f5]"
                      style={{ animationDelay: "0.24s" }}
                    />
                    <span className="mr-1 font-medium">در حال نوشتن پاسخ…</span>
                  </div>
                </div>
              ) : null}

              {errorMsg ? (
                <div className="rounded-xl border border-[#E56458]/25 bg-[#E56458]/8 p-2.5 text-[11.5px] leading-5 text-[#9f2c22]">
                  <p>{errorMsg}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    {messages.some((m) => m.role === "user") ? (
                      <button
                        type="button"
                        onClick={() => {
                          const lastUser = [...messages]
                            .reverse()
                            .find((m) => m.role === "user")
                          if (lastUser) {
                            setMessages((prev) =>
                              prev.filter((m) => m.id !== lastUser.id),
                            )
                            void sendMessage(lastUser.text)
                          }
                        }}
                        className="font-bold text-[#0a1b33] underline underline-offset-4 hover:text-[#1b39f5]"
                      >
                        تلاش مجدد
                      </button>
                    ) : null}
                    <Link
                      href="/dashboard/tickets"
                      onClick={() => setOpen(false)}
                      className="font-bold text-[#1b39f5] underline underline-offset-4"
                    >
                      ثبت تیکت پشتیبانی
                    </Link>
                    <Link
                      href="/about"
                      onClick={() => setOpen(false)}
                      className="font-semibold text-slate-600 underline underline-offset-4"
                    >
                      سوالات متداول
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>

            {/* فرم ارسال پیام */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                void sendMessage(input)
              }}
              className="flex items-center gap-2 border-t border-[#1b39f5]/10 bg-white p-2.5"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="سوال خود را بنویسید…"
                aria-label="سوال خود را بنویسید"
                maxLength={1000}
                disabled={loading}
                className="h-9 flex-1 rounded-xl border border-slate-200 bg-[#f8faff] px-3 text-[12px] font-medium text-[#0a1b33] outline-none transition-colors placeholder:text-slate-400 focus:border-[#1b39f5]/50 focus:bg-white disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="ارسال سوال"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#1b39f5] text-white shadow-[0_8px_18px_-8px_rgba(27,57,245,0.75)] transition-all hover:bg-[#1530d8] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </form>
          </motion.section>
        ) : null}
      </AnimatePresence>

      {/* دکمهٔ جمع‌وجور باز کردن چت — فضای بسیار کم روی موبایل و دسکتاپ */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "بستن باکس پشتیبانی" : "باز کردن باکس سوالات و پشتیبانی AI"}
        className="group inline-flex h-11 items-center gap-2 rounded-2xl border border-[#1b39f5]/20 bg-[#0a152d] px-3.5 text-[12px] font-bold text-white shadow-[0_16px_34px_-12px_rgba(10,27,51,0.55)] transition-all hover:-translate-y-0.5 hover:bg-[#1b39f5]"
      >
        <span className="relative grid h-6 w-6 place-items-center rounded-lg bg-white/12 text-[#8ca0ff] transition-colors group-hover:bg-white/20 group-hover:text-white">
          {open ? (
            <X className="h-3.5 w-3.5" />
          ) : (
            <MessageSquareText className="h-3.5 w-3.5" />
          )}
          {!open ? (
            <span
              className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#46A171] ring-2 ring-[#0a152d]"
              aria-hidden
            />
          ) : null}
        </span>
        <span className="whitespace-nowrap">پشتیبانی AI</span>
        <Headphones className="hidden h-3.5 w-3.5 text-white/60 sm:block" />
      </button>
    </div>
  )
}
