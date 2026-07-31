import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import type { NewArrival, NewArrivalArt } from "@/lib/newArrivals"

/** مختصات شش‌ضلعی برای گرافیک هگزافیلد */
function hexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, index) => {
    const angle = (Math.PI / 180) * (60 * index - 30)
    return `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`
  }).join(" ")
}

/** گرافیک اختصاصی هر پوستر */
function BannerArt({ art }: { art: NewArrivalArt }) {
  if (art === "film") {
    return (
      <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <g opacity="0.35">
          <circle cx="320" cy="70" r="110" fill="#ffffff" opacity="0.14" />
          <circle cx="70" cy="250" r="90" fill="#ff7ad9" opacity="0.18" />
        </g>
        {/* نوار فیلم */}
        <g transform="rotate(-12 200 150)">
          <rect x="20" y="104" width="360" height="92" rx="14" fill="#ffffff" opacity="0.1" />
          <rect x="20" y="104" width="360" height="14" rx="7" fill="#ffffff" opacity="0.22" />
          <rect x="20" y="182" width="360" height="14" rx="7" fill="#ffffff" opacity="0.22" />
          {[38, 96, 154, 212, 270, 328].map((x) => (
            <g key={x}>
              <rect x={x} y="107" width="16" height="8" rx="2" fill="#0b0a2a" opacity="0.55" />
              <rect x={x} y="185" width="16" height="8" rx="2" fill="#0b0a2a" opacity="0.55" />
              <rect x={x} y="124" width="46" height="52" rx="6" fill="#ffffff" opacity="0.16" />
            </g>
          ))}
        </g>
        {/* دکمهٔ پلی */}
        <circle cx="200" cy="150" r="44" fill="#ffffff" opacity="0.92" />
        <circle cx="200" cy="150" r="56" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.45" />
        <polygon points="188,132 188,168 218,150" fill="#3a1d8f" />
        {/* موج حرکت */}
        <g fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.5">
          <path d="M282 118c16 20 16 44 0 64" />
          <path d="M304 104c26 30 26 62 0 92" opacity="0.6" />
        </g>
      </svg>
    )
  }

  if (art === "notebook") {
    return (
      <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <circle cx="330" cy="60" r="110" fill="#8ea8ff" opacity="0.2" />
        <circle cx="60" cy="260" r="90" fill="#ffffff" opacity="0.1" />
        {/* برگهٔ دفتر */}
        <g transform="rotate(-7 150 150)">
          <rect x="52" y="66" width="180" height="180" rx="18" fill="#ffffff" opacity="0.94" />
          <rect x="52" y="66" width="180" height="34" rx="18" fill="#1b39f5" opacity="0.14" />
          {[118, 140, 162, 184, 206].map((y, index) => (
            <rect
              key={y}
              x="74"
              y={y}
              width={index % 2 === 0 ? 136 : 100}
              height="8"
              rx="4"
              fill="#0a152d"
              opacity={index === 0 ? 0.35 : 0.16}
            />
          ))}
        </g>
        {/* گراف گره‌ای */}
        <g stroke="#ffffff" strokeWidth="2" opacity="0.65" fill="none">
          <path d="M268 108l46 32M268 108l30 78M314 140l-16 46M314 140l50-16" />
        </g>
        {[
          [268, 108, 9],
          [314, 140, 13],
          [298, 186, 8],
          [364, 124, 7],
        ].map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#ffffff" opacity="0.9" />
        ))}
        <path
          d="M300 214l5 13 13 5-13 5-5 13-5-13-13-5 13-5z"
          fill="#ffffff"
          opacity="0.9"
        />
      </svg>
    )
  }

  if (art === "hex") {
    const grid = [
      [120, 92],
      [200, 92],
      [280, 92],
      [80, 158],
      [160, 158],
      [240, 158],
      [320, 158],
      [120, 224],
      [200, 224],
      [280, 224],
    ]

    return (
      <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <circle cx="330" cy="250" r="110" fill="#3ff0c4" opacity="0.16" />
        <circle cx="60" cy="60" r="90" fill="#ffffff" opacity="0.1" />
        {grid.map(([cx, cy], index) => (
          <polygon
            key={`${cx}-${cy}`}
            points={hexPoints(cx, cy, 40)}
            fill="#ffffff"
            opacity={index === 4 || index === 6 ? 0.22 : 0.08}
            stroke="#ffffff"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />
        ))}
        <polygon points={hexPoints(200, 158, 52)} fill="#ffffff" opacity="0.95" />
        <polygon points={hexPoints(200, 158, 30)} fill="#0b6b5b" opacity="0.9" />
        <polygon points={hexPoints(200, 158, 16)} fill="#ffffff" opacity="0.9" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <circle cx="70" cy="70" r="100" fill="#c9a0ff" opacity="0.22" />
      <circle cx="330" cy="250" r="100" fill="#ffffff" opacity="0.1" />
      <g fill="none" stroke="#ffffff" opacity="0.55">
        <ellipse cx="200" cy="150" rx="150" ry="58" strokeWidth="1.6" />
        <ellipse cx="200" cy="150" rx="150" ry="58" strokeWidth="1.6" transform="rotate(60 200 150)" />
        <ellipse cx="200" cy="150" rx="150" ry="58" strokeWidth="1.6" transform="rotate(120 200 150)" />
      </g>
      <circle cx="200" cy="150" r="58" fill="#ffffff" opacity="0.95" />
      <text
        x="200"
        y="166"
        textAnchor="middle"
        fontSize="40"
        fontWeight="700"
        fill="#7b2ff7"
        fontFamily="Sora, sans-serif"
      >
        K3
      </text>
      {[
        [350, 150],
        [125, 92],
        [275, 208],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="8" fill="#ffffff" opacity="0.9" />
      ))}
    </svg>
  )
}

