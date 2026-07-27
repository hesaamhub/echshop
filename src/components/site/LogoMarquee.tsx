"use client"

import { useState } from "react"
import { brandLogos, logoSources, type BrandLogo } from "@/lib/brands"

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
                <LogoBubble key={`${group}-${logo.slug}`} logo={logo} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LogoBubble({ logo }: { logo: BrandLogo }) {
  const sources = logoSources(logo)
  const [index, setIndex] = useState(0)
  const exhausted = index >= sources.length

  return (
    <div className="group relative h-24 w-40 shrink-0 flex items-center justify-center rounded-full bg-white border border-slate-200/60 shadow-sm transition-colors hover:border-slate-300 overflow-hidden">
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${logo.gradient.from}, ${logo.gradient.to})`,
        }}
      />
      {exhausted ? (
        <span
          aria-label={logo.name}
          className="relative z-10 grid h-11 w-11 place-items-center rounded-2xl text-[17px] font-bold text-white transition-transform duration-500 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${logo.gradient.from}, ${logo.gradient.to})`,
          }}
        >
          {logo.name.charAt(0)}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sources[index]}
          alt={logo.name}
          loading="lazy"
          onError={() => setIndex((value) => value + 1)}
          className="relative z-10 h-8 w-auto max-w-[96px] object-contain transition-all duration-500 group-hover:brightness-0 group-hover:invert"
        />
      )}
    </div>
  )
}
