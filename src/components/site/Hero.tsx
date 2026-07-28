"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowLeft, Headphones, ShieldCheck, Zap } from "lucide-react"
import { brandLogos, logoSources, type BrandLogo } from "@/lib/brands"
import Logo from "./Logo"

/**
 * متن‌های بخش هیرو.
 * (در مرحلهٔ بعد به دیتابیس و پنل مدیریت متصل می‌شود.)
 */
const heroCopy = {
  badge: "تحویل فوری و خودکار",
  headlineLead: "خرید مطمئن اکانت",
  headlineTail: "با اچ‌شاپ",
  subheadline:
    "اکانت اورجینال و لایسنس رسمی بیش از ۴۰ برند معتبر جهانی — تحویل خودکار در کمتر از دو دقیقه، ضمانت بازگشت وجه و پشتیبانی شبانه‌روزی فارسی.",
}

/**
 * نام محصولاتی که در تیتر عوض می‌شوند.
 * همه به انگلیسی و تقریباً هم‌اندازه‌اند تا جایگاهشان در جمله پهن نشود.
 */
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

/** نشانهٔ اعتماد زیر دکمه‌ها */
const trustItems = [
  { icon: ShieldCheck, label: "پرداخت امن" },
  { icon: Zap, label: "تحویل آنی" },
  { icon: Headphones, label: "پشتیبانی ۲۴/۷" },
]

/** سه دکمهٔ زیر متن */
const heroActions = [
  { label: "مشاهدهٔ محصولات", href: "/products", primary: true },
  { label: "پنل کاربری", href: "/dashboard", primary: false },
  { label: "ارتباط با ما", href: "/contact", primary: false },
]

/** سه ردیف لوگوی برندها که لوگوی اچ‌شاپ را در بر می‌گیرند */
const topRow = brandLogos.slice(0, 13)
const middleLeft = brandLogos.slice(13, 19)
const middleRight = brandLogos.slice(19, 25)
const bottomRow = brandLogos.slice(25, 38)

/**
 * برای نمایشگرهای کوچک فقط کاشی‌های میانی هر ردیف نشان داده می‌شوند.
 * فاصلهٔ هر کاشی تا مرکز ردیف تعیین می‌کند در کدام بریک‌پوینت ظاهر شود.
 */
function visibilityFor(distance: number): string {
  if (distance <= 1) return "inline-flex"
  if (distance <= 2) return "hidden sm:inline-flex"
  if (distance <= 4) return "hidden md:inline-flex"
  return "hidden lg:inline-flex"
}

/**
 * بخش هیروی صفحه اصلی — متن وست‌چین و منظومهٔ لوگوی برندها در پایین.
 */