/** پوستر تبلیغاتی تمام‌کارت محصول تازه‌رسیده (بدون قیمت) */
export default function NewArrivalBanner({ item }: { item: NewArrival }) {
  return (
    <Link
      href={`/new/${item.slug}`}
      className="group relative flex h-[440px] flex-col overflow-hidden rounded-[30px] text-white shadow-[0_34px_70px_-40px_rgba(10,21,45,0.85)] transition-all duration-500 hover:-translate-y-1.5"
      style={{ background: `linear-gradient(150deg, ${item.from} 0%, ${item.to} 100%)` }}
    >
      {/* گرافیک پوستر */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[300px] opacity-90 transition-transform duration-700 group-hover:scale-[1.06]">
        <BannerArt art={item.art} />
      </div>

      {/* بافت و نورپردازی چاپی */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 70% at 15% 0%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 55%), linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 38%, rgba(0,0,0,0) 68%)",
        }}
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -left-24 top-0 h-[520px] w-24 rotate-[18deg] bg-white/10 blur-[2px] transition-all duration-700 group-hover:left-[120%]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-0 rounded-[30px] border border-white/20"
        aria-hidden
      />

      {/* سربرگ پوستر */}
      <div className="relative flex items-start justify-between p-5">
        <span className="font-latin rounded-full border border-white/30 bg-black/25 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] backdrop-blur-sm">
          {item.kicker}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[10.5px] font-bold text-[#0a1b33] shadow-[0_10px_24px_-16px_rgba(0,0,0,0.9)]">
          <Sparkles className="h-3 w-3" />
          {item.badge}
        </span>
      </div>

      {/* متن تبلیغاتی پایین پوستر */}
      <div className="relative mt-auto p-5">
        <div className="font-latin wordmark text-[13px] font-semibold uppercase tracking-[0.22em] text-white/70">
          {item.latinName}
        </div>
        <h3 className="mt-1.5 font-display text-[22px] font-semibold leading-8">{item.name}</h3>
        <p className="mt-2 text-[12.5px] font-medium leading-6 text-white/85">{item.pitch}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.uses.map((use) => (
            <span
              key={use}
              className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[10.5px] font-semibold text-white/90 backdrop-blur-sm"
            >
              {use}
            </span>
          ))}
        </div>

        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[12px] font-bold text-[#0a1b33] transition-all duration-500 group-hover:gap-3">
          بیشتر بدانید
          <ArrowLeft className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}
