import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import BrandIcon from "@/components/site/BrandIcon"

type Poster = {
  id: string
  title: string
  subtitle: string
  brand: string
  href: string
  tint: string
  glow: string
  starFrom: string
  starTo: string
}

const POSTERS: Poster[] = [
  {
    id: "claude",
    title: "Claude Code",
    subtitle: "برنامه‌نویسی سریع‌تر با هوشمندترین دستیار کدنویسی",
    brand: "anthropic",
    href: "/products",
    tint: "#ffe6d8",
    glow: "#ffb794",
    starFrom: "#ffb08a",
    starTo: "#f2724a",
  },
  {
    id: "telegram-premium",
    title: "تلگرام پریمیوم",
    subtitle: "بدون تبلیغ، با سقف‌های بیشتر و امکانات ویژه",
    brand: "telegram",
    href: "/products",
    tint: "#d9ecff",
    glow: "#8ec6ff",
    starFrom: "#9fd4ff",
    starTo: "#2f9df4",
  },
  {
    id: "gemini",
    title: "Gemini · 18 ماهه",
    subtitle: "همهٔ کارهایت را با یک اشتراک بلندمدت جلو ببر",
    brand: "google",
    href: "/products",
    tint: "#e6e2ff",
    glow: "#b3a6ff",
    starFrom: "#b9c8ff",
    starTo: "#7b5cf5",
  },
  {
    id: "telegram-stars",
    title: "استارز تلگرام",
    subtitle: "شارژ آنی برای هدیه، اشتراک و خرید درون‌برنامه‌ای",
    brand: "telegram",
    href: "/products",
    tint: "#fff2cf",
    glow: "#ffd166",
    starFrom: "#ffe08a",
    starTo: "#f5a524",
  },
  {
    id: "chatgpt",
    title: "ChatGPT Plus",
    subtitle: "دستیار روزمره‌ات برای نوشتن، تحلیل و ایده‌پردازی",
    brand: "openai",
    href: "/products",
    tint: "#d6f7ec",
    glow: "#7fe3c4",
    starFrom: "#a5f0da",
    starTo: "#12b886",
  },
]

/** ستارهٔ براق سه‌بعدی‌نما */
function Star({
  from,
  to,
  size,
  className,
}: {
  from: string
  to: string
  size: number
  className?: string
}) {
  const gradientId = `star-${from.replace("#", "")}-${size}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="20" y1="0" x2="85" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="0.35" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <path
        d="M50 0C53.5 27.5 72.5 46.5 100 50C72.5 53.5 53.5 72.5 50 100C46.5 72.5 27.5 53.5 0 50C27.5 46.5 46.5 27.5 50 0Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  )
}

function PosterCard({ poster, tall = false }: { poster: Poster; tall?: boolean }) {
  return (
    <Link
      href={poster.href}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-[30px] border border-white bg-white p-6 shadow-[0_26px_60px_-42px_rgba(10,27,51,0.75)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_34px_70px_-40px_rgba(10,27,51,0.8)] ${
        tall ? "min-h-[280px] lg:min-h-full" : "min-h-[176px]"
      }`}
    >
      {/* شست‌وشوی رنگی پس‌زمینه */}
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(255deg, ${poster.tint} 0%, rgba(255,255,255,0) 62%)`,
        }}
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -left-10 -top-14 h-44 w-44 rounded-full opacity-50 blur-[46px] transition-opacity duration-500 group-hover:opacity-70"
        style={{ background: poster.glow }}
        aria-hidden
      />
      {/* بافت شطرنجی محو گوشهٔ کارت */}
      <span
        className="pointer-events-none absolute inset-y-0 right-0 w-40 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(45deg, rgba(10,27,51,0.5) 25%, transparent 25%, transparent 75%, rgba(10,27,51,0.5) 75%), linear-gradient(45deg, rgba(10,27,51,0.5) 25%, transparent 25%, transparent 75%, rgba(10,27,51,0.5) 75%)",
          backgroundSize: "12px 12px",
          backgroundPosition: "0 0, 6px 6px",
          maskImage: "radial-gradient(90% 70% at 100% 0%, #000 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(90% 70% at 100% 0%, #000 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* ستاره‌های براق */}
      <span
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-transform duration-500 group-hover:scale-105"
        aria-hidden
      >
        <span className="relative block">
          <span
            className="absolute -inset-6 rounded-full opacity-45 blur-[30px]"
            style={{ background: poster.glow }}
          />
          <Star
            from={poster.starFrom}
            to={poster.starTo}
            size={tall ? 128 : 96}
            className="relative drop-shadow-[0_14px_24px_rgba(10,27,51,0.18)]"
          />
          <Star
            from={poster.starFrom}
            to={poster.starTo}
            size={tall ? 54 : 40}
            className="absolute -top-6 right-2 drop-shadow-[0_10px_18px_rgba(10,27,51,0.16)]"
          />
        </span>
      </span>

      <div className="relative max-w-[62%]">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#0a1b33]/8 bg-white/80 px-2.5 py-1 backdrop-blur-md">
          <BrandIcon slug={poster.brand} size={14} />
        </span>
        <h3
          className={`font-display mt-3 font-extrabold leading-8 text-[#171335] ${
            tall ? "text-[24px]" : "text-[19px]"
          }`}
        >
          {poster.title}
        </h3>
        <p className="mt-1.5 text-[12.5px] leading-6 text-slate-500">{poster.subtitle}</p>
      </div>

      <span className="relative mt-5 grid h-11 w-11 place-items-center rounded-full bg-[#2b2148] text-white shadow-[0_16px_30px_-18px_rgba(43,33,72,0.95)] transition-all duration-500 group-hover:bg-[#1b39f5]">
        <ArrowLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-0.5" />
      </span>
    </Link>
  )
}

export default function PosterGrid() {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {/* دو پوستر سمت راست */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <PosterCard poster={POSTERS[0]} />
        <PosterCard poster={POSTERS[1]} />
      </div>

      {/* پوستر میانی */}
      <PosterCard poster={POSTERS[2]} tall />

      {/* دو پوستر سمت چپ */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <PosterCard poster={POSTERS[3]} />
        <PosterCard poster={POSTERS[4]} />
      </div>
    </div>
  )
}
