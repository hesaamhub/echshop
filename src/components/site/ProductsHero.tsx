import Link from "next/link"
import { Search } from "lucide-react"
import { products } from "@/lib/data"
import { num, toman } from "@/lib/utils"
import BrandIcon from "./BrandIcon"
import ProductPoster from "./ProductPoster"

/** پنج محصول پرفروش — بادبزن پوسترهای داخل هیرو */
const fanProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5)

/** قاب‌بندی بادبزن — چرخش و برآمدگی هر پوستر (سمت راست در RTL) */
const FAN_STYLE = [
  { rotate: "12deg", lift: 34, height: "h-[235px] md:h-[300px]", show: "hidden min-[560px]:block" },
  { rotate: "6deg", lift: 16, height: "h-[258px] md:h-[330px]", show: "hidden min-[420px]:block" },
  { rotate: "0deg", lift: 0, height: "h-[280px] md:h-[360px]", show: "block" },
  { rotate: "-6deg", lift: 16, height: "h-[258px] md:h-[330px]", show: "hidden min-[420px]:block" },
  { rotate: "-12deg", lift: 34, height: "h-[235px] md:h-[300px]", show: "hidden min-[560px]:block" },
]

/** کمترین قیمت میان پلن‌های محصول */
function minPrice(product: (typeof products)[number]) {
  return Math.min(...product.plans.map((plan) => plan.price))
}

/**
 * هیروی صفحهٔ محصولات — پنل تیره با بادبزن پوسترهای تبلیغاتی برندها.
 * هر کارت یک مینی‌پوستر تبلیغاتی کامل است: آرت برند (گرادیان + موتیف +
 * وردمارک توخالی + نشان)، برچسب، امتیاز، عنوان و کمترین قیمت.
 */
export default function ProductsHero() {
  return (
    <section className="relative flex min-h-[580px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(120%_100%_at_50%_0%,#16224a_0%,#0b1226_55%,#080e1f_100%)] shadow-[0_40px_80px_-40px_rgba(8,14,31,0.6)] md:min-h-[640px]">
      {/* بافت شبکه‌ای ظریف */}
      <span
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(70% 60% at 50% 28%, #000 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(70% 60% at 50% 28%, #000 0%, transparent 75%)",
        }}
        aria-hidden
      />
      {/* هالهٔ آبی بالای پنل */}
      <span
        className="pointer-events-none absolute -top-[140px] left-1/2 h-[320px] w-[560px] -translate-x-1/2 rounded-full bg-[#1b39f5]/20 blur-[110px]"
        aria-hidden
      />

      {/* نشان‌های شناور برند لبه‌های پنل */}
      <span className="pointer-events-none absolute left-24 top-40 hidden -rotate-12 lg:grid h-14 w-14 place-items-center rounded-2xl border border-white/12 bg-white/[0.06] shadow-[0_18px_34px_-14px_rgba(0,0,0,0.5)] backdrop-blur-md" aria-hidden>
        <BrandIcon slug="spotify" size={26} color="#ffffff" />
      </span>
      <span className="pointer-events-none absolute right-28 top-32 hidden rotate-12 lg:grid h-16 w-16 place-items-center rounded-2xl border border-white/12 bg-white/[0.06] shadow-[0_18px_34px_-14px_rgba(0,0,0,0.5)] backdrop-blur-md" aria-hidden>
        <BrandIcon slug="netflix" size={30} color="#ffffff" />
      </span>
      <span className="pointer-events-none absolute bottom-44 left-40 hidden rotate-6 opacity-80 lg:grid h-11 w-11 place-items-center rounded-xl border border-white/12 bg-white/[0.06] backdrop-blur-md" aria-hidden>
        <BrandIcon slug="canva" size={20} color="#ffffff" />
      </span>

      {/* متن و جستجو */}
      <div className="relative z-10 px-6 pt-12 text-center md:pt-14">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#f59e0b]/40 bg-[#f59e0b]/10 px-4 py-1.5 text-[12.5px] font-extrabold text-[#fbbf24]">
          <span className="h-[7px] w-[7px] rounded-full bg-[#fbbf24] shadow-[0_0_0_4px_rgba(251,191,36,0.18)]" aria-hidden />
          ۴۰+ برند رسمی با گارانتی
        </span>
        <h1 className="mt-4 font-display text-[30px] font-extrabold leading-[1.35] text-white md:text-[44px]">
          همهٔ اکانت‌ها و لایسنس‌ها
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[13px] font-medium leading-7 text-[#94a3c7] md:text-[15px]">
          هر اشتراکی که لازم داری اینجاست — قیمت منصفانه، تحویل در چند دقیقه و گارانتی واقعی.
          جستجو کن، مقایسه کن، همین حالا فعالش کن.
        </p>

        <form action="/products" className="relative mx-auto mt-6 w-full max-w-md">
          <span className="pointer-events-none absolute inset-y-0 start-4 grid place-items-center text-[#8b96b8]">
            <Search className="h-[18px] w-[18px]" />
          </span>
          <input
            type="search"
            name="q"
            aria-label="جستجوی محصول"
            placeholder="جستجوی محصول، برند یا دسته‌بندی…"
            className="h-12 w-full rounded-full border border-white/15 bg-white/[0.07] ps-12 pe-4 text-[14px] font-semibold text-white outline-none backdrop-blur-md transition-colors placeholder:text-[#8b96b8] focus:border-[#7d92ff]/60 focus:bg-white/[0.1]"
          />
        </form>
      </div>

      {/* بادبزن پوسترهای تبلیغاتی محصولات */}
      <div className="relative z-10 mt-auto flex items-end justify-center pt-10">
        {fanProducts.map((product, index) => {
          const style = FAN_STYLE[index]

          return (
            <span
              key={product.id}
              className={`-mx-3 block md:-mx-4 ${style.show}`}
              style={{
                transform: `rotate(${style.rotate}) translateY(${style.lift}px)`,
                transformOrigin: "bottom center",
              }}
            >
              <Link
                href={`/products/${product.slug}`}
                className={`group relative block w-[140px] overflow-hidden rounded-t-[22px] border border-white/15 shadow-[0_-24px_50px_-20px_rgba(0,0,0,0.65)] transition-transform duration-500 hover:-translate-y-2 md:w-[185px] lg:w-[205px] ${style.height}`}
              >
                {/* آرت پوستر برند — گرادیان + موتیف + وردمارک توخالی + نشان بزرگ */}
                <ProductPoster slug={product.logo} brand={product.brand} />

                {/* برچسب محصول */}
                {product.badge ? (
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-extrabold text-white backdrop-blur-md">
                    {product.badge}
                  </span>
                ) : null}
                {/* امتیاز */}
                <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-extrabold text-[#fbbf24] backdrop-blur-md">
                  ★ <span className="font-latin">{num(product.rating)}</span>
                </span>

                {/* نوار اطلاعات پایین پوستر */}
                <span className="absolute inset-x-0 bottom-0 z-10 block border-t border-white/12 bg-[#060b1a]/75 px-3.5 py-2.5 text-right backdrop-blur-md">
                  <span className="block truncate text-[12px] font-bold text-white">
                    {product.title}
                  </span>
                  <span className="mt-1.5 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold text-white/55">
                      از <span className="font-latin">{toman(minPrice(product))}</span> تومان
                    </span>
                    <span className="rounded-full bg-white/12 px-2.5 py-0.5 text-[9.5px] font-bold text-white transition-colors duration-300 group-hover:bg-[#1b39f5]">
                      خرید
                    </span>
                  </span>
                </span>
              </Link>
            </span>
          )
        })}
      </div>
    </section>
  )
}
