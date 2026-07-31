import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { NewArrival, NewArrivalArt } from "@/lib/newArrivals"

/** نشانهٔ اختصاصی هر محصول */
function ArtGlyph({ art, className }: { art: NewArrivalArt; className?: string }) {
  if (art === "film") {
    return (
      <svg viewBox="0 0 48 48" className={className} aria-hidden>
        <path d="M17 13l19 11-19 11z" fill="currentColor" />
      </svg>
    )
  }

  if (art === "notebook") {
    return (
      <svg viewBox="0 0 48 48" className={className} aria-hidden>
        <rect x="11" y="8" width="26" height="32" rx="6" fill="currentColor" opacity="0.3" />
        <rect x="17" y="15" width="15" height="3.4" rx="1.7" fill="currentColor" />
        <rect x="17" y="22" width="15" height="3.4" rx="1.7" fill="currentColor" />
        <rect x="17" y="29" width="9" height="3.4" rx="1.7" fill="currentColor" />
      </svg>
    )
  }

  if (art === "hex") {
    return (
      <svg viewBox="0 0 48 48" className={className} aria-hidden>
        <path d="M24 6l15.6 9v18L24 42 8.4 33V15z" fill="currentColor" opacity="0.28" />
        <path
          d="M24 6l15.6 9v18L24 42 8.4 33V15z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <text
        x="24"
        y="32"
        textAnchor="middle"
        fontSize="21"
        fontWeight="700"
        fill="currentColor"
        fontFamily="Sora, sans-serif"
      >
        K3
      </text>
    </svg>
  )
}

/** بنر تبلیغاتی تمام‌کارت: آیکون سه‌بعدی، یک جمله و دکمهٔ خرید */
export default function NewArrivalBanner({ item }: { item: NewArrival }) {
  return (
    <Link
      href={`/new/${item.slug}`}
      className="group relative flex h-[380px] flex-col justify-between overflow-hidden rounded-[26px] p-6 text-white shadow-[0_34px_70px_-40px_rgba(10,10,14,0.9)] ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-1.5"
      style={{ background: `linear-gradient(155deg, ${item.from} 0%, ${item.to} 100%)` }}
    >
      {/* هالهٔ نئون */}
      <span
        className="pointer-events-none absolute -right-14 -top-10 h-60 w-60 rounded-full blur-[70px] transition-opacity duration-700 group-hover:opacity-70"
        style={{ background: item.accent, opacity: 0.5 }}
        aria-hidden
      />
      {/* نشانهٔ محو بزرگ */}
      <span
        className="pointer-events-none absolute -bottom-12 -left-10 text-white opacity-[0.08] transition-transform duration-700 group-hover:scale-110"
        aria-hidden
      >
        <ArtGlyph art={item.art} className="h-56 w-56" />
      </span>

      {/* آیکون سه‌بعدی و برچسب */}
      <div className="relative flex items-start justify-between">
        <span
          className="relative grid h-[76px] w-[76px] place-items-center overflow-hidden rounded-[22px] transition-transform duration-500 group-hover:-translate-y-1"
          style={{
            background: `linear-gradient(160deg, ${item.accent} 0%, ${item.from} 100%)`,
            boxShadow: `0 22px 44px -16px ${item.accent}`,
          }}
        >
          <span
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(150deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.08) 45%, rgba(0,0,0,0.18) 100%)",
            }}
            aria-hidden
          />
          <ArtGlyph art={item.art} className="relative h-10 w-10 text-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)]" />
        </span>

        <span className="font-latin rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[9.5px] font-bold tracking-[0.2em] backdrop-blur-sm">
          {item.badge}
        </span>
      </div>

      {/* متن کوتاه و دکمه */}
      <div className="relative">
        <span className="font-latin text-[9.5px] font-semibold tracking-[0.24em] text-white/55">
          {item.kicker}
        </span>
        <p className="mt-2 text-[15px] font-bold leading-7 text-white/90">{item.pitch}</p>
        <h3 className="font-latin mt-1 font-display text-[30px] font-semibold leading-tight">
          {item.name}
        </h3>

        <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-[12.5px] font-bold text-[#0a1b33] shadow-[0_16px_30px_-18px_rgba(0,0,0,0.9)] transition-all duration-500 group-hover:gap-3.5">
          خرید
          <ArrowLeft className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}
