import test from "node:test"
import assert from "node:assert/strict"
import { hasVisibleRichText, sanitizeRichHtml, stripRichHtml, toDisplayHtml } from "./richText"

test("sanitizeRichHtml strips script tags, event handlers, and javascript URLs", () => {
  const dirty =
    '<p onclick="alert(1)">سلام</p><script>evil()</script><a href="javascript:alert(2)" onmouseover="x()">کلیک</a><iframe src="https://x.test"></iframe>'
  const clean = sanitizeRichHtml(dirty)
  assert.equal(clean.includes("<script"), false)
  assert.equal(clean.includes("onclick"), false)
  assert.equal(clean.includes("onmouseover"), false)
  assert.equal(clean.includes("javascript:"), false)
  assert.equal(clean.includes("<iframe"), false)
  assert.match(clean, /<p>سلام<\/p><a>کلیک<\/a>/)
})

test("sanitizeRichHtml preserves safe formatting, external links, and RTL alignment", () => {
  const input =
    '<h3 style="text-align: right; color: red" dir="rtl">عنوان</h3><p>متن <strong>مهم</strong> و <a href="https://echshop.ir/about" data-x="1">درباره ما</a></p><ul><li>مورد اول</li></ul>'
  const clean = sanitizeRichHtml(input)
  assert.match(clean, /<h3 dir="rtl" style="text-align:right">عنوان<\/h3>/)
  assert.match(clean, /<a href="https:\/\/echshop\.ir\/about" target="_blank" rel="noopener noreferrer">درباره ما<\/a>/)
  assert.match(clean, /<ul><li>مورد اول<\/li><\/ul>/)
})

test("stripRichHtml extracts plain text cleanly for metadata and previews", () => {
  const html = "<p>فروشگاه <strong>اچ‌شاپ</strong></p><ul><li>تحویل آنی</li><li>پشتیبانی&nbsp;۲۴/۷</li></ul>"
  assert.equal(stripRichHtml(html), "فروشگاه اچ‌شاپ تحویل آنی پشتیبانی ۲۴/۷")
})

test("toDisplayHtml wraps legacy plain text into safe paragraphs while passing rich HTML through", () => {
  assert.equal(toDisplayHtml("خط اول <تست>\nخط دوم"), "<p>خط اول &lt;تست&gt;<br />خط دوم</p>")
  assert.equal(toDisplayHtml("<p><strong>سلام</strong></p>"), "<p><strong>سلام</strong></p>")
})

test("hasVisibleRichText rejects empty formatting tags", () => {
  assert.equal(hasVisibleRichText("<p><br /></p><div>   </div>"), false)
  assert.equal(hasVisibleRichText("<p>متن معتبر</p>"), true)
})
