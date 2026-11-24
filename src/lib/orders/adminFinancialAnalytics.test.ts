import assert from "node:assert/strict"
import test from "node:test"
import type { Product } from "@/lib/types"
import {
  buildAdminFinancialAnalytics,
  buildAdminMonthlySalesSeries,
  buildBestSellingProductsBreakdown,
  type AdminAnalyticsOrderInput,
} from "./adminFinancialAnalytics"

const sampleProducts: Product[] = [
  {
    id: "p1",
    slug: "chatgpt-plus",
    title: "اشتراک ChatGPT Plus",
    subtitle: "اکانت اختصاصی",
    category: "ai",
    brand: "OpenAI",
    badge: "پرفروش",
    rating: 4.9,
    reviewsCount: 120,
    sold: 420,
    stock: 10,
    image: "/img/1.png",
    description: "",
    features: [],
    plans: [
      { id: "pl1", title: "یک ماهه", duration: "1m", price: 950_000, delivery: "stock", inStock: true },
    ],
  },
  {
    id: "p2",
    slug: "spotify-premium",
    title: "اسپاتیفای پرمیوم",
    subtitle: "فمیلی",
    category: "music",
    brand: "Spotify",
    rating: 4.8,
    reviewsCount: 90,
    sold: 300,
    stock: 20,
    image: "/img/2.png",
    description: "",
    features: [],
    plans: [
      { id: "pl2", title: "یک ماهه", duration: "1m", price: 180_000, delivery: "upgrade", inStock: true },
    ],
  },
  {
    id: "p3",
    slug: "apple-id",
    title: "اپل آیدی آمریکا",
    subtitle: "وریفای شده",
    category: "apple",
    brand: "Apple",
    rating: 5,
    reviewsCount: 200,
    sold: 500,
    stock: 50,
    image: "/img/3.png",
    description: "",
    features: [],
    plans: [
      { id: "pl3", title: "آماده", duration: "once", price: 100_000, delivery: "stock", inStock: true },
    ],
  },
]

test("buildAdminMonthlySalesSeries buckets confirmed and pending revenue over 6 and 12 months", () => {
  const refDate = new Date("2026-10-15T12:00:00.000Z")
  const orders: AdminAnalyticsOrderInput[] = [
    { createdAt: "2026-10-05T10:00:00.000Z", amount: 1_200_000, status: "delivered", productId: "p1", productTitle: "ChatGPT" },
    { createdAt: "2026-10-10T10:00:00.000Z", amount: 400_000, status: "pending", productId: "p2", productTitle: "Spotify" },
    { createdAt: "2026-09-10T10:00:00.000Z", amount: 800_000, status: "paid", productId: "p1", productTitle: "ChatGPT" },
    { createdAt: "2026-09-12T10:00:00.000Z", amount: 500_000, status: "failed", productId: "p3", productTitle: "Apple ID" },
  ]

  const six = buildAdminMonthlySalesSeries(orders, 6, refDate)
  assert.equal(six.length, 6)
  assert.equal(six[six.length - 1].confirmedRevenue, 1_200_000)
  assert.equal(six[six.length - 1].pendingRevenue, 400_000)
  assert.equal(six[six.length - 1].ordersCount, 2)
  assert.equal(six[six.length - 2].confirmedRevenue, 800_000)
  // Failed order should count in ordersCount but NOT confirmed or pending revenue
  assert.equal(six[six.length - 2].ordersCount, 2)
  assert.equal(six[six.length - 2].confirmedOrdersCount, 1)

  const twelve = buildAdminMonthlySalesSeries(orders, 12, refDate)
  assert.equal(twelve.length, 12)
})

