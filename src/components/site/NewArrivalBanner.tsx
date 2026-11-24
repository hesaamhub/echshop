import Link from "next/link"
import { ArrowLeft, Zap } from "lucide-react"
import type { NewArrival, NewArrivalArt } from "@/lib/newArrivals"
import { num } from "@/lib/utils"

/** تصویر عریض هدر صفحهٔ محصول، متناسب با کاربرد همان سرویس */
export const ART_IMAGES: Record<NewArrivalArt, string> = {
  film:"/art/banners/p-kling.jpg",
  notebook:"/art/banners/p-notebooklm.jpg",
  hex:"/art/banners/p-hexafield.jpg",
  orbit:"/art/banners/p-kimi.jpg",
}

/** دکمهٔ مختص کاربرد هر سرویس */
const ACTIONS: Record<string, string> = {
  "kling-ai":"ساخت ویدیو",
  "notebooklm-plus":"تحلیل منابع",
  hexafield:"طراحی سه‌بعدی",
  "kimi-k3":"تحلیل اسناد",
}

/** مسیر شش‌ضلعی نوک‌بالا */
function hexPath(cx: number, cy: number, r: number) {
  const w = 0.866 * r
  return `M ${cx} ${cy - r} L ${cx + w} ${cy - r / 2} L ${cx + w} ${cy + r / 2} L ${cx} ${cy + r} L ${cx - w} ${cy + r / 2} L ${cx - w} ${cy - r / 2} Z`
}

