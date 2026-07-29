"use client"

import Link from "next/link"
import { useCallback, useEffect, useState, type ReactNode } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowUpRight, ChevronLeft, ChevronRight, Flame, Star, Zap } from "lucide-react"
import BrandIcon from "./BrandIcon"
import { brandLogos } from "@/lib/brands"
import { products } from "@/lib/data"
import { deliveryLabels, type Plan, type Product } from "@/lib/types"
import { num, toman } from "@/lib/utils"

/** ۶ محصول پرفروش برای معرفی در دک */
const deck = [...products].sort((a, b) => b.sold - a.sold).slice(0, 6)

/** رنگ برند برای گرافیک کارت */
function brandColor(slug: string) {
  return brandLogos.find((brand) => brand.slug === slug)?.color ?? "1b39f5"
}

function cheapestPlan(product: Product): Plan {
  return product.plans.reduce((best, plan) => (plan.price < best.price ? plan : best), product.plans[0])
}

function pad(value: number) {
  return String(value).padStart(2, "0")
}

/** قالب گرافیکی یکتا برای هر کارت */
type Variant = {
  /** پس‌زمینهٔ کل کارت */
  background: (color: string) => string
  /** لایهٔ گرافیکی پشت محتوا */
  art: (color: string) => ReactNode
  /** قالب نگهدارندهٔ لوگو */
  holder: string
  /** جبران چرخش قالب برای لوگو */
  holderInner: string
}

const VARIANTS: Variant[] = [
  // ۱) دایره‌های هم‌مرکز
  {
    background: (color) => `radial-gradient(120% 90% at 50% 8%, #${color}30 0%, #ffffff 62%)`,
    holder: "h-[112px] w-[112px] rounded-full",
    holderInner: "",
    art: (color) => (
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 300 520"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        {[52, 92, 132, 172, 212, 252].map((radius) => (
          <circle
            key={radius}
            cx="150"
            cy="250"
            r={radius}
            stroke={`#${color}`}
            strokeOpacity={0.16}
            strokeWidth={1.1}
          />
        ))}
        <circle cx="150" cy="250" r="20" fill={`#${color}`} fillOpacity={0.12} />
      </svg>
    ),
  },
  // ۲) موج‌های نرم
  {
    background: (color) => `linear-gradient(180deg, #ffffff 0%, #${color}26 100%)`,
    holder: "h-[116px] w-[116px] rounded-[38px]",
    holderInner: "",
    art: (color) => (
      <svg
        className="absolute inset-x-0 bottom-0 h-[62%] w-full"
        viewBox="0 0 300 260"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0 120C60 76 108 168 150 128C196 84 244 154 300 106V260H0V120Z"
          fill={`#${color}`}
          fillOpacity={0.14}
        />
        <path
          d="M0 166C54 130 112 206 156 168C204 128 250 190 300 152V260H0V166Z"
          fill={`#${color}`}
          fillOpacity={0.2}
        />
        <path
          d="M0 212C62 182 106 240 152 214C206 184 248 232 300 206V260H0V212Z"
          fill={`#${color}`}
          fillOpacity={0.28}
        />
      </svg>
    ),
  },
  // ۳) شبکهٔ نقطه‌ای + مربع چرخیده
  {
    background: (color) => `linear-gradient(145deg, #${color}24 0%, #ffffff 58%)`,
    holder: "h-[112px] w-[112px] rotate-12 rounded-[30px]",
    holderInner: "-rotate-12",
    art: (color) => (
      <>
        <span
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(#${color}59 1.2px, transparent 1.2px)`,
            backgroundSize: "18px 18px",
            opacity: 0.35,
            maskImage: "radial-gradient(80% 60% at 50% 45%, #000 25%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(80% 60% at 50% 45%, #000 25%, transparent 75%)",
          }}
          aria-hidden
        />
        <span
          className="absolute -bottom-16 -left-14 h-56 w-56 rotate-[18deg] rounded-[52px]"
          style={{ background: `#${color}`, opacity: 0.12 }
          }
          aria-hidden
        />
      </>
    ),
  },
  // ۴) خطوط مورب
  {
    background: (color) => `linear-gradient(200deg, #ffffff 0%, #${color}2b 100%)`,
    holder: "h-[124px] w-[104px] rounded-[999px]",
    holderInner: "",
    art: (color) => (
      <>
        <span
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(135deg, #${color}40 0px, #${color}40 1.5px, transparent 1.5px, transparent 13px)`,
            opacity: 0.5,
            maskImage: "linear-gradient(180deg, #000 0%, transparent 78%)",
            WebkitMaskImage: "linear-gradient(180deg, #000 0%, transparent 78%)",
          }}
          aria-hidden
        />
        <span
          className="absolute -top-14 -left-10 h-48 w-48 rounded-full blur-2xl"
          style={{ background: `#${color}`, opacity: 0.22 }}
          aria-hidden
        />
      </>
    ),
  },
  // ۵) هالهٔ چندرنگ (مشبک)
  {
    background: () => `linear-gradient(180deg, #f8fafc 0%, #ffffff 70%)`,
    holder: "h-[118px] w-[118px] rounded-[46px_18px_46px_18px]",
    holderInner: "",
    art: (color) => (
      <>
        <span
          className="absolute -top-10 right-2 h-52 w-52 rounded-full blur-3xl"
          style={{ background: `#${color}`, opacity: 0.35 }}
          aria-hidden
        />
        <span
          className="absolute top-24 -left-14 h-48 w-48 rounded-full bg-[#1b39f5] opacity-20 blur-3xl"
          aria-hidden
        />
        <span
          className="absolute bottom-8 right-10 h-44 w-44 rounded-full blur-3xl"
          style={{ background: `#${color}`, opacity: 0.2 }}
          aria-hidden
        />
      </>
    ),
  },
  // ۶) کمان‌های باز
  {
    background: (color) => `radial-gradient(110% 80% at 20% 100%, #${color}2e 0%, #ffffff 60%)`,
    holder: "h-[112px] w-[112px] rotate-45 rounded-[26px]",
    holderInner: "-rotate-45",
    art: (color) => (
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 300 520"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        {[110, 155, 200, 245].map((radius, layer) => (
          <path
            key={radius}
            d={`M${150 - radius} 470A${radius} ${radius} 0 0 1 ${150 + radius} 470`}
            stroke={`#${color}`}
            strokeOpacity={0.3 - layer * 0.05}
            strokeWidth={1.4}
            strokeLinecap="round"
          />
        ))}
        <circle cx="150" cy="470" r="46" fill={`#${color}`} fillOpacity={0.1} />
      </svg>
    ),
  },
]

