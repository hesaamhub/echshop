import PanelShell from "@/components/panel/PanelShell"

const nav = [
  { href: "/dashboard", label: "پیشخوان" },
  { href: "/dashboard/orders", label: "سفارش‌ها و تحویل" },
  { href: "/dashboard/wallet", label: "کیف پول" },
  { href: "/dashboard/tickets", label: "تیکت‌ها" },
  { href: "/dashboard/notifications", label: "اطلاع‌رسانی" },
  { href: "/dashboard/favorites", label: "علاقه‌مندی‌ها" },
  { href: "/dashboard/profile", label: "پروفایل و امنیت" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PanelShell nav={nav} title="پنل کاربری" role="حساب مشتری اچ‌شاپ">
      {children}
    </PanelShell>
  )
}
