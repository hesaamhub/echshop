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

/** پوستر اختصاصی هر محصول — رنگ، طرح و عنوان مخصوص همان برند */
export default function ProductPoster({ slug, brand }: Props) {
  const key = slug.toLowerCase()
  const config = POSTERS[key] ?? { kicker: "DIGITAL ACCOUNT", motif: "grid" as Motif }
  const gradient = brandGradient(key)
  const tone = brandTone(key)
  const name = brandName(key, brand)

  return (
    <div
      className="absolute inset-0"
      style={{ background: `linear-gradient(145deg, ${gradient.from} 0%, ${gradient.to} 100%)` }}
    >
      {/* طرح گرافیکی مختص برند */}
      <span className="absolute inset-0 opacity-[0.16]" style={motifStyle(config.motif)} aria-hidden />

      {/* نشان بزرگ برند در پس‌زمینه */}
      <span
        className="pointer-events-none absolute -right-6 -bottom-8 opacity-[0.18] transition-transform duration-700 group-hover:scale-110 group-hover:opacity-25"
        aria-hidden
      >
        <BrandIcon slug={slug} size={150} color="#ffffff" />
      </span>

      {/* درخشش نور */}
      <span
        className="pointer-events-none absolute -top-10 -left-10 h-44 w-44 rounded-full bg-white/25 blur-[60px]"
        aria-hidden
      />
      {/* سایهٔ پایین برای خوانایی */}
      <span
        className="absolute inset-x-0 bottom-0 h-3/5"
        style={{ background: "linear-gradient(to top, rgba(6,8,16,0.75) 0%, transparent 100%)" }}
        aria-hidden
      />

      {/* محتوای پوستر */}
      <div className="relative flex h-full flex-col justify-between p-4">
        <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/25 bg-white/15 shadow-[0_10px_24px_-14px_rgba(0,0,0,0.8)] backdrop-blur-md">
          <BrandIcon slug={slug} size={22} color="#ffffff" />
        </span>

        <div>
          <span className="font-latin block text-[8.5px] font-bold uppercase tracking-[0.24em] text-white/70">
            {config.kicker}
          </span>
          <span
            className="font-display font-latin mt-1 block text-[27px] font-extrabold leading-none text-white drop-shadow-[0_10px_22px_rgba(0,0,0,0.5)]"
            dir="ltr"
          >
            {name}
          </span>
          <span className="mt-2 block h-[3px] w-9 rounded-full" style={{ background: tone }} />
        </div>
      </div>
    </div>
  )
}
