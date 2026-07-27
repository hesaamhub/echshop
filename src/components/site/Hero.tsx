"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ChevronLeft, Headphones, ShieldCheck, Zap } from "lucide-react"
import { siteContent } from "@/lib/data"

/**
 * متن‌های بخش هیرو.
 * (در مرحلهٔ بعد به دیتابیس و پنل مدیریت متصل می‌شود.)
 */
const heroCopy = {
  badge: "تحویل فوری و خودکار",
  headlineLead: "خرید مطمئن اکانت ",
  headlineBrand: "با اچ‌شاپ",
  subheadline:
    "مرجع تخصصی خرید انواع اکانت پرمیوم، اشتراک و لایسنس. تحویل فوری، گارانتی بازگشت وجه، پشتیبانی ۲۴ ساعته و درگاه پرداخت امن.",
}

/** نشانهٔ اعتماد زیر متن هیرو */
const trustItems = [
  { icon: ShieldCheck, label: "پرداخت امن", color: "text-[#46A171]" },
  { icon: Zap, label: "تحویل آنی", color: "text-[#EAC26B]" },
  { icon: Headphones, label: "پشتیبانی ۲۴/۷", color: "text-[#2783de]" },
]

/**
 * لینک‌های نوار شناور پایین هیرو.
 * سه دکمه: محصولات، پنل کاربری و ارتباط با ما (دکمهٔ آخر از navCta می‌آید).
 */
const heroNavLinks = [
  { label: "محصولات", href: "/products" },
  { label: "پنل کاربری", href: "/dashboard" },
]

/**
 * بخش هیروی صفحه اصلی — راست‌چین.
 * ویدیو تمام‌عرض و یک‌تکه است، متن در سمت راست روی قسمت آرام ویدیو
 * می‌نشیند و شیء متحرک آبی در سمت چپ دیده می‌شود.
 */
export default function Hero() {
  const { hero, brand } = siteContent

  return (
    <section className="px-4 md:px-6 pt-6">
      <div className="relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-white border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden h-[600px] flex flex-col">
        {/* لایهٔ ویدیو — تمام کادر هیرو، یک‌تکه و بدون ماسک برش‌خورده */}
        <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-left scale-105 transition-transform duration-1000"
            src={hero.videoSrc}
          />

          {/* محافظ خوانایی متن در سمت راست — ملایم، تا ویدیو پنهان نشود */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to left, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.58) 22%, rgba(255,255,255,0.26) 40%, rgba(255,255,255,0.05) 58%, rgba(255,255,255,0) 74%)",
            }}
          />
        </div>

        {/* محتوای متنی — سمت راست، روی قسمت خالی ویدیو */}
        <div className="relative z-20 flex-1 px-8 md:px-16 pt-12 md:pt-16 flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:max-w-[60%]"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/85 backdrop-blur px-4 py-1.5 text-[12px] font-semibold text-[#0a1b33] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#46A171]" />
              {heroCopy.badge}
            </span>

            {/* تیتر اصلی — در دسکتاپ حتماً یک خط */}
            <h1 className="mt-6 font-display text-[32px] md:text-[48px] font-bold tracking-tight leading-[1.25] text-[#0a1b33] md:whitespace-nowrap [text-shadow:0_1px_18px_rgba(255,255,255,0.9)]">
              {heroCopy.headlineLead}
              <span className="text-brand">{heroCopy.headlineBrand}</span>
            </h1>

            <p className="mt-6 font-sans text-[14px] md:text-[15.5px] font-medium leading-8 text-[#334155] md:max-w-[80%] [text-shadow:0_1px_10px_rgba(255,255,255,1),0_1px_24px_rgba(255,255,255,0.95)]">
              {heroCopy.subheadline}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              {trustItems.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-700"
                >
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  {item.label}
                </span>
              ))}
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

            {heroNavLinks.map((link) => (
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
