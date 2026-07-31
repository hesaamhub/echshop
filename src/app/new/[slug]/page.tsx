import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, BadgeCheck, Check, Headphones, Zap } from "lucide-react"
import Header from "@/components/site/Header"
import Footer from "@/components/site/Footer"
import NewArrivalBanner from "@/components/site/NewArrivalBanner"
import { getNewArrival, newArrivals } from "@/lib/newArrivals"

function latinPrice(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}

export function generateStaticParams() {
  return newArrivals.map((item) => ({ slug: item.slug }))
}

export default async function NewArrivalPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = getNewArrival(slug)

  if (!item) notFound()

  const others = newArrivals.filter((entry) => entry.slug !== item.slug)

  return (
    <>
      <Header />
      <main className="pb-20 pt-6">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6">
          {/* مسیر */}
          <div className="flex items-center gap-2 text-[11.5px] text-slate-400">
            <Link href="/" className="transition-colors hover:text-[#1b39f5]">
              خانه
            </Link>
            <span>/</span>
            <Link href="/products" className="transition-colors hover:text-[#1b39f5]">
              محصولات
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#0a1b33]">{item.name}</span>
          </div>

          {/* بنر اصلی */}
          <div
            className="relative mt-4 overflow-hidden rounded-[32px] px-6 py-10 md:px-12 md:py-14"
            style={{ background: `linear-gradient(135deg, ${item.from} 0%, ${item.to} 100%)` }}
          >
            <span
              className="pointer-events-none absolute -left-16 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl"
              aria-hidden
            />
            <div className="relative max-w-[640px] text-white">
              <span className="font-latin inline-block rounded-full border border-white/40 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-[0.2em] backdrop-blur-sm">
                {item.kicker}
              </span>
              <h1 className="font-display mt-4 text-[26px] font-extrabold leading-10 md:text-[36px]">
                {item.name}
              </h1>
              <div className="font-latin mt-1 text-[15px] font-semibold text-white/70">{item.latinName}</div>
              <p className="mt-4 text-[13px] leading-7 text-white/85 md:text-[14px]">{item.tagline}</p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[12.5px] font-bold text-[#0a1b33] transition-transform hover:-translate-y-0.5"
                >
                  سفارش و فعال‌سازی فوری
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <div className="rounded-full border border-white/30 bg-white/10 px-5 py-3 text-[12px] font-semibold backdrop-blur-sm">
                  شروع از{" "}
                  <span className="font-latin" dir="ltr">
                    {latinPrice(item.priceFrom)}
                  </span>{" "}
                  تومان
                </div>
              </div>
            </div>
          </div>

          {/* محتوا */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_400px]">
            <div className="space-y-6">
              <section className="rounded-[26px] border border-slate-100 bg-white p-6">
                <h2 className="font-display text-[16px] font-extrabold text-[#0a1b33]">دربارهٔ این محصول</h2>
                <p className="mt-3 text-[13px] leading-8 text-slate-600">{item.description}</p>
              </section>

              <section className="rounded-[26px] border border-slate-100 bg-white p-6">
                <h2 className="font-display text-[16px] font-extrabold text-[#0a1b33]">چی دریافت می‌کنید؟</h2>
                <ul className="mt-4 grid gap-3 md:grid-cols-2">
                  {item.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 rounded-2xl bg-[#f7f8fb] p-3.5 text-[12.5px] leading-6 text-slate-600"
                    >
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#1b39f5] text-white">
                        <Check className="h-3 w-3" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-[26px] border border-slate-100 bg-white p-6">
                <h2 className="font-display text-[16px] font-extrabold text-[#0a1b33]">پرسش‌های پرتکرار</h2>
                <div className="mt-4 space-y-3">
                  {item.faq.map((entry) => (
                    <div key={entry.q} className="rounded-2xl border border-slate-100 p-4">
                      <div className="text-[13px] font-bold text-[#0a1b33]">{entry.q}</div>
                      <p className="mt-2 text-[12.5px] leading-7 text-slate-500">{entry.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* پلن‌ها */}
            <aside className="space-y-4">
              <div className="rounded-[26px] border border-slate-100 bg-white p-5">
                <h2 className="font-display text-[15px] font-extrabold text-[#0a1b33]">پلن‌های موجود</h2>
                <div className="mt-4 space-y-3">
                  {item.plans.map((plan) => (
                    <div
                      key={plan.title}
                      className="rounded-2xl border border-slate-100 p-4 transition-colors hover:border-[#1b39f5]/40"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-[13px] font-bold text-[#0a1b33]">{plan.title}</div>
                        <div className="font-latin text-[14px] font-bold text-[#1b39f5]" dir="ltr">
                          {latinPrice(plan.price)}
                        </div>
                      </div>
                      <p className="mt-1.5 text-[11.5px] leading-6 text-slate-500">{plan.note}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/contact"
                  className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#0a152d] px-5 py-3 text-[12.5px] font-bold text-white transition-colors hover:bg-[#1b39f5]"
                >
                  تماس با پشتیبانی برای خرید
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-2">
                {[
                  { icon: Zap, text: "فعال‌سازی فوری پس از پرداخت" },
                  { icon: BadgeCheck, text: "اورجینال و با گارانتی دورهٔ اشتراک" },
                  { icon: Headphones, text: "پشتیبانی فارسی در تمام مدت" },
                ].map((assurance) => (
                  <div
                    key={assurance.text}
                    className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 text-[12px] font-semibold text-slate-600"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#1b39f5]/10 text-[#1b39f5]">
                      <assurance.icon className="h-4 w-4" />
                    </span>
                    {assurance.text}
                  </div>
                ))}
              </div>
            </aside>
          </div>

          {/* سایر تازه‌رسیده‌ها */}
          <section className="mt-14">
            <h2 className="font-display flex items-center gap-2.5 text-[17px] font-extrabold text-[#0a1b33]">
              <span className="h-6 w-1.5 rounded-full bg-[#1b39f5]" />
              بقیهٔ تازه‌رسیده‌ها
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((entry) => (
                <NewArrivalBanner key={entry.slug} item={entry} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
