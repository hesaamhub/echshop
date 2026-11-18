import type { MetadataRoute } from "next"
import { resolveSiteUrl } from "@/lib/seo/structuredData"

export default function robots(): MetadataRoute.Robots {
  const siteUrl = resolveSiteUrl()

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // مسیرهای خصوصی، پنل‌ها، API و سبد خرید هرگز ایندکس نشوند
      disallow: ["/admin", "/dashboard", "/checkout", "/cart", "/login", "/api"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
