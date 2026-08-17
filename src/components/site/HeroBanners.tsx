"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type HeroSlide = { id: string; image: string; alt: string; href: string }

/**
 * بنرهای چرخان زیر هیرو — تصویرهای نهایی در public/art قرار دارند.
 * برای تعویض بنر، فایل جدید را در public/art بگذارید و مسیرش را این‌جا بنویسید.
 */
const SLIDES: HeroSlide[] = [
  { id: "instant", image: "/art/hero-1.jpg", alt: "تحویل خودکار در کمتر از دو دقیقه", href: "/products" },
  { id: "ai", image: "/art/hero-2.jpg", alt: "ده برابر سریع‌تر با هوش مصنوعی", href: "/category/ai-tools" },
  { id: "currency", image: "/art/hero-3.jpg", alt: "پرداخت ارزی بدون کارت خارجی", href: "/category/currency-pay" },
  { id: "services", image: "/art/hero-4.jpg", alt: "همهٔ سرویس‌های دیجیتال یک‌جا", href: "/products" },
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
      className="group relative overflow-hidden rounded-[28px] border border-[#1b39f5]/10 bg-white shadow-[0_30px_70px_-48px_rgba(27,57,245,0.55)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* نسبت ۱۶۰۰×۵۶۰ تصویرهای بنر — با نگه‌داشت نسبت، متن پخته‌شده هرگز کراپ نمی‌شود */}
      <div className="relative aspect-[20/7]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Link href={slide.href} aria-label={slide.alt} className="block h-full w-full">
              <img src={slide.image} alt={slide.alt} className="h-full w-full object-cover" />
            </Link>
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
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/60 px-2.5 py-2 backdrop-blur-md">
        {SLIDES.map((item, dotIndex) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setIndex(dotIndex)}
            aria-label={`بنر ${dotIndex + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              dotIndex === index ? "w-7 bg-[#1b39f5]" : "w-1.5 bg-[#0a1b33]/20 hover:bg-[#0a1b33]/40",
            )}
          />
        ))}
      </div>
    </div>
  )
}
