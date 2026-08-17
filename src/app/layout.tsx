import type { Metadata } from "next"
import "@fontsource-variable/vazirmatn"
import "@fontsource-variable/sora"
import "./globals.css"
import PromoBanner from "@/components/site/PromoBanner"
import { siteContent } from "@/lib/data"
import { LOGO_MARK_URI } from "@/lib/brandMark"

export const metadata: Metadata = {
  // مبنای ساخت نشانی مطلق تصاویر OpenGraph — با دامنهٔ نهایی سایت به‌روزرسانی شود
  metadataBase: new URL("https://echshop.ir"),
  title: {
    default: `${siteContent.brand.nameFa} | ${siteContent.brand.tagline}`,
    template: `%s | ${siteContent.brand.nameFa}`,
  },
  description: siteContent.hero.subheadline,
  keywords: ["خرید اکانت", "لایسنس", "اچ شاپ", "echshop", "اشتراک پرمیوم"],
  icons: {
    // فاوآیکون — نشان سه‌بعدی برند (کلید آبی) به‌صورت data URI
    icon: LOGO_MARK_URI,
    shortcut: LOGO_MARK_URI,
    apple: LOGO_MARK_URI,
  },
  openGraph: {
    title: `${siteContent.brand.nameFa} — ${siteContent.brand.tagline}`,
    description: siteContent.hero.subheadline,
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-sans antialiased">
        <PromoBanner />
        {children}
      </body>
    </html>
  )
}
