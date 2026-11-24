"use client"

import { useMemo, useState } from "react"
import { ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export type FaqEntry = {
  id: string
  category:"delivery" |"warranty" |"payment" |"appleid"
  categoryLabel: string
  q: string
  a: string
}

const FILTER_TABS: { key:"all" | FaqEntry["category"]; label: string }[] = [
  { key:"all", label:"همهٔ سوالات" },
  { key:"delivery", label:"تحویل و فعال‌سازی" },
  { key:"warranty", label:"گارانتی و بازگشت وجه" },
  { key:"payment", label:"پرداخت و کیف پول" },
  { key:"appleid", label:"اپل آیدی و امنیت" },
]

export default function FaqBrowser({ items }: { items: FaqEntry[] }) {
  const [tab, setTab] = useState<"all" | FaqEntry["category"]>("all")
  const [query, setQuery] = useState("")
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((item) => {
      const matchTab = tab === "all" || item.category === tab
      const matchQuery = !q || item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
      return matchTab && matchQuery
    })
  }, [items, tab, query])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-[24px] border border-[#1b39f5]/10 bg-white p-4 shadow-[0_18px_40px_-34px_rgba(27,57,245,0.45)] sm:p-5">
        <div className="flex h-11 items-center gap-2.5 rounded-2xl border border-[#1b39f5]/12 bg-[#f8faff] px-4">
          <Search className="h-4 w-4 shrink-0 text-[#1b39f5]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در سوالات متداول (مثلاً: گارانتی، ایمیل شخصی، اپل آیدی)…"
            aria-label="جستجو در سوالات متداول"
            className="h-full w-full bg-transparent text-[12.5px] font-medium text-[#0a1b33] outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTER_TABS.map((entry) => {
            const active = tab === entry.key
            return (
              <button
                key={entry.key}
                type="button"
                onClick={() => setTab(entry.key)}
                className={cn(
                  "rounded-full px-3.5 py-2 text-[11.5px] font-semibold transition-all",
                  active
                    ? "bg-[#1b39f5] text-white shadow-[0_10px_22px_-12px_rgba(27,57,245,0.8)]"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-[#1b39f5]/35 hover:text-[#1b39f5]",
                )}
              >
                {entry.label}
              </button>
            )
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#1b39f5]/25 bg-white p-10 text-center text-[13px] text-slate-500">
          پاسخی مطابق جستجوی شما پیدا نشد. می‌توانید از پشتیبانی آنلاین یا تیکت سوال خود را بپرسید.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const isOpen = openId === item.id
            return (
              <div
                key={item.id}
                className={cn(
                  "overflow-hidden rounded-[22px] border bg-white transition-all",
                  isOpen
                    ? "border-[#1b39f5]/30 shadow-[0_20px_44px_-32px_rgba(27,57,245,0.5)]"
                    : "border-[#1b39f5]/10 shadow-[0_14px_30px_-28px_rgba(10,27,51,0.35)]",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenId((curr) => (curr === item.id ? null : item.id))}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-3 px-4 py-4 text-right sm:px-6 sm:py-5"
                >
                  <div className="min-w-0 flex-1">
                    <span className="mb-1 inline-block rounded-full bg-[#1b39f5]/8 px-2.5 py-0.5 text-[10px] font-bold text-[#1b39f5]">
                      {item.categoryLabel}
                    </span>
                    <h2 className="text-[13.5px] font-bold leading-6 text-[#0a1b33] sm:text-[14.5px]">
                      {item.q}
                    </h2>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
                      isOpen && "rotate-180 text-[#1b39f5]",
                    )}
                  />
                </button>
                {isOpen ? (
                  <div className="border-t border-slate-100 bg-[#f9fbff] px-4 py-4 text-[12.5px] leading-7 text-slate-600 sm:px-6 sm:text-[13px]">
                    {item.a}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
