"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ChevronLeft, Percent, Wallet, Zap, type LucideIcon } from "lucide-react"
import { brandLogos } from "@/lib/brands"
import BrandIcon from "./BrandIcon"

/**
 * یک طرح بنر تبلیغاتی بالای سایت.
 * هر طرح رنگ‌بندی، نشان (لوگوی برند یا آیکون) و چیدمان مختص خود را دارد.
 */
export type PromoSlide = {
  id: string
  href: string
  /** کلاس پس‌زمینهٔ نوار */
  bar: string
  /** کلاس متن اصلی */
  text: string
  /** اسلاگ برند در brands.ts — لوگوی محصول ابتدای نوار */
  logoSlug?: string
  /** اگر برندی وجود ندارد: یک آیکون */
  icon?: LucideIcon
  /** کلاس کاشیٔ نشان */
  markClass?: string
  /** برچسب کوچک ابتدای نوار */
  chip?: string
  chipClass?: string
  lead: string
  /** نام لاتین محصول (با قاب مخصوص) */
  highlight?: string
  highlightClass?: string
  tail?: string
  /** پیل تأکیدی (تخفیف، کد، مهلت و …) */
  note?: string
  noteClass?: string
  cta: string
  ctaClass: string
}

/**
 * تنظیمات نوار تبلیغاتی بالای سایت.
 */
export const promoBanner = {
  enabled: true,
  intervalMs: 5200,
  slides: [
    {
      id:"spotify-off",
      href:"/products/spotify-premium",
      bar:"bg-[#0a152d]",
      text:"text-white",
      logoSlug:"spotify",
      markClass:"bg-white",
      chip:"تخفیف ویژه",
      chipClass:"bg-[#1b39f5] text-white",
      lead:"اشتراک سه‌ماههٔ",
      highlight:"Spotify Premium",
      highlightClass:"bg-white/12 text-white",
      tail:"با ۳۵٪ تخفیف",
      note:"تا پایان هفته",
      noteClass:"bg-[#D5803B] text-white",
      cta:"خرید",
      ctaClass:"text-white/85",
    },
    {
      id:"chatgpt-restock",
      href:"/products/chatgpt-plus",
      bar:"bg-[#0f2f22]",
      text:"text-white",
      logoSlug:"openai",
      markClass:"bg-white",
      chip:"موجود شد",
      chipClass:"bg-[#46A171] text-white",
      lead:"اکانت",
      highlight:"ChatGPT Plus",
      highlightClass:"bg-white/12 text-white",
      tail:"دوباره شارژ شد",
      note:"تحویل آنی",
      noteClass:"bg-white text-[#0f2f22]",
      cta:"ثبت سفارش",
      ctaClass:"text-white/85",
    },
    {
      id:"first-order-code",
      href:"/products",
      bar:"bg-[#1b39f5]",
      text:"text-white",
      icon: Percent,
      markClass:"bg-white text-[#1b39f5]",
      chip:"خرید اول",
      chipClass:"bg-white/18 text-white",
      lead:"با کد",
      highlight:"ECH20",
      highlightClass:"bg-white text-[#1b39f5]",
      tail:"۲۰٪ تخفیف اولین خریدت را بگیر",
      note:"بدون سقف مبلغ",
      noteClass:"bg-[#0a152d] text-white",
      cta:"شروع خرید",
      ctaClass:"text-white/85",
    },
    {
      id:"netflix-4k",
      href:"/products/netflix-premium",
      bar:"bg-[#FCEAE8]",
      text:"text-[#0a1b33]",
      logoSlug:"netflix",
      markClass:"bg-white shadow-[0_6px_16px_-10px_rgba(10,21,45,0.6)]",
      chip:"پرفروش‌ترین",
      chipClass:"bg-[#A8382C] text-white",
      lead:"اشتراک",
      highlight:"Netflix 4K",
      highlightClass:"bg-[#0a152d] text-white",
      tail:"از ۲۹۰ هزار تومان",
      note:"گارانتی ۳۰ روزه",
      noteClass:"bg-[#E56458] text-white",
      cta:"مشاهده",
      ctaClass:"text-[#A8382C]",
    },
    {
      id:"adobe-year",
      href:"/products/adobe-creative-cloud",
      bar:"bg-[#FBF1E2]",
      text:"text-[#0a1b33]",
      logoSlug:"adobe",
      markClass:"bg-white shadow-[0_6px_16px_-10px_rgba(10,21,45,0.6)]",
      chip:"لایسنس رسمی",
      chipClass:"bg-[#9A6321] text-white",
      lead:"لایسنس یک‌سالهٔ",
      highlight:"Adobe Creative Cloud",
      highlightClass:"bg-[#0a152d] text-white",
      tail:"روی اکانت شخصی شما",
      note:"۱۵٪ تخفیف دانشجویی",
      noteClass:"bg-[#D5803B] text-white",
      cta:"جزئیات",
      ctaClass:"text-[#9A6321]",
    },
    {
      id:"canva-pro",
      href:"/products/canva-pro",
      bar:"bg-[#E5F2FC]",
      text:"text-[#0a1b33]",
      logoSlug:"canva",
      markClass:"bg-white shadow-[0_6px_16px_-10px_rgba(27,57,245,0.6)]",
      chip:"تحویل خودکار",
      chipClass:"bg-[#1b39f5] text-white",
      lead:"اشتراک تیمیٔ",
      highlight:"Canva Pro",
      highlightClass:"bg-[#0a152d] text-white",
      tail:"موجود شد",
      note:"تحویل در کمتر از ۲ دقیقه",
      noteClass:"bg-[#1b39f5]/10 text-[#1b39f5]",
      cta:"خرید",
      ctaClass:"text-[#1b39f5]",
    },
    {
      id:"youtube-premium",
      href:"/products/youtube-premium",
      bar:"bg-[#2b1758]",
      text:"text-white",
      logoSlug:"youtube",
      markClass:"bg-white",
      chip:"پیشنهاد ماه",
      chipClass:"bg-white/18 text-white",
      lead:"سه ماه",
      highlight:"YouTube Premium",
      highlightClass:"bg-white/12 text-white",
      tail:"بدون تبلیغ، روی اکانت خودتان",
      note:"۲۵٪ تخفیف",
      noteClass:"bg-white text-[#2b1758]",
      cta:"مشاهده",
      ctaClass:"text-white/85",
    },
    {
      id:"gamepass",
      href:"/category/gaming",
      bar:"bg-[#E7F4EC]",
      text:"text-[#0a1b33]",
      logoSlug:"xbox",
      markClass:"bg-white shadow-[0_6px_16px_-10px_rgba(47,122,80,0.7)]",
      chip:"موجودی محدود",
      chipClass:"bg-[#2F7A50] text-white",
      lead:"گیفت‌کارت",
      highlight:"Xbox Game Pass",
      highlightClass:"bg-[#0a152d] text-white",
      tail:"با تحویل فوری از انبار",
      note:"فقط ۳۰ عدد",
      noteClass:"bg-[#46A171] text-white",
      cta:"خرید",
      ctaClass:"text-[#2F7A50]",
    },
    {
      id:"wallet-bonus",
      href:"/dashboard/wallet",
      bar:"bg-[#0a1b33]",
      text:"text-white",
      icon: Wallet,
      markClass:"bg-white text-[#1b39f5]",
      chip:"کیف پول",
      chipClass:"bg-[#1b39f5] text-white",
      lead:"شارژ کیف پول با ۵٪ اعتبار هدیه",
      note:"فقط تا پایان ماه",
      noteClass:"bg-[#1b39f5]/25 text-white",
      cta:"شارژ حساب",
      ctaClass:"text-white/85",
    },
    {
      id:"auto-delivery",
      href:"/about",
      bar:"bg-white",
      text:"text-[#0a1b33]",
      icon: Zap,
      markClass:"bg-[#1b39f5]/8 text-[#1b39f5]",
      chip:"تحویل خودکار",
      chipClass:"bg-[#1b39f5]/10 text-[#1b39f5]",
      lead:"تحویل خودکار سفارش در کمتر از دو دقیقه، ۲۴ ساعت شبانه‌روز",
      note:"ضمانت بازگشت وجه",
      noteClass:"bg-[#1b39f5] text-white",
      cta:"بیشتر بدانید",
      ctaClass:"text-[#1b39f5]",
    },
  ] satisfies PromoSlide[],
}

