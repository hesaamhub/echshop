import test from "node:test"
import assert from "node:assert/strict"
import { categories, getCategory, getProduct, products } from "../data"
import {
  buildBreadcrumbJsonLd,
  buildProductDetailGraphJsonLd,
  buildProductsCatalogGraphJsonLd,
  serializeJsonLd,
} from "./structuredData"

test("buildProductsCatalogGraphJsonLd includes BreadcrumbList and rated Product ItemList", () => {
  const graphDoc = buildProductsCatalogGraphJsonLd({
    products,
    categories,
    siteUrl: "https://echshop.ir",
  })

  assert.equal(graphDoc["@context"], "https://schema.org")
  assert.equal(graphDoc["@graph"].length, 2)

  const breadcrumb = graphDoc["@graph"][0] as {
    "@type": string
    itemListElement: Array<{ position: number; name: string; item: string }>
  }
  assert.equal(breadcrumb["@type"], "BreadcrumbList")
  assert.equal(breadcrumb.itemListElement.length, 2)
  assert.equal(breadcrumb.itemListElement[0].item, "https://echshop.ir/")
  assert.equal(breadcrumb.itemListElement[1].item, "https://echshop.ir/products")

  const collection = graphDoc["@graph"][1] as {
    "@type": string
    mainEntity: {
      "@type": string
      numberOfItems: number
      itemListElement: Array<{
        position: number
        item: {
          "@type": string
          aggregateRating: { ratingValue: number; bestRating: number; worstRating: number; ratingCount: number }
          offers: { priceCurrency: string; lowPrice: number; highPrice: number; offerCount: number }
        }
      }>
    }
  }
  assert.equal(collection["@type"], "CollectionPage")
  assert.equal(collection.mainEntity["@type"], "ItemList")
  assert.equal(collection.mainEntity.numberOfItems, products.length)

  const firstProduct = collection.mainEntity.itemListElement[0].item
  assert.equal(firstProduct["@type"], "Product")
  assert.equal(firstProduct.aggregateRating.bestRating, 5)
  assert.equal(firstProduct.aggregateRating.worstRating, 1)
  assert.ok(firstProduct.aggregateRating.ratingValue >= 1 && firstProduct.aggregateRating.ratingValue <= 5)
  assert.ok(firstProduct.aggregateRating.ratingCount >= 1)
  assert.equal(firstProduct.offers.priceCurrency, "IRR")
  assert.ok(firstProduct.offers.lowPrice <= firstProduct.offers.highPrice)
})

test("buildProductDetailGraphJsonLd includes BreadcrumbList, Product aggregateRating, reviews, and FAQPage", () => {
  const product = getProduct("spotify-premium")
  assert.ok(product)
  const category = getCategory(product.categorySlug)

  const graphDoc = buildProductDetailGraphJsonLd({
    product,
    category,
    siteUrl: "https://echshop.ir",
  })

  const nodes = graphDoc["@graph"] as Array<Record<string, unknown>>
  const types = nodes.map((n) => n["@type"])
  assert.deepEqual(types, ["BreadcrumbList", "Product", "FAQPage"])

  const breadcrumb = nodes[0] as { itemListElement: Array<{ position: number; name: string; item?: string }> }
  assert.equal(breadcrumb.itemListElement.length, 4)
  assert.equal(breadcrumb.itemListElement[3].name, product.title)
  assert.equal(breadcrumb.itemListElement[3].item, "https://echshop.ir/products/spotify-premium")

  const productNode = nodes[1] as {
    aggregateRating: { ratingValue: number; bestRating: number; worstRating: number; ratingCount: number }
    review: Array<{ "@type": string; reviewRating: { ratingValue: number } }>
  }
  assert.equal(productNode.aggregateRating.ratingValue, product.rating)
  assert.equal(productNode.aggregateRating.worstRating, 1)
  assert.equal(productNode.review.length, 3)
  assert.equal(productNode.review[0]["@type"], "Review")
})

test("serializeJsonLd escapes '<' characters to prevent script tag breakout", () => {
  const serialized = serializeJsonLd({ text: "</script><script>alert(1)</script>" })
  assert.equal(serialized.includes("<"), false)
  assert.ok(serialized.includes("\\u003c/script>"))
})

test("buildBreadcrumbJsonLd resolves optional currentPath on last item", () => {
  const ld = buildBreadcrumbJsonLd(
    [{ label: "صفحه اصلی", href: "/" }, { label: "محصولات" }],
    { currentPath: "/products", siteUrl: "https://echshop.ir" },
  )
  assert.equal(ld.itemListElement[1].item, "https://echshop.ir/products")
})
