"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowLeft, Headphones, ShieldCheck, Star, Zap } from "lucide-react"
import { brandLogos, type BrandLogo } from "@/lib/brands"
import { siteContent } from "@/lib/data"
import { fetchSiteSettings } from "@/lib/firebase/repository"
import Logo from "./Logo"
import BrandIcon from "./BrandIcon"
import RichTextContent from "./RichTextContent"

/** متن هیرو از منبع واحد محتوا خوانده می‌شود (قابل ویرایش در پنل مدیریت) */
const hero = siteContent.hero

const rotatingProducts = [
  "Spotify",
  "ChatGPT",
  "Netflix",
  "YouTube",
  "Discord",
  "Canva",
  "Adobe",
  "Xbox",
]

const trustItems = [
  { icon: ShieldCheck, label: "پرداخت امن" },
  { icon: Zap, label: "تحویل آنی" },
  { icon: Headphones, label: "پشتیبانی ۲۴/۷" },
]

const topRow = brandLogos.slice(0, 13)
const middleLeft = brandLogos.slice(13, 19)
const middleRight = brandLogos.slice(19, 25)
const bottomRow = brandLogos.slice(25, 38)

/** آواتارهای گرادیانی ردیف اثبات اجتماعی */
const PROOF_AVATARS = [
  "linear-gradient(140deg, #2a49ff, #1226c4)",
  "linear-gradient(140deg, #7c3aed, #4c1d95)",
  "linear-gradient(140deg, #06b6d4, #0e7490)",
  "linear-gradient(140deg, #f59e0b, #b45309)",
]

function visibilityFor(distance: number): string {
  if (distance <= 1) return "inline-flex"
  if (distance <= 2) return "hidden sm:inline-flex"
  if (distance <= 4) return "hidden md:inline-flex"
  return "hidden lg:inline-flex"
}

