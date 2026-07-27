import PanelShell from "@/components/panel/PanelShell"

const nav = [
  { href: "/admin", label: "داشبورد مدیریت" },
  { href: "/admin/products", label: "محصولات و پلن‌ها" },
  { href: "/admin/inventory", label: "انبار و تحویل" },
  { href: "/admin/categories", label: "دسته‌بندی‌ها" },
  { href: "/admin/orders", label: "سفارش‌ها", badge: 2 },
  { href: "/admin/users", label: "کاربران" },
  { href: "/admin/tickets", label: "تیکت‌ها", badge: 1 },
  { href: "/admin/discounts", label: "کدهای تخفیف" },
  { href: "/admin/content", label: "مدیریت محتوا" },
  { href: "/admin/blog", label: "بلاگ" },
  { href: "/admin/notifications", label: "اطلاع‌رسانی" },
  { href: "/admin/reports", label: "گزارش‌ها" },
  { href: "/admin/settings", label: "تنظیمات سایت" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <PanelShell nav={nav} title="پنل مدیریت" role="مدیر کل اچ‌شاپ">
      {children}
    </PanelShell>
  )
}
