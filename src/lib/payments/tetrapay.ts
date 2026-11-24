import { createHmac, timingSafeEqual } from "node:crypto"
import {
  rialToToman,
  sanitizeGatewayOrderId,
  tomanToRial,
  validateGatewayRedirectUrl,
  type CreatedGatewayPayment,
} from "./types"

export const TETRAPAY_PROD_API_BASE = "https://api.tetra98.com/api/v1"
export const TETRAPAY_SANDBOX_API_BASE = "https://api.sandbox.tetra98.com/api/v1"
const TETRAPAY_ALLOWED_REDIRECT_HOSTS = ["tetra98.com", "t.me", "shaparak.ir"] as const

export function isTetraPaySandbox(): boolean {
  return process.env.TETRAPAY_SANDBOX?.trim().toLowerCase() === "true"
}

export function getTetraPayBaseUrl(sandboxOverride?: boolean): string {
  const useSandbox = sandboxOverride ?? isTetraPaySandbox()
  return useSandbox ? TETRAPAY_SANDBOX_API_BASE : TETRAPAY_PROD_API_BASE
}

export function isTetraPayConfigured(): boolean {
  return Boolean(process.env.TETRAPAY_API_KEY?.trim())
}

export function isTetraPayWebhookConfigured(): boolean {
  return Boolean(process.env.TETRAPAY_WEBHOOK_SECRET?.trim())
}

export type TetraPayCreateParams = {
  amountToman: number
  orderId: string
  callbackUrl: string
  webhookUrl?: string
  description?: string
  customerPhone?: string
  customerEmail?: string
  apiKey?: string
  sandbox?: boolean
  fetchImpl?: typeof fetch
}

type TetraPayCreateResponse = {
  token?: string
  payment_url?: string
  bot_payment_url?: string
  error?: { code?: string; message?: string }
}

