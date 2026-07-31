import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { NewArrival, NewArrivalArt } from "@/lib/newArrivals"

/** تصویر پس‌زمینهٔ هر بنر (استوک آزاد) */
export const ART_IMAGES: Record<NewArrivalArt, string> = {
  film: "https://images.pexels.com/photos/32634582/pexels-photo-32634582.jpeg?auto=compress&cs=tinysrgb&w=1400",
  notebook: "https://images.pexels.com/photos/29652326/pexels-photo-29652326.jpeg?auto=compress&cs=tinysrgb&w=1400",
  hex: "https://images.pexels.com/photos/28844045/pexels-photo-28844045.jpeg?auto=compress&cs=tinysrgb&w=1400",
  orbit: "https://images.pexels.com/photos/25630341/pexels-photo-25630341.jpeg?auto=compress&cs=tinysrgb&w=1400",
}

/** نشانهٔ اپلیکیشن روی کاشی سه‌بعدی گوشهٔ بنر */
function ArtGlyph({ art, className }: { art: NewArrivalArt; className?: string }) {
  if (art === "film") {
    return (
      <svg viewBox="0 0 48 48" className={className} aria-hidden>
        <path d="M18 12.5l19 11.5-19 11.5z" fill="currentColor" />
      </svg>
    )
  }

  if (art === "notebook") {
    return (
      <svg viewBox="0 0 48 48" className={className} aria-hidden>
        <rect x="16" y="13" width="17" height="4" rx="2" fill="currentColor" />
        <rect x="16" y="22" width="17" height="4" rx="2" fill="currentColor" />
        <rect x="16" y="31" width="10" height="4" rx="2" fill="currentColor" />
      </svg>
    )
  }

  if (art === "hex") {
    return (
      <svg viewBox="0 0 48 48" className={className} aria-hidden>
        <path
          d="M24 7l14.7 8.5v17L24 41 9.3 32.5v-17z"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path d="M24 18l7 4v8l-7 4-7-4v-8z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <text
        x="24"
        y="32"
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        fill="currentColor"
        fontFamily="Sora, sans-serif"
      >
        K3
      </text>
    </svg>
  )
}

/** بنر تبلیغاتی تصویری محصولات تازه‌رسیده */
export default function NewArrivalBanner({ item }: { item: NewArrival }) {
  const words = item.name.split(" ")
  const lastWord = words.length > 1 ? words[words.length - 1] : ""
  const firstWords = words.length > 1 ? words.slice(0, -1).join(" ") : item.name

  return (
    <Link
      href={`/new/${item.slug}`}
      className="group relative flex h-[380px] flex-col justify-between overflow-hidden rounded-[26px] p-5 text-white shadow-[0_30px_60px_-34px_rgba(10,16,32,0.7)] transition-transform duration-500 hover:-translate-y-1.5"
    >
      {/* تصویر بنر */}
      <span
        className="absolute inset-0 scale-105 bg-cover bg-center transition-transform duration-[900ms] group-hover:scale-110"
        style={{ backgroundImage: `url(${ART_IMAGES[item.art]})` }}
        aria-hidden
      />
      {/* لایهٔ رنگ برند برای خوانایی متن */}
      <span
        className="absolute inset-0"
        style={{ background: `linear-gradient(150deg, ${item.from}cc 0%, ${item.to}f2 100%)` }}
        aria-hidden
      />
      <span
        className="absolute inset-x-0 bottom-0 h-2/3"
        style={{ background: `linear-gradient(to top, ${item.to} 6%, rgba(0,0,0,0) 100%)` }}
        aria-hidden
      />
      <span
        className="absolute -right-16 -top-20 h-56 w-56 rounded-full blur-[70px]"
        style={{ background: item.accent, opacity: 0.5 }}
        aria-hidden
      />
      {/* درخشش متحرک */}
      <span
        className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/3 -skew-x-12 bg-white/15 blur-md transition-all duration-700 group-hover:left-[130%]"
        aria-hidden
      />

      {/* کاشی سه‌بعدی و برچسب */}
      <div className="relative flex items-start justify-between">
        <span
          className="relative grid h-[68px] w-[68px] place-items-center overflow-hidden rounded-[20px] transition-transform duration-500 group-hover:-translate-y-1"
          style={{
            background: `linear-gradient(160deg, ${item.accent} 0%, ${item.from} 100%)`,
            boxShadow: `0 20px 38px -14px ${item.accent}, inset 0 1px 0 rgba(255,255,255,0.45)`,
          }}
        >
          <span
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(155deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 45%, rgba(0,0,0,0.2) 100%)",
            }}
            aria-hidden
          />
          <ArtGlyph art={item.art} className="relative h-9 w-9 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
        </span>

        <span
          className="font-latin rounded-md px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#0b1020]"
          style={{ background: item.accent }}
        >
          {item.badge}
        </span>
      </div>

      {/* پیام کوتاه، وردمارک و دکمه */}
      <div className="relative">
        <span className="font-latin text-[9px] font-bold uppercase tracking-[0.24em] text-white/60">
          {item.kicker}
        </span>
        <p className="mt-1.5 text-[13.5px] font-bold leading-7 text-white">{item.pitch}</p>
        <h3 className="font-latin font-display mt-1 text-[28px] font-semibold leading-tight" dir="ltr">
          {firstWords}
          {lastWord ? (
            <>
              {" "}
              <span className="font-extrabold" style={{ color: item.accent }}>
                {lastWord}
              </span>
            </>
          ) : null}
        </h3>

        <span
          className="mt-4 inline-flex items-center gap-2 rounded-lg px-7 py-2.5 text-[12.5px] font-extrabold text-[#0b1020] transition-all duration-500 group-hover:gap-3.5"
          style={{ background: item.accent, boxShadow: `0 16px 30px -16px ${item.accent}` }}
        >
          خرید
          <ArrowLeft className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}
