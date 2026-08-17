import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // مسیرهای خصوصی و سبد خرید هرگز ایندکس نشوند
      disallow: ["/admin", "/dashboard", "/checkout", "/cart", "/login"],
    },
    sitemap: "https://echshop.ir/sitemap.xml",
  }
}
