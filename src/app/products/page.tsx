import type { Metadata } from "next"
import { Suspense } from "react"
import Shell from "@/components/site/Shell"
import ProductsHero from "@/components/site/ProductsHero"
import ProductsBrowser from "@/components/site/ProductsBrowser"
import { categories, products } from "@/lib/data"

export const metadata: Metadata = {
  title: "همهٔ محصولات — اکانت و لایسنس با تحویل فوری",
  description:
    "خرید اکانت پرمیوم و لایسنس اورجینال بیش از ۴۰ برند جهانی؛ اسپاتیفای، نتفلیکس، ChatGPT Plus، کانوا پرو و دیسکورد نیترو با تحویل خودکار در چند دقیقه، گارانتی کامل و پشتیبانی فارسی ۲۴/۷.",
  keywords: [
    "خرید اکانت",
    "اکانت پرمیوم",
    "لایسنس اورجینال",
    "تحویل فوری اکانت",
    "اسپاتیفای پرمیوم",
    "خرید نتفلیکس",
    "اکانت ChatGPT",
    "کانوا پرو",
    "دیسکورد نیترو",
  ],
  alternates: { canonical: "/products" },
  openGraph: {
    title: "فروشگاه اچ‌شاپ — همهٔ اکانت‌ها و لایسنس‌ها",
    description:
      "خرید اکانت پرمیوم و لایسنس اورجینال بیش از ۴۰ برند جهانی با تحویل خودکار در چند دقیقه و گارانتی کامل.",
    url: "/products",
  },
}

export default function ProductsPage() {
  return (
    <Shell breadcrumb={[{ label: "صفحه اصلی", href: "/" }, { label: "محصولات" }]}>
      <ProductsHero />
      <div className="mt-10">
        {/* ProductsBrowser برای خواندن پارامتر جستجو به Suspense نیاز دارد */}
        <Suspense fallback={null}>
          <ProductsBrowser products={products} categories={categories} />
        </Suspense>
      </div>
    </Shell>
  )
}
