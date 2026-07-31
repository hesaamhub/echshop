import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import BrandIcon from "@/components/site/BrandIcon"

type Poster = {
  id: string
  kicker: string
  name: string
  accentWord: string
  note: string
  action: string
  brand: string
  href: string
  accent: string
  deep: string
  photo: string
}

const PHOTO_BASE = "https://images.pexels.com/photos"
const PHOTO_QUERY = "?auto=compress&cs=tinysrgb&w=800"

function photo(id: number) {
  return `${PHOTO_BASE}/${id}/pexels-photo-${id}.jpeg${PHOTO_QUERY}`
}

const POSTERS: Poster[] = [
  {
    id: "claude",
    kicker: "خرید اکانت هوش مصنوعی",
    name: "Claude",
    accentWord: "Code",
    note: "دستیار برنامه‌نویسی",
    action: "نوشتن کد",
    brand: "anthropic",
    href: "/products",
    accent: "#f2724a",
    deep: "#3a1409",
    photo: photo(16645676),
  },
  {
    id: "telegram-premium",
    kicker: "خرید اشتراک تلگرام",
    name: "Telegram",
    accentWord: "Premium",
    note: "بدون تبلیغ و بی‌محدودیت",
    action: "ارتقای اکانت",
    brand: "telegram",
    href: "/products",
    accent: "#2f9df4",
    deep: "#06203f",
    photo: photo(26736061),
  },
  {
    id: "gemini",
    kicker: "خرید اکانت هوش مصنوعی",
    name: "Google AI",
    accentWord: "Ultra",
    note: "Gemini · 18 ماهه",
    action: "ساخت تصویر و ویدیو",
    brand: "google",
    href: "/products",
    accent: "#7b5cf5",
    deep: "#1a0f45",
    photo: photo(16249328),
  },
  {
    id: "telegram-stars",
    kicker: "شارژ آنی و مطمئن",
    name: "Telegram",
    accentWord: "Stars",
    note: "هدیه و خرید درون‌برنامه‌ای",
    action: "شارژ استارز",
    brand: "telegram",
    href: "/products",
    accent: "#f5a524",
    deep: "#3d2504",
    photo: photo(4983368),
  },
  {
    id: "chatgpt",
    kicker: "خرید اکانت هوش مصنوعی",
    name: "ChatGPT",
    accentWord: "Plus",
    note: "دستیار هرروزه",
    action: "شروع گفت‌وگو",
    brand: "openai",
    href: "/products",
    accent: "#12b886",
    deep: "#042c22",
    photo: photo(13697160),
  },
]

/** کاشی لوگوی برند گوشهٔ بنر */
function LogoTile({ brand, size = 32 }: { brand: string; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-[10px] border border-white/15 bg-white/10 backdrop-blur-md"
      style={{ height: size, width: size }}
    >
      <BrandIcon slug={brand} size={Math.round(size * 0.55)} color="#ffffff" />
    </span>
  )
}

function PosterCard({ poster, tall = false }: { poster: Poster; tall?: boolean }) {
  return (
    <Link
      href={poster.href}
      className={`group relative flex overflow-hidden rounded-[20px] border border-white/10 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/25 ${
        tall
          ? "h-[224px] flex-col justify-between p-5 lg:h-full"
          : "h-[104px] items-center justify-between px-5"
      }`}
      style={{
        background: `linear-gradient(255deg, ${poster.deep} 0%, #0b0d1c 60%)`,
      }}
    >
      {/* کاراکتر تصویری سمت چپ بنر */}
      <span
        className={`pointer-events-none absolute inset-y-0 left-0 transition-transform duration-700 group-hover:scale-[1.06] ${
          tall ? "w-[58%]" : "w-[44%]"
        }`}
        style={{
          backgroundImage: `url(${poster.photo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: "linear-gradient(to left, transparent 0%, #000 55%)",
          WebkitMaskImage: "linear-gradient(to left, transparent 0%, #000 55%)",
        }}
        aria-hidden
      />
      {/* هالهٔ رنگی برند روی کاراکتر */}
      <span
        className="pointer-events-none absolute -left-6 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full opacity-45 blur-[44px] transition-opacity duration-500 group-hover:opacity-70"
        style={{ background: poster.accent }}
        aria-hidden
      />
      {/* بافت نقطه‌ای محو */}
      <span
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
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
        <p className="text-[10.5px] font-semibold leading-4 text-white/60">{poster.kicker}</p>
        <p
          className={`font-display font-latin mt-1 font-bold leading-tight text-white ${
            tall ? "text-[26px]" : "text-[19px]"
          }`}
          dir="ltr"
        >
          {poster.name} <span style={{ color: poster.accent }}>{poster.accentWord}</span>
        </p>
        <p className="mt-1 text-[10.5px] leading-4 text-white/50">{poster.note}</p>
      </div>

      {/* دکمهٔ مختص همان سرویس و لوگوی برند */}
      <div className={`relative flex items-center gap-2.5 ${tall ? "justify-between" : ""}`}>
        <span
          className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[11px] font-bold text-white shadow-[0_10px_22px_-14px_rgba(0,0,0,0.9)] transition-transform duration-500 group-hover:-translate-x-0.5"
          style={{ background: poster.accent }}
        >
          {poster.action}
          <ArrowLeft className="h-3 w-3" />
        </span>
        <LogoTile brand={poster.brand} size={tall ? 38 : 32} />
      </div>
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
