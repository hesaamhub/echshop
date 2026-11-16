/**
 * ابزارهای پاک‌سازی و آماده‌سازی متن غنی (HTML) برای ویرایشگر WYSIWYG و نمایش امن در فروشگاه
 */

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "del",
  "blockquote",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "a",
  "div",
  "span",
])

const STRIP_WITH_CONTENT_RE =
  /<\s*(script|style|iframe|object|embed|svg|math|noscript|template)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi

const DANGEROUS_SINGLE_TAGS_RE =
  /<\s*(script|style|iframe|object|embed|svg|math|form|input|textarea|button|select|meta|link|base)[^>]*\/?>/gi

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function escapeAttr(value: string): string {
  return value.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function sanitizeHref(raw: string): string | null {
  const cleaned = raw.replace(/[\u0000-\u001F\u007F\s]+/g, "").trim()
  if (!cleaned) return null
  const lower = cleaned.toLowerCase()
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("data:")
  ) {
    return null
  }
  if (
    lower.startsWith("https://") ||
    lower.startsWith("http://") ||
    lower.startsWith("/") ||
    lower.startsWith("#") ||
    lower.startsWith("mailto:") ||
    lower.startsWith("tel:")
  ) {
    return cleaned
  }
  return `https://${cleaned}`
}

function extractAttr(attrs: string, name: string): string | null {
  const doubleRe = new RegExp(`(?:^|\\s)${name}\\s*=\\s*"([^"]*)"`, "i")
  const doubleMatch = attrs.match(doubleRe)
  if (doubleMatch) return doubleMatch[1]

  const singleRe = new RegExp(`(?:^|\\s)${name}\\s*=\\s*'([^']*)'`, "i")
  const singleMatch = attrs.match(singleRe)
  if (singleMatch) return singleMatch[1]

  const bareRe = new RegExp(`(?:^|\\s)${name}\\s*=\\s*([^\\s"'>]+)`, "i")
  const bareMatch = attrs.match(bareRe)
  return bareMatch ? bareMatch[1] : null
}

function sanitizeStyleAlign(styleAttr: string | null): string | null {
  if (!styleAttr) return null
  const alignMatch = styleAttr.match(/text-align\s*:\s*(right|left|center|justify)/i)
  if (!alignMatch) return null
  return `text-align:${alignMatch[1].toLowerCase()}`
}

/**
 * پاک‌سازی HTML ورودی از ویرایشگر: تنها تگ‌های متنی مجاز و لینک‌های ایمن حفظ می‌شوند.
 */
export function sanitizeRichHtml(input: string): string {
  if (!input || typeof input !== "string") return ""

  let html = input
    .replace(/\u0000/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(STRIP_WITH_CONTENT_RE, "")
    .replace(DANGEROUS_SINGLE_TAGS_RE, "")

  html = html.replace(/<\s*(\/?)\s*([a-zA-Z0-9]+)([^>]*)>/g, (_full, slash: string, rawTag: string, attrs: string) => {
    const tag = rawTag.toLowerCase()
    if (!ALLOWED_TAGS.has(tag)) {
      return ""
    }
    if (slash) {
      if (tag === "br") return ""
      return `</${tag}>`
    }
    if (tag === "br") {
      return "<br />"
    }

    const keptAttrs: string[] = []

    if (tag === "a") {
      const rawHref = extractAttr(attrs, "href")
      const safeHref = rawHref ? sanitizeHref(rawHref) : null
      if (!safeHref) return "<a>"
      keptAttrs.push(`href="${escapeAttr(safeHref)}"`)
      if (safeHref.startsWith("http://") || safeHref.startsWith("https://")) {
        keptAttrs.push('target="_blank"', 'rel="noopener noreferrer"')
      }
    }

    const dir = extractAttr(attrs, "dir")?.toLowerCase()
    if (dir === "rtl" || dir === "ltr") {
      keptAttrs.push(`dir="${dir}"`)
    }

    const align = sanitizeStyleAlign(extractAttr(attrs, "style"))
    if (align) {
      keptAttrs.push(`style="${align}"`)
    }

    return keptAttrs.length > 0 ? `<${tag} ${keptAttrs.join(" ")}>` : `<${tag}>`
  })

  return html.trim()
}

/**
 * استخراج متن ساده بدون تگ (مناسب متاتگ‌های سئو، JSON-LD و پیش‌نمایش متنی)
 */
export function stripRichHtml(input: string): string {
  if (!input || typeof input !== "string") return ""
  const withoutScripts = input.replace(STRIP_WITH_CONTENT_RE, " ")
  const spaced = withoutScripts
    .replace(/<\s*br\s*\/?>/gi, " ")
    .replace(/<\/\s*(p|div|li|h[1-6]|blockquote)\s*>/gi, " ")
    .replace(/<[^>]+>/g, "")

  return spaced
    .replace(/&nbsp;/gi, " ")
    .replace(/&zwnj;/gi, "\u200c")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim()
}

/** بررسی وجود متن قابل مشاهده در خروجی ویرایشگر */
export function hasVisibleRichText(input: string): boolean {
  return stripRichHtml(input).length > 0
}

/** تبدیل متن ساده یا HTML ذخیره‌شده به HTML امن برای نمایش در صفحه */
export function toDisplayHtml(input: string): string {
  if (!input || typeof input !== "string") return ""
  const trimmed = input.trim()
  if (!trimmed) return ""

  const looksLikeHtml = /<\s*(p|br|strong|b|em|i|u|s|del|blockquote|h[2-4]|ul|ol|li|a|div|span)\b/i.test(trimmed)
  if (looksLikeHtml) {
    return sanitizeRichHtml(trimmed)
  }

  return trimmed
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph.trim()).replace(/\n/g, "<br />")}</p>`)
    .join("")
}
