import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { NewArrival, NewArrivalArt } from "@/lib/newArrivals"

const PHOTO_BASE = "https://images.pexels.com/photos"
const PHOTO_QUERY = "?auto=compress&cs=tinysrgb&w=800"
const WIDE_QUERY = "?auto=compress&cs=tinysrgb&w=1400"

function photo(id: number) {
  return `${PHOTO_BASE}/${id}/pexels-photo-${id}.jpeg${PHOTO_QUERY}`
}

function widePhoto(id: number) {
  return `${PHOTO_BASE}/${id}/pexels-photo-${id}.jpeg${WIDE_QUERY}`
}

/** تصویر عریض هدر صفحهٔ محصول، متناسب با کاربرد همان سرویس */
export const ART_IMAGES: Record<NewArrivalArt, string> = {
  film: widePhoto(29043652),
  notebook: widePhoto(5185074),
  hex: widePhoto(29652326),
  orbit: widePhoto(16978372),
}

/** تصویر بنر: ویدیو، پژوهش و یادداشت، رندر سه‌بعدی، اسناد */
const ART_PHOTOS: Record<NewArrivalArt, string> = {
  film: photo(29043652),
  notebook: photo(5185074),
  hex: photo(29450016),
  orbit: photo(16978372),
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
      className="group relative flex h-[196px] flex-col justify-between overflow-hidden rounded-[20px] border border-white/10 p-5 shadow-[0_26px_54px_-34px_rgba(5,7,20,0.9)] transition-all duration-500 hover:-translate-y-0.5 hover:border-white/20"
      style={{ background: `linear-gradient(255deg, ${item.from} 0%, #0b0d1c 62%)` }}
    >
      {/* تصویر مرتبط با کاربرد سرویس */}
      <span
        className="pointer-events-none absolute inset-y-0 left-0 w-[62%] bg-cover bg-center opacity-70 transition-transform duration-700 group-hover:scale-105"
        style={{
          backgroundImage: `url(${ART_PHOTOS[item.art]})`,
          WebkitMaskImage:
            "linear-gradient(to left, rgba(0,0,0,1) 30%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0) 100%)",
          maskImage:
            "linear-gradient(to left, rgba(0,0,0,1) 30%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0) 100%)",
        }}
        aria-hidden
      />
      {/* تیرگی روی تصویر برای خوانایی متن */}
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(255deg, ${item.from} 6%, rgba(11,13,28,0.72) 52%, rgba(11,13,28,0.25) 100%)`,
        }}
        aria-hidden
      />
      {/* هالهٔ نئون رنگ محصول */}
      <span
        className="pointer-events-none absolute -top-16 -right-10 h-44 w-44 rounded-full opacity-40 blur-[52px]"
        style={{ background: item.accent }}
        aria-hidden
      />
      {/* بافت نقطه‌ای */}
      <span
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
        aria-hidden
      />

      {/* متن بنر */}
      <div className="relative flex flex-col items-end text-right">
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

        <p
          className="font-display font-latin mt-2 text-[21px] leading-tight font-bold text-white"
          dir="ltr"
        >
          {item.name}
        </p>

        <p className="mt-1.5 line-clamp-2 max-w-[210px] text-[11px] leading-5 text-white/65">
          {item.pitch}
        </p>
      </div>

      {/* اقدام */}
      <div className="relative flex items-center justify-end gap-2">
        <span className="rounded-lg border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/75 backdrop-blur-sm">
          تحویل فوری
        </span>
        <span
          className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-[11px] font-bold text-white shadow-[0_14px_26px_-16px_rgba(0,0,0,0.9)] transition-transform duration-500 group-hover:-translate-x-0.5"
          style={{ background: item.accent }}
        >
          {action}
          <ArrowLeft className="h-3 w-3" />
        </span>
      </div>
    </Link>
  )
}
