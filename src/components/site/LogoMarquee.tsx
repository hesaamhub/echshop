"use client"

import { useState } from "react"
import { brandLogos, type BrandLogo } from "@/lib/brands"

/**
 * اسکرولر بی‌نهایت لوگوی برندها.
 *
 * نکتهٔ مهم: خود نوار حتماً باید LTR باشد. در حالت راست‌چین، ترک از لبهٔ راست
 * می‌چسبید و وقتی به چپ حرکت می‌کرد، سمت راست خالی می‌ماند و نوار «تمام» می‌شد.
 * با dir="ltr" دو گروه یکسان پشت سر قرار می‌گیرند و حلقه همیشه پر است.
 */
export default function LogoMarquee() {
  return (
    <div className="mt-10 px-4 md:px-6">
      <div
        dir="ltr"
        className="echshop-marquee relative w-full max-w-[1400px] mx-auto overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        <div className="echshop-marquee-track">
          {[0, 1].map((group) => (
            <div
              key={group}
              aria-hidden={group === 1}
              className="flex shrink-0 items-center gap-8 pr-8"
            >
              {brandLogos.map((logo) => (
                <LogoBubble key={`${group}-${logo.name}`} logo={logo} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LogoBubble({ logo }: { logo: BrandLogo }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="group relative h-24 w-40 shrink-0 flex items-center justify-center rounded-full bg-white border border-slate-200/60 shadow-sm transition-colors hover:border-slate-300 overflow-hidden">
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${logo.gradient.from}, ${logo.gradient.to})`,
        }}
      />
      {failed ? (
        <span className="wordmark relative z-10 text-[14px] text-slate-500 transition-colors duration-500 group-hover:text-white">
          {logo.name}
        </span>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={logo.src}
          alt={logo.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="relative z-10 h-8 w-auto max-w-[96px] object-contain transition-all duration-500 group-hover:brightness-0 group-hover:invert"
        />
      )}
    </div>
  )
}
