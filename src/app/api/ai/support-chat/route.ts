import { GoogleGenAI, ThinkingLevel } from "@google/genai"
import { NextRequest, NextResponse } from "next/server"
import { categories, products } from "@/lib/data"
import {
  buildStoreSystemInstruction,
  classifyGeminiError,
  MAX_MESSAGE_LENGTH,
  resolveSupportModel,
  sanitizeChatHistory,
  sanitizeGeminiApiKey,
} from "@/lib/ai/supportChat"

const SYSTEM_INSTRUCTION = buildStoreSystemInstruction(products, categories)

export async function POST(req: NextRequest) {
  let body: { message?: unknown; history?: unknown; mode?: unknown }
  try {
    body = (await req.json()) as { message?: unknown; history?: unknown; mode?: unknown }
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر است." }, { status: 400 })
  }

  const rawMessage = typeof body.message === "string" ? body.message.trim() : ""
  if (!rawMessage) {
    return NextResponse.json({ error: "لطفاً پیام یا سوال خود را بنویسید." }, { status: 400 })
  }

  const message = rawMessage.slice(0, MAX_MESSAGE_LENGTH)
  const model = resolveSupportModel(body.mode)
  const historyTurns = sanitizeChatHistory(body.history)

  const apiKey = sanitizeGeminiApiKey(process.env.GEMINI_API_KEY)
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "سرویس پاسخگوی خودکار در این محیط پیکربندی نشده است. لطفاً کلید GEMINI_API_KEY را در Settings > Secrets تنظیم کنید یا از بخش تیکت پشتیبانی اقدام نمایید.",
        code: "GEMINI_KEY_MISSING",
      },
      { status: 503 },
    )
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })

    const chat = ai.chats.create({
      model,
      history: historyTurns.map((turn) => ({
        role: turn.role,
        parts: [{ text: turn.text }],
      })),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        ...(model === "gemini-4-hydrogen"
          ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } }
          : {}),
      },
    })

    const response = await chat.sendMessage({ message })
    const reply = response.text?.trim()

    if (!reply) {
      return NextResponse.json(
        { error: "پاسخی از دستیار دریافت نشد. لطفاً دوباره امتحان کنید." },
        { status: 502 },
      )
    }

    return NextResponse.json({ reply, model })
  } catch (err) {
    const rawMsg = err instanceof Error ? err.message : String(err)
    const classified = classifyGeminiError(rawMsg)

    if (classified.code === "GEMINI_REQUEST_FAILED") {
      console.error("[support-chat] Unexpected error:", rawMsg)
    } else {
      console.warn(`[support-chat] Upstream notice (${classified.code})`)
    }

    return NextResponse.json(
      {
        error: classified.message,
        code: classified.code,
      },
      { status: classified.status },
    )
  }
}