export async function createTetraPayPayment(
  params: TetraPayCreateParams,
): Promise<CreatedGatewayPayment> {
  const apiKey = (params.apiKey || process.env.TETRAPAY_API_KEY || "").trim()
  if (!apiKey) {
    throw new Error("TETRAPAY_NOT_CONFIGURED")
  }

  const amountToman = Math.round(Number(params.amountToman) || 0)
  const amountRial = tomanToRial(amountToman)
  if (amountRial < 10_000) {
    throw new Error("TETRAPAY_AMOUNT_OUT_OF_RANGE")
  }

  const orderId = sanitizeGatewayOrderId(params.orderId)
  const sandbox = params.sandbox ?? isTetraPaySandbox()
  const baseUrl = getTetraPayBaseUrl(sandbox)

  const body: Record<string, unknown> = {
    amount: String(amountRial),
    order_id: orderId,
    callback_url: params.callbackUrl,
  }

  if (params.description?.trim()) {
    body.description = params.description.trim().slice(0, 255)
  }
  if (params.customerPhone?.trim()) {
    body.customer_phone = params.customerPhone.trim().slice(0, 24)
  }
  if (params.customerEmail?.trim()) {
    body.customer_email = params.customerEmail.trim().slice(0, 254)
  }
  if (params.webhookUrl?.trim() && params.webhookUrl.startsWith("https://")) {
    body.webhook_url = params.webhookUrl.trim()
  }

  const fetchFn = params.fetchImpl ?? fetch
  const response = await fetchFn(`${baseUrl}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  })

  const data = (await response.json().catch(() => ({}))) as TetraPayCreateResponse
  if (!response.ok) {
    const code = data.error?.code || `HTTP_${response.status}`
    const msg = data.error?.message || "TetraPay payment creation failed"
    throw new Error(`TETRAPAY_CREATE_FAILED:${code}:${msg}`)
  }

  const token = typeof data.token === "string" ? data.token.trim() : ""
  const rawPaymentUrl = typeof data.payment_url === "string" ? data.payment_url.trim() : ""
  if (!token || !rawPaymentUrl) {
    throw new Error("TETRAPAY_INVALID_CREATE_RESPONSE")
  }

  const safePaymentUrl = validateGatewayRedirectUrl(rawPaymentUrl, TETRAPAY_ALLOWED_REDIRECT_HOSTS)
  let safeBotUrl: string | undefined
  if (typeof data.bot_payment_url === "string" && data.bot_payment_url.trim()) {
    try {
      safeBotUrl = validateGatewayRedirectUrl(
        data.bot_payment_url.trim(),
        TETRAPAY_ALLOWED_REDIRECT_HOSTS,
      )
    } catch {
      safeBotUrl = undefined
    }
  }

  return {
    gateway: "tetrapay",
    orderId,
    paymentUrl: safePaymentUrl,
    referenceCode: token,
    amountToman,
    amountRial,
    botPaymentUrl: safeBotUrl,
    sandbox,
  }
}

export type TetraPayStatus = "created" | "pending" | "paid" | "expired"

export type TetraPayVerifyResponse = {
  token?: string
  status?: TetraPayStatus
  order_id?: string
  amount?: string
  payable_amount?: string
  received_amount?: string | null
  net_amount?: string
  fee_total?: string
  method?: string
  paid_at?: string
  verified_before?: boolean
  error?: { code?: string; message?: string }
}

export type TetraPayVerifyResult = {
  verified: boolean
  status: "paid" | "pending" | "expired" | "failed"
  token: string
  orderId?: string
  amountRial: number
  amountToman: number
  receivedAmountRial?: number
  method?: string
  paidAt?: string
  verifiedBefore?: boolean
  message?: string
}

const SAFE_TOKEN_RE = /^[A-Za-z0-9._-]{4,128}$/

export async function verifyTetraPayPayment(params: {
  token: string
  expectedOrderId?: string
  expectedAmountToman?: number
  apiKey?: string
  sandbox?: boolean
  fetchImpl?: typeof fetch
}): Promise<TetraPayVerifyResult> {
  const apiKey = (params.apiKey || process.env.TETRAPAY_API_KEY || "").trim()
  if (!apiKey) {
    throw new Error("TETRAPAY_NOT_CONFIGURED")
  }

  const token = params.token.trim()
  if (!SAFE_TOKEN_RE.test(token)) {
    return {
      verified: false,
      status: "failed",
      token,
      amountRial: 0,
      amountToman: 0,
      message: "توکن پرداخت تتراپی نامعتبر است.",
    }
  }

  const baseUrl = getTetraPayBaseUrl(params.sandbox)
  const fetchFn = params.fetchImpl ?? fetch
  const response = await fetchFn(`${baseUrl}/payments/${encodeURIComponent(token)}/verify`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    cache: "no-store",
  })

  const data = (await response.json().catch(() => ({}))) as TetraPayVerifyResponse
  if (!response.ok) {
    return {
      verified: false,
      status: "failed",
      token,
      amountRial: 0,
      amountToman: 0,
      message: data.error?.message || `خطا در تایید پرداخت تتراپی (${response.status})`,
    }
  }

  const amountRial = Math.round(Number(data.amount) || 0)
  const amountToman = rialToToman(amountRial)
  const status = data.status

  if (status === "pending") {
    return {
      verified: false,
      status: "pending",
      token,
      orderId: data.order_id,
      amountRial,
      amountToman,
      method: data.method,
      message: "پرداخت شما در تتراپی در حال بررسی است.",
    }
  }

  if (status === "expired") {
    return {
      verified: false,
      status: "expired",
      token,
      orderId: data.order_id,
      amountRial,
      amountToman,
      message: "مهلت پرداخت این لینک در تتراپی به پایان رسیده است.",
    }
  }

  if (status !== "paid") {
    return {
      verified: false,
      status: "failed",
      token,
      orderId: data.order_id,
      amountRial,
      amountToman,
      message: "پرداخت در تتراپی تکمیل نشده است.",
    }
  }

  // Per official Tetra98 docs: check order_id and amount before confirming fulfillment
  const orderMatches =
    !params.expectedOrderId || !data.order_id || data.order_id === params.expectedOrderId
  const expectedRial =
    typeof params.expectedAmountToman === "number" && params.expectedAmountToman > 0
      ? tomanToRial(params.expectedAmountToman)
      : null
  const amountMatches = expectedRial === null || amountRial === expectedRial

  if (!orderMatches || !amountMatches) {
    return {
      verified: false,
      status: "failed",
      token,
      orderId: data.order_id,
      amountRial,
      amountToman,
      message: "مبلغ یا شناسه سفارش در پاسخ تتراپی با سفارش شما مطابقت ندارد.",
    }
  }

  return {
    verified: true,
    status: "paid",
    token,
    orderId: data.order_id,
    amountRial,
    amountToman,
    receivedAmountRial: data.received_amount ? Math.round(Number(data.received_amount) || 0) : undefined,
    method: data.method,
    paidAt: data.paid_at,
    verifiedBefore: Boolean(data.verified_before),
  }
}

export type TetraPayWebhookVerification = {
  valid: boolean
  reason?: string
  timestamp?: number
}

/**
 * Verifies TetraPay X-TetraPay-Signature header per official docs:
 * Header format: `t=<unix>,v1=<hex>`
 * Signed payload: `${t}.${rawBody}` using HMAC-SHA256 with TETRAPAY_WEBHOOK_SECRET.
 * Rejects timestamps older/newer than maxSkewSec (default 300 seconds).
 */
export function verifyTetraPayWebhookSignature(params: {
  rawBody: string
  signatureHeader: string | null | undefined
  secret: string | undefined
  nowSec?: number
  maxSkewSec?: number
}): TetraPayWebhookVerification {
  const secret = params.secret?.trim()
  if (!secret) {
    return { valid: false, reason: "WEBHOOK_SECRET_NOT_CONFIGURED" }
  }
  const header = params.signatureHeader?.trim()
  if (!header) {
    return { valid: false, reason: "MISSING_SIGNATURE_HEADER" }
  }

  const parts: Record<string, string> = {}
  for (const segment of header.split(",")) {
    const eqIdx = segment.indexOf("=")
    if (eqIdx <= 0) continue
    const key = segment.slice(0, eqIdx).trim()
    const val = segment.slice(eqIdx + 1).trim()
    if (key && val) parts[key] = val
  }

  const t = parts.t
  const v1 = parts.v1
  if (!t || !/^\d+$/.test(t) || !v1 || !/^[a-fA-F0-9]{64}$/.test(v1)) {
    return { valid: false, reason: "MALFORMED_SIGNATURE_HEADER" }
  }

  const timestamp = Number.parseInt(t, 10)
  const nowSec = params.nowSec ?? Math.floor(Date.now() / 1000)
  const maxSkewSec = params.maxSkewSec ?? 300
  if (Math.abs(nowSec - timestamp) > maxSkewSec) {
    return { valid: false, reason: "TIMESTAMP_OUT_OF_WINDOW", timestamp }
  }

  const expectedHex = createHmac("sha256", secret)
    .update(`${t}.${params.rawBody}`, "utf8")
    .digest("hex")

  const providedBuf = Buffer.from(v1.toLowerCase(), "hex")
  const expectedBuf = Buffer.from(expectedHex, "hex")

  if (providedBuf.length !== expectedBuf.length || !timingSafeEqual(providedBuf, expectedBuf)) {
    return { valid: false, reason: "SIGNATURE_MISMATCH", timestamp }
  }

  return { valid: true, timestamp }
}
