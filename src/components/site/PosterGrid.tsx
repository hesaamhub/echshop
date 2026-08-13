import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { T_BLUEPRINT_URI } from "@/lib/art/t-blueprint"
import { T_PUZZLE_URI } from "@/lib/art/t-puzzle"
import { T_TARGET_URI } from "@/lib/art/t-target"
import { T_TILES_URI } from "@/lib/art/t-tiles"
import { T_TRAY_URI } from "@/lib/art/t-tray"

type Banner = {
  id: string
  title: string
  subtitle: string
  note: string
  href: string
  image: string
  accent: string
}

/** پنج بنر دسته‌بندی با تصویرهای سه‌بعدی شیشه‌ای */
const BANNERS: Banner[] = [
  {
    id: "ai",
    title: "محصولات هوش مصنوعی",
    subtitle: "ChatGPT، Claude، Midjourney و ابزارهای مولد",
    note: "تحویل خودکار و گارانتی کامل",
    href: "/category/ai-tools",
    image: T_BLUEPRINT_URI,
    accent: "#1b39f5",
  },
  {
    id: "stream",
    title: "فیلم، سریال و موسیقی",
    subtitle: "نتفلیکس، اسپاتیفای و یوتیوب پرمیوم",
    note: "کیفیت بالا، بدون تبلیغ",
    href: "/category/music-video",
    image: T_TILES_URI,
    accent: "#0a66c2",
  },
  {
    id: "gaming",
    title: "گیمینگ و کنسول",
    subtitle: "گیفت‌کارت و اشتراک بازی‌ها",
    note: "تحویل فوری کد فعال‌سازی",
    href: "/category/gaming",
    image: T_TARGET_URI,
    accent: "#2a49ff",
  },
  {
    id: "design",
    title: "طراحی و خلاقیت",
    subtitle: "ادوبی، کانوا و فیگما",
    note: "روی اکانت شخصی خودتان",
    href: "/category/design",
    image: T_TRAY_URI,
    accent: "#6d5cff",
  },
  {
    id: "work",
    title: "کار و بهره‌وری",
    subtitle: "سرویس‌های روزمرهٔ کار و یادگیری",
    note: "پلان ماهانه تا سالانه",
    href: "/category/software",
    image: T_PUZZLE_URI,
    accent: "#0d63d6",
  },
]

function BannerCard({ banner, wide = false }: { banner: Banner; wide?: boolean }) {
  return (
    <Link
      href={banner.href}
      className={`group relative flex items-center overflow-hidden rounded-[24px] border border-black/5 bg-gradient-to-l from-white via-[#f6f8fd] to-[#eaf0fb] shadow-[0_24px_50px_-36px_rgba(10,21,45,0.55)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_30px_60px_-34px_rgba(27,57,245,0.45)] ${
        wide ? "h-[200px]" : "h-[172px]"
      }`}
    >
      {/* تصویر — سمت چپ با محو شدن نرم */}
      <img
        src={banner.image}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-full w-[46%] select-none object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        style={{
          maskImage: "linear-gradient(to left, transparent 0%, #000 46%)",
          WebkitMaskImage: "linear-gradient(to left, transparent 0%, #000 46%)",
        }}
      />
      {/* هالهٔ رنگی */}
      <span
        className="pointer-events-none absolute -left-8 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full opacity-50 blur-[60px]"
        style={{ background: banner.accent }}
        aria-hidden
      />

      {/* متن بنر — سمت راست */}
      <div className="relative flex flex-col items-end px-6 text-right md:px-7">
        <h3
          className={`font-bold leading-[1.4] text-[#0a152d] ${
            wide ? "text-[24px] md:text-[28px]" : "text-[19px] md:text-[21px]"
          }`}
        >
          {banner.title}
        </h3>
        <p className={`mt-1.5 font-semibold text-[#0a152d]/70 ${wide ? "text-[13.5px]" : "text-[12px]"}`}>
          {banner.subtitle}
        </p>
        <p className="mt-1 text-[11px] text-[#0a152d]/45">{banner.note}</p>
        <span
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-[11px] font-bold text-white transition-transform duration-500 group-hover:-translate-x-0.5"
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
