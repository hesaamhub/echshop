import Image from "next/image"
import Link from "next/link"
import { ArrowUpLeft } from "lucide-react"
import BrandIcon from "@/components/site/BrandIcon"
import { homePosters, type HomePoster } from "@/lib/data"
import { num } from "@/lib/utils"

/**
 * پنج قاب پوستر «جدیدترین محصولات»: دو قاب کناری راست، یک قاب بزرگ وسط و دو قاب کناری چپ.
 * هر قاب تصویر اختصاصی محصول به‌همراه توضیح کاربرد و شروع قیمت را نمایش می‌دهد.
 */
export default function PosterShowcase() {
  const [rightTop, rightBottom, center, leftTop, leftBottom] = homePosters

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr_1fr] lg:grid-rows-[210px_210px]">
      <PosterSlot poster={rightTop} className="lg:col-start-1 lg:row-start-1" />
      <PosterSlot poster={rightBottom} className="lg:col-start-1 lg:row-start-2" />
      <PosterSlot poster={center} tall className="max-lg:order-first lg:col-start-2 lg:row-span-2" />
      <PosterSlot poster={leftTop} className="lg:col-start-3 lg:row-start-1" />
      <PosterSlot poster={leftBottom} className="lg:col-start-3 lg:row-start-2" />
    </div>
  )
}

function PosterSlot({
  poster,
  tall = false,
  className = "",
}: {
  poster: HomePoster
  tall?: boolean
  className?: string
}) {
  return (
    <Link
      href={poster.href}
      className={`group relative block overflow-hidden rounded-[22px] border border-[#1b39f5]/15 bg-[#070d1e] shadow-[0_22px_50px_-36px_rgba(10,27,51,0.6)] transition-all duration-500 hover:-translate-y-1 hover:border-[#7d92ff]/40 hover:shadow-[0_34px_64px_-34px_rgba(27,57,245,0.45)] ${
        tall
          ? "aspect-[4/3] h-auto sm:aspect-[108/87] lg:aspect-auto lg:h-full"
          : "aspect-[16/10] h-auto sm:aspect-[83/42] lg:aspect-auto lg:h-full"
      } ${className}`}
    >
      {poster.image ? (
        <Image
          src={poster.image}
          alt={poster.title}
          fill
          sizes={tall ? "(max-width: 1024px) 100vw, 540px" : "(max-width: 1024px) 100vw, 400px"}
          referrerPolicy="no-referrer"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
      ) : (
        <span
          className="absolute inset-0"
          style={{ background: `linear-gradient(155deg, ${poster.tint} 0%, #0a152d 135%)` }}
          aria-hidden
        />
      )}

      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[#040814]/95 via-[#040814]/45 to-[#040814]/15"
      />

      <span className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-5">
        <span className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            {poster.logo ? (
              <span className="grid h-6 w-6 place-items-center rounded-lg border border-white/15 bg-black/45 backdrop-blur-md">
                <BrandIcon slug={poster.logo} size={13} color="#ffffff" />
              </span>
            ) : null}
            <span
              className="font-latin rounded-lg border border-white/15 bg-black/40 px-2.5 py-1 text-[9.5px] font-bold tracking-[0.18em] text-[#b4c2ff] backdrop-blur-md"
              dir="ltr"
            >
              {poster.kicker}
            </span>
          </span>
          <span className="grid h-7 w-7 place-items-center rounded-full border border-white/20 bg-black/40 text-white opacity-85 backdrop-blur-md transition-all duration-300 group-hover:bg-[#1b39f5] group-hover:opacity-100">
            <ArrowUpLeft className="h-3.5 w-3.5" />
          </span>
        </span>

        <span>
          <span
            className={`font-display font-latin block font-extrabold text-white ${
              tall ? "text-[22px] sm:text-[26px]" : "text-[17px] sm:text-[19px]"
            }`}
            dir="ltr"
          >
            {poster.title}
          </span>
          <span className="mt-1 line-clamp-1 block text-[11px] text-slate-200/80">
            {poster.summary}
          </span>
          <span className="mt-2 flex items-center justify-between gap-2 text-[10.5px]">
            <span className="font-semibold text-white/85">
              از <span className="font-latin font-bold text-white">{num(poster.priceFrom)}</span> تومان
            </span>
            <span className="font-bold text-[#99adff] transition-colors group-hover:text-white">
              مشاهده
            </span>
          </span>
        </span>
      </span>
    </Link>
  )
}
