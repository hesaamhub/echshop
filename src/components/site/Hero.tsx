"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ChevronLeft } from "lucide-react"
import { siteContent } from "@/lib/data"

/**
 * بخش هیروی صفحه اصلی — نسخهٔ راست‌چین.
 * متن در سمت راست و ویدیوی پس‌زمینه در سمت چپ قرار می‌گیرد.
 */
export default function Hero() {
  const { hero, brand } = siteContent

  return (
    <section className="px-4 md:px-6 pt-6">
      <div className="relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-white border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden h-[600px] flex flex-col">
        {/* لایهٔ ویدیو — سمت چپ */}
        <div className="absolute inset-y-0 left-0 w-full md:w-[56%] pointer-events-none z-0 overflow-hidden select-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105 transition-transform duration-1000"
            style={{
              maskImage:
                "linear-gradient(to left, transparent 0%, black 34%, black 100%)",
              WebkitMaskImage:
                "linear-gradient(to left, transparent 0%, black 34%, black 100%)",
            }}
            src={hero.videoSrc}
          />
        </div>

        {/* محتوای متنی — سمت راست */}
        <div className="relative z-20 flex-1 px-8 md:px-16 pt-12 md:pt-16 flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:max-w-[46%]"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 backdrop-blur px-4 py-1.5 text-[12px] font-semibold text-[#0a1b33] shadow-sm">
              <span className="text-brand">{brand.logoMark}</span>
              {brand.nameFa} — {brand.tagline}
            </span>

            <h1 className="mt-6 font-display text-[42px] md:text-[56px] font-medium tracking-tight leading-[1.15] text-[#0a1b33]">
              {hero.headlineTop}
              <br />
              {hero.headlineBottom}
            </h1>

            <p className="mt-6 font-sans text-[14px] md:text-[15px] leading-8 text-[#64748b]">
              {hero.subheadline}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={hero.ctaHref}
                  className="inline-flex items-center gap-2 bg-[#0a152d] text-white px-7 py-3 rounded-full text-[13px] font-semibold shadow-[0_10px_30px_rgba(10,21,45,0.22)]"
                >
                  {hero.ctaLabel}
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-white px-7 py-3 rounded-full text-[13px] font-semibold text-[#0a1b33] border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all"
                >
                  مشاهدهٔ محصولات
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* نوار شناور پایین */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30">
          <motion.nav
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-1 bg-white/90 backdrop-blur-2xl px-1.5 py-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-slate-200/40"
          >
            <Link
              href="/"
              aria-label={brand.nameFa}
              className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-white border border-slate-100 shadow-sm text-[#0a1b33]"
            >
              {brand.logoMark}
            </Link>

            {hero.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-[12px] font-semibold text-slate-500 hover:text-[#0a1b33] transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href={hero.navCta.href}
              className="inline-flex items-center gap-1 bg-white px-5 py-2 rounded-full text-[12px] font-semibold text-[#0a1b33] border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all"
            >
              {hero.navCta.label}
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          </motion.nav>
        </div>
      </div>
    </section>
  )
}
