import type { Category, Order, Post, Product, Ticket } from "./types"
import { productsB } from "./productsB"
import { productsC } from "./productsC"

/* -------------------------------------------------------------------------- */
/*  محتوای قابل ویرایش از پنل مدیریت (متن‌ها، تصاویر، تنظیمات)                */
/* -------------------------------------------------------------------------- */

export const siteContent = {
  brand: {
    nameFa: "اچ‌شاپ",
    nameEn: "echshop",
    tagline: "فروشگاه اکانت و لایسنس دیجیتال",
    logoMark: "✦",
  },
  hero: {
    headlineTop: "بنیانِ نسل تازهٔ",
    headlineBottom: "خرید اکانت‌های دیجیتال",
    subheadline:
      "اچ‌شاپ اکانت‌ها و لایسنس‌های اورجینال را با تحویل فوری، گارانتی بازگشت وجه و پشتیبانی شبانه‌روزی در اختیار شما می‌گذارد.",
    ctaLabel: "تماس با ما",
    ctaHref: "/contact",
    videoSrc:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4",
    navLinks: [
      { label: "محصولات", href: "/products" },
      { label: "بلاگ", href: "/blog" },
    ],
    navCta: { label: "ارتباط با ما", href: "/contact" },
  },
  features: [
    {
      icon: "Zap",
      title: "تحویل فوری و خودکار",
      body: "بلافاصله پس از پرداخت، اکانت یا لایسنس از انبار برداشته و در پنل کاربری شما قرار می‌گیرد.",
    },
    {
      icon: "ShieldCheck",
      title: "گارانتی و جایگزینی",
      body: "در تمام مدت اشتراک، در صورت بروز مشکل اکانت جایگزین یا مبلغ بازگردانده می‌شود.",
    },
    {
      icon: "Headphones",
      title: "پشتیبانی ۲۴ ساعته",
      body: "تیم پشتیبانی از طریق تیکت و چت، شبانه‌روزی پاسخگوی شماست.",
    },
    {
      icon: "BadgeCheck",
      title: "محصولات اورجینال",
      body: "همهٔ اکانت‌ها از تامین‌کنندگان رسمی و معتبر تهیه می‌شوند.",
    },
  ],
  stats: [
    { value: "۴۸،۰۰