import { NextRequest, NextResponse } from "next/server"
import { resolveAppOrigin } from "@/lib/payments/sessionSecurity"
import {
  isTetraPayConfigured,
  isTetraPaySandbox,
  isTetraPayWebhookConfigured,
} from "@/lib/payments/tetrapay"

export async function GET(request: NextRequest) {
  const origin = resolveAppOrigin(request)

  return NextResponse.json(
    {
      gateways: {
        tetrapay: {
          id: "tetrapay",
          nameFa: "درگاه پرداخت تتراپی (TetraPay)",
          configured: isTetraPayConfigured(),
          webhookConfigured: isTetraPayWebhookConfigured(),
          sandbox: isTetraPaySandbox(),
          currency: "IRR",
          apiVersion: "v1",
        },
      },
      callbacks: {
        tetrapayPaymentCallback: `${origin}/api/payments/tetrapay/callback`,
        tetrapayWebhook: `${origin}/api/payments/tetrapay/webhook`,
      },
    },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    },
  )
}
