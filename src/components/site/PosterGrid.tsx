import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import BrandIcon from "@/components/site/BrandIcon"

type BannerBrand = {
  slug: string
  label: string
  color: string
}

type Banner = {
  id: string
  title: string
  subtitle: string
  note: string
  watermark: string
  accent: string
  glow: string
  href: string
  brands: BannerBrand[]
}

const BANNERS: Banner[] = [
  {
    id: "ai",
    title: "محصولات هوش مصنوعی",
    subtitle: "دسترسی به محبوب‌ترین ابزارهای هوش مصنوعی",
    note: "چت‌بات، تولید محتوا، طراحی و ویدیو",
    watermark: "AI",
    accent: "#1b39f5",
    glow: "#9db4ff",
    href: "/products",
    brands: [
      { slug: "openai", label: "ChatGPT", color: "#10A37F" },
      { slug: "anthropic", label: "Claude", color: "#D97757" },
      { slug: "google", label: "Gemini", color: "#4285F4" },
      { slug: "midjourney", label: "Midjourney", color: "#111827" },
      { slug: "perplexity", label: "Perplexity", color: "#1FB8CD" },
      { slug: "canva", label: "Canva AI", color: "#00C4CC" },
    ],
  },
  {
    id: "stream",
    title: "فیلم، سریال و موسیقی",
    subtitle: "اشتراک سرویس‌های محبوب استریم",
    note: "کیفیت بالا و بدون تبلیغ",
    watermark: "PLAY",
    accent: "#E50914",
    glow: "#ffc0c4",
    href: "/products",
    brands: [
      { slug: "netflix", label: "Netflix", color: "#E50914" },
      { slug: "spotify", label: "Spotify", color: "#1DB954" },
      { slug: "youtube", label: "YouTube", color: "#FF0033" },
      { slug: "applemusic", label: "Apple Music", color: "#111827" },
    ],
  },
  {
    id: "gaming",
    title: "گیمینگ و کنسول",
    subtitle: "گیفت کارت و اشتراک بازی‌ها",
    note: "تحویل فوری کد فعال‌سازی",
    watermark: "GAME",
    accent: "#0d63d6",
    glow: "#b7cdff",
    href: "/products",
    brands: [
      { slug: "steam", label: "Steam", color: "#171a21" },
      { slug: "playstation", label: "PlayStation", color: "#0d63d6" },
      { slug: "xbox", label: "Xbox", color: "#107C10" },
      { slug: "nintendo", label: "Nintendo", color: "#E60012" },
    ],
  },
  {
    id: "design",
    title: "طراحی و خلاقیت",
    subtitle: "ابزارهای حرفه‌ای طراحان و تولیدکننده‌ها",
    note: "اشتراک قانونی و فعال روی اکانت خودتان",
    watermark: "DESIGN",
    accent: "#F24E1E",
    glow: "#ffd0bd",
    href: "/products",
    brands: [
      { slug: "adobe", label: "Adobe", color: "#FF0000" },
      { slug: "figma", label: "Figma", color: "#F24E1E" },
      { slug: "canva", label: "Canva", color: "#00C4CC" },
      { slug: "envato", label: "Envato", color: "#81B441" },
    ],
  },
  {
    id: "work",
    title: "کار، آموزش و بهره‌وری",
    subtitle: "سرویس‌های روزمرهٔ کار و یادگیری",
    note: "پلان ماهانه تا سالانه",
    watermark: "WORK",
    accent: "#0A66C2",
    glow: "#b9d6f7",
    href: "/products",
    brands: [
      { slug: "notion", label: "Notion", color: "#111827" },
      { slug: "duolingo", label: "Duolingo", color: "#58CC02" },
      { slug: "udemy", label: "Udemy", color: "#A435F0" },
      { slug: "linkedin", label: "LinkedIn", color: "#0A66C2" },
    ],
  },
]

