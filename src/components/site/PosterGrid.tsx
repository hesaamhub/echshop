import Image from "next/image"
import Link from "next/link"

type Tile = { id: string; image: string; alt: string; href: string; wide?: boolean }

/**
 * پنج بنر دسته‌بندی — تصویرهای نهایی در public/art قرار دارند.
 * برای تعویض هر بنر، فایل جدید را در public/art بگذارید و مسیرش را این‌جا بنویسید.
 */
const TILES: Tile[] = [
  { id: "ai", image: "/art/tile-ai.jpg", alt: "محصولات هوش مصنوعی", href: "/category/ai-tools", wide: true },
  { id: "stream", image: "/art/tile-stream.jpg", alt: "فیلم، سریال و موسیقی", href: "/category/music-video" },
  { id: "gaming", image: "/art/tile-gaming.jpg", alt: "گیمینگ و کنسول", href: "/category/gaming" },
  { id: "design", image: "/art/tile-design.jpg", alt: "طراحی و خلاقیت", href: "/category/design" },
  { id: "work", image: "/art/tile-work.jpg", alt: "کار و بهره‌وری", href: "/category/software" },
]

export default function PosterGrid() {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {TILES.map((tile) => (
        <Link
          key={tile.id}
          href={tile.href}
          aria-label={tile.alt}
          className={`group relative block overflow-hidden rounded-[24px] border border-black/5 shadow-[0_24px_50px_-36px_rgba(10,21,45,0.55)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_30px_60px_-34px_rgba(27,57,245,0.45)] ${
            tile.wide ? "aspect-[70/19] lg:col-span-2" : "aspect-[69/38]"
          }`}
        >
          {/* نسبت قاب با نسبت تصویر یکی است تا متن پخته‌شده کراپ نشود؛
              next/image به‌صورت خودکار نسخهٔ AVIF/WebP و سایز مناسب دستگاه را سرو می‌کند */}
          <Image
            src={tile.image}
            alt={tile.alt}
            fill
            sizes={tile.wide ? "(max-width: 1024px) 100vw, 1232px" : "(max-width: 1024px) 100vw, 608px"}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </Link>
      ))}
    </div>
  )
}
