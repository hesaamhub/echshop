import type { MetadataRoute } from "next"

/** قوانین ربات‌های جستجو */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard", "/checkout", "/cart"],
    },
    sitemap: "https://echshop.ir/sitemap.xml",
  }
}
