import assert from "node:assert/strict"
import { createHmac } from "node:crypto"
import test from "node:test"
import {
  buildSecureCookieHeader,
  signCookiePayload,
  verifyCookiePayload,
} from "./sessionSecurity"
import {
  TETRAPAY_PROD_API_BASE,
  TETRAPAY_SANDBOX_API_BASE,
  createTetraPayPayment,
  verifyTetraPayPayment,
  verifyTetraPayWebhookSignature,
} from "./tetrapay"
import {
  rialToToman,
  sanitizeGatewayOrderId,
  tomanToRial,
  validateGatewayRedirectUrl,
} from "./types"

test("currency conversion and orderId sanitization work accurately", () => {
  assert.equal(tomanToRial(250_000), 2_500_000)
  assert.equal(rialToToman("2500000"), 250_000)
  assert.equal(sanitizeGatewayOrderId("ECH 1001/test"), "ECH-1001-test")
  assert.throws(
    () => validateGatewayRedirectUrl("https://evil.example/pay", ["tetra98.com"]),
    /UNTRUSTED_GATEWAY_HOST/,
  )
  assert.equal(
    validateGatewayRedirectUrl("https://pay.tetra98.com/p/tp_tok_abc123", ["tetra98.com"]),
    "https://pay.tetra98.com/p/tp_tok_abc123",
  )
})

test("signed payment cookies round-trip and reject tampered payloads", () => {
  const secret = "test-payment-session-secret-0123456789"
  const signed = signCookiePayload({ orderId: "ECH-2002", amountToman: 250_000 }, secret)
  const verified = verifyCookiePayload<{ orderId: string; amountToman: number }>(signed, secret)
  assert.deepEqual(verified, { orderId: "ECH-2002", amountToman: 250_000 })
  assert.equal(verifyCookiePayload(`${signed}tamper`, secret), null)

  const header = buildSecureCookieHeader("echshop_pending_payment", signed, {
    maxAge: 1800,
    isHttps: true,
  })
  assert.match(header, /HttpOnly/)
  assert.match(header, /SameSite=None/)
  assert.match(header, /Secure/)
  assert.match(header, /Partitioned/)
})

test("TetraPay v1 converts Tomans to Rials, supports sandbox base URL, and verifies paid transactions", async () => {
  const seenUrls: string[] = []
  const mockFetch = (async (input: string | URL, init?: RequestInit) => {
    const url = String(input)
    seenUrls.push(url)
    if (url.endsWith("/payments")) {
      const body = JSON.parse(String(init?.body || "{}")) as Record<string, unknown>
      assert.equal(body.amount, "2500000")
      assert.equal(body.order_id, "ECH-2002")
      return new Response(
        JSON.stringify({
          token: "tp_tok_abc123",
          payment_url: "https://pay.tetra98.com/p/tp_tok_abc123",
          bot_payment_url: "https://t.me/tetrapaybot?start=pay_tp_tok_abc123",
        }),
        { status: 201 },
      )
    }

    if (url.endsWith("/payments/tp_tok_abc123/verify")) {
      return new Response(
        JSON.stringify({
          token: "tp_tok_abc123",
          status: "paid",
          order_id: "ECH-2002",
          amount: "2500000",
          received_amount: "2500000",
          method: "online",
          paid_at: "2026-10-15T10:00:00.000Z",
          verified_before: false,
        }),
        { status: 200 },
      )
    }

    return new Response("not found", { status: 404 })
  }) as unknown as typeof fetch

  const created = await createTetraPayPayment({
    amountToman: 250_000,
    orderId: "ECH-2002",
    callbackUrl: "https://example.com/api/payments/tetrapay/callback",
    apiKey: "tp-api-key",
    sandbox: true,
    fetchImpl: mockFetch,
  })
  assert.ok(seenUrls[0].startsWith(TETRAPAY_SANDBOX_API_BASE))
  assert.equal(created.amountRial, 2_500_000)
  assert.equal(created.referenceCode, "tp_tok_abc123")
  assert.equal(created.sandbox, true)

  const verified = await verifyTetraPayPayment({
    token: "tp_tok_abc123",
    expectedOrderId: "ECH-2002",
    expectedAmountToman: 250_000,
    apiKey: "tp-api-key",
    sandbox: false,
    fetchImpl: mockFetch,
  })
  assert.ok(seenUrls[1].startsWith(TETRAPAY_PROD_API_BASE))
  assert.equal(verified.verified, true)
  assert.equal(verified.status, "paid")
  assert.equal(verified.amountToman, 250_000)
})

test("verifyTetraPayWebhookSignature validates HMAC-SHA256 t.body signature and enforces 5-minute replay window", () => {
  const secret = "whsec_test_secret_12345"
  const rawBody = JSON.stringify({ event: "payment.paid", event_id: "evt_1", order_id: "ECH-2002", amount: "2500000", status: "paid" })
  const nowSec = 1_760_000_000
  const sig = createHmac("sha256", secret).update(`${nowSec}.${rawBody}`, "utf8").digest("hex")
  const header = `t=${nowSec},v1=${sig}`

  assert.equal(
    verifyTetraPayWebhookSignature({ rawBody, signatureHeader: header, secret, nowSec: nowSec + 10 }).valid,
    true,
  )

  // Tampered body fails
  assert.equal(
    verifyTetraPayWebhookSignature({ rawBody: `${rawBody} `, signatureHeader: header, secret, nowSec: nowSec + 10 }).valid,
    false,
  )

  // Replay outside 5-minute window fails
  const expired = verifyTetraPayWebhookSignature({
    rawBody,
    signatureHeader: header,
    secret,
    nowSec: nowSec + 301,
  })
  assert.equal(expired.valid, false)
  assert.equal(expired.reason, "TIMESTAMP_OUT_OF_WINDOW")
})
