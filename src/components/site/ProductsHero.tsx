import Link from "next/link"
import { Search } from "lucide-react"
import { products } from "@/lib/data"
import { num, toman } from "@/lib/utils"
import BrandIcon from "./BrandIcon"

/** پنج محصول پرفروش — بادبزن کارت‌های داخل هیرو */
const fanProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5)

/** قاب‌بندی بادبزن — چرخش و برآمدگی هر کارت (سمت راست در RTL) */
const FAN_STYLE = [
  { rotate: "12deg", lift: 30, height: "h-[210px] md:h-[270px]", show: "hidden min-[560px]:block" },
  { rotate: "6deg", lift: 14, height: "h-[230px] md:h-[295px]", show: "hidden min-[420px]:block" },
  { rotate: "0deg", lift: 0, height: "h-[250px] md:h-[320px]", show: "block" },
  { rotate: "-6deg", lift: 14, height: "h-[230px] md:h-[295px]", show: "hidden min-[420px]:block" },
  { rotate: "-12deg", lift: 30, height: "h-[210px] md:h-[270px]", show: "hidden min-[560px]:block" },
]

/** کمترین قیمت میان پلن‌های محصول */
function minPrice(product: (typeof products)[number]) {
  return Math.min(...product.plans.map((plan) => plan.price))
}

/**
 * هیروی صفحهٔ محصولات — پنل تیره با بادبزن کارت‌های رنگی برندها.
 * الهام از رابط‌های فروشگاه بازی (کارت‌های کمیاب رو به بیننده).
 */
export default function ProductsHero() {
  return (
    <section className="relative flex min-h-[560px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(120%_100%_at_50%_0%,#16224a_0%,#0b1226_55%,#080e1f_100%)] shadow-[0_40px_80px_-40px_rgba(8,14,31,0.6)] md:min-h-[620px]">
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
          بیش از ۴۰ برند جهانی با تحویل فوری، خودکار یا دستی — همه با گارانتی و پشتیبانی فارسی.
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

      {/* بادبزن کارت‌های برند */}
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
                className={`group relative block w-[132px] overflow-hidden rounded-t-[20px] border border-white/10 bg-gradient-to-b shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:-translate-y-1.5 md:w-[180px] lg:w-[200px] ${style.height} ${product.gradient}`}
              >
                {/* هالهٔ پشت نشان */}
                <span
                  className="pointer-events-none absolute left-1/2 top-[18%] h-[120px] w-[120px] -translate-x-1/2 rounded-full bg-white/25 blur-[46px]"
                  aria-hidden
                />
                {/* نشان برند */}
                <span className="absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_14px_30px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:scale-110">
                  <BrandIcon slug={product.logo} size={64} color="#ffffff" />
                </span>
                {/* نشان امتیاز */}
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-extrabold text-white backdrop-blur-md">
                  ★ {num(product.rating)}
                </span>
                {/* نام و قیمت */}
                <span className="absolute inset-x-0 bottom-0 block bg-gradient-to-t from-[#040812bf] to-transparent px-3.5 pb-4 pt-8 text-right">
                  <span className="wordmark block text-[14px] font-bold text-white">{product.brand}</span>
                  <span className="mt-1 block text-[11px] font-semibold text-white/60">
                    از <span className="font-latin">{toman(minPrice(product))}</span> تومان
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
