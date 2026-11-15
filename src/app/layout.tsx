import type { Metadata, Viewport } from "next"
import "@fontsource-variable/vazirmatn"
import "@fontsource-variable/sora"
import "./globals.css"
import PromoBanner from "@/components/site/PromoBanner"
import AuthProvider from "@/components/providers/AuthProvider"
import { siteContent } from "@/lib/data"
import { LOGO_MARK_URI } from "@/lib/brandMark"

const SITE_URL = "https://echshop.ir"

export const metadata: Metadata = {
  // مبنای ساخت نشانی مطلق تصاویر OpenGraph — با دامنهٔ نهایی سایت به‌روزرسانی شود
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteContent.brand.nameFa} | ${siteContent.brand.tagline}`,
    template: `%s | ${siteContent.brand.nameFa}`,
  },
  description: siteContent.hero.subheadline,
  keywords: [
    "خرید اکانت",
    "اکانت پرمیوم",
    "لایسنس اورجینال",
    "اچ شاپ",
    "echshop",
    "اشتراک پرمیوم",
    "اسپاتیفای پرمیوم",
    "اکانت ChatGPT",
    "خرید نتفلیکس",
    "یوتیوب پرمیوم",
    "کانوا پرو",
    "تحویل فوری اکانت",
    "فروشگاه اکانت دیجیتال",
    "لایسنس ادوبی",
  ],
  alternates: { canonical: "/" },
  category: "فروشگاه آنلاین",
  formatDetection: { telephone: false },
  icons: {
    // فاوآیکون — نشان سه‌بعدی برند (کلید آبی) به‌صورت data URI
    icon: LOGO_MARK_URI,
    shortcut: LOGO_MARK_URI,
    apple: LOGO_MARK_URI,
  },
  openGraph: {
    title: `${siteContent.brand.nameFa} — ${siteContent.brand.tagline}`,
    description: siteContent.hero.subheadline,
    url: SITE_URL,
    siteName: siteContent.brand.nameFa,
    locale: "fa_IR",
    type: "website",
    images: [{ url: "/art/hero-1.jpg", width: 2560, height: 768, alt: siteContent.brand.nameFa }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteContent.brand.nameFa} — ${siteContent.brand.tagline}`,
    description: siteContent.hero.subheadline,
    images: ["/art/hero-1.jpg"],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1b39f5",
}

/** دادهٔ ساخت‌یافتهٔ کلی سایت — سازمان + وب‌سایت با اکشن جستجو برای گوگل */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: siteContent.brand.nameFa,
      alternateName: siteContent.brand.nameEn,
      url: SITE_URL,
      description: siteContent.hero.subheadline,
      contactPoint: {
        "@type": "ContactPoint",
        email: siteContent.contact.email,
        contactType: "customer support",
        availableLanguage: ["fa"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: siteContent.brand.nameFa,
      inLanguage: "fa-IR",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthProvider>
          <PromoBanner />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
