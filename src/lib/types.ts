/** روش‌های تحویل محصول — هر محصول/پلن می‌تواند یکی از این‌ها را داشته باشد */
export type DeliveryMethod =
  | "manual" // تحویل دستی توسط پشتیبان
  | "stock" // برداشت خودکار از انبار کد/اکانت
  | "api" // دریافت خودکار از API تامین‌کننده
  | "upgrade" // ارتقای اکانت شخصی کاربر (دریافت ایمیل/یوزرنیم)
  | "gift_code" // ارسال گیفت کد / لایسنس
  | "scheduled" // تحویل زمان‌بندی‌شده

export const deliveryLabels: Record<DeliveryMethod, string> = {
  manual: "تحویل دستی توسط پشتیبانی",
  stock: "تحویل فوری از انبار",
  api: "تحویل خودکار از API تامین‌کننده",
  upgrade: "ارتقای اکانت شخصی شما",
  gift_code: "ارسال گیفت‌کد / لایسنس",
  scheduled: "تحویل زمان‌بندی‌شده",
}

export type Plan = {
  id: string
  title: string // مثلاً "۱ ماهه اشتراکی"
  price: number
  compareAt?: number
  delivery: DeliveryMethod
  stock: number
}

export type Product = {
  id: string
  slug: string
  title: string
  brand: string
  logo: string
  categorySlug: string
  excerpt: string
  description: string
  badge?: string
  rating: number
  sold: number
  gradient: string
  plans: Plan[]
  features: string[]
  faq: { q: string; a: string }[]
}

export type Category = {
  slug: string
  title: string
  description: string
  icon: string
  count: number
}

export type Post = {
  slug: string
  title: string
  excerpt: string
  body: string
  category: string
  author: string
  readMinutes: number
  publishedAt: string
  cover: string
}

export type OrderStatus = "pending" | "paid" | "delivered" | "failed" | "refunded"

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "در انتظار پرداخت",
  paid: "پرداخت شده",
  delivered: "تحویل شده",
  failed: "ناموفق",
  refunded: "مرجوع شده",
}

export type Order = {
  id: string
  customer: string
  product: string
  plan: string
  amount: number
  status: OrderStatus
  delivery: DeliveryMethod
  createdAt: string
}

export type TicketStatus = "open" | "answered" | "pending_user" | "closed"

export const ticketStatusLabels: Record<TicketStatus, string> = {
  open: "باز",
  answered: "پاسخ داده شده",
  pending_user: "در انتظار پاسخ شما",
  closed: "بسته شده",
}

export type Ticket = {
  id: string
  subject: string
  department: "پشتیبانی فنی" | "مالی و پرداخت" | "پیش از خرید"
  status: TicketStatus
  priority: "کم" | "متوسط" | "زیاد"
  updatedAt: string
  messages: { from: "user" | "support"; body: string; at: string }[]
}
