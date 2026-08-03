import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import type { NewArrival, NewArrivalArt } from "@/lib/newArrivals"

const PHOTO_BASE = "https://images.pexels.com/photos"
const WIDE_QUERY = "?auto=compress&cs=tinysrgb&w=1400"

function widePhoto(id: number) {
  return `${PHOTO_BASE}/${id}/pexels-photo-${id}.jpeg${WIDE_QUERY}`
}

/** تصویر عریض برای هدر صفحهٔ محصول */
export const ART_IMAGES: Record<NewArrivalArt, string> = {
  film: widePhoto(32634582),
  notebook: widePhoto(29652326),
  hex: widePhoto(28844045),
  orbit: widePhoto(25630341),
}

/** وردمارک محو پشت کاشی‌های هر طرح */
const WATERMARKS: Record<NewArrivalArt, string> = {
  film: "VIDEO",
  notebook: "NOTES",
  hex: "3D",
  orbit: "AI",
}

/** دکمهٔ مختص کاربرد هر سرویس */
const ACTIONS: Record<string, string> = {
  "kling-ai": "ساخت ویدیو",
  "notebooklm-plus": "تحلیل منابع",
  hexafield: "طراحی سه‌بعدی",
  "kimi-k3": "تحلیل اسناد",
}

/** حروف اول نام محصول برای کاشی اصلی */
function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((part) => part.charAt(0)).join("").toUpperCase()
}

export default function NewArrivalBanner({ item }: { item: NewArrival }) {
  const action = ACTIONS[item.slug] ?? "مشاهدهٔ محصول"
  const watermark = WATERMARKS[item.art]

  return (
    <Link
      href={`/new/${item.slug}`}
      className="group relative flex h-[196px] items-center justify-between overflow-hidden rounded-[24px] border border-black/5 bg-gradient-to-l from-white via-[#f6f8fd] to-[#e9edf8] px-5 shadow-[0_24px_50px_-36px_rgba(10,21,45,0.55)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_30px_60px_-34px_rgba(10,21,45,0.5)]"
    >
      {/* هالهٔ رنگی سمت کاشی‌ها */}
      <span
        className="pointer-events-none absolute top-1/2 -left-10 h-52 w-52 -translate-y-1/2 rounded-full opacity-30 blur-[60px]"
        style={{ background: item.accent }}
        aria-hidden
      />
      {/* وردمارک محو */}
      <span
        className="font-display font-latin pointer-events-none absolute top-1/2 left-[18%] -translate-x-1/2 -translate-y-1/2 text-[64px] leading-none font-extrabold tracking-tight text-[#0a152d]/[0.06] uppercase select-none"
        dir="ltr"
        aria-hidden
      >
        {watermark}
      </span>

      {/* کاشی‌های شناور محصول */}
      <div className="relative hidden items-center gap-2 sm:flex">
        <span className="flex translate-y-3 shrink-0 flex-col items-center gap-1 rounded-[16px] border border-black/5 bg-white px-2.5 py-2 shadow-[0_16px_30px_-18px_rgba(10,21,45,0.45)] transition-transform duration-500 group-hover:-translate-y-0.5">
          <Sparkles className="h-4 w-4" style={{ color: item.accent }} />
          <span className="font-latin text-[7.5px] font-bold text-[#0a152d]/70" dir="ltr">
            NEW
          </span>
        </span>

        <span className="flex -translate-y-4 shrink-0 flex-col items-center gap-1 rounded-[18px] border border-black/5 bg-white px-3 py-2.5 shadow-[0_20px_36px_-18px_rgba(10,21,45,0.5)] transition-transform duration-500 group-hover:-translate-y-1">
          <span
            className="font-display font-latin grid h-9 w-9 place-items-center rounded-[12px] text-[14px] font-extrabold text-white"
            style={{ background: `linear-gradient(140deg, ${item.accent} 0%, ${item.from} 100%)` }}
            dir="ltr"
          >
            {initials(item.name)}
          </span>
          <span className="font-latin text-[8px] font-bold text-[#0a152d]/75" dir="ltr">
            {item.name}
          </span>
        </span>

        <span className="flex translate-y-2 shrink-0 flex-col items-center gap-1 rounded-[16px] border border-black/5 bg-white px-2.5 py-2 shadow-[0_16px_30px_-18px_rgba(10,21,45,0.45)] transition-transform duration-500 group-hover:-translate-y-0.5">
            <span
              className="font-latin text-[11px] font-extrabold"
              style={{ color: item.accent }}
              dir="ltr"
            >
              {watermark}
            </span>
            <span className="font-latin text-[7.5px] font-bold text-[#0a152d]/60" dir="ltr">
              TOOL
            </span>
        </span>
      </div>

      {/* متن بنر */}
      <div className="relative flex flex-col items-end text-right">
        <div className="flex items-center gap-2">
          <span
            className="font-latin rounded-md px-2 py-0.5 text-[9px] font-bold tracking-wide text-white"
            style={{ background: item.accent }}
          >
            {item.badge}
          </span>
          <span className="font-latin text-[9.5px] font-semibold tracking-[0.14em] text-[#0a152d]/45">
            {item.kicker}
          </span>
        </div>

        <p className="font-display font-latin mt-1.5 text-[24px] leading-tight font-bold text-[#0a152d]" dir="ltr">
          {item.name}
        </p>

        {/* خط تزئینی طلایی */}
        <span className="mt-2 flex items-center gap-2" aria-hidden>
          <span className="h-px w-20 bg-gradient-to-l from-transparent to-[#EAC26B]" />
          <Sparkles className="h-3.5 w-3.5 text-[#EAC26B]" />
        </span>

        <p className="mt-2 line-clamp-2 max-w-[230px] text-[11px] leading-5 text-[#0a152d]/55">
          {item.pitch}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-lg border border-black/5 bg-white px-2.5 py-1 text-[10px] font-semibold text-[#0a152d]/60 shadow-[0_10px_20px_-16px_rgba(10,21,45,0.6)]">
            تحویل فوری
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-[11px] font-bold text-white shadow-[0_14px_26px_-16px_rgba(10,21,45,0.9)] transition-transform duration-500 group-hover:-translate-x-0.5"
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
