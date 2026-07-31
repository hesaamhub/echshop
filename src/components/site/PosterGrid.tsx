import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import BrandIcon from "@/components/site/BrandIcon"

type Poster = {
  id: string
  kicker: string
  name: string
  accentWord: string
  note?: string
  brand: string
  href: string
  accent: string
  deep: string
}

const POSTERS: Poster[] = [
  {
    id: "claude",
    kicker: "خرید اکانت هوش مصنوعی",
    name: "Claude",
    accentWord: "Code",
    note: "برای برنامه‌نویسی",
    brand: "anthropic",
    href: "/products",
    accent: "#f2724a",
    deep: "#3a1409",
  },
  {
    id: "telegram-premium",
    kicker: "خرید اشتراک تلگرام",
    name: "Telegram",
    accentWord: "Premium",
    note: "بدون تبلیغ، با امکانات ویژه",
    brand: "telegram",
    href: "/products",
    accent: "#2f9df4",
    deep: "#06203f",
  },
  {
    id: "gemini",
    kicker: "خرید اکانت هوش مصنوعی",
    name: "Google AI",
    accentWord: "Ultra",
    note: "Gemini · 18 ماهه",
    brand: "google",
    href: "/products",
    accent: "#7b5cf5",
    deep: "#1a0f45",
  },
  {
    id: "telegram-stars",
    kicker: "شارژ آنی و مطمئن",
    name: "Telegram",
    accentWord: "Stars",
    note: "هدیه و خرید درون‌برنامه‌ای",
    brand: "telegram",
    href: "/products",
    accent: "#f5a524",
    deep: "#3d2504",
  },
  {
    id: "chatgpt",
    kicker: "خرید اکانت هوش مصنوعی",
    name: "ChatGPT",
    accentWord: "Plus",
    note: "دستیار هرروزه",
    brand: "openai",
    href: "/products",
    accent: "#12b886",
    deep: "#042c22",
  },
]

/** کاشی لوگوی برند گوشهٔ بنر */
function LogoTile({ brand, size = 34 }: { brand: string; size?: number }) {
  return (
    <span
      className="grid place-items-center rounded-[10px] border border-white/15 bg-white/10 backdrop-blur-md"
      style={{ height: size, width: size }}
    >
      <BrandIcon slug={brand} size={size * 0.55} color="#ffffff" />
    </span>
  )
}

function PosterCard({ poster, tall = false }: { poster: Poster; tall?: boolean }) {
  return (
    <Link
      href={poster.href}
      className={`group relative flex overflow-hidden rounded-[18px] border border-white/10 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/20 ${
        tall ? "h-[172px] flex-col justify-between p-4 lg:h-full" : "h-[80px] items-center justify-between px-4"
      }`}
      style={{
        background: `linear-gradient(255deg, ${poster.deep} 0%, #0b0d1c 62%)`,
      }}
    >
      {/* درخشش رنگی سمت چپ بنر */}
      <span
        className="pointer-events-none absolute -left-8 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full opacity-45 blur-[38px] transition-opacity duration-500 group-hover:opacity-70"
        style={{ background: poster.accent }}
        aria-hidden
      />
      {/* بافت نقطه‌ای محو */}
      <span
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
          maskImage: "radial-gradient(80% 100% at 0% 50%, #000 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(80% 100% at 0% 50%, #000 0%, transparent 75%)",
        }}
        aria-hidden
      />

      {/* متن بنر */}
      <div className="relative">
        <p className="text-[10px] font-semibold leading-4 text-white/55">{poster.kicker}</p>
        <p
          className={`font-display font-latin mt-0.5 font-bold leading-tight text-white ${
            tall ? "text-[22px]" : "text-[16px]"
          }`}
          dir="ltr"
        >
          {poster.name} <span style={{ color: poster.accent }}>{poster.accentWord}</span>
        </p>
        {poster.note ? (
          <p className="mt-0.5 text-[10px] leading-4 text-white/45">{poster.note}</p>
        ) : null}
      </div>

      {/* کنش و لوگو */}
      {tall ? (
        <div className="relative flex items-end justify-between">
          <span
            className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[11px] font-bold text-white transition-transform duration-500 group-hover:-translate-x-0.5"
            style={{ background: poster.accent }}
          >
            خرید
            <ArrowLeft className="h-3 w-3" />
          </span>
          <LogoTile brand={poster.brand} size={40} />
        </div>
      ) : (
        <div className="relative flex items-center gap-2.5">
          <span
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1 text-[10.5px] font-bold text-white transition-transform duration-500 group-hover:-translate-x-0.5"
            style={{ background: poster.accent }}
          >
            خرید
            <ArrowLeft className="h-3 w-3" />
          </span>
          <LogoTile brand={poster.brand} />
        </div>
      )}
    </Link>
  )
}

export default function PosterGrid() {
  return (
    <div className="grid gap-2.5 lg:grid-cols-3">
      {/* دو بنر سمت راست */}
      <div className="grid gap-2.5">
        <PosterCard poster={POSTERS[0]} />
        <PosterCard poster={POSTERS[1]} />
      </div>

      {/* بنر میانی */}
      <PosterCard poster={POSTERS[2]} tall />

      {/* دو بنر سمت چپ */}
      <div className="grid gap-2.5">
        <PosterCard poster={POSTERS[3]} />
        <PosterCard poster={POSTERS[4]} />
      </div>
    </div>
  )
}
