import test from "node:test"
import assert from "node:assert/strict"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { clampSkeletonCount, resolveLoadingPhase } from "./loadingState"
import {
  ProductCardSkeleton,
  ProductGridSkeleton,
  ProductListTransitionOverlay,
  ProductsBrowserSkeleton,
} from "@/components/site/ProductListSkeleton"
import {
  AdminChartsSkeleton,
  AdminDashboardPageSkeleton,
  AdminListSkeleton,
  AdminTableSkeleton,
  CardTransitionOverlay,
} from "@/components/panel/AdminSkeletons"
import { Card, StatCard } from "@/components/panel/Ui"
import AdminFinancialCharts from "@/components/panel/AdminFinancialCharts"

// Ensure JSX classic fallback global is set under tsx test runner
;(globalThis as unknown as { React: typeof React }).React = React

test("resolveLoadingPhase returns initial-skeleton when loading with no data", () => {
  assert.equal(resolveLoadingPhase({ isLoading: true, hasData: false }), "initial-skeleton")
  assert.equal(
    resolveLoadingPhase({ isLoading: true, hasData: false, isTransitioning: true }),
    "initial-skeleton",
  )
})

test("resolveLoadingPhase returns refresh-overlay when loading or transitioning with existing data", () => {
  assert.equal(resolveLoadingPhase({ isLoading: true, hasData: true }), "refresh-overlay")
  assert.equal(
    resolveLoadingPhase({ isLoading: false, hasData: true, isTransitioning: true }),
    "refresh-overlay",
  )
})

test("resolveLoadingPhase returns ready when idle", () => {
  assert.equal(resolveLoadingPhase({ isLoading: false, hasData: true }), "ready")
  assert.equal(resolveLoadingPhase({ isLoading: false, hasData: false }), "ready")
})

test("clampSkeletonCount enforces lower and upper bounds safely", () => {
  assert.equal(clampSkeletonCount(6), 6)
  assert.equal(clampSkeletonCount(0, 6, 12), 1)
  assert.equal(clampSkeletonCount(-5, 4, 12), 1)
  assert.equal(clampSkeletonCount(99, 6, 12), 12)
  assert.equal(clampSkeletonCount(Number.NaN, 5, 12), 5)
  assert.equal(clampSkeletonCount(3.9, 6, 12), 4)
})

test("ProductListSkeleton components render exact skeleton geometry and transition overlay", () => {
  const cardHtml = renderToStaticMarkup(React.createElement(ProductCardSkeleton))
  assert.match(cardHtml, /data-testid="product-card-skeleton"/)
  assert.match(cardHtml, /skeleton-shimmer/)

  const gridHtml = renderToStaticMarkup(React.createElement(ProductGridSkeleton, { count: 4 }))
  assert.match(gridHtml, /data-testid="product-list-skeleton"/)
  assert.match(gridHtml, /role="status"/)
  const cardMatches = gridHtml.match(/data-testid="product-card-skeleton"/g) ?? []
  assert.equal(cardMatches.length, 4)

  const browserHtml = renderToStaticMarkup(
    React.createElement(ProductsBrowserSkeleton, { count: 6 }),
  )
  assert.match(browserHtml, /data-testid="products-browser-skeleton"/)
  assert.equal((browserHtml.match(/data-testid="product-card-skeleton"/g) ?? []).length, 6)

  const visibleOverlay = renderToStaticMarkup(
    React.createElement(ProductListTransitionOverlay, {
      visible: true,
      label: "در حال فیلتر…",
    }),
  )
  assert.match(visibleOverlay, /data-testid="product-list-transition-overlay"/)
  assert.match(visibleOverlay, /در حال فیلتر…/)
  assert.match(visibleOverlay, /loading-sweep-bar/)

  const hiddenOverlay = renderToStaticMarkup(
    React.createElement(ProductListTransitionOverlay, { visible: false }),
  )
  assert.doesNotMatch(hiddenOverlay, /data-testid="product-list-transition-overlay"/)
})

