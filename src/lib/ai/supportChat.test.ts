import test from "node:test"
import assert from "node:assert/strict"
import { categories, products } from "../data"
import {
  buildStoreSystemInstruction,
  classifyGeminiError,
  isAllowedSupportModel,
  MAX_HISTORY_TURNS,
  QUICK_QUESTIONS,
  resolveSupportModel,
  sanitizeChatHistory,
  sanitizeGeminiApiKey,
} from "./supportChat"

test("resolveSupportModel maps modes to approved free-tier Gemini models only", () => {
  const smart = resolveSupportModel("smart")
  const fast = resolveSupportModel("fast")
  const unknown = resolveSupportModel("paid-model")

  assert.equal(smart, "gemini-4-hydrogen")
  assert.equal(fast, "gemini-3.1-flash-lite")
  assert.equal(unknown, "gemini-4-hydrogen")
  assert.equal(isAllowedSupportModel(smart), true)
  assert.equal(isAllowedSupportModel(fast), true)
  assert.equal(isAllowedSupportModel("gemini-4-argon"), false)
  assert.equal(isAllowedSupportModel("gemini-4-carbon"), false)
})

test("sanitizeChatHistory enforces alternating user/model turns and strips invalid entries", () => {
  const result = sanitizeChatHistory([
    { role: "model", text: "پیام خوش‌آمد اول" },
    { role: "user", text: "سلام" },
    { role: "user", text: "سوال دوم بدون پاسخ وسطش" },
    { role: "model", text: "   " },
    { role: "model", text: "پاسخ منظم" },
    { role: "user", text: "سوال بی‌پاسخ آخر" },
  ])

  assert.deepEqual(result, [
    { role: "user", text: "سلام\nسوال دوم بدون پاسخ وسطش" },
    { role: "model", text: "پاسخ منظم" },
  ])
})

test("sanitizeChatHistory caps history length at MAX_HISTORY_TURNS", () => {
  const longHistory = Array.from({ length: 20 }, (_, i) => ({
    role: i % 2 === 0 ? "user" : "model",
    text: `msg-${i}`,
  }))
  const sanitized = sanitizeChatHistory(longHistory)
  assert.ok(sanitized.length <= MAX_HISTORY_TURNS)
  assert.equal(sanitized[0].role, "user")
  assert.equal(sanitized[sanitized.length - 1].role, "model")
})

test("QUICK_QUESTIONS provide ready-made non-empty Persian Q&A items", () => {
  assert.ok(QUICK_QUESTIONS.length >= 4)
  for (const q of QUICK_QUESTIONS) {
    assert.ok(q.id.length > 0)
    assert.ok(q.label.trim().length > 4)
    assert.ok(q.prompt.trim().length > 10)
  }
})

test("buildStoreSystemInstruction embeds live catalog products, warranty, and ticket route", () => {
  const prompt = buildStoreSystemInstruction(products, categories)
  assert.match(prompt, /echshop/)
  assert.match(prompt, /\/dashboard\/tickets/)
  assert.match(prompt, /Spotify|اسپاتیفای/)
  assert.match(prompt, /ChatGPT/)
})

test("sanitizeGeminiApiKey trims quotes/whitespace and rejects placeholders", () => {
  assert.equal(sanitizeGeminiApiKey(undefined), null)
  assert.equal(sanitizeGeminiApiKey("   "), null)
  assert.equal(sanitizeGeminiApiKey("undefined"), null)
  assert.equal(sanitizeGeminiApiKey('"YOUR_API_KEY"'), null)
  assert.equal(sanitizeGeminiApiKey(' "AIzaExample123" '), "AIzaExample123")
})

test("classifyGeminiError classifies API_KEY_INVALID and rate limits cleanly", () => {
  const invalid = classifyGeminiError('{"error":{"code":400, "status":"INVALID_ARGUMENT", "details":[{"reason":"API_KEY_INVALID"}]}}')
  assert.equal(invalid.code, "GEMINI_AUTH_ERROR")
  assert.equal(invalid.status, 503)
  assert.match(invalid.message, /Settings > Secrets/)

  const rate = classifyGeminiError("429 RESOURCE_EXHAUSTED")
  assert.equal(rate.code, "GEMINI_RATE_LIMIT")
  assert.equal(rate.status, 429)

  const missing = classifyGeminiError("404 NOT_FOUND")
  assert.equal(missing.code, "GEMINI_MODEL_NOT_FOUND")
  assert.equal(missing.status, 502)
})
