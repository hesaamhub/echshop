"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import BrandIcon from "./BrandIcon"
import { brandLogos } from "@/lib/brands"
import { products } from "@/lib/data"
import { toman } from "@/lib/utils"
import type { Product } from "@/lib/types"

/** ۶ محصول پرفروش برای معرفی در دک */
const deck = [...products].sort((a, b) => b.sold - a.sold).slice(0, 6)

/** رنگ برند برای ته‌رنگ و هالهٔ کارت */
function brandColor(slug: string) {
  return brandLogos.find((brand) => brand.slug === slug)?.color ?? "1b39f5"
}

function lowestPrice(product: Product) {
  return product.plans.reduce(
    (min, plan) => (plan.price < min ? plan.price : min),
    product.plans[0].price,
  )
}

function pad(value: number) {
  return String(value).padStart(2, "0")
}

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
    }, 4200)

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

            return (
              <motion.article
                key={product.id}
                layout
                initial={{ opacity: 0, x: 70, scale: 0.93 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -70, scale: 0.93 }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className="relative min-w-0 flex-1"
              >
                <div
                  className="relative flex h-[430px] flex-col overflow-hidden rounded-[32px] border border-white/70 p-6 shadow-[0_30px_70px_-40px_rgba(10,27,51,0.45)] md:h-[470px] md:p-7"
                  style={{ background: `linear-gradient(180deg, #${color}22 0%, #ffffff 60%)` }}
                >
                  <div className="flex items-start gap-2">
                    <h3 className="font-display text-[19px] font-bold leading-[1.5] text-[#0a1b33] md:text-[21px]">
                      {product.brand}
                    </h3>
                    <Sparkles className="mt-1 h-4 w-4 shrink-0" style={{ color: `#${color}` }} />
                  </div>

                  <p className="mt-2 text-[11.5px] leading-6 text-slate-500">
                    {product.excerpt}
                  </p>

                  <div className="relative flex flex-1 items-center justify-center">
                    <span
                      className="pointer-events-none absolute h-40 w-40 rounded-full opacity-40 blur-3xl"
                      style={{ background: `#${color}` }}
                      aria-hidden
                    />
                    <motion.span
                      animate={{ y: [0, -12, 0] }}
                      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                      className="relative grid h-[104px] w-[104px] place-items-center rounded-[34px] shadow-[0_20px_45px_-20px_rgba(10,27,51,0.5)]"
                      style={{ background: product.gradient }}
                    >
                      <BrandIcon slug={product.logo} size={52} color="#ffffff" />
                    </motion.span>
                  </div>

                  <div className="text-[11px] text-slate-500">شروع قیمت از</div>
                  <div className="mt-0.5 text-[17px] font-bold text-[#0a1b33]">
                    <span className="num">{toman(lowestPrice(product))}</span>
                    <span className="mr-1.5 text-[11.5px] font-medium text-slate-500">تومان</span>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[12px] font-semibold">
                      <span className="num text-[#0a1b33]">{pad(position + 1)}</span>
                      <span className="h-px w-10 bg-[#0a1b33]/25" aria-hidden />
                      <span className="num text-slate-400">{pad(deck.length)}</span>
                    </div>

                    <Link
                      href={`/products/${product.slug}`}
                      aria-label={`خرید ${product.title}`}
                      className="grid h-12 w-12 place-items-center rounded-full bg-[#0a152d] text-white transition-transform hover:scale-105"
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
