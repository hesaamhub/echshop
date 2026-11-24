import type { CSSProperties } from "react"
import { brandLogos, type BrandLogo } from "@/lib/brands"
import BrandIcon from "./BrandIcon"

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
  return (
    <div className="group relative h-24 w-40 shrink-0 flex items-center justify-center rounded-full border border-slate-200/60 bg-white shadow-sm transition-colors hover:border-slate-300 overflow-hidden">
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:`linear-gradient(135deg, ${logo.gradient.from}, ${logo.gradient.to})`,
        }}
      />
      <span
        className="relative z-10 text-[var(--brand-light)] transition-all duration-500 group-hover:[&>svg]:brightness-0 group-hover:[&>svg]:invert"
        style={
          {
            "--brand-light":`#${logo.color}`,
            "--brand-dark":`#${logo.darkColor ?? logo.color}`,
          } as CSSProperties
        }
      >
        <BrandIcon
          slug={logo.slug}
          size={32}
          color="currentColor"
          className="transition-transform duration-500 group-hover:scale-110"
        />
      </span>
    </div>
  )
}
