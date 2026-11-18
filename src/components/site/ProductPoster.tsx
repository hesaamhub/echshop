import type { CSSProperties } from "react"
import BrandIcon from "@/components/site/BrandIcon"
import { brandLogos } from "@/lib/brands"

/** طرح گرافیکی پس‌زمینهٔ پوستر */
type Motif =
  | "waves"
  | "rings"
  | "bars"
  | "beams"
  | "rays"
  | "stripes"
  | "grid"
  | "mesh"
  | "dots"
  | "bubbles"
  | "cross"

type PosterConfig = {
  kicker: string
  motif: Motif
}

/** هر محصول طرح و عنوان مخصوص خودش را دارد */
const POSTERS: Record<string, PosterConfig> = {
  spotify: { kicker: "MUSIC STREAMING", motif: "waves" },
  applemusic: { kicker: "LOSSLESS MUSIC", motif: "rings" },
  soundcloud: { kicker: "AUDIO & PODCAST", motif: "bars" },
  netflix: { kicker: "MOVIES & SERIES", motif: "beams" },
  youtube: { kicker: "VIDEO PREMIUM", motif: "rays" },
  crunchyroll: { kicker: "ANIME", motif: "stripes" },
  twitch: { kicker: "LIVE STREAMING", motif: "grid" },
  steam: { kicker: "PC GAMES", motif: "mesh" },
  playstation: { kicker: "PLAYSTATION PLUS", motif: "rings" },
  xbox: { kicker: "GAME PASS", motif: "rays" },
  nintendo: { kicker: "NINTENDO ONLINE", motif: "dots" },
  epicgames: { kicker: "GAME STORE", motif: "grid" },
  discord: { kicker: "NITRO", motif: "bubbles" },
  openai: { kicker: "AI ASSISTANT", motif: "rings" },
  anthropic: { kicker: "AI FOR WORK", motif: "waves" },
  perplexity: { kicker: "AI SEARCH", motif: "mesh" },
  midjourney: { kicker: "AI IMAGES", motif: "rays" },
  google: { kicker: "AI & CLOUD", motif: "dots" },
  figma: { kicker: "UI DESIGN", motif: "bubbles" },
  adobe: { kicker: "CREATIVE CLOUD", motif: "stripes" },
  canva: { kicker: "GRAPHIC DESIGN", motif: "mesh" },
  envato: { kicker: "CREATIVE ASSETS", motif: "grid" },
  freepik: { kicker: "GRAPHICS LIBRARY", motif: "waves" },
  autodesk: { kicker: "3D & CAD", motif: "cross" },
  duolingo: { kicker: "LANGUAGE LEARNING", motif: "dots" },
  udemy: { kicker: "ONLINE COURSES", motif: "stripes" },
  coursera: { kicker: "UNIVERSITY COURSES", motif: "grid" },
  nordvpn: { kicker: "PRIVACY & VPN", motif: "beams" },
  notion: { kicker: "WORKSPACE", motif: "grid" },
  zoom: { kicker: "MEETINGS", motif: "rings" },
  dropbox: { kicker: "CLOUD STORAGE", motif: "cross" },
  grammarly: { kicker: "WRITING ASSISTANT", motif: "waves" },
  wetransfer: { kicker: "FILE TRANSFER", motif: "beams" },
  slack: { kicker: "TEAM CHAT", motif: "bubbles" },
  linkedin: { kicker: "CAREER NETWORK", motif: "bars" },
  microsoft: { kicker: "MICROSOFT 365", motif: "grid" },
  windows: { kicker: "WINDOWS LICENSE", motif: "grid" },
  github: { kicker: "DEVELOPERS", motif: "cross" },
  jetbrains: { kicker: "DEV TOOLS", motif: "rays" },
  apple: { kicker: "APPLE ID", motif: "mesh" },
  telegram: { kicker: "PREMIUM MESSAGING", motif: "beams" },
}