test("AdminSkeletons, StatCard, Card, and AdminFinancialCharts render skeleton & refresh overlay states", () => {
  const tableHtml = renderToStaticMarkup(
    React.createElement(AdminTableSkeleton, { columns: 7, rows: 5 }),
  )
  assert.match(tableHtml, /data-testid="admin-table-skeleton"/)
  assert.match(tableHtml, /role="status"/)

  const listHtml = renderToStaticMarkup(React.createElement(AdminListSkeleton, { rows: 4 }))
  assert.match(listHtml, /data-testid="admin-list-skeleton"/)

  const chartsSkeletonHtml = renderToStaticMarkup(React.createElement(AdminChartsSkeleton))
  assert.match(chartsSkeletonHtml, /data-testid="admin-charts-skeleton"/)

  const pageSkeletonHtml = renderToStaticMarkup(React.createElement(AdminDashboardPageSkeleton))
  assert.match(pageSkeletonHtml, /data-testid="admin-dashboard-skeleton"/)
  assert.match(pageSkeletonHtml, /data-testid="admin-charts-skeleton"/)
  assert.match(pageSkeletonHtml, /data-testid="admin-table-skeleton"/)
  assert.match(pageSkeletonHtml, /data-testid="admin-list-skeleton"/)

  const statLoadingHtml = renderToStaticMarkup(
    React.createElement(StatCard, {
      label: "مجموع فروش",
      value: "۰ تومان",
      loading: true,
    }),
  )
  assert.match(statLoadingHtml, /data-testid="stat-card-skeleton"/)
  assert.match(statLoadingHtml, /aria-busy="true"/)
  assert.match(statLoadingHtml, /skeleton-shimmer/)

  const statRefreshingHtml = renderToStaticMarkup(
    React.createElement(StatCard, {
      label: "مجموع فروش",
      value: "۱,۲۰۰,۰۰۰ تومان",
      refreshing: true,
    }),
  )
  assert.match(statRefreshingHtml, /data-testid="stat-card"/)
  assert.match(statRefreshingHtml, /loading-sweep-bar/)
  assert.match(statRefreshingHtml, /۱,۲۰۰,۰۰۰ تومان/)

  const cardRefreshingHtml = renderToStaticMarkup(
    React.createElement(
      Card,
      {
        title: "آخرین سفارش‌ها",
        refreshing: true,
        refreshLabel: "در حال بروزرسانی سفارش‌ها…",
      },
      React.createElement("div", null, "محتوای جدول"),
    ),
  )
  assert.match(cardRefreshingHtml, /aria-busy="true"/)
  assert.match(cardRefreshingHtml, /data-testid="card-transition-overlay"/)
  assert.match(cardRefreshingHtml, /در حال بروزرسانی سفارش‌ها…/)
  assert.match(cardRefreshingHtml, /محتوای جدول/)

  const overlayHiddenHtml = renderToStaticMarkup(
    React.createElement(CardTransitionOverlay, { visible: false }),
  )
  assert.doesNotMatch(overlayHiddenHtml, /data-testid="card-transition-overlay"/)

  const chartsInitialHtml = renderToStaticMarkup(
    React.createElement(AdminFinancialCharts, {
      orders: [],
      products: [],
      loading: true,
    }),
  )
  assert.match(chartsInitialHtml, /data-testid="admin-charts-skeleton"/)
  assert.match(chartsInitialHtml, /aria-busy="true"/)

  const chartsRefreshHtml = renderToStaticMarkup(
    React.createElement(AdminFinancialCharts, {
      orders: [],
      products: [],
      loading: false,
      refreshing: true,
    }),
  )
  assert.doesNotMatch(chartsRefreshHtml, /data-testid="admin-charts-skeleton"/)
  assert.match(chartsRefreshHtml, /data-testid="card-transition-overlay"/)
  assert.match(chartsRefreshHtml, /loading-sweep-bar/)
})
