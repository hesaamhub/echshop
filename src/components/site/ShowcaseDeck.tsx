"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { motion } from "motion/react"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Flame,
  Hand,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from "lucide-react"
import BrandIcon from "./BrandIcon"
import { products } from "@/lib/data"
import { num, toman } from "@/lib/utils"

/** ۶ محصول پرفروش برای معرفی در دک */
const deck = [...products].sort((a, b) => b.sold - a.sold).slice(0, 6)

const perks = [
  { icon: Zap, label: "تحویل خودکار زیر ۲ دقیقه" },
  { icon: ShieldCheck, label: "ضمانت بازگشت وجه" },
  { icon: Sparkles, label: "اکانت کاملاً اورجینال" },
]

function lowestPrice(index: number) {
  const plans = deck[index].plans
  return plans.reduce((min, plan) => (plan.price < min ? plan.price : min), plans[0].price)
}

export default function ShowcaseDeck() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = useCallback((direction: number) => {
    setIndex((current) => (current + direction + deck.length) % deck.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % deck.length)
    }, 5200)

    return () => clearInterval(timer)
  }, [paused])

  return (
    <section className="mx-auto mt-12 max-w-[1400px] px-4 md:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-3 font-display text-[22px] font-semibold text-[#0a1b33] md:text-[26px]">
            <span className="h-6 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
            اکانت‌هایی که همه می‌خواهند
          </h2>
          <p className="mt-2 text-[13px] text-slate-500">
            کارت‌ها خودبه‌خود عوض می‌شوند — یا خودتان با موس یا انگشت بکشید.
          </p>
        </div>
        <span className="glass-plate inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11.5px] font-semibold text-[#1b39f5]">
          <Hand className="h-3.5 w-3.5" />
          بکشید تا محصول بعدی
        </span>
      </div>

      <div
        className="relative h-[520px] select-none sm:h-[440px] md:h-[400px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {deck.map((product, position) => {
          const depth = (position - index + deck.length) % deck.length
          const isFront = depth === 0
          const price = lowestPrice(position)
          const perk = perks[position % perks.length]

          return (
            <motion.div
              key={product.id}
              drag={isFront ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragStart={() => setPaused(true)}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) go(1)
                else if (info.offset.x > 80) go(-1)
              }}
              animate={{
                x: depth * 22,
                y: depth * 16,
                scale: 1 - depth * 0.06,
                rotate: depth * -2.2,
                opacity: depth > 2 ? 0 : 1,
              }}
              transition={{ type: "spring", stiffness: 240, damping: 28 }}
              style={{ zIndex: deck.length - depth, pointerEvents: isFront ? "auto" : "none" }}
              className={`absolute inset-x-0 top-0 ${isFront ? "cursor-grab active:cursor-grabbing" : ""}`}
            >
              <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#0a152d] p-6 shadow-[0_40px_90px_-45px_rgba(10,21,45,0.9)] md:p-9">
                <span
                  className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full blur-3xl"
                  style={{ background: `#${product.logo === product.logo ? "1b39f5" : "1b39f5"}45` }}
                  aria-hidden
                />
                <span
                  className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#1b39f5]/20 blur-3xl"
                  aria-hidden
                />

                <div className="relative grid gap-7 md:grid-cols-[1.15fr_0.85fr] md:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      {product.badge ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E56458]/15 px-3 py-1 text-[11px] font-semibold text-[#ff9d94]">
                          <Flame className="h-3.5 w-3.5" />
                          {product.badge}
                        </span>
                      ) : null}
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1 text-[11px] font-semibold text-white/70">
                        <Star className="h-3.5 w-3.5 text-[#EAC26B]" />
                        <span className="num">{product.rating}</span>
                        <span className="text-white/40">از ۵</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#137a4b]/20 px-3 py-1 text-[11px] font-semibold text-[#7fe0ac]">
                        <perk.icon className="h-3.5 w-3.5" />
                        {perk.label}
                      </span>
                    </div>

                    <h3 className="mt-5 font-display text-[24px] font-semibold leading-[1.5] text-white md:text-[30px]">
                      {product.title}
                    </h3>

                    <p className="mt-3 max-w-xl text-[13px] leading-7 text-white/65">
                      {product.excerpt}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {product.features.slice(0, 3).map((feature) => (
                        <span
                          key={feature}
                          className="rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-[11.5px] font-medium text-white/75"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                      <div>
                        <div className="text-[11px] text-white/45">شروع قیمت از</div>
                        <div className="mt-0.5 text-[20px] font-bold text-white">
                          <span className="num">{toman(price)}</span>
                          <span className="mr-1.5 text-[12px] font-medium text-white/50">تومان</span>
                        </div>
                      </div>

                      <Link
                        href={`/products/${product.slug}`}
                        className="glass-solid inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-semibold"
                      >
                        خرید و تحویل فوری
                        <ArrowLeft className="h-4 w-4" />
                      </Link>

                      <span className="text-[11.5px] text-white/45">
                        <span className="num">{num(product.sold)}</span> فروش موفق
                      </span>
                    </div>
                  </div>

                  <div className="relative hidden aspect-[4/3] items-center justify-center overflow-hidden rounded-[28px] md:flex">
                    <span
                      className="absolute inset-0"
                      style={{ background: product.gradient }}
                      aria-hidden
                    />
                    <span
                      className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent"
                      aria-hidden
                    />
                    <motion.span
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="relative z-10 grid h-[104px] w-[104px] place-items-center rounded-[30px] bg-white/12 backdrop-blur-sm"
                    >
                      <BrandIcon slug={product.logo} size={56} color="#ffffff" />
                    </motion.span>
                    <span className="absolute bottom-4 text-[11.5px] font-semibold text-white/80">
                      {product.brand}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 md:hidden">
                    <span
                      className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl"
                      style={{ background: product.gradient }}
                    >
                      <BrandIcon slug={product.logo} size={28} color="#ffffff" />
                    </span>
                    <span className="text-[12px] font-semibold text-white/70">{product.brand}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="محصول قبلی"
          className="glass-plate glass-plate-hover grid h-10 w-10 place-items-center rounded-full text-[#1b39f5]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
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

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="محصول بعدی"
          className="glass-plate glass-plate-hover grid h-10 w-10 place-items-center rounded-full text-[#1b39f5]"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
    </section>
  )
}