export default function Hero() {
  const [productIndex, setProductIndex] = useState(0)
  const [heroCopy, setHeroCopy] = useState({
    badge: hero.badge,
    headlineLead: hero.headlineLead,
    headlineTail: hero.headlineTail,
    subheadline: hero.subheadline,
  })
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const timer = setInterval(() => {
      setProductIndex((current) => (current + 1) % rotatingProducts.length)
    }, 2200)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let active = true
    fetchSiteSettings()
      .then((res) => {
        if (!active || !res.fromFirestore) return
        setHeroCopy({
          badge: res.data.heroBadge || hero.badge,
          headlineLead: res.data.heroHeadlineLead || hero.headlineLead,
          headlineTail: res.data.heroHeadlineTail || hero.headlineTail,
          subheadline: res.data.heroSubheadline || hero.subheadline,
        })
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="px-4 md:px-6 pt-1">
      <div className="relative mx-auto w-full max-w-[1280px] overflow-hidden rounded-[36px] border border-[#1b39f5]/10 bg-gradient-to-b from-[#f6f8ff] via-white to-white pt-3 pb-3 shadow-[0_40px_100px_-40px_rgba(27,57,245,0.35)] md:pt-5">
        {/* هاله‌های رنگی نرم */}
        <span
          className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[720px] -translate-x-1/2 rounded-full bg-[#1b39f5]/8 blur-3xl"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute bottom-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#1b39f5]/10 blur-3xl"
          aria-hidden
        />
        {/* بافت نقطه‌ای ظریف برای عمق دادن به بک‌دراپ */}
        <span
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage: "radial-gradient(rgba(27,57,245,0.13) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(75% 60% at 50% 30%, #000 0%, transparent 76%)",
            WebkitMaskImage: "radial-gradient(75% 60% at 50% 30%, #000 0%, transparent 76%)",
          }}
          aria-hidden
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mx-auto max-w-3xl px-6 text-center"
        >
          <DeliveryBadge label={heroCopy.badge} reduceMotion={reduceMotion ?? false} />

          <h1 className="mt-4 font-display text-[26px] md:text-[40px] font-bold leading-[1.4] tracking-tight text-[#0a1b33] lg:whitespace-nowrap">
            {heroCopy.headlineLead}{" "}
            <span className="inline-grid align-baseline text-center">
              {rotatingProducts.map((name) => (
                <span
                  key={`ghost-${name}`}
                  aria-hidden
                  className="wordmark col-start-1 row-start-1 invisible whitespace-nowrap"
                >
                  {name}
                </span>
              ))}
              <AnimatePresence initial={false}>
                <motion.span
                  key={rotatingProducts[productIndex]}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="wordmark col-start-1 row-start-1 whitespace-nowrap bg-gradient-to-l from-[#1b39f5] to-[#7d92ff] bg-clip-text text-transparent"
                >
                  {rotatingProducts[productIndex]}
                </motion.span>
              </AnimatePresence>
            </span>{" "}
            {heroCopy.headlineTail}
          </h1>

          <RichTextContent
            content={heroCopy.subheadline}
            className="mx-auto mt-4 max-w-xl text-[12.5px] md:text-[14px] font-medium leading-8 text-[#475569]"
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 flex flex-wrap items-center justify-center gap-2.5"
          >
            {hero.actions.map((action) =>
              action.primary ? (
                <Link
                  key={action.href}
                  href={action.href}
                  className="glass-solid inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[12.5px] font-semibold"
                >
                  {action.label}
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  key={action.href}
                  href={action.href}
                  className="glass-plate glass-plate-hover rounded-full px-6 py-2.5 text-[12.5px] font-semibold text-[#1b39f5]"
                >
                  {action.label}
                </Link>
              ),
            )}
          </motion.div>

          {/* اثبات اجتماعی + نشانه‌های اعتماد */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3"
          >
            <span className="flex flex-wrap items-center justify-center gap-2.5">
              <span className="flex" aria-hidden>
                {PROOF_AVATARS.map((background, index) => (
                  <span
                    key={index}
                    className="-ms-2 h-7 w-7 rounded-full border-2 border-white shadow-sm first:ms-0"
                    style={{ background }}
                  />
                ))}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="flex text-[#EAC26B]" aria-hidden>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-3.5 w-3.5 fill-[#EAC26B]" />
                  ))}
                </span>
                <span className="font-latin text-[12px] font-bold text-[#0a1b33]" dir="ltr">
                  4.9/5
                </span>
              </span>
              <span className="text-[11.5px] font-medium text-slate-500">
                از <span className="font-latin font-bold text-[#0a1b33]">48,000+</span> سفارش موفق
              </span>
            </span>

            <span className="hidden h-4 w-px bg-[#0a1b33]/10 sm:block" aria-hidden />

            {trustItems.map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-500"
              >
                <item.icon className="h-4 w-4 text-[#1b39f5]" />
                {item.label}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <div
          className="relative z-10 mt-8 px-2 pb-6 md:mt-10 md:px-6"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          <div className="flex flex-col items-center gap-2.5 sm:gap-3 md:gap-4">
            <LogoRow logos={topRow} startIndex={0} reduceMotion={reduceMotion ?? false} />

            <div className="flex w-full items-center justify-center gap-2.5 sm:gap-3 md:gap-4">
              <LogoRow
                logos={middleLeft}
                startIndex={topRow.length}
                align="end"
                reduceMotion={reduceMotion ?? false}
              />

              <motion.span
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative mx-1.5 grid h-[64px] w-[64px] shrink-0 place-items-center rounded-[22px] bg-gradient-to-br from-[#1b39f5] to-[#5b78ff] p-1.5 shadow-[0_24px_54px_-14px_rgba(27,57,245,0.75)] md:h-[80px] md:w-[80px] md:rounded-[26px] md:p-2"
              >
                <span
                  className="pointer-events-none absolute -inset-8 rounded-full bg-[#1b39f5]/25 blur-2xl"
                  aria-hidden
                />
                <span
                  className="pointer-events-none absolute inset-0 rounded-[22px] bg-gradient-to-b from-white/35 to-transparent md:rounded-[26px]"
                  aria-hidden
                />
                <Logo className="relative z-10 h-full w-full rounded-[18px] md:rounded-[20px]" />
              </motion.span>

              <LogoRow
                logos={middleRight}
                startIndex={topRow.length + middleLeft.length}
                align="start"
                reduceMotion={reduceMotion ?? false}
              />
            </div>

            <LogoRow
              logos={bottomRow}
              startIndex={topRow.length + middleLeft.length + middleRight.length}
              reduceMotion={reduceMotion ?? false}
            />
          </div>

          <p className="mt-7 text-center text-[11px] font-medium text-slate-400">
            اکانت و لایسنس رسمی برندهای معتبر جهانی
          </p>
        </div>
      </div>
    </section>
  )
}

function DeliveryBadge({ label, reduceMotion }: { label: string; reduceMotion: boolean }) {
  const pulseProps = reduceMotion
    ? {}
    : {
        animate: {
          boxShadow: [
            "0 0 0 0 rgba(70,161,113,0)",
            "0 0 22px 2px rgba(70,161,113,0.28)",
            "0 0 0 0 rgba(70,161,113,0)",
          ],
        },
        transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" as const },
      }

  return (
    <motion.span
      {...pulseProps}
      className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-[#46A171]/30 bg-[#46A171]/10 px-4 py-1.5 text-[12px] font-semibold text-[#2F7A50]"
    >
      {reduceMotion ? null : (
        <motion.span
          aria-hidden
          initial={{ x: "-160%" }}
          animate={{ x: "260%" }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-y-0 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/75 to-transparent"
        />
      )}
      <span className="relative flex h-2 w-2 items-center justify-center">
        {reduceMotion ? null : (
          <motion.span
            aria-hidden
            animate={{ scale: [1, 2.2, 1], opacity: [0.55, 0, 0.55] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute h-2 w-2 rounded-full bg-[#46A171]"
          />
        )}
        <span className="relative h-1.5 w-1.5 rounded-full bg-[#46A171]" />
      </span>
      <span className="relative">{label}</span>
    </motion.span>
  )
}

function LogoRow({
  logos,
  startIndex,
  align = "center",
  reduceMotion,
}: {
  logos: BrandLogo[]
  startIndex: number
  align?: "center" | "start" | "end"
  reduceMotion: boolean
}) {
  const middle = (logos.length - 1) / 2
  const justify =
    align === "center" ? "justify-center" : align === "start" ? "justify-start" : "justify-end"

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 md:gap-4 ${justify}`}>
      {logos.map((logo, index) => {
        const distance =
          align === "center"
            ? Math.abs(index - middle)
            : align === "start"
              ? index + 0.5
              : logos.length - index - 0.5

        return (
          <BrandTile
            key={logo.slug}
            logo={logo}
            order={startIndex + index}
            visibility={visibilityFor(distance)}
            reduceMotion={reduceMotion}
          />
        )
      })}
    </div>
  )
}

function BrandTile({
  logo,
  order,
  visibility,
  reduceMotion,
}: {
  logo: BrandLogo
  order: number
  visibility: string
  reduceMotion: boolean
}) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 + order * 0.02, ease: [0.16, 1, 0.3, 1] }}
      className={`${visibility} group h-14 w-14 shrink-0 items-center justify-center rounded-[16px] border border-[#1b39f5]/10 bg-white shadow-[0_12px_28px_-16px_rgba(27,57,245,0.6)] transition-all hover:-translate-y-1 hover:border-[#1b39f5]/30 hover:shadow-[0_18px_34px_-14px_rgba(27,57,245,0.5)] md:h-[60px] md:w-[60px] md:rounded-[18px]`}
      title={logo.name}
    >
      <motion.span
        {...(reduceMotion
          ? {}
          : {
              animate: { y: [0, -5, 0] },
              transition: {
                duration: 5 + (order % 4) * 0.6,
                repeat: Infinity,
                ease: "easeInOut" as const,
                delay: (order % 6) * 0.55,
              },
            })}
        className="grid place-items-center"
      >
        <BrandIcon
          slug={logo.slug}
          size={28}
          color={`#${logo.color}`}
          className="transition-transform duration-500 group-hover:scale-110"
        />
      </motion.span>
    </motion.span>
  )
}
