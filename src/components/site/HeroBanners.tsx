"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { B_CALC_URI } from "@/lib/art/b-calc"
import { B_COINS_URI } from "@/lib/art/b-coins"
import { B_HOURGLASS_URI } from "@/lib/art/b-hourglass"
import { B_ORB_URI } from "@/lib/art/b-orb"
import { cn } from "@/lib/utils"

type HeroSlide = {
  id: string
  kicker: string
  title: string
  subtitle: string
  cta: string
  href: string
  image: string
  tint: string
  soft: string
}

/** بنرهای چرخان زیر هیرو — تصویرهای سه‌بعدی شیشه‌ای سمت چپ، متن سمت راست */
const SLIDES: HeroSlide[] = [
  {
    id: "instant",
    kicker: "تحویل آنی و خودکار",
    title: "هر ثانیه، یک سفارش تحویل می‌شود",
    subtitle: "از پرداخت تا دریافت اکانت کمتر از دو دقیقه طول می‌کشد — بدون انتظار، بدون مکاتبه.",
    cta: "مشاهدهٔ محصولات",
    href: "/products",
    image: B_HOURGLASS_URI,
    tint: "#1b39f5",
    soft: "#e6eeff",
  },
  {
    id: "ai",
    kicker: "هوش مصنوعی",
    title: "قدرت AI، آمادهٔ کار شما",
    subtitle: "ChatGPT Plus و Claude و Midjourney با تحویل خودکار و گارانتی کامل اچ‌شاپ.",
    cta: "دستهٔ هوش مصنوعی",
    href: "/category/ai-tools",
    image: B_ORB_URI,
    tint: "#6d5cff",
    soft: "#eceaff",
  },
  {
    id: "currency",
    kicker: "پرداخت ارزی",
    title: "بدون کارت بین‌المللی، بدون مرز",
    subtitle: "هزینهٔ هر سرویس خارجی را به تومان بپردازید؛ سریع، امن و با نرخ شفاف.",
    cta: "شروع پرداخت ارزی",
    href: "/category/currency-pay",
    image: B_COINS_URI,
    tint: "#2a49ff",
    soft: "#e7f0ff",
  },
  {
    id: "services",
    kicker: "همهٔ سرویس‌ها، یک‌جا",
    title: "از اپل آیدی تا اشتراک‌های پرمیوم",
    subtitle: "بیش از ۱۲۰ محصول فعال با پشتیبانی شبانه‌روزی فارسی و ضمانت بازگشت وجه.",
    cta: "دیدن همهٔ محصولات",
    href: "/products",
    image: B_CALC_URI,
    tint: "#0d63d6",
    soft: "#e8f0fb",
  },
]

const INTERVAL = 5500

export default function HeroBanners() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = useCallback((step: number) => {
    setIndex((current) => (current + step + SLIDES.length) % SLIDES.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length)
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [paused])

  const slide = SLIDES[index]

  return (
    <div
      className="group relative overflow-hidden rounded-[36px] border border-[#1b39f5]/10 shadow-[0_30px_70px_-48px_rgba(27,57,245,0.55)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[300px] sm:h-[340px] md:h-[400px] lg:h-[440px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.015 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
            style={{
              background: `linear-gradient(120deg, ${slide.soft} 0%, #f8faff 52%, #ffffff 100%)`,
            }}
          >
            {/* هالهٔ رنگی پشت تصویر */}
            <span
              className="pointer-events-none absolute -left-16 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full opacity-40 blur-[80px]"
              style={{ background: slide.tint }}
              aria-hidden
            />

            {/* تصویر بنر — سمت چپ با محو شدن نرم به سمت متن */}
            <img
              src={slide.image}
              alt=""
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 h-full w-[54%] select-none object-cover"
              style={{
                maskImage: "linear-gradient(to left, transparent 0%, #000 42%)",
                WebkitMaskImage: "linear-gradient(to left, transparent 0%, #000 42%)",
              }}
            />

            {/* لینک کل بنر */}
            <Link href={slide.href} className="absolute inset-0" aria-label={slide.title} />

            {/* متن بنر */}
            <div className="pointer-events-none relative flex h-full flex-col items-start justify-center gap-3 px-6 md:max-w-[52%] md:px-12">
              <span
                className="rounded-full border px-3 py-1 text-[10.5px] font-bold"
                style={{
                  borderColor: `${slide.tint}33`,
                  background: `${slide.tint}14`,
                  color: slide.tint,
                }}
              >
                {slide.kicker}
              </span>
              <h3 className="font-display text-[22px] font-extrabold leading-[1.5] text-[#0a1b33] md:text-[30px] lg:text-[34px]">
                {slide.title}
              </h3>
              <p className="max-w-[440px] text-[12px] leading-6 text-slate-500 md:text-[13.5px] md:leading-7">
                {slide.subtitle}
              </p>
              <span className="glass-solid mt-1.5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-bold md:px-6 md:py-3 md:text-[13px]">
                {slide.cta}
                <ArrowLeft className="h-4 w-4" />
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* فلش بعدی (چپ در RTL) */}
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="بنر بعدی"
        className="absolute left-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-black/5 bg-white/80 text-[#0a1b33] opacity-0 shadow-[0_10px_24px_-12px_rgba(10,27,51,0.4)] backdrop-blur-md transition-all hover:bg-white group-hover:opacity-100"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {/* فلش قبلی (راست در RTL) */}
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="بنر قبلی"
        className="absolute right-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-black/5 bg-white/80 text-[#0a1b33] opacity-0 shadow-[0_10px_24px_-12px_rgba(10,27,51,0.4)] backdrop-blur-md transition-all hover:bg-white group-hover:opacity-100"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* نقطه‌های ناوبری */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
        {SLIDES.map((item, dotIndex) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setIndex(dotIndex)}
            aria-label={`بنر ${dotIndex + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              dotIndex === index
                ? "w-7 bg-[#1b39f5]"
                : "w-1.5 bg-[#0a1b33]/20 hover:bg-[#0a1b33]/40",
            )}
          />
        ))}
      </div>
    </div>
  )
}
