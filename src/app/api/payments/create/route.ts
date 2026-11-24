import { NextRequest, NextResponse } from "next/server"
import {
  buildSecureCookieHeader,
  isTrustedSameOriginRequest,
  resolveAppOrigin,
  signCookiePayload,
} from "@/lib/payments/sessionSecurity"
import {
  createTetraPayPayment,
  isTetraPayConfigured,
  isTetraPayWebhookConfigured,
} from "@/lib/payments/tetrapay"
import {
  PENDING_PAYMENT_COOKIE,
  sanitizeGatewayOrderId,
  type PaymentGatewayId,
  type PendingPaymentCookiePayload,
} from "@/lib/payments/types"

type CreatePaymentBody = {
  gateway?: unknown
  orderId?: unknown
  amountToman?: unknown
  payerName?: unknown
  payerEmail?: unknown
  payerPhone?: unknown
  description?: unknown
}

export async function POST(request: NextRequest) {
  if (!isTrustedSameOriginRequest(request)) {
    return NextResponse.json(
      { ok: false, code: "FORBIDDEN_ORIGIN", error: "درخواست از مبدا نامعتبر رد شد." },
      { status: 403 },
    )
  }

  let body: CreatePaymentBody
  try {
    body = (await request.json()) as CreatePaymentBody
  } catch {
    return NextResponse.json(
      { ok: false, code: "BAD_JSON", error: "ساختار درخواست نامعتبر است." },
      { status: 400 },
    )
  }

  const gateway: PaymentGatewayId | null = body.gateway === "tetrapay" ? "tetrapay" : null
  if (!gateway) {
    return NextResponse.json(
      { ok: false, code: "INVALID_GATEWAY", error: "درگاه پرداخت انتخاب‌شده معتبر نیست." },
      { status: 400 },
    )
  }

  const rawOrderId = typeof body.orderId === "string" ? body.orderId.trim() : ""
  const amountToman = Math.round(Number(body.amountToman) || 0)
  if (!rawOrderId || amountToman < 1000 || amountToman > 200_000_000) {
    return NextResponse.json(
      {
        ok: false,
        code: "INVALID_AMOUNT_OR_ORDER",
        error: "شناسه سفارش یا مبلغ پرداختی در بازه مجاز نیست (حداقل ۱٬۰۰۰ تومان).",
      },
      { status: 400 },
    )
  }

  const orderId = sanitizeGatewayOrderId(rawOrderId)
  const payerEmail = typeof body.payerEmail === "string" ? body.payerEmail.trim().slice(0, 254) : undefined
  const payerPhone = typeof body.payerPhone === "string" ? body.payerPhone.trim().slice(0, 24) : undefined
  const description =
    typeof body.description === "string" && body.description.trim()
      ? body.description.trim().slice(0, 250)
      : `پرداخت سفارش ${orderId} در فروشگاه اچ‌شاپ`

  const origin = resolveAppOrigin(request)
  const isHttps = origin.startsWith("https://")

  try {
    if (!isTetraPayConfigured()) {
      return NextResponse.json(
        {
          ok: false,
          code: "GATEWAY_NOT_CONFIGURED",
          gateway: "tetrapay",
          error: "کلید API درگاه تتراپی (TETRAPAY_API_KEY) هنوز روی سرور تنظیم نشده است.",
        },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      )
    }

    const callbackUrl = `${origin}/api/payments/tetrapay/callback`
    const webhookUrl =
      isHttps && isTetraPayWebhookConfigured()
        ? `${origin}/api/payments/tetrapay/webhook`
        : undefined

    const created = await createTetraPayPayment({
      amountToman,
      orderId,
      callbackUrl,
      webhookUrl,
      description,
      customerPhone: payerPhone,
      customerEmail: payerEmail,
    })

    const pendingPayload: PendingPaymentCookiePayload = {
      gateway: "tetrapay",
      orderId: created.orderId,
      amountToman: created.amountToman,
      referenceCode: created.referenceCode,
      createdAt: Date.now(),
    }

    const response = NextResponse.json(
      {
        ok: true,
        gateway: created.gateway,
        orderId: created.orderId,
        paymentUrl: created.paymentUrl,
        botPaymentUrl: created.botPaymentUrl,
        referenceCode: created.referenceCode,
        amountToman: created.amountToman,
        amountRial: created.amountRial,
        sandbox: created.sandbox,
      },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    )
    response.headers.append(
      "Set-Cookie",
      buildSecureCookieHeader(PENDING_PAYMENT_COOKIE, signCookiePayload(pendingPayload), {
        maxAge: 1800,
        isHttps,
      }),
    )
    return response
  } catch (err) {
    const rawMsg = err instanceof Error ? err.message : ""
    const isAmountError = rawMsg.includes("AMOUNT_OUT_OF_RANGE")
    return NextResponse.json(
      {
        ok: false,
        code: isAmountError ? "AMOUNT_OUT_OF_RANGE" : "GATEWAY_ERROR",
        gateway,
        error: isAmountError
          ? "مبلغ سفارش خارج از بازه مجاز درگاه پرداخت است."
          : "اتصال به درگاه پرداخت با خطا مواجه شد. لطفا تنظیمات درگاه را بررسی کنید یا دوباره تلاش کنید.",
      },
      { status: isAmountError ? 422 : 502, headers: { "Cache-Control": "no-store" } },
    )
  }
}
