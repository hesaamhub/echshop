import Image from "next/image"
import Link from "next/link"
import { ArrowUpLeft } from "lucide-react"
import BrandIcon from "@/components/site/BrandIcon"

type Tile = {
  id: string
  image: string
  kicker: string
  title: string
  subtitle: string
  href: string
  brands: string[]
  wide?: boolean
}

/**
 * پنج بنر دسته‌بندی — هر بنر با تصویر اختصاصی و نشان برندهای واقعی همان دسته
 */
const TILES: Tile[] = [
  {
    id: "ai",
    image: "/art/banners/tile-ai.jpg",
    kicker: "AI WORKSPACE",
    title: "محصولات هوش مصنوعی",
    subtitle: "اکانت اختصاصی ChatGPT Plus، Claude، Midjourney و Perplexity با تحویل فوری",
    href: "/category/ai-tools",
    brands: ["openai", "anthropic", "google", "midjourney"],
    wide: true,
  },
  {
    id: "stream",
    image: "/art/banners/tile-stream.jpg",
    kicker: "MUSIC & STREAMING",
    title: "فیلم، سریال و موسیقی",
    subtitle: "اسپاتیفای، یوتیوب پرمیوم و نتفلیکس با گارانتی کامل",
    href: "/category/music-video",
    brands: ["spotify", "netflix", "youtube"],
  },
  {
    id: "gaming",
    image: "/art/banners/tile-gaming.jpg",
    kicker: "GAMING PASS",
    title: "گیمینگ و کنسول",
    subtitle: "گیم‌پس آلتیمیت، پلی‌استیشن پلاس و گیفت‌کارت استیم",
    href: "/category/gaming",
    brands: ["playstation", "xbox", "steam"],
  },
  {
    id: "design",
    image: "/art/banners/tile-design.jpg",
    kicker: "CREATIVE SUITE",
    title: "طراحی و خلاقیت",
    subtitle: "لایسنس رسمی Adobe Creative Cloud، Canva Pro و Figma",
    href: "/category/design",
    brands: ["adobe", "figma", "canva"],
  },
  {
    id: "work",
    image: "/art/banners/tile-work.jpg",
    kicker: "PRODUCTIVITY",
    title: "کار و بهره‌وری",
    subtitle: "مایکروسافت 365، ویندوز، Notion و ابزارهای تیمی",
    href: "/category/software",
    brands: ["microsoft", "notion", "github"],
  },
]

export default function PosterGrid() {
  return (
    <div className="grid gap-3.5 lg:grid-cols-2">
      {TILES.map((tile) => (
        <Link
          key={tile.id}
          href={tile.href}
          aria-label={tile.title}
          className={`group relative block overflow-hidden rounded-[24px] border border-white/10 bg-[#070c1b] shadow-[0_24px_50px_-36px_rgba(10,21,45,0.55)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_30px_60px_-34px_rgba(27,57,245,0.45)] ${
            tile.wide ? "aspect-[16/9] lg:col-span-2 lg:aspect-[3.2/1]" : "aspect-[16/10] sm:aspect-[69/38]"
          }`}
        >
          <Image
            src={tile.image}
            alt={tile.title}
            fill
            sizes={tile.wide ? "(max-width: 1024px) 100vw, 1232px" : "(max-width: 1024px) 100vw, 608px"}
            referrerPolicy="no-referrer"
            className="object-cover object-left transition-transform duration-700 group-hover:scale-[1.03]"
          />

          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-l from-[#040814]/94 via-[#040814]/65 to-[#040814]/15"
          />

          <span className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-7">
            <span className="flex items-center justify-between gap-3">
              <span className="font-latin text-[10px] font-bold tracking-[0.2em] text-[#99adff]" dir="ltr">
                {tile.kicker}
              </span>
              <span className="flex items-center gap-1.5" aria-hidden>
                {tile.brands.map((brand) => (
                  <span
                    key={brand}
                    className="grid h-7 w-7 place-items-center rounded-lg border border-white/15 bg-black/40 backdrop-blur-md"
                  >
                    <BrandIcon slug={brand} size={14} color="#ffffff" />
                  </span>
                ))}
              </span>
            </span>

            <span className="flex items-end justify-between gap-4">
              <span className="max-w-[78%]">
                <span className="block font-display text-[19px] font-extrabold text-white sm:text-[24px]">
                  {tile.title}
                </span>
                <span className="mt-1 block text-[11.5px] leading-5 text-slate-200/85 sm:text-[12.5px]">
                  {tile.subtitle}
                </span>
              </span>

              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:border-[#7d92ff]/50 group-hover:bg-[#1b39f5]">
                <ArrowUpLeft className="h-4 w-4" />
              </span>
            </span>
          </span>
        </Link>
      ))}
    </div>
  )
}
