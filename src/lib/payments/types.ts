export type PaymentGatewayId = "tetrapay"

export const PENDING_PAYMENT_COOKIE = "echshop_pending_payment"

export type CreatePaymentInput = {
  gateway: PaymentGatewayId
  orderId: string
  amountToman: number
  payerName?: string
  payerEmail?: string
  payerPhone?: string
  description?: string
}

export type CreatedGatewayPayment = {
  gateway: PaymentGatewayId
  orderId: string
  paymentUrl: string
  referenceCode: string
  amountToman: number
  amountRial: number
  botPaymentUrl?: string
  sandbox?: boolean
}

export type PendingPaymentCookiePayload = {
  gateway: PaymentGatewayId
  orderId: string
  amountToman: number
  referenceCode: string
  createdAt: number
}

export function tomanToRial(amountToman: number): number {
  const clean = Math.round(Number(amountToman) || 0)
  return clean > 0 ? clean * 10 : 0
}

export function rialToToman(amountRial: number | string): number {
  const clean = Math.round(Number(amountRial) || 0)
  return clean > 0 ? Math.round(clean / 10) : 0
}

/**
 * Normalizes orderId for strict gateway compatibility.
 * Tetra98 requires 1..64 chars from [A-Za-z0-9_.:-].
 */
export function sanitizeGatewayOrderId(rawOrderId: string): string {
  const cleaned = rawOrderId.trim().replace(/[^A-Za-z0-9_.:-]/g, "-").slice(0, 64)
  return cleaned || `ECH-${Date.now()}`
}

export function validateGatewayRedirectUrl(
  rawUrl: string,
  allowedHostSuffixes: readonly string[],
): string {
  let parsed: URL
  try {
    parsed = new URL(rawUrl)
  } catch {
    throw new Error("INVALID_GATEWAY_REDIRECT_URL")
  }
  if (parsed.protocol !== "https:") {
    throw new Error("INSECURE_GATEWAY_REDIRECT_URL")
  }
  const host = parsed.hostname.toLowerCase()
  const allowed = allowedHostSuffixes.some(
    (suffix) => host === suffix || host.endsWith(`.${suffix}`),
  )
  if (!allowed) {
    throw new Error(`UNTRUSTED_GATEWAY_HOST:${host}`)
  }
  return parsed.toString()
}

export function getGatewayLabelFa(gateway: PaymentGatewayId): string {
  return gateway === "tetrapay" ? "درگاه پرداخت تتراپی (TetraPay)" : "درگاه پرداخت آنلاین"
}
