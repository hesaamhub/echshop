"use client"

import { useEffect, useId, useRef, useState } from "react"
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Eye,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Underline,
  Undo2,
  Unlink,
} from "lucide-react"
import { sanitizeRichHtml, stripRichHtml, toDisplayHtml } from "@/lib/richText"
import { cn } from "@/lib/utils"

type ToolbarActionProps = {
  title: string
  active?: boolean
  onClick: () => void
  children: React.ReactNode
}

function ToolbarButton({ title, active, onClick, children }: ToolbarActionProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      onMouseDown={(event) => {
        // حفظ فوکوس و انتخاب متن هنگام کلیک روی دکمه‌های نوار ابزار
        event.preventDefault()
      }}
      onClick={onClick}
      className={cn(
        "grid h-8 w-8 shrink-0 place-items-center rounded-xl border text-[12px] transition-all",
        active
          ? "border-[#1b39f5] bg-[#1b39f5] text-white shadow-[0_8px_16px_-10px_rgba(27,57,245,0.8)]"
          : "border-transparent text-slate-600 hover:border-[#1b39f5]/15 hover:bg-white hover:text-[#1b39f5]",
      )}
    >
      {children}
    </button>
  )
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  placeholder = "متن خود را اینجا بنویسید…",
  hint,
  maxLength = 4000,
  minHeightClass = "min-h-[160px]",
}: {
  label: string
  value: string
  onChange: (nextHtml: string) => void
  placeholder?: string
  hint?: string
  maxLength?: number
  minHeightClass?: string
}) {
  const editorId = useId()
  const editorRef = useRef<HTMLDivElement>(null)
  const savedRangeRef = useRef<Range | null>(null)
  const lastEmittedRef = useRef<string>("")

  const [mode, setMode] = useState<"visual" | "source">("visual")
  const [focused, setFocused] = useState(false)
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("https://")
  const [linkLabel, setLinkLabel] = useState("")

  // همگام‌سازی مقدار بیرونی با DOM ویرایشگر بدون برهم زدن مکان‌نما هنگام تایپ
  useEffect(() => {
    if (mode !== "visual") return
    const el = editorRef.current
    if (!el) return
    const displayHtml = toDisplayHtml(value)
    if (el.innerHTML !== displayHtml && value !== lastEmittedRef.current) {
      el.innerHTML = displayHtml
      lastEmittedRef.current = value
    }
  }, [value, mode])

  function emitFromDom() {
    const el = editorRef.current
    if (!el) return
    const cleaned = sanitizeRichHtml(el.innerHTML)
    const bounded = cleaned.slice(0, maxLength)
    lastEmittedRef.current = bounded
    onChange(bounded)
  }

  function saveSelection() {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return
    const range = sel.getRangeAt(0)
    if (editorRef.current?.contains(range.commonAncestorContainer)) {
      savedRangeRef.current = range.cloneRange()
    }
  }

  function restoreSelection() {
    const range = savedRangeRef.current
    const el = editorRef.current
    if (!el) return
    el.focus()
    if (!range) return
    const sel = window.getSelection()
    if (!sel) return
    sel.removeAllRanges()
    sel.addRange(range)
  }

  function runCommand(command: string, commandValue?: string) {
    if (mode !== "visual") return
    editorRef.current?.focus()
    document.execCommand(command, false, commandValue)
    emitFromDom()
  }

  function openLinkBar() {
    saveSelection()
    const sel = window.getSelection()
    const selectedText = sel?.toString().trim() ?? ""
    setLinkLabel(selectedText)
    setLinkUrl("https://")
    setLinkOpen((prev) => !prev)
  }

  function applyLink(event: React.FormEvent) {
    event.preventDefault()
    const href = linkUrl.trim()
    if (!href) return
    restoreSelection()

    const sel = window.getSelection()
    if (sel && sel.isCollapsed && linkLabel.trim()) {
      const anchor = document.createElement("a")
      anchor.href = href
      anchor.textContent = linkLabel.trim()
      const range = sel.rangeCount > 0 ? sel.getRangeAt(0) : null
      if (range) {
        range.insertNode(anchor)
        range.setStartAfter(anchor)
        range.collapse(true)
        sel.removeAllRanges()
        sel.addRange(range)
      }
    } else {
      document.execCommand("createLink", false, href)
    }
    setLinkOpen(false)
    emitFromDom()
  }

  function toggleMode() {
    if (mode === "visual") {
      emitFromDom()
      setLinkOpen(false)
      setMode("source")
    } else {
      const cleaned = sanitizeRichHtml(value).slice(0, maxLength)
      onChange(cleaned)
      setMode("visual")
      requestAnimationFrame(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = toDisplayHtml(cleaned)
          lastEmittedRef.current = cleaned
        }
      })
    }
  }

  const plainCount = stripRichHtml(value).length
  const htmlCount = value.length
  const nearLimit = htmlCount > maxLength * 0.9

  return (
    <div className="block">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={editorId} className="text-[12px] font-semibold text-[#0a1b33]">
          {label}
        </label>
        <div className="flex items-center gap-2 text-[10.5px] text-slate-400">
          <span>
            متن: <span className="num">{plainCount}</span> کاراکتر
          </span>
          <span aria-hidden>·</span>
          <span className={cn(nearLimit && "font-semibold text-[#A8382C]")}>
            <span className="num">
              {htmlCount}/{maxLength}
            </span>
          </span>
        </div>
      </div>

      <div
        className={cn(
          "mt-2 overflow-hidden rounded-[22px] border transition-all",
          focused
            ? "border-[#1b39f5]/45 bg-white shadow-[0_0_0_4px_rgba(27,57,245,0.1)]"
            : "border-[#1b39f5]/15 bg-[#1b39f5]/[0.03]",
        )}
      >
        {/* نوار ابزار قالب‌بندی */}
        <div className="flex flex-wrap items-center gap-1 border-b border-[#1b39f5]/10 bg-[#f6f8ff]/90 px-2.5 py-2">
          {mode === "visual" ? (
            <>
              <ToolbarButton title="ضخیم (Bold)" onClick={() => runCommand("bold")}>
                <Bold className="h-3.5 w-3.5" />
              </ToolbarButton>
              <ToolbarButton title="مورب (Italic)" onClick={() => runCommand("italic")}>
                <Italic className="h-3.5 w-3.5" />
              </ToolbarButton>
              <ToolbarButton title="زیرخط (Underline)" onClick={() => runCommand("underline")}>
                <Underline className="h-3.5 w-3.5" />
              </ToolbarButton>
              <ToolbarButton title="خط‌خورده" onClick={() => runCommand("strikeThrough")}>
                <Strikethrough className="h-3.5 w-3.5" />
              </ToolbarButton>

              <span className="mx-1 h-5 w-px bg-[#1b39f5]/12" aria-hidden />

              <ToolbarButton title="تیتر اصلی (H2)" onClick={() => runCommand("formatBlock", "h2")}>
                <Heading2 className="h-3.5 w-3.5" />
              </ToolbarButton>
              <ToolbarButton title="زیرتیتر (H3)" onClick={() => runCommand("formatBlock", "h3")}>
                <Heading3 className="h-3.5 w-3.5" />
              </ToolbarButton>
              <ToolbarButton title="پاراگراف معمولی" onClick={() => runCommand("formatBlock", "p")}>
                <Pilcrow className="h-3.5 w-3.5" />
              </ToolbarButton>
              <ToolbarButton title="نقل‌قول" onClick={() => runCommand("formatBlock", "blockquote")}>
                <Quote className="h-3.5 w-3.5" />
              </ToolbarButton>

              <span className="mx-1 h-5 w-px bg-[#1b39f5]/12" aria-hidden />

              <ToolbarButton title="فهرست نقطه‌ای" onClick={() => runCommand("insertUnorderedList")}>
                <List className="h-3.5 w-3.5" />
              </ToolbarButton>
              <ToolbarButton title="فهرست شماره‌دار" onClick={() => runCommand("insertOrderedList")}>
                <ListOrdered className="h-3.5 w-3.5" />
              </ToolbarButton>

              <span className="mx-1 h-5 w-px bg-[#1b39f5]/12" aria-hidden />

              <ToolbarButton title="چیدمان راست" onClick={() => runCommand("justifyRight")}>
                <AlignRight className="h-3.5 w-3.5" />
              </ToolbarButton>
              <ToolbarButton title="وسط‌چین" onClick={() => runCommand("justifyCenter")}>
                <AlignCenter className="h-3.5 w-3.5" />
              </ToolbarButton>
              <ToolbarButton title="چیدمان چپ" onClick={() => runCommand("justifyLeft")}>
                <AlignLeft className="h-3.5 w-3.5" />
              </ToolbarButton>

              <span className="mx-1 h-5 w-px bg-[#1b39f5]/12" aria-hidden />

              <ToolbarButton title="افزودن لینک" active={linkOpen} onClick={openLinkBar}>
                <Link2 className="h-3.5 w-3.5" />
              </ToolbarButton>
              <ToolbarButton title="حذف لینک" onClick={() => runCommand("unlink")}>
                <Unlink className="h-3.5 w-3.5" />
              </ToolbarButton>
              <ToolbarButton title="پاک‌کردن قالب‌بندی" onClick={() => runCommand("removeFormat")}>
                <RemoveFormatting className="h-3.5 w-3.5" />
              </ToolbarButton>

              <span className="mx-1 h-5 w-px bg-[#1b39f5]/12" aria-hidden />

              <ToolbarButton title="بازگشت (Undo)" onClick={() => runCommand("undo")}>
                <Undo2 className="h-3.5 w-3.5" />
              </ToolbarButton>
              <ToolbarButton title="تکرار (Redo)" onClick={() => runCommand("redo")}>
                <Redo2 className="h-3.5 w-3.5" />
              </ToolbarButton>
            </>
          ) : (
            <span className="px-2 text-[11px] font-semibold text-slate-500">
              ویرایش مستقیم کد HTML (پس از بازگشت به‌صورت خودکار پاک‌سازی می‌شود)
            </span>
          )}

          <button
            type="button"
            onClick={toggleMode}
            className={cn(
              "ms-auto inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-[11px] font-semibold transition-colors",
              mode === "source"
                ? "border-[#1b39f5] bg-[#1b39f5] text-white"
                : "border-[#1b39f5]/15 bg-white text-[#1b39f5] hover:bg-[#1b39f5]/8",
            )}
          >
            {mode === "source" ? <Eye className="h-3.5 w-3.5" /> : <Code2 className="h-3.5 w-3.5" />}
            {mode === "source" ? "نمای بصری" : "کد HTML"}
          </button>
        </div>

        {/* نوار افزودن لینک درون‌خطی (بدون prompt) */}
        {linkOpen && mode === "visual" ? (
          <form
            onSubmit={applyLink}
            className="flex flex-wrap items-center gap-2 border-b border-[#1b39f5]/10 bg-white px-3 py-2.5"
          >
            <input
              type="url"
              dir="ltr"
              required
              placeholder="https://echshop.ir/products"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="font-latin min-w-[200px] flex-[2] rounded-xl border border-[#1b39f5]/20 bg-[#f6f8ff] px-3 py-1.5 text-left text-[11.5px] outline-none focus:border-[#1b39f5]"
            />
            <input
              type="text"
              placeholder="متن لینک (اختیاری)"
              value={linkLabel}
              onChange={(e) => setLinkLabel(e.target.value)}
              className="min-w-[140px] flex-1 rounded-xl border border-[#1b39f5]/20 bg-[#f6f8ff] px-3 py-1.5 text-[11.5px] outline-none focus:border-[#1b39f5]"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#1b39f5] px-3.5 py-1.5 text-[11px] font-bold text-white"
            >
              ثبت لینک
            </button>
            <button
              type="button"
              onClick={() => setLinkOpen(false)}
              className="rounded-xl bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-600"
            >
              بستن
            </button>
          </form>
        ) : null}

        {/* بوم ویرایشگر */}
        {mode === "visual" ? (
          <div className="relative bg-white/80">
            {plainCount === 0 && !focused ? (
              <span className="pointer-events-none absolute top-3.5 right-4 text-[12px] text-slate-400">
                {placeholder}
              </span>
            ) : null}
            <div
              id={editorId}
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              dir="rtl"
              role="textbox"
              aria-multiline="true"
              aria-label={label}
              onFocus={() => setFocused(true)}
              onBlur={() => {
                setFocused(false)
                emitFromDom()
              }}
              onInput={emitFromDom}
              onKeyUp={saveSelection}
              onMouseUp={saveSelection}
              onPaste={(event) => {
                const html = event.clipboardData.getData("text/html")
                if (!html) return
                event.preventDefault()
                const clean = sanitizeRichHtml(html)
                document.execCommand("insertHTML", false, clean)
                emitFromDom()
              }}
              className={cn(
                minHeightClass,
                "px-4 py-3.5 text-[12.5px] leading-7 text-[#0a1b33] outline-none",
                "[&_p]:mb-2 [&_p:last-child]:mb-0",
                "[&_h2]:mt-3 [&_h2]:mb-1.5 [&_h2]:text-[16px] [&_h2]:font-bold [&_h2]:text-[#0a1b33]",
                "[&_h3]:mt-2.5 [&_h3]:mb-1 [&_h3]:text-[14px] [&_h3]:font-bold [&_h3]:text-[#0a1b33]",
                "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pr-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pr-5",
                "[&_blockquote]:my-2 [&_blockquote]:border-r-3 [&_blockquote]:border-[#1b39f5] [&_blockquote]:bg-[#f6f8ff] [&_blockquote]:py-1.5 [&_blockquote]:pr-3 [&_blockquote]:text-slate-600",
                "[&_a]:font-semibold [&_a]:text-[#1b39f5] [&_a]:underline",
              )}
            />
          </div>
        ) : (
          <textarea
            id={editorId}
            dir="ltr"
            rows={8}
            value={value}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
            className="font-latin block w-full bg-[#0a152d] p-4 text-left text-[12px] leading-6 text-slate-100 outline-none"
          />
        )}
      </div>

      {hint ? <p className="mt-1.5 text-[10.5px] text-slate-400">{hint}</p> : null}
    </div>
  )
}
