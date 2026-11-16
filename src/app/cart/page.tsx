import type { Metadata } from "next"
import Shell from "@/components/site/Shell"
import CartClient from "@/components/site/CartClient"

export const metadata: Metadata = {
  title: "سبد خرید",
  robots: { index: false, follow: false },
}

export default function CartPage() {
  return (
    <Shell
      title="سبد خرید"
      breadcrumb={[{ label: "صفحه اصلی", href: "/" }, { label: "سبد خرید" }]}
    >
      <CartClient />
    </Shell>
  )
}
