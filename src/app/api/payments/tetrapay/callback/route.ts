import { NextRequest, NextResponse } from "next/server"
import {
  buildSecureCookieHeader,
  resolveAppOrigin,
  verifyCookiePayload,
} from "@/lib/payments/sessionSecurity"
import { verifyTetraPayPayment } from "@/lib/payments/tetrapay"
import { PENDING_PAYMENT_COOKIE, type PendingPaymentCookiePayload } from "@/lib/payments/types"

/**
 * TetraPay callback handler (`callback_url?token=...&status=...`).
 * Per official Tetra98 docs, we NEVER trust the `status` query parameter;
 * the authoritative result is always fetched server-side via POST /payments/{token}/verify.
 */
export async function GET(request: NextRequest) {
  const origin = resolveAppOrigin(request)
  const isHttps = origin.startsWith("https://")
  const clearPendingCookie = buildSecureCookieHeader(PENDING_PAYMENT_COOKIE, "", {
    maxAge: 0,
    isHttps,
  })

  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")?.trim() || ""

  const pendingCookie = verifyCookiePayload<PendingPaymentCookiePayload>(
    request.cookies.get(PENDING_PAYMENT_COOKIE)?.value,
  )

  const expectedOrderId =
    pendingCookie?.gateway === "tetrapay" ? pendingCookie.orderId : undefined
  const expectedAmountToman =
    pendingCookie?.gateway === "tetrapay" ? pendingCookie.amountToman : undefined

  const redirectUrl = new URL("/checkout/result", origin)
  redirectUrl.searchParams.set("gateway", "tetrapay")
  if (expectedOrderId) redirectUrl.searchParams.set("orderId", expectedOrderId)

  if (!token) {
    redirectUrl.searchParams.set("status", "failed")
    redirectUrl.searchParams.set("reason", "توکن پرداخت تتراپی در آدرس بازگشت وجود ندارد.")
    const res = NextResponse.redirect(redirectUrl, 303)
    res.headers.append("Set-Cookie", clearPendingCookie)
    return res
  }

  try {
    const result = await verifyTetraPayPayment({
      token,
      expectedOrderId,
      expectedAmountToman,
    })

    redirectUrl.searchParams.set("status", result.status)
    redirectUrl.searchParams.set("refId", result.token)
    if (result.orderId) redirectUrl.searchParams.set("orderId", result.orderId)
    if (result.amountToman > 0) redirectUrl.searchParams.set("amount", String(result.amountToman))
    if (result.method) redirectUrl.searchParams.set("method", result.method)
    if (!result.verified && result.message) {
      redirectUrl.searchParams.set("reason", result.message)
    }
  } catch {
    redirectUrl.searchParams.set("status", "failed")
    redirectUrl.searchParams.set("reason", "خطا در تایید سرور به سرور پرداخت تتراپی.")
  }

  const res = NextResponse.redirect(redirectUrl, 303)
  res.headers.append("Set-Cookie", clearPendingCookie)
  return res
}
