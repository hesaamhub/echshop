import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import type { NewArrival, NewArrivalArt } from "@/lib/newArrivals"

/** قیمت با ارقام لاتین */
function latinPrice(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}

/** شش‌ضلعی برای گرافیک هگزافیلد */
function hexPoints(cx: number, cy: number, r: number) {
  return [0, 1, 2, 3, 4, 5]
    .map((index) => {
      const angle = ((60 * index - 30) * Math.PI) / 180
      return `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`
    })
    .join(" ")
}

/** گرافیک اختصاصی هر بنر */
function BannerArt({ art }: { art: NewArrivalArt }) {
  if (art === "film") {
    return (
      <svg
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <circle cx="205" cy="100" r="76" fill="rgba(255,255,255,0.06)" />
        <circle cx="205" cy="100" r="56" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" fill="none" />
        <rect x="22" y="58" width="356" height="84" rx="16" fill="rgba(255,255,255,0.12)" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
          <rect
            key={`top-${index}`}
            x={40 + index * 42}
            y="66"
            width="16"
            height="9"
            rx="3"
            fill="rgba(255,255,255,0.32)"
          />
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
          <rect
            key={`bottom-${index}`}
            x={40 + index * 42}
            y="125"
            width="16"
            height="9"
            rx="3"
            fill="rgba(255,255,255,0.32)"
          />
        ))}
        <circle cx="205" cy="100" r="30" fill="rgba(255,255,255,0.9)" />
        <path d="M196 89 L221 100 L196 111 Z" fill="#2a1266" />
        <path
          d="M262 74 C286 84 286 116 262 126"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M280 62 C316 78 316 122 280 138"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    )
  }

  if (art === "notebook") {
    return (
      <svg
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <rect x="36" y="34" width="150" height="132" rx="18" fill="rgba(255,255,255,0.14)" />
        <rect x="36" y="34" width="14" height="132" rx="7" fill="rgba(255,255,255,0.24)" />
        {[0, 1, 2, 3, 4].map((index) => (
          <rect
            key={`line-${index}`}
            x="62"
            y={56 + index * 22}
            width={index % 2 === 0 ? 104 : 78}
            height="7"
            rx="3.5"
            fill="rgba(255,255,255,0.4)"
          />
        ))}
        <path
          d="M212 100 C244 100 244 62 276 62 M212 100 C244 100 244 138 276 138 M276 62 C308 62 308 100 340 100 M276 138 C308 138 308 100 340 100"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="212" cy="100" r="9" fill="rgba(255,255,255,0.85)" />
        <circle cx="276" cy="62" r="7" fill="rgba(255,255,255,0.65)" />
        <circle cx="276" cy="138" r="7" fill="rgba(255,255,255,0.65)" />
        <circle cx="340" cy="100" r="12" fill="rgba(255,255,255,0.9)" />
        <path
          d="M340 90 L343 97 L350 100 L343 103 L340 110 L337 103 L330 100 L337 97 Z"
          fill="#1b39f5"
        />
      </svg>
    )
  }

  if (art === "hex") {
    return (
      <svg
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2, 3, 4, 5, 6].map((col) => {
            const cx = 40 + col * 56 + (row % 2 === 1 ? 28 : 0)
            const cy = 26 + row * 50
            const strong = (row === 1 && col === 2) || (row === 2 && col === 4)

            return (
              <polygon
                key={`hex-${row}-${col}`}
                points={hexPoints(cx, cy, 26)}
                fill={strong ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.05)"}
                stroke={strong ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.22)"}
                strokeWidth="1.6"
              />
            )
          }),
        )}
        <polygon points={hexPoints(200, 100, 44)} fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
        <polygon points={hexPoints(200, 100, 24)} fill="rgba(255,255,255,0.85)" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 400 200"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      {[46, 74, 102, 130].map((radius, index) => (
        <ellipse
          key={`orbit-${radius}`}
          cx="200"
          cy="100"
          rx={radius}
          ry={radius * 0.52}
          stroke={`rgba(255,255,255,${0.4 - index * 0.08})`}
          strokeWidth="1.6"
          fill="none"
        />
      ))}
      <circle cx="200" cy="100" r="38" fill="rgba(255,255,255,0.16)" />
      <circle cx="200" cy="100" r="38" stroke="rgba(255,255,255,0.6)" strokeWidth="1.6" fill="none" />
      <circle cx="330" cy="100" r="7" fill="rgba(255,255,255,0.9)" />
      <circle cx="98" cy="78" r="5" fill="rgba(255,255,255,0.7)" />
      <circle cx="124" cy="128" r="4" fill="rgba(255,255,255,0.5)" />
      <text
        x="200"
        y="112"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="30"
        fontWeight="700"
        letterSpacing="1"
      >
        K3
      </text>
    </svg>
  )
}

export default function NewArrivalBanner({ item }: { item: NewArrival }) {
  return (
    <Link
      href={`/new/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-[26px] border border-[#1b39f5]/10 bg-white shadow-[0_20px_44px_-36px_rgba(10,21,45,0.9)] transition-all duration-500 hover:-translate-y-1 hover:border-[#1b39f5]/25 hover:shadow-[0_30px_58px_-34px_rgba(27,57,245,0.5)]"
    >
      {/* بنر تصویری */}
      <div
        className="relative h-[168px] overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${item.from} 0%, ${item.to} 100%)` }}
      >
        <BannerArt art={item.art} />

        {/* هالهٔ نور و لایهٔ تیرگی پایین */}
        <span
          className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-white/20 blur-2xl transition-transform duration-700 group-hover:scale-125"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0))" }}
          aria-hidden
        />

        {/* برچسب و دسته */}
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[10.5px] font-bold text-[#0a1b33] shadow-sm">
          <Sparkles className="h-3 w-3 text-[#1b39f5]" />
          {item.badge}
        </span>
        <span className="font-latin absolute left-3 top-3 rounded-full border border-white/40 bg-white/10 px-2.5 py-1 text-[9.5px] font-bold tracking-[0.18em] text-white backdrop-blur-sm">
          {item.kicker}
        </span>

        {/* لوگوتایپ لاتین */}
        <span className="font-latin absolute bottom-3 left-4 text-[22px] font-bold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
          {item.latinName}
        </span>
      </div>

      {/* متن کارت */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[14px] font-extrabold leading-6 text-[#0a1b33] transition-colors group-hover:text-[#1b39f5]">
          {item.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[11.5px] leading-6 text-slate-500">{item.tagline}</p>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div>
            <div className="text-[10px] text-slate-400">شروع قیمت از</div>
            <div className="font-latin text-[15px] font-bold text-[#0a1b33]" dir="ltr">
              {latinPrice(item.priceFrom)}
              <span className="mr-1 font-sans text-[10px] font-semibold text-slate-400">تومان</span>
            </div>
          </div>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0a152d] text-white transition-all duration-500 group-hover:bg-[#1b39f5]">
            <ArrowLeft className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