/** کاشی شناور لوگوی برند */
function LogoTile({
  brand,
  size,
  lift,
}: {
  brand: BannerBrand
  size: number
  lift: string
}) {
  return (
    <span
      className={`flex shrink-0 flex-col items-center gap-1 rounded-[16px] border border-black/5 bg-white px-2 py-2 shadow-[0_16px_30px_-18px_rgba(10,21,45,0.45)] transition-transform duration-500 group-hover:-translate-y-0.5 ${lift}`}
      style={{ width: size }}
    >
      <BrandIcon slug={brand.slug} size={Math.round(size * 0.42)} color={brand.color} />
      <span className="font-latin text-[7.5px] font-bold text-[#0a152d]/70" dir="ltr">
        {brand.label}
      </span>
    </span>
  )
}

function BannerCard({ banner, wide = false }: { banner: Banner; wide?: boolean }) {
  const tiles = wide ? banner.brands : banner.brands.slice(0, 4)
  const tileSize = wide ? 62 : 54
  const lifts = ["translate-y-3", "-translate-y-4", "translate-y-1", "-translate-y-3", "translate-y-2", "-translate-y-1"]

  return (
    <Link
      href={banner.href}
      className={`group relative flex items-center justify-between overflow-hidden rounded-[24px] border border-black/5 bg-gradient-to-l from-white via-[#f6f8fd] to-[#e9edf8] px-5 shadow-[0_24px_50px_-36px_rgba(10,21,45,0.55)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_30px_60px_-34px_rgba(10,21,45,0.5)] ${
        wide ? "h-[188px] px-8" : "h-[172px]"
      }`}
    >
      {/* هالهٔ رنگی سمت کاشی‌ها */}
      <span
        className="pointer-events-none absolute top-1/2 -left-10 h-56 w-56 -translate-y-1/2 rounded-full opacity-60 blur-[60px]"
        style={{ background: banner.glow }}
        aria-hidden
      />
      {/* وردمارک محو پشت کاشی‌ها */}
      <span
        className="font-display font-latin pointer-events-none absolute top-1/2 left-[16%] -translate-x-1/2 -translate-y-1/2 text-[74px] leading-none font-extrabold tracking-tight text-[#0a152d]/[0.06] uppercase select-none"
        dir="ltr"
        aria-hidden
      >
        {banner.watermark}
      </span>

      {/* کاشی لوگوها */}
      <div className="relative hidden items-center gap-2 sm:flex">
        {tiles.map((brand, index) => (
          <LogoTile
            key={`${banner.id}-${brand.slug}-${index}`}
            brand={brand}
            size={tileSize}
            lift={lifts[index % lifts.length]}
          />
        ))}
      </div>

      {/* متن بنر */}
      <div className="relative flex flex-col items-end text-right">
        <h3
          className={`font-bold text-[#0a152d] ${wide ? "text-[30px] leading-[1.35]" : "text-[22px] leading-[1.4]"}`}
        >
          {banner.title}
        </h3>

        {/* خط تزئینی طلایی */}
        <span className="mt-2 flex items-center gap-2" aria-hidden>
          <span className="h-px w-24 bg-gradient-to-l from-transparent to-[#EAC26B]" />
          <Sparkles className="h-3.5 w-3.5 text-[#EAC26B]" />
        </span>

        <p className={`mt-2 font-semibold text-[#0a152d]/75 ${wide ? "text-[14px]" : "text-[12px]"}`}>
          {banner.subtitle}
        </p>
        <p className="mt-1 text-[11.5px] text-[#0a152d]/45">{banner.note}</p>

        <span
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-[11px] font-bold text-white shadow-[0_14px_26px_-16px_rgba(10,21,45,0.9)] transition-transform duration-500 group-hover:-translate-x-0.5"
          style={{ background: banner.accent }}
        >
          مشاهده محصولات
          <ArrowLeft className="h-3 w-3" />
        </span>
      </div>
    </Link>
  )
}

export default function PosterGrid() {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <BannerCard banner={BANNERS[0]} wide />
      </div>
      <BannerCard banner={BANNERS[1]} />
      <BannerCard banner={BANNERS[2]} />
      <BannerCard banner={BANNERS[3]} />
      <BannerCard banner={BANNERS[4]} />
    </div>
  )
}
