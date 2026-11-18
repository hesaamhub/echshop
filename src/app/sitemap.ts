import type { MetadataRoute } from "next"
import { categories, posts, products } from "@/lib/data"
import { newArrivals } from "@/lib/newArrivals"
import { resolveSiteUrl } from "@/lib/seo/structuredData"

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = resolveSiteUrl()

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/categories`, changeFrequency: "weekly", priority: 0.85 },
    { url: `${siteUrl}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/refund`, changeFrequency: "monthly", priority: 0.45 },
    { url: `${siteUrl}/terms`, changeFrequency: "monthly", priority: 0.35 },
    { url: `${siteUrl}/privacy`, changeFrequency: "monthly", priority: 0.35 },
  ]

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/products/${product.slug}`,
    changeFrequency: "weekly",
    priority: 0.85,
  }))

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteUrl}/category/${category.slug}`,
    changeFrequency: "weekly",
    priority: 0.75,
  }))

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: post.publishedAt,
  }))

  const newPages: MetadataRoute.Sitemap = newArrivals.map((item) => ({
    url: `${siteUrl}/new/${item.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  return [...staticPages, ...productPages, ...categoryPages, ...blogPages, ...newPages]
}