export default function NewArrivalBanner({ item }: { item: NewArrival }) {
  const action = ACTIONS[item.slug] ?? "مشاهدهٔ محصول"

  return (
    <Link
      href={`/new/${item.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-[#1b39f5]/10 bg-white shadow-[0_22px_50px_-36px_rgba(10,27,51,0.6)] transition-all duration-500 hover:-translate-y-1 hover:border-[#1b39f5]/25 hover:shadow-[0_34px_64px_-34px_rgba(27,57,245,0.45)]"
    >
      {/* بنر اختصاصی هر محصول — گرافیک وکتوری متناسب با کاربردش */}
      <div className="relative h-[158px] overflow-hidden">
        <BannerArt item={item} />

        <span
          className="font-latin absolute top-3 right-3 rounded-full px-2.5 py-1 text-[9px] font-extrabold tracking-wider text-white shadow-[0_8px_18px_-10px_rgba(0,0,0,0.8)]"
          style={{ background: item.accent }}
          dir="ltr"
        >
          {item.badge}
        </span>
        <span
          className="font-latin absolute top-3.5 left-3.5 text-[9.5px] font-bold tracking-[0.16em] text-white/85"
          dir="ltr"
        >
          {item.kicker}
        </span>

        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/25 px-3 py-1 text-[10.5px] font-bold text-white shadow-sm backdrop-blur-md">
          از <span className="num">{num(item.priceFrom)}</span> تومان
        </span>
      </div>

      {/* بدنهٔ کارت */}
      <div className="flex flex-1 flex-col p-5 pt-4">
        <p className="font-display font-latin text-[16px] font-bold leading-6 text-[#0a1b33]" dir="ltr">
          {item.name}
        </p>
        <p className="mt-1 line-clamp-2 text-[12px] leading-6 text-slate-500">{item.pitch}</p>

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

/** بنر اختصاصی هر محصول بر اساس نوع گرافیکش */
function BannerArt({ item }: { item: NewArrival }) {
  switch (item.art) {
    case "film":
      return <FilmArt from={item.from} to={item.to} accent={item.accent} />
    case "notebook":
      return <NotebookArt from={item.from} to={item.to} accent={item.accent} />
    case "hex":
      return <HexArt from={item.from} to={item.to} accent={item.accent} />
    case "orbit":
      return <OrbitArt from={item.from} to={item.to} accent={item.accent} />
  }
}

/** Kling AI — نوار فیلم و دکمهٔ پخش */
function FilmArt({ from, to, accent }: { from: string; to: string; accent: string }) {
  return (
    <svg viewBox="0 0 400 158" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="filmBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="400" height="158" fill="url(#filmBg)" />
      {[22, 92].map((y) => (
        <g key={y}>
          <rect x="-20" y={y} width="440" height="36" fill="#ffffff" opacity="0.07" />
          {Array.from({ length: 16 }).map((_, i) => (
            <rect key={`t${i}`} x={-14 + i * 27} y={y + 5} width="10" height="7" rx="2" fill="#ffffff" opacity="0.22" />
          ))}
          {Array.from({ length: 16 }).map((_, i) => (
            <rect key={`b${i}`} x={-14 + i * 27} y={y + 24} width="10" height="7" rx="2" fill="#ffffff" opacity="0.22" />
          ))}
        </g>
      ))}
      <circle cx="200" cy="79" r="34" fill={accent} opacity="0.35" />
      <circle cx="200" cy="79" r="24" fill={accent} />
      <path d="M 194 68 L 214 79 L 194 90 Z" fill="#ffffff" />
    </svg>
  )
}

/** NotebookLM Plus — سند و نشان هوش مصنوعی */
function NotebookArt({ from, to, accent }: { from: string; to: string; accent: string }) {
  return (
    <svg viewBox="0 0 400 158" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="noteBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="400" height="158" fill="url(#noteBg)" />
      <g transform="rotate(-5 235 82)">
        <rect x="150" y="24" width="170" height="112" rx="14" fill="#ffffff" opacity="0.94" />
        <rect x="168" y="44" width="100" height="8" rx="4" fill="#0a1b33" opacity="0.12" />
        <rect x="168" y="60" width="134" height="8" rx="4" fill="#0a1b33" opacity="0.12" />
        <rect x="168" y="76" width="118" height="8" rx="4" fill="#0a1b33" opacity="0.12" />
        <rect x="168" y="92" width="86" height="8" rx="4" fill="#0a1b33" opacity="0.12" />
        <rect x="168" y="112" width="60" height="8" rx="4" fill={accent} opacity="0.55" />
      </g>
      <circle cx="126" cy="56" r="22" fill={accent} />
      <path d="M 126 45 Q 127.9 54.1 137 56 Q 127.9 57.9 126 67 Q 124.1 57.9 115 56 Q 124.1 54.1 126 45 Z" fill="#ffffff" />
    </svg>
  )
}

/** Hexafield — خوشهٔ شش‌ضلعی‌ها */
function HexArt({ from, to, accent }: { from: string; to: string; accent: string }) {
  return (
    <svg viewBox="0 0 400 158" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="hexBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="400" height="158" fill="url(#hexBg)" />
      <g fill="none" stroke={accent} strokeWidth="1.4">
        <path d={hexPath(200, 79, 30)} strokeOpacity="0.95" />
        <path d={hexPath(253, 49, 22)} strokeOpacity="0.4" />
        <path d={hexPath(147, 49, 22)} strokeOpacity="0.4" />
        <path d={hexPath(253, 109, 22)} strokeOpacity="0.4" />
        <path d={hexPath(147, 109, 22)} strokeOpacity="0.4" />
        <path d={hexPath(306, 79, 18)} strokeOpacity="0.2" />
        <path d={hexPath(94, 79, 18)} strokeOpacity="0.2" />
      </g>
      <path d={hexPath(200, 79, 30)} fill={accent} fillOpacity="0.16" />
      <path d={hexPath(200, 79, 14)} fill={accent} />
    </svg>
  )
}

/** Kimi K3 — مدارها و خطوط متن بلند */
function OrbitArt({ from, to, accent }: { from: string; to: string; accent: string }) {
  return (
    <svg viewBox="0 0 400 158" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="orbitBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="400" height="158" fill="url(#orbitBg)" />
      <g fill="none" stroke="#ffffff">
        <circle cx="200" cy="79" r="30" strokeOpacity="0.18" />
        <circle cx="200" cy="79" r="48" strokeOpacity="0.12" />
        <circle cx="200" cy="79" r="66" strokeOpacity="0.08" />
      </g>
      <g fill="#ffffff" opacity="0.16">
        <rect x="58" y="52" width="120" height="4" rx="2" />
        <rect x="50" y="76" width="96" height="4" rx="2" />
        <rect x="62" y="100" width="110" height="4" rx="2" />
      </g>
      <circle cx="200" cy="79" r="15" fill={accent} />
      <circle cx="248" cy="55" r="5" fill="#ffffff" opacity="0.85" />
      <circle cx="146" cy="104" r="4" fill={accent} opacity="0.9" />
    </svg>
  )
}
