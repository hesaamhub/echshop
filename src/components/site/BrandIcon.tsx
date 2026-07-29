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
  SiPerplexity,
  SiGithub,
  SiFigma,
  SiEnvato,
  SiFreepik,
  SiSteam,
  SiPlaystation,
  SiEpicgames,
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
 * نگاشت اسلاگ → کامپوننت آیکون simple-icons
 * فقط برندهایی که واقعاً در پکیج موجودند اینجا هستند
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
  perplexity: SiPerplexity,
  github: SiGithub,
  figma: SiFigma,
  envato: SiEnvato,
  freepik: SiFreepik,
  steam: SiSteam,
  playstation: SiPlaystation,
  epicgames: SiEpicgames,
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

type CustomIcon = {
  viewBox: string
  paths: string[]
  /** آیکون‌های خطی با stroke رندر می‌شوند نه fill */
  stroke?: boolean
  strokeWidth?: number
}

/**
 * برندهایی که simple-icons آن‌ها را ندارد (به دلایل حقوقی حذف شده‌اند)
 * مسیرهای SVG اینجا به‌صورت داخلی ذخیره شده‌اند — بدون هیچ درخواست شبکه‌ای
 */
const CUSTOM_ICONS: Record<string, CustomIcon> = {
  windows: {
    viewBox: "0 0 448 512",
    paths: [
      "M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z",
    ],
  },
  microsoft: {
    viewBox: "0 0 448 512",
    paths: [
      "M0 32h214.6v214.6H0V32zm233.4 0H448v214.6H233.4V32zM0 265.4h214.6V480H0V265.4zm233.4 0H448V480H233.4V265.4z",
    ],
  },
  xbox: {
    viewBox: "0 0 512 512",
    paths: [
      "M369.9 318.2c44.3 54.3 64.7 98.8 54.4 118.7-7.9 15.1-56.7 44.6-92.6 55.9-29.6 9.3-68.4 13.3-100.4 10.2-38.2-3.7-76.9-17.4-110.1-39C93.3 445.8 87 438.3 87 423.4c0-29.9 32.9-82.3 89.2-142.1 32-33.9 76.5-73.7 81.4-72.6 9.4 2.1 84.3 75.1 112.3 109.5zM188.6 143.8c-29.7-26.9-58.1-53.9-86.4-63.4-15.2-5.1-16.3-4.8-28.7 8.1-29.2 30.4-53.5 79.7-60.3 122.4-5.4 34.2-6.1 43.8-4.2 60.5 5.6 50.5 17.3 85.4 40.5 120.9 9.5 14.6 12.1 17.3 9.3 9.9-4.2-11-.3-37.5 9.5-64 14.3-39 53.9-112.9 120.3-194.4zm311.6 63.5C483.3 127.3 432.7 77 425.6 77c-7.3 0-24.2 6.5-36 13.9-23.3 14.5-41 31.4-64.3 52.8C367.7 197 427.5 283.1 448.2 346c6.8 20.7 9.7 41.1 7.4 52.3-1.7 8.5-1.7 8.5 1.4 4.6 6.1-7.7 19.9-31.3 25.4-43.5 7.4-16.2 15-40.2 18.6-58.7 4.3-22.5 3.9-70.8-.8-93.4zM141.3 43C189 40.5 251 77.5 255.6 78.4c.7.1 10.4-4.2 21.6-9.7 63.9-31.1 94-25.8 107.4-25.2-63.9-39.3-152.7-50-233.9-11.7-23.4 11.1-24 11.9-9.4 11.2z",
    ],
  },
  nintendo: {
    viewBox: "0 0 448 512",
    paths: [
      "M95.9 33.5c-44.6 8-80.5 41-91.8 84.4C0 133.6-.3 142.8.2 264.4.4 376 .5 378.6 2.4 387.3c10.3 46.5 43.3 79.6 90.3 90.5 6.1 1.4 13.9 1.7 64.1 1.9 51.9.4 57.3.3 58.7-1.1 1.4-1.4 1.5-19.3 1.5-222.2 0-150.5-.3-221.3-.9-222.6-.9-1.7-2.5-1.8-56.9-1.7-44.2.1-57.5.4-63.3 1.4zm83.9 222.6V444l-37.8-.5c-34.8-.4-38.5-.6-45.5-2.3-29.9-7.7-52-30.7-58.3-60.7-2-9.4-2-240.1-.1-249.3 5.6-26.1 23.7-47.7 48-57.4 12.2-4.9 17.9-5.5 57.6-5.6l35.9-.1v188zm-75.9-131.2c-5.8 1.1-14.7 5.6-19.5 9.7-9.7 8.4-14.6 20.4-13.8 34.5.4 7.3.8 9.3 3.8 15.2 4.4 9 10.9 15.6 19.9 20 6.2 3.1 7.8 3.4 15.9 3.7 7.3.3 9.9 0 14.8-1.7 20.1-6.8 32.3-26.3 28.8-46.4-3.9-23.7-26.6-39.7-49.9-35zm158.2-92.3c-.4.3-.6 100.8-.6 223.5 0 202.3.1 222.8 1.5 223.4 2.5.9 74.5.6 83.4-.4 37.7-4.3 71-27.2 89-61.2 2.3-4.4 5.4-11.7 7-16.2 5.8-17.4 5.7-12.8 5.7-146.1 0-106.4-.2-122.3-1.5-129-9.2-48.3-46.1-84.8-94.5-93.1-6.5-1.1-16.5-1.4-48.8-1.4-22.4-.1-40.9.2-41.2.5zm99.1 202.1c14.5 3.8 26.3 14.8 31.2 28.9 3.1 8.7 3 21.5-.1 29.5-5.7 14.7-16.8 25-31.1 28.8-23.2 6-47.9-8-54.6-31-2-7-1.9-18.9.4-26.2 6.9-22.7 31-36.1 54.2-30z",
    ],
  },
  midjourney: {
    viewBox: "0 0 698 583",
    stroke: true,
    strokeWidth: 26,
    paths: [
      "M9 573.5C29 573.5 59 531.5 94 525.5C114 525.5 129 567.5 179 573.5C214 573.5 229 531.5 264 531.5C299 531.5 314 573.5 349 573.5C384 573.5 399 531.5 434 531.5C469 531.5 484 573.5 519 573.5C554 573.5 569 531.5 604 531.5C639 531.5 654 573.5 689 573.5",
      "M77.4 531.7L54.5 487.9L644.5 449.9C598.1 492.1 538.5 526.3 478.2 554.3",
      "M289.4 79.9004C389.8 110.6 530.2 258.9 578 418.3C551.8 408 532.2 397.5 495.4 406.9C459.8 277.4 396.1 153.7 289.4 79.9004Z",
      "M102.7 9.00049C231.3 64.0005 407.7 217.1 440.1 421C291.8 361.2 178.9 393.1 100.3 441.6C220.2 289.2 166.4 115.9 102.7 9.00049Z",
    ],
  },
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
 * ابتدا از پکیج simple-icons و سپس از مجموعهٔ SVG داخلی استفاده می‌کند.
 * هیچ‌گاه متن یا حرف اول نمایش داده نمی‌شود.
 */
export default function BrandIcon({ slug, size = 24, color, className }: BrandIconProps) {
  const Icon = ICON_MAP[slug]
  if (Icon) {
    return <Icon size={size} color={color} className={className} />
  }

  const custom = CUSTOM_ICONS[slug]
  if (custom) {
    const paint = color ?? "currentColor"
    return (
      <svg
        role="img"
        aria-hidden
        viewBox={custom.viewBox}
        width={size}
        height={size}
        className={className}
        fill={custom.stroke ? "none" : paint}
        stroke={custom.stroke ? paint : undefined}
        strokeWidth={custom.stroke ? custom.strokeWidth ?? 18 : undefined}
        strokeLinecap={custom.stroke ? "round" : undefined}
        strokeLinejoin={custom.stroke ? "round" : undefined}
      >
        {custom.paths.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
    )
  }

  return null
}
