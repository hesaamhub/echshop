import BrandIcon from "@/components/site/BrandIcon"
import { brandLogos } from "@/lib/brands"

const PHOTO_BASE = "https://images.pexels.com/photos"
const PHOTO_QUERY = "?auto=compress&cs=tinysrgb&w=1000"

function photo(id: number) {
  return `${PHOTO_BASE}/${id}/pexels-photo-${id}.jpeg${PHOTO_QUERY}`
}

type PosterTheme = {
  kicker: string
  image: string
}

/** فضای تصویری هر دسته از سرویس‌ها */
const THEMES: Record<string, PosterTheme> = {
  music: { kicker: "MUSIC", image: photo(34516763) },
  video: { kicker: "STREAMING", image: photo(32634582) },
  gaming: { kicker: "GAMING", image: photo(9072216) },
  ai: { kicker: "AI TOOLS", image: photo(29376742) },
  design: { kicker: "DESIGN", image: photo(33839921) },
  learning: { kicker: "LEARNING", image: photo(30547616) },
  privacy: { kicker: "PRIVACY", image: photo(26195107) },
  work: { kicker: "PRODUCTIVITY", image: photo(28844045) },
}

/** هر برند به کدام فضا تعلق دارد */
const BRAND_THEME: Record<string, keyof typeof THEMES> = {
  spotify: "music",
  applemusic: "music",
  soundcloud: "music",
  netflix: "video",
  youtube: "video",
  crunchyroll: "video",
  twitch: "video",
  steam: "gaming",
  playstation: "gaming",
  xbox: "gaming",
  nintendo: "gaming",
  epicgames: "gaming",
  discord: "gaming",
  openai: "ai",
  anthropic: "ai",
  perplexity: "ai",
  midjourney: "ai",
  google: "ai",
  figma: "design",
  adobe: "design",
  canva: "design",
  envato: "design",
  freepik: "design",
  autodesk: "design",
  duolingo: "learning",
  udemy: "learning",
  coursera: "learning",
  nordvpn: "privacy",
}

export function brandTone(slug: string) {
  const brand = brandLogos.find((entry) => entry.slug === slug.toLowerCase())
  return brand ? `#${brand.color}` : "#1b39f5"
}

export function brandName(slug: string, fallback: string) {
  const brand = brandLogos.find((entry) => entry.slug === slug.toLowerCase())
  return brand ? brand.name : fallback
}

type Props = {
  /** اسلاگ لوگوی محصول */
  slug: string
  /** نام برند برای حالت پشتیبان */
  brand: string
}

/** پوستر تصویری مختص هر محصول (جایگزین لوگوی خالی) */
export default function ProductPoster({ slug, brand }: Props) {
  const key = slug.toLowerCase()
  const theme = THEMES[BRAND_THEME[key] ?? "work"]
  const tone = brandTone(key)
  const name = brandName(key, brand)

  return (
    <div className="absolute inset-0">
      {/* تصویر پس‌زمینهٔ پوستر */}
      <span
        className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.08]"
        style={{
          backgroundImage: `url(${theme.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden
      />
      {/* تینت رنگ برند */}
      <span
        className="absolute inset-0"
        style={{ background: `linear-gradient(155deg, ${tone}e6 0%, ${tone}59 42%, rgba(8,10,20,0.9) 100%)` }}
        aria-hidden
      />
      {/* بافت نقطه‌ای ریز */}
      <span
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
        aria-hidden
      />
      {/* سایهٔ پایین برای خوانایی متن */}
      <span
        className="absolute inset-x-0 bottom-0 h-2/3"
        style={{ background: "linear-gradient(to top, rgba(8,10,20,0.92) 0%, transparent 100%)" }}
        aria-hidden
      />

      {/* محتوای پوستر */}
      <div className="relative flex h-full flex-col justify-between p-4">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/25 bg-white/15 backdrop-blur-md">
            <BrandIcon slug={slug} size={18} color="#ffffff" />
          </span>
          <span className="font-latin text-[9px] font-bold uppercase tracking-[0.22em] text-white/75">
            {theme.kicker}
          </span>
        </div>

        <div>
          <span
            className="font-display font-latin block text-[26px] font-extrabold leading-none text-white drop-shadow-[0_10px_22px_rgba(0,0,0,0.55)]"
            dir="ltr"
          >
            {name}
          </span>
          <span className="mt-1.5 block h-[3px] w-10 rounded-full" style={{ background: tone }} />
        </div>
      </div>
    </div>
  )
}
