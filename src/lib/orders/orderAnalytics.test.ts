import test from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import SpendingOrdersChart from "@/components/panel/SpendingOrdersChart"
import {
  buildSixMonthOrderSeries,
  formatCompactToman,
  type AnalyticsOrderInput,
} from "./orderAnalytics"

;(globalThis as { React?: typeof React }).React = React

test("buildSixMonthOrderSeries builds 6 consecutive Persian months ending at referenceDate", () => {
  // 2026-06-15 is Khordad 1405, so 6 months ending Khordad 1405 spans Dey 1404 .. Khordad 1405
  const result = buildSixMonthOrderSeries([], new Date("2026-06-15T12:00:00.000Z"))
  assert.equal(result.months.length, 6)
  assert.deepEqual(
    result.months.map((m) => m.key),
    ["1404-10", "1404-11", "1404-12", "1405-01", "1405-02", "1405-03"],
  )
  assert.equal(result.months[0].fullMonthLabel, "دی 1404")
  assert.equal(result.months[5].fullMonthLabel, "خرداد 1405")
  assert.equal(result.totalSpending, 0)
  assert.equal(result.totalOrders, 0)
  assert.equal(result.peakMonthLabel, null)
})

test("buildSixMonthOrderSeries aggregates confirmed spending and order frequency accurately", () => {
  const ref = new Date("2026-11-16T12:00:00.000Z") // Aban 1405 (1405-08)
  const orders: AnalyticsOrderInput[] = [
    // Aban 1405
    { createdAt: "2026-11-16", amount: 300_000, status: "delivered" },
    { createdAt: "2026-11-05", amount: 200_000, status: "paid" },
    { createdAt: "2026-11-02", amount: 500_000, status: "failed" },
    { createdAt: "2026-11-01", amount: 150_000, status: "pending" },
    // Mehr 1405
    { createdAt: "2026-10-10", amount: 850_000, status: "delivered" },
    { createdAt: "2026-10-03", amount: 400_000, status: "refunded" },
    // Out-of-window order (> 6 months ago)
    { createdAt: "2025-12-01", amount: 999_000, status: "delivered" },
    // Invalid date safely ignored
    { createdAt: "not-a-date", amount: 100_000, status: "delivered" },
  ]

  const result = buildSixMonthOrderSeries(orders, ref)
  assert.equal(result.months.length, 6)
  assert.equal(result.months[5].key, "1405-08")
  assert.equal(result.months[5].ordersCount, 4)
  assert.equal(result.months[5].confirmedOrdersCount, 2)
  assert.equal(result.months[5].spending, 500_000)

  assert.equal(result.months[4].key, "1405-07")
  assert.equal(result.months[4].ordersCount, 2)
  assert.equal(result.months[4].confirmedOrdersCount, 1)
  assert.equal(result.months[4].spending, 850_000)

  assert.equal(result.totalSpending, 1_350_000)
  assert.equal(result.totalOrders, 6)
  assert.equal(result.averageMonthlySpending, 225_000)
  assert.equal(result.peakMonthLabel, "مهر 1405")
})

test("formatCompactToman formats numbers concisely for chart axes", () => {
  assert.equal(formatCompactToman(0), "0")
  assert.equal(formatCompactToman(850), "850")
  assert.equal(formatCompactToman(450_000), "450K")
  assert.equal(formatCompactToman(2_000_000), "2M")
  assert.equal(formatCompactToman(2_500_000), "2.5M")
})

test("SpendingOrdersChart renders populated totals, empty state, and loading skeleton", () => {
  const ref = new Date("2026-11-16T12:00:00.000Z")
  const populatedHtml = renderToStaticMarkup(
    React.createElement(SpendingOrdersChart, {
      orders: [
        { createdAt: "2026-11-10", amount: 420_000, status: "delivered" },
        { createdAt: "2026-10-12", amount: 180_000, status: "paid" },
      ],
      referenceDate: ref,
    }),
  )
  assert.ok(populatedHtml.includes('data-testid="spending-orders-chart"'))
  assert.ok(populatedHtml.includes("600,000"))
  assert.ok(populatedHtml.includes("مهر 1405") || populatedHtml.includes("آبان 1405"))

  const emptyHtml = renderToStaticMarkup(
    React.createElement(SpendingOrdersChart, { orders: [], referenceDate: ref }),
  )
  assert.ok(emptyHtml.includes("مشاهدهٔ محصولات فروشگاه"))

  const loadingHtml = renderToStaticMarkup(
    React.createElement(SpendingOrdersChart, { orders: [], loading: true, referenceDate: ref }),
  )
  assert.ok(loadingHtml.includes("در حال بارگذاری نمودار"))
})
