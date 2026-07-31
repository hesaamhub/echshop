import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { NewArrival, NewArrivalArt } from "@/lib/newArrivals"

/** نشانهٔ اختصاصی هر محصول روی کاشی سه‌بعدی */
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

/** کاشی‌های کوچک شناور دور ایکون اصلی */
const SATELLITES = [
  { className: "-left-7 -top-4 h-11 w-11 rounded-[14px] -rotate-12", dot: "h-3.5 w-3.5 rounded-[4px]" },
  { className: "-right-8 -top-1 h-10 w-10 rounded-[13px] rotate-12", dot: "h-3 w-3 rounded-full" },
  { className: "-left-9 bottom-2 h-9 w-9 rounded-[12px] rotate-6", dot: "h-2.5 w-2.5 rounded-full" },
  { className: "-right-6 -bottom-5 h-12 w-12 rounded-[15px] -rotate-6", dot: "h-3.5 w-3.5 rounded-[5px]" },
]

/** بنر تبلیغاتی پوستری محصولات تازه‌رسیده */
export default function NewArrivalBanner({ item }: { item: NewArrival }) {
  const words = item.name.split(" ")
  const lastWord = words.length > 1 ? words[words.length - 1] : ""
  const firstWords = words.length > 1 ? words.slice(0, -1).join(" ") : item.name

  return (
    <Link
      href={`/new/${item.slug}`}
      className="group relative flex h-[380px] flex-col overflow-hidden rounded-[26px] p-5 text-white shadow-[0_30px_60px_-34px_rgba(10,16,32,0.65)] transition-transform duration-500 hover:-translate-y-1.5"
    >
      {/* زمینهٔ رنگی پوستر */}
      <span
        className="absolute inset-0"
        style={{ background: `linear-gradient(150deg, ${item.from} 0%, ${item.to} 100%)` }}
        aria-hidden
      />
      <span
        className="absolute -right-14 -top-20 h-64 w-64 rounded-full blur-[60px]"
        style={{ background: item.accent, opacity: 0.65 }}
        aria-hidden
      />
      <span
        className="absolute -left-20 top-24 h-56 w-56 rounded-full blur-[70px]"
        style={{ background: item.from, opacity: 0.85 }}
        aria-hidden
      />
      <span
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(85% 60% at 50% 26%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 62%)",
        }}
        aria-hidden
      />
      {/* درخشش متحرک */}
      <span
        className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/3 -skew-x-12 bg-white/15 blur-md transition-all duration-700 group-hover:left-[130%]"
        aria-hidden
      />

      {/* ردیف بالا */}
      <div className="relative flex items-center justify-between">
        <span
          className="font-latin rounded-md px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#0b1020]"
          style={{ background: item.accent }}
        >
          {item.badge}
        </span>
        <span className="font-latin text-[9px] font-bold uppercase tracking-[0.24em] text-white/60">
          {item.kicker}
        </span>
      </div>

      {/* صحنهٔ ایکون سه‌بعدی */}
      <div className="relative flex flex-1 items-center justify-center">
        <div className="relative">
          <span
            className="absolute inset-0 -z-10 rounded-[46px] blur-2xl"
            style={{ background: item.accent, opacity: 0.55 }}
            aria-hidden
          />

          {SATELLITES.map((satellite) => (
            <span
              key={satellite.className}
              className={`absolute grid place-items-center border border-white/50 bg-white/85 shadow-[0_12px_24px_-12px_rgba(0,0,0,0.55)] backdrop-blur-sm transition-transform duration-700 group-hover:scale-105 ${satellite.className}`}
              aria-hidden
            >
              <span className={satellite.dot} style={{ background: item.accent }} />
            </span>
          ))}

          <span
            className="relative grid h-[112px] w-[112px] place-items-center overflow-hidden rounded-[30px] transition-transform duration-500 group-hover:-translate-y-1.5"
            style={{
              background: "linear-gradient(160deg, #23252e 0%, #0c0d13 100%)",
              boxShadow: `0 26px 48px -18px ${item.accent}, inset 0 1px 0 rgba(255,255,255,0.35)`,
            }}
          >
            <span
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(155deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.04) 42%, rgba(0,0,0,0.25) 100%)",
              }}
              aria-hidden
            />
            <ArtGlyph art={item.art} className="relative h-14 w-14" />
          </span>
        </div>
      </div>

      {/* وردمارک و دکمه */}
      <div className="relative">
        <h3 className="font-latin font-display text-center text-[27px] font-semibold leading-tight" dir="ltr">
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
        <p className="mt-2 text-center text-[12.5px] font-bold leading-6 text-white/80">{item.pitch}</p>

        <span className="mt-4 flex items-center justify-center gap-2 rounded-full bg-white px-6 py-2.5 text-[12.5px] font-extrabold text-[#0b1020] transition-all duration-500 group-hover:gap-3.5">
          خرید
          <ArrowLeft className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}
