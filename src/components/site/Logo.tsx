"use client"

import { motion, useReducedMotion } from "motion/react"
import { LOGO_MARK_URI } from "@/lib/brandMark"
import { cn } from "@/lib/utils"

type LogoProps = {
  className?: string
  /** فعال‌بودن حرکت‌های لوگو موشن (با احترام خودکار به تنظیمات کاهش حرکت سیستم) */
  animated?: boolean
}

/**
 * لوگوموشن رسمی اچ‌شاپ — کلید سه‌بعدی آبی با حلقهٔ مداری، درخشش تنفسی،
 * عبور نور شیشه‌ای و واکنش فنری هنگام لمس و هاور.
 */
export default function Logo({ className = "h-6 w-6", animated = true }: LogoProps) {
  const prefersReduced = useReducedMotion()
  const active = animated && !prefersReduced

  return (
    <motion.span
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden rounded-[28%] select-none will-change-transform",
        className,
      )}
      whileHover={active ? { scale: 1.07, rotate: -5 } : undefined}
      whileTap={active ? { scale: 0.94 } : undefined}
      transition={{ type: "spring", stiffness: 360, damping: 22 }}
    >
      {/* هالهٔ نوری تنفسی پشت نشان */}
      {active ? (
        <motion.span
          aria-hidden
          animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.22, 0.45, 0.22] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-[8%] rounded-full bg-[#7d92ff]/55 blur-[3px]"
        />
      ) : null}

      {/* حلقهٔ ظریف مداری چرخان */}
      {active ? (
        <motion.svg
          viewBox="0 0 64 64"
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute inset-0 h-full w-full opacity-55"
        >
          <circle
            cx="32"
            cy="32"
            r="29"
            fill="none"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="1.4"
            strokeDasharray="18 12 6 12"
            strokeLinecap="round"
          />
        </motion.svg>
      ) : null}

      {/* هستهٔ تصویر سه‌بعدی کلید با حرکت شناور ملایم */}
      <motion.img
        src={LOGO_MARK_URI}
        alt="اچ‌شاپ"
        width={144}
        height={144}
        loading="eager"
        animate={active ? { y: [0, -1.5, 0], scale: [1, 1.025, 1] } : undefined}
        transition={
          active
            ? { duration: 4.2, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
        className="relative z-10 h-full w-full object-cover"
      />

      {/* عبور نور مورب شیشه‌ای روی لوگو */}
      {active ? (
        <motion.span
          aria-hidden
          initial={{ x: "-140%" }}
          animate={{ x: "230%" }}
          transition={{ duration: 1.45, repeat: Infinity, repeatDelay: 4.2, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-y-0 z-20 w-1/2 skew-x-[-22deg] bg-gradient-to-r from-transparent via-white/45 to-transparent"
        />
      ) : null}
    </motion.span>
  )
}
