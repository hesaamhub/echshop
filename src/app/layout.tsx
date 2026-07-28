import type { Metadata } from "next"
import "./globals.css"
import PromoBanner from "@/components/site/PromoBanner"
import { siteContent } from "@/lib/data"

export const metadata: Metadata = {
  title: {
    default: `${siteContent.brand.nameFa} | ${siteContent.brand.tagline}`,
    template: `%s | ${siteContent.brand.nameFa}`,
  },
  description: siteContent.hero.subheadline,
  keywords: ["خرید اکانت", "لایسنس", "اچ شاپ", "echshop", "اشتراک پرمیوم"],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: `${siteContent.brand.nameFa} — ${siteContent.brand.tagline}`,
    description: siteContent.hero.subheadline,
    locale: "fa_IR",
    type: "website",
    images: [{ url: "/logo.png", width: 640, height: 640, alt: siteContent.brand.nameFa }],
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
