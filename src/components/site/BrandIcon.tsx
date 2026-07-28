import type { ComponentType } from "react"
import {
  SiSpotify,
  SiOpenai,
  SiAdobe,
  SiNetflix,
  SiCanva,
  SiYoutube,
  SiDiscord,
  SiTelegram,
  SiApplemusic,
  SiSoundcloud,
  SiCrunchyroll,
  SiAnthropic,
  SiMidjourney,
  SiPerplexity,
  SiGithub,
  SiFigma,
  SiEnvato,
  SiFreepik,
  SiSteam,
  SiXbox,
  SiPlaystation,
  SiNintendo,
  SiEpicgames,
  SiMicrosoft,
  SiWindows,
  SiNordvpn,
  SiJetbrains,
  SiNotion,
  SiZoom,
  SiLinkedin,
  SiTwitch,
  SiApple,
  SiGoogle,
  SiSlack,
  SiDropbox,
  SiDuolingo,
  SiGrammarly,
  SiAutodesk,
  SiUdemy,
  SiCoursera,
  SiWetransfer,
} from "@icons-pack/react-simple-icons"

// نوع مشترک همهٔ آیکون‌های simple-icons
type SiIcon = ComponentType<{ size?: number; color?: string; className?: string }>

/**
 * نگاشت اسلاگ → کامپوننت آیکون
 * هر آیکون به‌صورت SVG داخلی بدون هیچ درخواست شبکه‌ای رندر می‌شود
 */
const ICON_MAP: Record<string, SiIcon> = {
  spotify: SiSpotify,
  openai: SiOpenai,
  adobe: SiAdobe,
  netflix: SiNetflix,
  canva: SiCanva,
  youtube: SiYoutube,
  discord: SiDiscord,
  telegram: SiTelegram,
  applemusic: SiApplemusic,
  soundcloud: SiSoundcloud,
  crunchyroll: SiCrunchyroll,
  anthropic: SiAnthropic,
  midjourney: SiMidjourney,
  perplexity: SiPerplexity,
  github: SiGithub,
  figma: SiFigma,
  envato: SiEnvato,
  freepik: SiFreepik,
  steam: SiSteam,
  xbox: SiXbox,
  playstation: SiPlaystation,
  nintendo: SiNintendo,
  epicgames: SiEpicgames,
  microsoft: SiMicrosoft,
  windows: SiWindows,
  nordvpn: SiNordvpn,
  jetbrains: SiJetbrains,
  notion: SiNotion,
  zoom: SiZoom,
  linkedin: SiLinkedin,
  twitch: SiTwitch,
  apple: SiApple,
  google: SiGoogle,
  slack: SiSlack,
  dropbox: SiDropbox,
  duolingo: SiDuolingo,
  grammarly: SiGrammarly,
  autodesk: SiAutodesk,
  udemy: SiUdemy,
  coursera: SiCoursera,
  wetransfer: SiWetransfer,
}

interface BrandIconProps {
  /** اسلاگ برند — همان مقدار product.logo یا BrandLogo.slug */
  slug: string
  /** اندازهٔ آیکون به پیکسل (پیش‌فرض ۲۴) */
  size?: number
  /** رنگ آیکون — مثلاً "#ffffff" یا "#1DB954" */
  color?: string
  className?: string
}

/**
 * آیکون SVG داخلی یک برند را بدون هیچ درخواست شبکه‌ای رندر می‌کند.
 * اگر اسلاگ در کتابخانه یافت نشد، اولین حرف نام برند نشان داده می‌شود.
 */
export default function BrandIcon({ slug, size = 24, color, className }: BrandIconProps) {
  const Icon = ICON_MAP[slug]

  if (!Icon) {
    // Fallback: اولین حرف اسلاگ
    return (
      <span
        className={className}
        aria-hidden
        style={{
          fontSize: Math.round(size * 0.55),
          fontWeight: 700,
          lineHeight: 1,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        {slug.charAt(0).toUpperCase()}
      </span>
    )
  }

  return <Icon size={size} color={color} className={className} />
}