/** ساخت لایهٔ طرح بر اساس موتیف */
function motifStyle(motif: Motif): CSSProperties {
  const light = "rgba(255,255,255,0.9)"
  const soft = "rgba(255,255,255,0.5)"

  switch (motif) {
    case "waves":
      return {
        backgroundImage: `repeating-radial-gradient(circle at 15% 110%, transparent 0 16px, ${soft} 16px 17px)`,
      }
    case "rings":
      return {
        backgroundImage: `repeating-radial-gradient(circle at 78% 22%, transparent 0 13px, ${soft} 13px 14.5px)`,
      }
    case "bars":
      return {
        backgroundImage: `repeating-linear-gradient(90deg, ${soft} 0 3px, transparent 3px 15px)`,
      }
    case "beams":
      return {
        backgroundImage: `repeating-linear-gradient(115deg, ${soft} 0 2px, transparent 2px 26px)`,
      }
    case "rays":
      return {
        backgroundImage: `repeating-conic-gradient(from 200deg at 82% 18%, ${soft} 0deg 4deg, transparent 4deg 16deg)`,
      }
    case "stripes":
      return {
        backgroundImage: `repeating-linear-gradient(45deg, ${soft} 0 9px, transparent 9px 22px)`,
      }
    case "grid":
      return {
        backgroundImage: `repeating-linear-gradient(0deg, ${soft} 0 1px, transparent 1px 26px), repeating-linear-gradient(90deg, ${soft} 0 1px, transparent 1px 26px)`,
      }
    case "mesh":
      return {
        backgroundImage: `radial-gradient(circle at 20% 25%, ${light} 0%, transparent 45%), radial-gradient(circle at 85% 70%, ${light} 0%, transparent 40%)`,
      }
    case "dots":
      return {
        backgroundImage: `radial-gradient(${light} 2px, transparent 2px)`,
        backgroundSize: "20px 20px",
      }
    case "bubbles":
      return {
        backgroundImage: `radial-gradient(circle at 25% 30%, ${light} 0 22px, transparent 23px), radial-gradient(circle at 70% 65%, ${light} 0 34px, transparent 35px), radial-gradient(circle at 90% 20%, ${light} 0 14px, transparent 15px)`,
      }
    case "cross":
    default:
      return {
        backgroundImage: `repeating-linear-gradient(45deg, ${soft} 0 1.5px, transparent 1.5px 18px), repeating-linear-gradient(-45deg, ${soft} 0 1.5px, transparent 1.5px 18px)`,
      }
  }
}

export function brandTone(slug: string) {
  const brand = brandLogos.find((entry) => entry.slug === slug.toLowerCase())
  return brand ? `#${brand.color}` : "#1b39f5"
}

export function brandName(slug: string, fallback: string) {
  const brand = brandLogos.find((entry) => entry.slug === slug.toLowerCase())
  return brand ? brand.name : fallback
}

function brandGradient(slug: string) {
  const brand = brandLogos.find((entry) => entry.slug === slug.toLowerCase())
  return brand ? brand.gradient : { from: "#2a49ff", to: "#0a152d" }
}

type Props = {
  /** اسلاگ لوگوی محصول */
  slug: string
  /** نام برند برای حالت پشتیبان */
  brand: string
}

/** پوستر اختصاصی هر محصول — گرادیان برند، طرح گرافیکی یکتا، وردمارک و نشان */
export default function ProductPoster({ slug, brand }: Props) {
  const key = slug.toLowerCase()
  const config = POSTERS[key] ?? { kicker: "DIGITAL ACCOUNT", motif: "grid" as Motif }
  const gradient = brandGradient(key)
  const name = brandName(key, brand)

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: `linear-gradient(150deg, ${gradient.from} 0%, ${gradient.to} 100%)` }}
    >
      {/* طرح گرافیکی مختص برند */}
      <span className="absolute inset-0 opacity-[0.1]" style={motifStyle(config.motif)} aria-hidden />

      {/* وردمارک توخالی تکرارشونده */}
      <div
        className="pointer-events-none absolute inset-x-0 top-4 flex flex-col items-center gap-0.5 select-none"
        dir="ltr"
        aria-hidden
      >
        {[0.24, 0.14, 0.06].map((opacity, index) => (
          <span
            key={index}
            className="font-display font-latin text-[22px] leading-[0.92] font-extrabold tracking-[-0.02em] whitespace-nowrap uppercase sm:text-[30px]"
            style={{
              color: "transparent",
              WebkitTextStroke: `1.3px rgba(255,255,255,${opacity})`,
            }}
          >
            {name}
          </span>
        ))}
      </div>

      {/* درخشش نرم پشت نشان */}
      <span
        className="pointer-events-none absolute top-[28%] left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-white/30 blur-[48px]"
        aria-hidden
      />

      {/* نشان اصلی برند */}
      <span
        className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 scale-75 drop-shadow-[0_18px_32px_rgba(0,0,0,0.65)] transition-transform duration-700 group-hover:scale-[0.85] sm:scale-100 sm:group-hover:scale-110"
        aria-hidden
      >
        <BrandIcon slug={slug} size={64} color="#ffffff" />
      </span>

      {/* عنوان دسته */}
      <span
        className="font-latin absolute bottom-2.5 left-3 z-10 text-[7.5px] font-bold tracking-[0.18em] text-white/75 uppercase sm:bottom-3.5 sm:left-4 sm:text-[8.5px] sm:tracking-[0.2em]"
        dir="ltr"
      >
        {config.kicker}
      </span>

      {/* سایهٔ پایین برای کنتراست */}
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: "linear-gradient(to top, rgba(5,7,14,0.85) 0%, transparent 100%)" }}
        aria-hidden
      />
    </div>
  )
}