test("buildBestSellingProductsBreakdown prefers live confirmed orders and groups overflow into 'سایر محصولات'", () => {
  const orders: AdminAnalyticsOrderInput[] = [
    { createdAt: "2026-10-01", amount: 1_000_000, quantity: 2, status: "delivered", productId: "a", productTitle: "محصول الف" },
    { createdAt: "2026-10-02", amount: 700_000, quantity: 1, status: "paid", productId: "b", productTitle: "محصول ب" },
    { createdAt: "2026-10-03", amount: 500_000, quantity: 1, status: "paid", productId: "c", productTitle: "محصول ج" },
    { createdAt: "2026-10-04", amount: 300_000, quantity: 3, status: "delivered", productId: "d", productTitle: "محصول د" },
    { createdAt: "2026-10-05", amount: 900_000, quantity: 1, status: "failed", productId: "e", productTitle: "سفارش ناموفق" },
  ]

  const { slices, source } = buildBestSellingProductsBreakdown(orders, sampleProducts, 2)
  assert.equal(source, "orders")
  assert.equal(slices.length, 3)
  assert.equal(slices[0].name, "محصول الف")
  assert.equal(slices[0].revenue, 1_000_000)
  assert.equal(slices[0].shareRevenuePct, 40)
  assert.equal(slices[2].name, "سایر محصولات")
  assert.equal(slices[2].isOther, true)
  assert.equal(slices[2].revenue, 800_000)
})

test("buildBestSellingProductsBreakdown falls back cleanly to catalog sales when no confirmed orders exist", () => {
  const { slices, source } = buildBestSellingProductsBreakdown([], sampleProducts, 5)
  assert.equal(source, "catalog")
  assert.equal(slices.length, 3)
  // ChatGPT: 420 * 950,000 = 399,000,000 (highest revenue)
  assert.equal(slices[0].id, "p1")
  assert.equal(slices[0].units, 420)
  const totalPct = slices.reduce((sum, s) => sum + s.shareRevenuePct, 0)
  assert.ok(Math.abs(totalPct - 100) <= 0.3)
})

test("buildAdminFinancialAnalytics computes MoM growth, AOV, and peak month", () => {
  const refDate = new Date("2026-10-15T12:00:00.000Z")
  const orders: AdminAnalyticsOrderInput[] = [
    { createdAt: "2026-09-10T10:00:00.000Z", amount: 1_000_000, status: "delivered", productId: "p1", productTitle: "ChatGPT" },
    { createdAt: "2026-10-05T10:00:00.000Z", amount: 1_500_000, status: "paid", productId: "p1", productTitle: "ChatGPT" },
  ]
  const summary = buildAdminFinancialAnalytics(orders, sampleProducts, {
    monthsCount: 6,
    referenceDate: refDate,
  })

  assert.equal(summary.totalConfirmedRevenue, 2_500_000)
  assert.equal(summary.averageOrderValue, 1_250_000)
  assert.equal(summary.monthOverMonthGrowthPct, 50)
  assert.equal(summary.topProductName, "ChatGPT")
  assert.ok(summary.peakMonthLabel)
})

test("AdminFinancialCharts component renders bar & pie dashboard sections cleanly", async () => {
  const React = await import("react")
  ;(globalThis as unknown as { React: typeof React }).React = React
  const { renderToStaticMarkup } = await import("react-dom/server")
  const { default: AdminFinancialCharts } = await import("@/components/panel/AdminFinancialCharts")

  const html = renderToStaticMarkup(
    React.createElement(AdminFinancialCharts, {
      orders: [
        {
          id: "ord-1",
          orderNumber: "ECH-101",
          userId: "u1",
          customerName: "سارا",
          customerEmail: "sara@example.com",
          customerPhone: "09120000000",
          productId: "p1",
          productTitle: "اشتراک ChatGPT Plus",
          planId: "pl1",
          planTitle: "یک ماهه",
          delivery: "stock",
          quantity: 1,
          amount: 950_000,
          discountAmount: 0,
          discountCode: "",
          paymentMethod: "gateway",
          status: "delivered",
          createdAt: new Date().toISOString(),
        },
      ],
      products: sampleProducts,
      loading: false,
    }),
  )

  assert.ok(html.includes("admin-financial-charts"))
  assert.ok(html.includes("روند فروش ماهانه (نمودار میله‌ای)"))
  assert.ok(html.includes("پرفروش‌ترین محصولات (نمودار دایره‌ای)"))
  assert.ok(html.includes("اشتراک ChatGPT Plus"))
})
