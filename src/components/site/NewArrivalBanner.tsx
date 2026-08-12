import Link from "next/link"
import { ArrowLeft, Zap } from "lucide-react"
import type { NewArrival, NewArrivalArt } from "@/lib/newArrivals"
import { num } from "@/lib/utils"

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
      className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-[#1b39f5]/10 bg-white shadow-[0_22px_50px_-36px_rgba(10,27,51,0.6)] transition-all duration-500 hover:-translate-y-1 hover:border-[#1b39f5]/25 hover:shadow-[0_34px_64px_-34px_rgba(27,57,245,0.45)]"
    >
      {/* تصویر محصول */}
      <div className="relative h-[168px] overflow-hidden">
        <span
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${ART_PHOTOS[item.art]})` }}
          aria-hidden
        />
        {/* پوشش نرم برای خوانایی و اتصال به بدنهٔ کارت */}
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(200deg, ${item.from}38 0%, transparent 46%), linear-gradient(0deg, rgba(255,255,255,0.92) 0%, transparent 42%)`,
          }}
          aria-hidden
        />

        {/* نشان محصول */}
        <span
          className="font-latin absolute top-3 right-3 rounded-full px-2.5 py-1 text-[9px] font-extrabold tracking-wider text-white shadow-[0_8px_18px_-10px_rgba(0,0,0,0.8)]"
          style={{ background: item.accent }}
          dir="ltr"
        >
          {item.badge}
        </span>
        <span
          className="font-latin absolute top-3.5 left-3.5 text-[9.5px] font-bold tracking-[0.16em] text-white/90"
          dir="ltr"
          style={{ textShadow: "0 1px 10px rgba(0,0,0,0.4)" }}
        >
          {item.kicker}
        </span>

        {/* قیمت شروع — روی تصویر، پایین */}
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/75 px-3 py-1 text-[10.5px] font-bold text-[#0a1b33] shadow-sm backdrop-blur-md">
          از <span className="num">{num(item.priceFrom)}</span> تومان
        </span>
      </div>

      {/* بدنهٔ کارت */}
      <div className="flex flex-1 flex-col p-5 pt-4">
        <p className="font-display font-latin text-[16px] font-bold leading-6 text-[#0a1b33]" dir="ltr">
          {item.name}
        </p>
        <p className="mt-1 line-clamp-1 text-[12px] leading-6 text-slate-500">{item.pitch}</p>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3.5">
          <span className="inline-flex items-center gap-1 rounded-lg bg-[#46A171]/10 px-2.5 py-1 text-[10px] font-bold text-[#2F7A50]">
            <Zap className="h-3 w-3" />
            تحویل فوری
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-[11px] font-bold text-white shadow-[0_14px_26px_-16px_rgba(0,0,0,0.7)] transition-transform duration-500 group-hover:-translate-x-0.5"
            style={{ background: item.accent }}
          >
            {action}
            <ArrowLeft className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}
