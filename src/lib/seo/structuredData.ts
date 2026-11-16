import { lowestPrice } from "@/lib/data"
import type { Category, Product } from "@/lib/types"

export const DEFAULT_SITE_URL = "https://echshop.ir"

export function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL
  if (!configured) return DEFAULT_SITE_URL
  try {
    return new URL(configured).origin
  } catch {
    return DEFAULT_SITE_URL
  }
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

export type BreadcrumbInput = {
  label: string
  href?: string
}

export function buildBreadcrumbJsonLd(
  items: BreadcrumbInput[],
  options?: { siteUrl?: string; currentPath?: string; id?: string },
) {
  const siteUrl = options?.siteUrl ?? DEFAULT_SITE_URL
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(options?.id ? { "@id": options.id } : {}),
    itemListElement: items.map((item, index) => {
      const isLast = index === items.length - 1
      const resolvedPath = item.href ?? (isLast ? options?.currentPath : undefined)
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        ...(resolvedPath ? { item: `${siteUrl}${resolvedPath}` } : {}),
      }
    }),
  }
}

export type ProductReviewItem = {
  name: string
  body: string
  rating: number
}

export const DEFAULT_PRODUCT_REVIEWS: readonly ProductReviewItem[] = [
  { name: "مریم ا.", body: "خیلی سریع تحویل گرفتم، زیر ده دقیقه. همه‌چیز درست کار کرد.", rating: 5 },
  { name: "سینا ک.", body: "پشتیبانی در تیکت سریع جواب داد و مشکل من حل شد.", rating: 5 },
  { name: "نگار م.", body: "قیمت منطقی و روند خرید ساده. دوباره خرید می‌کنم.", rating: 4 },
]

export function buildProductOfferRange(product: Product, productUrl: string) {
  const prices = product.plans.map((plan) => plan.price)
  const lowToman = prices.length > 0 ? Math.min(...prices) : lowestPrice(product)
  const highToman = prices.length > 0 ? Math.max(...prices) : lowToman

  return {
    "@type": "AggregateOffer",
    priceCurrency: "IRR",
    lowPrice: Math.max(0, lowToman) * 10,
    highPrice: Math.max(0, highToman) * 10,
    offerCount: product.plans.length,
    availability: "https://schema.org/InStock",
    url: productUrl,
  }
}

export function buildProductAggregateRating(product: Product) {
  return {
    "@type": "AggregateRating",
    ratingValue: Number(product.rating.toFixed(1)),
    bestRating: 5,
    worstRating: 1,
    ratingCount: Math.max(1, Math.round(product.sold || 1)),
  }
}

export function buildProductsCatalogGraphJsonLd(options: {
  products: Product[]
  categories: Category[]
  siteUrl?: string
}) {
  const siteUrl = options.siteUrl ?? DEFAULT_SITE_URL
  const pageUrl = `${siteUrl}/products`
  const breadcrumbId = `${pageUrl}#breadcrumb`
  const categoryMap = new Map(options.categories.map((c) => [c.slug, c.title]))

  const breadcrumbNode = {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "صفحه اصلی", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "محصولات", item: pageUrl },
    ],
  }

  const collectionNode = {
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection`,
    url: pageUrl,
    name: "همهٔ محصولات — اکانت و لایسنس با تحویل فوری | اچ‌شاپ",
    description:
      "فهرست کامل اکانت‌های پرمیوم و لایسنس‌های رسمی با تحویل فوری، گارانتی و امتیاز خریداران در اچ‌شاپ.",
    inLanguage: "fa-IR",
    breadcrumb: { "@id": breadcrumbId },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: options.products.length,
      itemListElement: options.products.map((product, index) => {
        const productUrl = `${siteUrl}/products/${product.slug}`
        return {
          "@type": "ListItem",
          position: index + 1,
          url: productUrl,
          item: {
            "@type": "Product",
            "@id": `${productUrl}#product`,
            name: product.title,
            description: product.excerpt,
            sku: product.id,
            image: `${siteUrl}/art/hero-1.jpg`,
            url: productUrl,
            brand: { "@type": "Brand", name: product.brand },
            ...(categoryMap.get(product.categorySlug)
              ? { category: categoryMap.get(product.categorySlug) }
              : {}),
            aggregateRating: buildProductAggregateRating(product),
            offers: buildProductOfferRange(product, productUrl),
          },
        }
      }),
    },
  }

  return {
    "@context": "https://schema.org",
    "@graph": [breadcrumbNode, collectionNode],
  }
}

export function buildProductDetailGraphJsonLd(options: {
  product: Product
  category?: Category
  reviews?: readonly ProductReviewItem[]
  siteUrl?: string
}) {
  const siteUrl = options.siteUrl ?? DEFAULT_SITE_URL
  const productUrl = `${siteUrl}/products/${options.product.slug}`
  const breadcrumbId = `${productUrl}#breadcrumb`
  const reviews = options.reviews ?? DEFAULT_PRODUCT_REVIEWS

  const breadcrumbItems: BreadcrumbInput[] = [
    { label: "صفحه اصلی", href: "/" },
    { label: "محصولات", href: "/products" },
    ...(options.category
      ? [{ label: options.category.title, href: `/category/${options.category.slug}` }]
      : []),
    { label: options.product.title, href: `/products/${options.product.slug}` },
  ]

  const breadcrumbNode = {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${siteUrl}${item.href}` } : {}),
    })),
  }

  const productNode = {
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: options.product.title,
    description: options.product.description,
    sku: options.product.id,
    image: `${siteUrl}/art/hero-1.jpg`,
    brand: { "@type": "Brand", name: options.product.brand },
    ...(options.category ? { category: options.category.title } : {}),
    url: productUrl,
    aggregateRating: buildProductAggregateRating(options.product),
    review: reviews.map((rev) => ({
      "@type": "Review",
      author: { "@type": "Person", name: rev.name },
      reviewBody: rev.body,
      reviewRating: {
        "@type": "Rating",
        ratingValue: rev.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })),
    offers: buildProductOfferRange(options.product, productUrl),
  }

  const graph: Record<string, unknown>[] = [breadcrumbNode, productNode]

  if (options.product.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${productUrl}#faq`,
      mainEntity: options.product.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    })
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  }
}
