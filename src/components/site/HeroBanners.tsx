"use client"

import Link from "next/link"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { motion } from "motion/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type HeroSlide = { id: string; image: string; alt: string; href: string }

/**
 * بنرهای چرخان زیر هیرو — تصویرهای نهایی در public/art قرار دارند.
 * برای تعویض بنر، فایل جدید را در public/art بگذارید و مسیرش را این‌جا بنویسید.
 */
const SLIDES: HeroSlide[] = [
  { id: "instant", image: "/art/hero-1.jpg", alt: "سفارش‌ات قبل از قهوه‌ات می‌رسد — تحویل خودکار", href: "/products" },
  { id: "ai", image: "/art/hero-2.jpg", alt: "هوش مصنوعی، برای همه — ChatGPT و ابزارهای برتر", href: "/category/ai-tools" },
  { id: "stream", image: "/art/hero-3.jpg", alt: "شبِ فیلم و موسیقیه — Netflix و Spotify با گارانتی", href: "/category/stream" },
  { id: "trust", image: "/art/hero-4.jpg", alt: "رسمی، ارزان‌تر، با گارانتی — ضمانت بازگشت وجه", href: "/products" },
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

  return (
    <div
      className="group relative overflow-hidden rounded-[24px] border border-[#1b39f5]/10 bg-white shadow-[0_24px_60px_-44px_rgba(27,57,245,0.5)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* نسبت کوتاه‌تر از قبل: موبایل ۱۶:۹، دسکتاپ ۱۰:۳ — با next/image برای لود بهینه */}
      <div className="relative aspect-[16/9] md:aspect-[10/3]">
        {/* همهٔ اسلایدها سوار بر هم؛ کراس‌فید نرم بدون خلأ بین تعویض */}
        {SLIDES.map((slide, slideIndex) => {
          const active = slideIndex === index

          return (
            <motion.div
              key={slide.id}
              initial={false}
              animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 1.02 }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-0"
              style={{ pointerEvents: active ? "auto" : "none" }}
              aria-hidden={!active}
            >
              <Link
                href={slide.href}
                aria-label={slide.alt}
                tabIndex={active ? 0 : -1}
                className="block h-full w-full"
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 1232px"
                  priority={slideIndex === 0}
                  loading={slideIndex === 0 ? undefined : "lazy"}
                  className="object-cover"
                />
              </Link>
            </motion.div>
          )
        })}
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
      <div className="absolute bottom-3.5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/60 px-2.5 py-2 backdrop-blur-md">
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
