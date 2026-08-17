import type { MetadataRoute } from "next"
import { categories, posts, products } from "@/lib/data"

/** نقشهٔ سایت برای موتورهای جستجو */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://echshop.ir"
  const now = new Date()

  const staticPages = ["", "/products", "/blog", "/about", "/contact", "/new"].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }))

  const productPages = products.map((product) => ({
    url: `${base}/products/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const categoryPages = categories.map((category) => ({
    url: `${base}/category/${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  const blogPages = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))

  return [...staticPages, ...productPages, ...categoryPages, ...blogPages]
}
