import test from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import OrderStatusTracker from "@/components/panel/OrderStatusTracker"
import { buildOrderTrackerModel } from "./orderTracker"
import { deliveryLabels, orderStatusLabels, type DeliveryMethod, type OrderStatus } from "@/lib/types"

;(globalThis as { React?: typeof React }).React = React

test("buildOrderTrackerModel reflects every OrderStatus progression and label dynamically", () => {
  const pending = buildOrderTrackerModel({ status: "pending", delivery: "stock" })
  assert.equal(pending.currentLabel, orderStatusLabels.pending)
  assert.equal(pending.trackFillRatio, 0)
  assert.equal(pending.steps[0].state, "current")
  assert.equal(pending.steps[0].isCurrent, true)
  assert.equal(pending.steps[1].state, "upcoming")
  assert.equal(pending.steps[2].state, "upcoming")

  const paid = buildOrderTrackerModel({ status: "paid", delivery: "manual" })
  assert.equal(paid.currentLabel, orderStatusLabels.paid)
  assert.equal(paid.trackFillRatio, 0.5)
  assert.equal(paid.steps[0].state, "completed")
  assert.equal(paid.steps[1].state, "current")
  assert.equal(paid.steps[1].isCurrent, true)
  assert.equal(paid.steps[2].state, "upcoming")
  assert.ok(paid.subtext.includes(deliveryLabels.manual))

  const delivered = buildOrderTrackerModel({ status: "delivered", delivery: "api" })
  assert.equal(delivered.currentLabel, orderStatusLabels.delivered)
  assert.equal(delivered.trackFillRatio, 1)
  assert.equal(delivered.progressPercent, 100)
  assert.equal(delivered.steps[0].state, "completed")
  assert.equal(delivered.steps[1].state, "completed")
  assert.equal(delivered.steps[2].state, "completed")
  assert.equal(delivered.steps[2].isCurrent, true)

  const failed = buildOrderTrackerModel({ status: "failed", delivery: "upgrade" })
  assert.equal(failed.currentLabel, orderStatusLabels.failed)
  assert.equal(failed.steps[0].state, "completed")
  assert.equal(failed.steps[1].state, "error")
  assert.equal(failed.steps[1].label, orderStatusLabels.failed)
  assert.equal(failed.steps[1].isCurrent, true)
  assert.equal(failed.steps[2].state, "upcoming")

  const refunded = buildOrderTrackerModel({ status: "refunded", delivery: "gift_code" })
  assert.equal(refunded.currentLabel, orderStatusLabels.refunded)
  assert.equal(refunded.trackFillRatio, 1)
  assert.equal(refunded.steps[0].state, "completed")
  assert.equal(refunded.steps[1].state, "completed")
  assert.equal(refunded.steps[2].state, "refunded")
  assert.equal(refunded.steps[2].label, orderStatusLabels.refunded)
  assert.equal(refunded.steps[2].isCurrent, true)
})

test("buildOrderTrackerModel uses custom statusLabels overrides and deliveryNote", () => {
  const customLabels: Record<OrderStatus, string> = {
    pending: "منتظر تسویه",
    paid: "تایید مالی",
    delivered: "ارسال تکمیل شد",
    failed: "تراکنش لغو شد",
    refunded: "عودت وجه انجام شد",
  }

  const deliveries: DeliveryMethod[] = ["manual", "stock", "api", "upgrade", "gift_code", "scheduled"]
  for (const delivery of deliveries) {
    const model = buildOrderTrackerModel({
      status: "failed",
      delivery,
      statusLabels: customLabels,
      deliveryNote: "خطای موقت درگاه پرداخت",
    })
    assert.equal(model.currentLabel, customLabels.failed)
    assert.equal(model.steps[0].label, customLabels.pending)
    assert.equal(model.steps[1].label, customLabels.failed)
    assert.equal(model.steps[2].label, customLabels.delivered)
    assert.equal(model.subtext, "خطای موقت درگاه پرداخت")
  }
})

test("OrderStatusTracker component renders dynamic status labels and aria-current step", () => {
  const statuses: OrderStatus[] = ["pending", "paid", "delivered", "failed", "refunded"]
  for (const status of statuses) {
    const html = renderToStaticMarkup(
      React.createElement(OrderStatusTracker, {
        status,
        delivery: "stock",
        createdAt: "2026-11-16",
        statusLabels: orderStatusLabels,
      }),
    )
    assert.ok(html.includes(`data-status="${status}"`))
    assert.ok(html.includes(orderStatusLabels[status]))
    assert.ok(html.includes('aria-current="step"'))
  }
})
