"use client"

import Link from "next/link"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { motion } from "motion/react"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import BrandIcon from "@/components/site/BrandIcon"
import { cn, num } from "@/lib/utils"

type HeroSlide = {
  id: string
  image: string
  alt: string
  brandSlug: string
  accent: string
  kicker: string
  title: string
  subtitle: string
  priceFrom: number
  cta: string
  href: string
}

/**
 * بنرهای اختصاصی محصولات منتخب — هر اسلاید مخصوص یک محصول یا خانوادهٔ محصول است
 */
const SLIDES: HeroSlide[] = [
  {
    id: "chatgpt",
    image: "/art/banners/hero-chatgpt.jpg",
    alt: "اکانت اختصاصی ChatGPT Plus با تحویل فوری",
    brandSlug: "openai",
    accent: "#10A37F",
    kicker: "ChatGPT Plus — اکانت اختصاصی",
    title: "هوش مصنوعی حرفه‌ای روی اکانت شخصی",
    subtitle: "دسترسی کامل به جدیدترین مدل‌های OpenAI، تحلیل فایل و گفت‌وگوی صوتی با تحویل فوری.",
    priceFrom: 1180000,
    cta: "خرید ChatGPT Plus",
    href: "/products/chatgpt-plus",
  },
  {
    id: "spotify",
    image: "/art/banners/hero-spotify.jpg",
    alt: "اشتراک اسپاتیفای پرمیوم روی ایمیل شخصی",
    brandSlug: "spotify",
    accent: "#1DB954",
    kicker: "Spotify Premium — ارتقای ایمیل شخصی",
    title: "موزیک بدون تبلیغ با کیفیت اصلی",
    subtitle: "فعال‌سازی امن روی اکانت خودتان بدون نیاز به رمز عبور و همراه با گارانتی کل دوره.",
    priceFrom: 285000,
    cta: "خرید Spotify Premium",
    href: "/products/spotify-premium",
  },
  {
    id: "netflix",
    image: "/art/banners/hero-netflix.jpg",
    alt: "اشتراک نتفلیکس پرمیوم با کیفیت 4K",
    brandSlug: "netflix",
    accent: "#E50914",
    kicker: "Netflix Premium 4K — پروفایل اختصاصی",
    title: "تماشای فیلم و سریال با کیفیت 4K",
    subtitle: "پروفایل اختصاصی همراه با پین شخصی، تحویل فوری از انبار و ضمانت جایگزینی.",
    priceFrom: 420000,
    cta: "خرید Netflix 4K",
    href: "/products/netflix-premium",
  },
  {
    id: "gaming",
    image: "/art/banners/hero-gaming.jpg",
    alt: "اشتراک PlayStation Plus و Xbox Game Pass",
    brandSlug: "playstation",
    accent: "#1b39f5",
    kicker: "PlayStation Plus & Xbox Game Pass",
    title: "صدها بازی روز با اشتراک رسمی کنسول",
    subtitle: "فعال‌سازی سریع پلاس، گیم‌پس آلتیمیت و گیفت‌کارت استیم با پشتیبانی شبانه‌روزی.",
    priceFrom: 690000,
    cta: "مشاهدهٔ اشتراک‌های گیمینگ",
    href: "/category/gaming",
  },
]

const INTERVAL = 5800

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
      className="group relative overflow-hidden rounded-[24px] border border-[#1b39f5]/12 bg-[#070d1f] shadow-[0_24px_60px_-44px_rgba(27,57,245,0.5)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative min-h-[256px] aspect-[4/3] sm:min-h-0 sm:aspect-[16/9] md:aspect-[10/3]">
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
                className="relative block h-full w-full"
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 1232px"
                  priority={slideIndex === 0}
                  loading={slideIndex === 0 ? undefined : "lazy"}
                  referrerPolicy="no-referrer"
                  className="object-cover object-left"
                />

                {/* گرادیان تیره از راست برای خوانایی کامل متن فارسی روی تصویر محصول */}
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-l from-[#040814]/95 via-[#040814]/72 to-[#040814]/15"
                />

                <span className="relative z-10 flex h-full w-full flex-col justify-center px-5 pt-5 pb-14 sm:px-10 sm:py-5 md:max-w-[62%] md:px-14">
                  <span className="flex items-center gap-2.5">
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-white/20 shadow-sm"
                      style={{ backgroundColor: slide.accent }}
                    >
                      <BrandIcon slug={slide.brandSlug} size={17} color="#ffffff" />
                    </span>
                    <span className="text-[11px] font-bold text-white/90 sm:text-[12px]">
                      {slide.kicker}
                    </span>
                  </span>

                  <span className="mt-2.5 block font-display text-[17px] font-extrabold leading-tight text-white sm:text-[24px] md:mt-3 md:text-[30px]">
                    {slide.title}
                  </span>

                  <span className="mt-2 hidden max-w-lg text-[12px] leading-6 text-slate-200/85 sm:block md:text-[13.5px]">
                    {slide.subtitle}
                  </span>

                  <span className="mt-3.5 flex flex-wrap items-center gap-3 sm:mt-4">
                    <span
                      className="inline-flex w-fit items-center gap-2 rounded-xl px-4 py-2 text-[11px] font-bold text-white shadow-[0_14px_28px_-12px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:-translate-x-0.5 sm:text-[12px]"
                      style={{ backgroundColor: slide.accent }}
                    >
                      {slide.cta}
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[11px] font-semibold text-white/80 sm:text-[12px]">
                      شروع از <span className="font-latin font-bold text-white">{num(slide.priceFrom)}</span> تومان
                    </span>
                  </span>
                </span>
              </Link>
            </motion.div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => go(1)}
        aria-label="بنر بعدی"
        className="absolute left-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-[#0a152d]/70 text-white opacity-0 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all hover:bg-[#1b39f5] group-hover:opacity-100"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="بنر قبلی"
        className="absolute right-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-[#0a152d]/70 text-white opacity-0 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all hover:bg-[#1b39f5] group-hover:opacity-100"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-2.5 py-2 backdrop-blur-md">
        {SLIDES.map((item, dotIndex) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setIndex(dotIndex)}
            aria-label={`بنر ${dotIndex + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              dotIndex === index ? "w-7 bg-[#7d92ff]" : "w-1.5 bg-white/35 hover:bg-white/60",
            )}
          />
        ))}
      </div>
    </div>
  )
}
