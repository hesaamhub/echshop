import type { Metadata } from "next"
import Shell from "@/components/site/Shell"
import CheckoutClient from "@/components/site/CheckoutClient"

export const metadata: Metadata = {
  title: "تسویه حساب",
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  return (
    <Shell
      title="تسویه حساب"
      subtitle="اطلاعات تحویل را بررسی کنید و سفارش را ثبت نمایید."
      breadcrumb={[
        { label: "صفحه اصلی", href: "/" },
        { label: "سبد خرید", href: "/cart" },
        { label: "تسویه حساب" },
      ]}
    >
      <CheckoutClient />
    </Shell>
  )
}
