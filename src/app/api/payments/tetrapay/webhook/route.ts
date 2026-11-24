import { NextRequest, NextResponse } from "next/server"
import { verifyTetraPayWebhookSignature } from "@/lib/payments/tetrapay"

// Bounded in-memory idempotency cache for processed TetraPay event IDs.
const MAX_PROCESSED_EVENTS = 1000
const processedEventIds = new Set<string>()

function markEventProcessed(eventId: string): boolean {
  if (processedEventIds.has(eventId)) return false
  if (processedEventIds.size >= MAX_PROCESSED_EVENTS) {
    const oldest = processedEventIds.values().next().value
    if (oldest) processedEventIds.delete(oldest)
  }
  processedEventIds.add(eventId)
  return true
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signatureHeader = request.headers.get("x-tetrapay-signature")
  const eventType = request.headers.get("x-tetrapay-event") || ""
  const eventId = request.headers.get("x-tetrapay-event-id") || ""
  const isSandboxHeader = request.headers.get("x-tetrapay-sandbox") === "true"

  const verification = verifyTetraPayWebhookSignature({
    rawBody,
    signatureHeader,
    secret: process.env.TETRAPAY_WEBHOOK_SECRET,
  })

  if (!verification.valid) {
    const status = verification.reason === "WEBHOOK_SECRET_NOT_CONFIGURED" ? 503 : 400
    return NextResponse.json(
      { ok: false, reason: verification.reason || "INVALID_SIGNATURE" },
      { status },
    )
  }

  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>
  } catch {
    return NextResponse.json({ ok: false, reason: "BAD_JSON" }, { status: 400 })
  }

  const resolvedEventId =
    (typeof payload.event_id === "string" && payload.event_id) || eventId || ""
  const resolvedEvent =
    (typeof payload.event === "string" && payload.event) || eventType || "unknown"
  const isDuplicate = resolvedEventId ? !markEventProcessed(resolvedEventId) : false

  return NextResponse.json(
    {
      ok: true,
      received: true,
      duplicate: isDuplicate,
      event: resolvedEvent,
      eventId: resolvedEventId || null,
      orderId: typeof payload.order_id === "string" ? payload.order_id : null,
      status: typeof payload.status === "string" ? payload.status : null,
      sandbox: isSandboxHeader || Boolean(payload.sandbox),
    },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  )
}
