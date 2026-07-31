import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { NewArrival, NewArrivalArt } from "@/lib/newArrivals"

const PHOTO_BASE = "https://images.pexels.com/photos"
const PHOTO_QUERY = "?auto=compress&cs=tinysrgb&w=800"

function photo(id: number) {
  return `${PHOTO_BASE}/${id}/pexels-photo-${id}.jpeg${PHOTO_QUERY}`
}

/** کاراکتر تصویری هر بنر */
const ART_PHOTOS: Record<NewArrivalArt, string> = {
  film: photo(23363498),
  notebook: photo(26736061),
  hex: photo(13697160),
  orbit: photo(16249328),
}

/** دکمهٔ مختص کاربرد هر سرویس */
const ACTIONS: Record<string, string> = {
  "kling-ai": "ساخت ویدیو",
  "notebooklm-plus": "تحلیل منابع",
  hexafield: "طراحی سه‌بعدی",
  "kimi-k3": "تحلیل اسناد",
}

export default function NewArrivalBanner({ item }: { item: NewArrival }) {
  const action = ACTIONS[item.slug] ?? "مشاهدهٔ محصول"

  return (
    <Link
      href={`/new/${item.slug}`}
      className="group relative flex h-[196px] flex-col justify-between overflow-hidden rounded-[20px] border border-white/10 p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/25"
      style={{ background: `linear-gradient(255deg, ${item.from} 0%, #0b0d1c 62%)` }}
    >
      {/* کاراکتر تصویری سمت چپ */}
      <span
        className="pointer-events-none absolute inset-y-0 left-0 w-[56%] transition-transform duration-700 group-hover:scale-[1.06]"
        style={{
          backgroundImage: `url(${ART_PHOTOS[item.art]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: "linear-gradient(to left, transparent 0%, #000 58%)",
          WebkitMaskImage: "linear-gradient(to left, transparent 0%, #000 58%)",
        }}
        aria-hidden
      />
      {/* هالهٔ نئونی */}
      <span
        className="pointer-events-none absolute -left-6 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full opacity-45 blur-[44px] transition-opacity duration-500 group-hover:opacity-70"
        style={{ background: item.accent }}
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
        <div className="flex items-center gap-2">
          <span
            className="font-latin rounded-md px-2 py-0.5 text-[9px] font-bold tracking-wide text-white"
            style={{ background: item.accent }}
          >
            {item.badge}
          </span>
          <span className="font-latin text-[9.5px] font-semibold tracking-[0.14em] text-white/50">
            {item.kicker}
          </span>
        </div>
        <p className="font-display font-latin mt-2 text-[21px] font-bold leading-tight text-white" dir="ltr">
          {item.name}
        </p>
        <p className="mt-1 line-clamp-2 text-[10.5px] leading-4 text-white/55">{item.pitch}</p>
      </div>

      {/* دکمهٔ مختص کاربرد محصول */}
      <div className="relative flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[11px] font-bold text-white shadow-[0_10px_22px_-14px_rgba(0,0,0,0.9)] transition-transform duration-500 group-hover:-translate-x-0.5"
          style={{ background: item.accent }}
        >
          {action}
          <ArrowLeft className="h-3 w-3" />
        </span>
        <span className="rounded-lg border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/70 backdrop-blur-md">
          تحویل فوری
        </span>
      </div>
    </Link>
  )
}