export default function ShowcaseDeck() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(3)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const sync = () => {
      const width = window.innerWidth
      setVisible(width >= 1024 ? 3 : width >= 640 ? 2 : 1)
    }

    sync()
    window.addEventListener("resize", sync)
    return () => window.removeEventListener("resize", sync)
  }, [])

  const go = useCallback((direction: number) => {
    setIndex((current) => (current + direction + deck.length) % deck.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % deck.length)
    }, 4600)

    return () => clearInterval(timer)
  }, [paused])

  const shown = Array.from({ length: visible }, (_, offset) => {
    const position = (index + offset) % deck.length
    return { product: deck[position], position }
  })

  return (
    <section className="mx-auto mt-12 max-w-[1400px] px-4 md:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-3 font-display text-[22px] font-semibold text-[#0a1b33] md:text-[26px]">
          <span className="h-6 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
          اکانت‌هایی که همه می‌خواهند
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="محصول قبلی"
            className="glass-plate glass-plate-hover grid h-10 w-10 place-items-center rounded-full text-[#1b39f5]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="محصول بعدی"
            className="glass-plate glass-plate-hover grid h-10 w-10 place-items-center rounded-full text-[#1b39f5]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragStart={() => setPaused(true)}
        onDragEnd={(_, info) => {
          if (info.offset.x < -70) go(1)
          else if (info.offset.x > 70) go(-1)
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="flex cursor-grab select-none gap-4 active:cursor-grabbing md:gap-6"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {shown.map(({ product, position }) => {
            const color = brandColor(product.logo)
            const variant = VARIANTS[position % VARIANTS.length]
            const plan = cheapestPlan(product)

            return (
              <motion.article
                key={product.id}
                layout
                initial={{ opacity: 0, x: 70, scale: 0.93 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -70, scale: 0.93 }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className="group relative min-w-0 flex-1"
              >
                <div
                  className="relative flex h-[540px] flex-col overflow-hidden rounded-[34px] border border-white/70 p-6 shadow-[0_34px_80px_-42px_rgba(10,27,51,0.5)] transition-shadow duration-500 group-hover:shadow-[0_44px_90px_-40px_rgba(27,57,245,0.45)] md:h-[620px] md:p-7"
                  style={{ background: variant.background(color) }}
                >
                  {variant.art(color)}

                  <div className="relative flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-[20px] font-bold leading-[1.4] text-[#0a1b33] md:text-[22px]">
                        {product.brand}
                      </h3>
                      <span className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                        <Star className="h-3.5 w-3.5 text-[#EAC26B]" />
                        <span className="num">{product.rating}</span>
                        <span className="text-slate-400">از ۵</span>
                      </span>
                    </div>

                    {product.badge ? (
                      <span
                        className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-bold text-white"
                        style={{ background: `#${color}` }}
                      >
                        <Flame className="h-3 w-3" />
                        {product.badge}
                      </span>
                    ) : (
                      <span className="num shrink-0 rounded-full bg-white/70 px-2.5 py-1 text-[10.5px] font-bold text-[#0a1b33]">
                        {num(product.sold)}
                      </span>
                    )}
                  </div>

                  <p className="relative mt-3 text-[11.5px] leading-6 text-slate-500">
                    {product.excerpt}
                  </p>

                  <div className="relative flex flex-1 items-center justify-center py-4">
                    <motion.span
                      animate={{ y: [0, -12, 0] }}
                      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                      className={`grid place-items-center shadow-[0_24px_50px_-22px_rgba(10,27,51,0.55)] ${variant.holder}`}
                      style={{ background: product.gradient }}
                    >
                      <span className={`grid place-items-center ${variant.holderInner}`}>
                        <BrandIcon slug={product.logo} size={52} color="#ffffff" />
                      </span>
                    </motion.span>
                  </div>

                  <div className="relative flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#0a1b33]/10 bg-white/70 px-2.5 py-1 text-[10.5px] font-semibold text-[#0a1b33]">
                      <Zap className="h-3 w-3 text-[#1b39f5]" />
                      {deliveryLabels[plan.delivery]}
                    </span>
                    {product.features.slice(0, 1).map((feature) => (
                      <span
                        key={feature}
                        className="truncate rounded-full border border-[#0a1b33]/10 bg-white/70 px-2.5 py-1 text-[10.5px] font-semibold text-slate-600"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="relative mt-4 text-[11px] text-slate-500">شروع قیمت از</div>
                  <div className="relative mt-0.5 text-[18px] font-bold text-[#0a1b33]">
                    <span className="num">{toman(plan.price)}</span>
                    <span className="mr-1.5 text-[11.5px] font-medium text-slate-500">تومان</span>
                  </div>

                  <div className="relative mt-5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[12px] font-semibold">
                      <span className="num text-[#0a1b33]">{pad(position + 1)}</span>
                      <span className="h-px w-10 bg-[#0a1b33]/25" aria-hidden />
                      <span className="num text-slate-400">{pad(deck.length)}</span>
                    </div>

                    <Link
                      href={`/products/${product.slug}`}
                      aria-label={`خرید ${product.title}`}
                      className="grid h-12 w-12 place-items-center rounded-full bg-[#0a152d] text-white transition-transform duration-300 hover:scale-105"
                    >
                      <ArrowUpRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </AnimatePresence>
      </motion.div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {deck.map((product, position) => (
          <button
            key={product.id}
            type="button"
            onClick={() => setIndex(position)}
            aria-label={product.title}
            className={`h-2 rounded-full transition-all ${
              position === index ? "w-7 bg-[#1b39f5]" : "w-2 bg-[#1b39f5]/25 hover:bg-[#1b39f5]/50"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
