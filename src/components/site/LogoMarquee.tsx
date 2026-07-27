"use client"

import { brandLogos } from "@/lib/brands"

/** اسکرولر بی‌نهایت لوگوی برندهای محصولات */
export default function LogoMarquee() {
  const logos = [...brandLogos, ...brandLogos]

  return (
    <div className="mt-10 px-4 md:px-6">
      <div
        className="echshop-marquee relative w-full max-w-[1400px] mx-auto overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        <div className="echshop-marquee-track gap-5">
          {logos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="group relative h-24 w-40 shrink-0 flex items-center justify-center rounded-full bg-white border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all overflow-hidden"
            >
              <div
                className="absolute inset-0 scale-150 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500"
                style={{
                  background: `linear-gradient(135deg, ${logo.gradient.from}, ${logo.gradient.to})`,
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={logo.name}
                loading="lazy"
                className="relative z-10 h-8 w-auto max-w-[96px] object-contain transition-all duration-500 group-hover:brightness-0 group-hover:invert"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