export default function Hero() {
  const [productIndex, setProductIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProductIndex((current) => (current + 1) % rotatingProducts.length)
    }, 2200)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="px-4 md:px-6 pt-3">
      <div className="relative mx-auto w-full max-w-[1400px] overflow-hidden rounded-[48px] border border-[#1b39f5]/10 bg-white pt-8 pb-4 shadow-[0_40px_100px_-40px_rgba(27,57,245,0.35)] md:pt-10">
        {/* هاله‌های آبی پس‌زمینه */}
        <span
          className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[720px] -translate-x-1/2 rounded-full bg-[#1b39f5]/8 blur-3xl"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute bottom-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#1b39f5]/10 blur-3xl"
          aria-hidden
        />

        {/* متن وست‌چین */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mx-auto max-w-3xl px-6 text-center"
        >
          <DeliveryBadge label={heroCopy.badge} />

          {/* تیتر اصلی — نام محصول وسط جمله مدام عوض می‌شود؛
              نام‌های نامرئی در همان خانهٔ گرید عرض جایگاه را ثابت نگه می‌دارند. */}
          <h1 className="mt-6 font-display text-[30px] md:text-[50px] font-bold leading-[1.4] tracking-tight text-[#0a1b33] md:whitespace-nowrap">
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
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={rotatingProducts[productIndex]}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="wordmark col-start-1 row-start-1 whitespace-nowrap text-[#1b39f5]"
                >
                  {rotatingProducts[productIndex]}
                </motion.span>
              </AnimatePresence>
            </span>{" "}
            {heroCopy.headlineTail}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-[13.5px] md:text-[15px] font-medium leading-8 text-[#475569]">
            {heroCopy.subheadline}
          </p>

          {/* سه دکمه */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
          >
            {heroActions.map((action) =>
              action.primary ? (
                <Link
                  key={action.href}
                  href={action.href}
                  className="glass-solid inline-flex items-center gap-2 rounded-full px-7 py-3 text-[13px] font-semibold"
                >
                  {action.label}
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  key={action.href}
                  href={action.href}
                  className="glass-plate glass-plate-hover rounded-full px-7 py-3 text-[13px] font-semibold text-[#1b39f5]"
                >
                  {action.label}
                </Link>
              ),
            )}
          </motion.div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {trustItems.map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-500"
              >
                <item.icon className="h-4 w-4 text-[#1b39f5]" />
                {item.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* منظومهٔ لوگوی برندها با لوگوی اچ‌شاپ در مرکز */}
        <div
          className="relative z-10 mt-12 px-2 pb-8 md:mt-14 md:px-6"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5">
            <LogoRow logos={topRow} startIndex={0} />

            <div className="flex w-full items-center justify-center gap-3 sm:gap-4 md:gap-5">
              <LogoRow logos={middleLeft} startIndex={topRow.length} align="end" />

              <motion.span
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative mx-1.5 grid h-[74px] w-[74px] shrink-0 place-items-center rounded-[26px] bg-gradient-to-br from-[#1b39f5] to-[#5b78ff] shadow-[0_24px_54px_-14px_rgba(27,57,245,0.75)] md:h-[94px] md:w-[94px] md:rounded-[30px]"
              >
                <span
                  className="pointer-events-none absolute -inset-8 rounded-full bg-[#1b39f5]/25 blur-2xl"
                  aria-hidden
                />
                <span
                  className="pointer-events-none absolute inset-0 rounded-[26px] bg-gradient-to-b from-white/35 to-transparent md:rounded-[30px]"
                  aria-hidden
                />
                <Logo className="relative z-10 h-10 w-10 brightness-0 invert md:h-14 md:w-14" />
              </motion.span>

              <LogoRow
                logos={middleRight}
                startIndex={topRow.length + middleLeft.length}
                align="start"
              />
            </div>

            <LogoRow
              logos={bottomRow}
              startIndex={topRow.length + middleLeft.length + middleRight.length}
            />
          </div>

          <p className="mt-9 text-center text-[11.5px] font-medium text-slate-400">
            اکانت و لایسنس رسمی برندهای معتبر جهانی
          </p>
        </div>
      </div>
    </section>
  )
}

/**
 * چیپ سبز «تحویل فوری و خودکار» با درخشش متحرک:
 * یک نوار نور از روی چیپ رد می‌شود و همزمان نقطهٔ سبز نبض می‌زند.
 */
function DeliveryBadge({ label }: { label: string }) {
  return (
    <motion.span
      animate={{
        boxShadow: [
          "0 0 0 0 rgba(70,161,113,0)",
          "0 0 22px 2px rgba(70,161,113,0.28)",
          "0 0 0 0 rgba(70,161,113,0)",
        ],
      }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-[#46A171]/30 bg-[#46A171]/10 px-4 py-1.5 text-[12px] font-semibold text-[#2F7A50]"
    >
      {/* نوار درخشش */}
      <motion.span
        aria-hidden
        initial={{ x: "-160%" }}
        animate={{ x: "260%" }}
        transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-y-0 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/75 to-transparent"
      />

      {/* نقطهٔ نبض‌دار */}
      <span className="relative flex h-2 w-2 items-center justify-center">
        <motion.span
          aria-hidden
          animate={{ scale: [1, 2.2, 1], opacity: [0.55, 0, 0.55] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute h-2 w-2 rounded-full bg-[#46A171]"
        />
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
}: {
  logos: BrandLogo[]
  startIndex: number
  align?: "center" | "start" | "end"
}) {
  const middle = (logos.length - 1) / 2
  const justify =
    align === "center" ? "justify-center" : align === "start" ? "justify-start" : "justify-end"

  return (
    <div className={`flex items-center gap-3 sm:gap-4 md:gap-5 ${justify}`}>
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
}: {
  logo: BrandLogo
  order: number
  visibility: string
}) {
  const sources = logoSources(logo)
  const [index, setIndex] = useState(0)
  const exhausted = index >= sources.length

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 + order * 0.02, ease: [0.16, 1, 0.3, 1] }}
      className={`${visibility} group h-16 w-16 shrink-0 items-center justify-center rounded-[20px] border border-[#1b39f5]/10 bg-white shadow-[0_12px_28px_-16px_rgba(27,57,245,0.6)] transition-all hover:-translate-y-1 hover:border-[#1b39f5]/30 hover:shadow-[0_18px_34px_-14px_rgba(27,57,245,0.5)] md:h-[72px] md:w-[72px] md:rounded-[22px]`}
      title={logo.name}
    >
      {exhausted ? (
        <span
          aria-label={logo.name}
          className="grid h-9 w-9 place-items-center rounded-xl text-[15px] font-bold text-white"
          style={{
            background: `linear-gradient(135deg, ${logo.gradient.from}, ${logo.gradient.to})`,
          }}
        >
          {logo.name.charAt(0)}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sources[index]}
          alt={logo.name}
          loading="lazy"
          onError={() => setIndex((value) => value + 1)}
          className="h-8 w-8 object-contain transition-transform duration-500 group-hover:scale-110 md:h-9 md:w-9"
        />
      )}
    </motion.span>
  )
}