/**
 * نوار تبلیغاتی بالاترین قسمت سایت (بالای هدر).
 */
export default function PromoBanner() {
  const slides = promoBanner.slides
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!promoBanner.enabled || slides.length < 2) return

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, promoBanner.intervalMs)

    return () => clearInterval(timer)
  }, [slides.length])

  if (!promoBanner.enabled || slides.length === 0) return null

  const slide = slides[index]

  return (
    <div
      className={`sticky top-0 z-50 w-full overflow-hidden transition-colors duration-700 ${slide.bar}`}
    >
      <div className="relative mx-auto h-9 w-full max-w-[1280px] md:h-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center px-4 md:px-6"
          >
            <Link
              href={slide.href}
              className="flex items-center justify-center gap-2 text-center md:gap-3"
            >
              <SlideMark slide={slide} />

              {slide.chip ? (
                <span
                  className={`hidden shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold sm:inline-block ${slide.chipClass ?? ""}`}
                >
                  {slide.chip}
                </span>
              ) : null}

              <span className={`text-[11.5px] font-bold md:text-[12.5px] ${slide.text}`}>
                {slide.lead}
                {slide.highlight ? (
                  <span
                    dir="ltr"
                    className={`wordmark mx-1.5 inline-block rounded-md px-1.5 py-0.5 text-[10.5px] md:text-[12px] ${slide.highlightClass ?? ""}`}
                  >
                    {slide.highlight}
                  </span>
                ) : null}
                {slide.tail}
              </span>

              {slide.note ? (
                <span
                  className={`hidden shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold md:inline-block ${slide.noteClass ?? ""}`}
                >
                  {slide.note}
                </span>
              ) : null}

              <span
                className={`hidden shrink-0 items-center gap-1 text-[11px] font-bold lg:inline-flex ${slide.ctaClass}`}
              >
                {slide.cta}
                <ChevronLeft className="h-3.5 w-3.5" />
              </span>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.span
        key={`progress-${slide.id}`}
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: promoBanner.intervalMs / 1000, ease:"linear" }}
        className="absolute bottom-0 right-0 h-[2px] w-full origin-right bg-[#1b39f5]/40"
      />
    </div>
  )
}

/**
 * کاشیٔ نشان ابتدای هر طرح: لوگوی برند یا آیکون.
 */
function SlideMark({ slide }: { slide: PromoSlide }) {
  const brand = slide.logoSlug
    ? brandLogos.find((item) => item.slug === slide.logoSlug)
    : undefined

  const Icon = slide.icon
  if (!brand && !Icon) return null

  const tile =`grid h-5 w-5 shrink-0 place-items-center rounded-[7px] md:h-6 md:w-6 md:rounded-[8px] ${slide.markClass ?? "bg-white"}`

  return (
    <span className={tile} aria-hidden>
      {brand ? (
        <BrandIcon slug={brand.slug} size={12} color={`#${brand.color}`} />
      ) : Icon ? (
        <Icon className="h-3 w-3 md:h-3.5 md:w-3.5" />
      ) : null}
    </span>
  )
}
