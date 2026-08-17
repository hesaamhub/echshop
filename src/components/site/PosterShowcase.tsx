import Image from "next/image"
import Link from "next/link"
import { ArrowUpLeft } from "lucide-react"
import { homePosters, type HomePoster } from "@/lib/data"

/**
 * پنج قاب پوستر «جدیدترین محصولات»: دو قاب کناری راست، یک قاب بزرگ وسط و دو قاب کناری چپ.
 * محتوای قاب‌ها (تصویر و لینک) از homePosters در src/lib/data.ts خوانده می‌شود؛
 * صاحب فروشگاه فایل پوستر را در public/art می‌گذارد و آدرسش را در همان آرایه می‌نویسد.
 */
export default function PosterShowcase() {
  const [rightTop, rightBottom, center, leftTop, leftBottom] = homePosters

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr_1fr] lg:grid-rows-[190px_190px]">
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
      className={`group relative block overflow-hidden rounded-[22px] border border-[#1b39f5]/10 shadow-[0_22px_50px_-36px_rgba(10,27,51,0.6)] transition-all duration-500 hover:-translate-y-1 hover:border-[#1b39f5]/25 hover:shadow-[0_34px_64px_-34px_rgba(27,57,245,0.45)] ${
        tall
          ? "aspect-[108/87] h-auto lg:aspect-auto lg:h-full"
          : "aspect-[83/42] h-auto lg:aspect-auto lg:h-full"
      } ${className}`}
    >
      {poster.image ? (
        // نسبت قاب با نسبت پوستر یکی است تا متن پخته‌شده کراپ نشود؛
        // next/image به‌صورت خودکار نسخهٔ AVIF/WebP و سایز مناسب دستگاه را سرو می‌کند
        <Image
          src={poster.image}
          alt={poster.title}
          fill
          sizes={tall ? "(max-width: 1024px) 100vw, 540px" : "(max-width: 1024px) 100vw, 400px"}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      ) : (
        // قاب پیش‌فرض تا وقتی پوستر آپلود شود
        <>
          <span
            className="absolute inset-0"
            style={{ background: `linear-gradient(155deg, ${poster.tint} 0%, #0a152d 135%)` }}
            aria-hidden
          />
          <span
            className="absolute -top-16 -right-10 h-44 w-44 rounded-full blur-3xl"
            style={{ background: poster.tint, opacity: 0.45 }}
            aria-hidden
          />
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
            <span className="font-latin text-[10px] font-bold tracking-[0.22em] text-white/60" dir="ltr">
              {poster.kicker}
            </span>
            <span className="font-display font-latin text-[22px] font-extrabold leading-7 text-white" dir="ltr">
              {poster.title}
            </span>
          </span>
        </>
      )}

      {/* چیپ مشاهده هنگام هاور */}
      <span className="absolute bottom-3.5 right-3.5 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/35 px-3 py-1.5 text-[10.5px] font-bold text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
        مشاهده
        <ArrowUpLeft className="h-3 w-3" />
      </span>
    </Link>
  )
}
