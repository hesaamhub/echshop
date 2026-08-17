import type { MetadataRoute } from "next"
import { categories, posts, products } from "@/lib/data"
import { newArrivals } from "@/lib/newArrivals"

const SITE_URL = "https://echshop.ir"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.4 },
  ]

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/category/${category.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: post.publishedAt,
  }))

  const newPages: MetadataRoute.Sitemap = newArrivals.map((item) => ({
    url: `${SITE_URL}/new/${item.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  return [...staticPages, ...productPages, ...categoryPages, ...blogPages, ...newPages]
}
