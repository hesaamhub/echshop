import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, BadgeCheck, Check, Headphones, Zap } from "lucide-react"
import Header from "@/components/site/Header"
import Footer from "@/components/site/Footer"
import NewArrivalBanner, { ART_IMAGES } from "@/components/site/NewArrivalBanner"
import { getNewArrival, newArrivals } from "@/lib/newArrivals"

function latinPrice(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}

export function generateStaticParams() {
  return newArrivals.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const item = getNewArrival(slug)
  if (!item) return { title: "محصول یافت نشد" }

  return {
    title: `${item.name} — تازه رسیده در اچ‌شاپ`,
    description: `${item.pitch} شروع قیمت از ${latinPrice(item.priceFrom)} تومان؛ فعال‌سازی فوری و گارانتی کامل.`,
    alternates: { canonical: `/new/${item.slug}` },
    openGraph: {
      title: `${item.name} | اچ‌شاپ`,
      description: item.pitch,
      url: `/new/${item.slug}`,
    },
  }
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

  // دادهٔ ساخت‌یافتهٔ پرسش‌های پرتکرار این محصول
  const faqLd =
    item.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: item.faq.map((entry) => ({
            "@type": "Question",
            name: entry.q,
            acceptedAnswer: { "@type": "Answer", text: entry.a },
          })),
        }
      : null

  return (
    <>
      <Header />
      {faqLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      ) : null}
      <main className="pb-14 sm:pb-20 pt-4 sm:pt-6">
        <div className="mx-auto max-w-[1400px] px-3 sm:px-4 md:px-6">
          {/* مسیر */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11.5px] text-slate-400">
            <Link href="/" className="transition-colors hover:text-[#1b39f5]">
              خانه
            </Link>
            <span>/</span>
            <Link href="/products" className="transition-colors hover:text-[#1b39f5]">
              محصولات
            </Link>
            <span>/</span>
            <span className="font-latin font-semibold text-[#0a1b33]">{item.name}</span>
          </div>

          {/* بنر تصویری اصلی */}
          <div className="relative mt-4 overflow-hidden rounded-[24px] sm:rounded-[32px] px-5 py-8 sm:px-6 sm:py-12 md:px-12 md:py-16">
            <span
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${ART_IMAGES[item.art]})` }}
              aria-hidden
            />
            <span
              className="absolute inset-0"
              style={{ background: `linear-gradient(100deg, ${item.to}f2 0%, ${item.from}b3 62%, rgba(0,0,0,0.1) 100%)` }}
              aria-hidden
            />
            <span
              className="pointer-events-none absolute -left-16 -top-24 h-72 w-72 rounded-full blur-[80px]"
              style={{ background: item.accent, opacity: 0.45 }}
              aria-hidden
            />

            <div className="relative max-w-[620px] text-white">
              <span
                className="font-latin inline-block rounded-md px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-[0.22em] text-[#0b1020]"
                style={{ background: item.accent }}
              >
                {item.badge}
              </span>
              <div className="font-latin mt-3 text-[10px] font-bold uppercase tracking-[0.24em] text-white/60">
                {item.kicker}
              </div>
              <h1 className="font-latin font-display mt-2 text-[26px] sm:text-[32px] font-extrabold leading-tight md:text-[46px]">
                {item.name}
              </h1>
              <p className="mt-2.5 sm:mt-3 text-[13.5px] sm:text-[15px] font-bold leading-7 sm:leading-8 text-white md:text-[17px]">{item.pitch}</p>
              <p className="mt-1 text-[12px] sm:text-[12.5px] leading-7 text-white/70">{item.tagline}</p>

              <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-2.5 sm:gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg px-5 sm:px-7 py-2.5 sm:py-3 text-[12px] sm:text-[12.5px] font-extrabold text-[#0b1020] transition-transform hover:-translate-y-0.5"
                  style={{ background: item.accent }}
                >
                  خرید و فعال‌سازی فوری
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <div className="rounded-lg border border-white/30 bg-white/10 px-4 sm:px-5 py-2.5 sm:py-3 text-[11.5px] sm:text-[12px] font-semibold backdrop-blur-sm">
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
          <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 lg:grid-cols-[1fr_400px]">
            <div className="space-y-4 sm:space-y-6">
              <section className="rounded-[22px] sm:rounded-[26px] border border-slate-100 bg-white p-4 sm:p-6">
                <h2 className="font-display text-[15px] sm:text-[16px] font-extrabold text-[#0a1b33]">دربارهٔ این محصول</h2>
                <p className="mt-2.5 sm:mt-3 text-[12.5px] sm:text-[13px] leading-7 sm:leading-8 text-slate-600">{item.description}</p>
              </section>

              <section className="rounded-[22px] sm:rounded-[26px] border border-slate-100 bg-white p-4 sm:p-6">
                <h2 className="font-display text-[15px] sm:text-[16px] font-extrabold text-[#0a1b33]">چی دریافت می‌کنید؟</h2>
                <ul className="mt-3.5 sm:mt-4 grid gap-2.5 sm:gap-3 md:grid-cols-2">
                  {item.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 rounded-2xl bg-[#f7f8fb] p-3 sm:p-3.5 text-[12px] sm:text-[12.5px] leading-6 text-slate-600"
                    >
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#1b39f5] text-white">
                        <Check className="h-3 w-3" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-[22px] sm:rounded-[26px] border border-slate-100 bg-white p-4 sm:p-6">
                <h2 className="font-display text-[15px] sm:text-[16px] font-extrabold text-[#0a1b33]">پرسش‌های پرتکرار</h2>
                <div className="mt-3.5 sm:mt-4 space-y-2.5 sm:space-y-3">
                  {item.faq.map((entry) => (
                    <div key={entry.q} className="rounded-2xl border border-slate-100 p-3.5 sm:p-4">
                      <div className="text-[12.5px] sm:text-[13px] font-bold text-[#0a1b33]">{entry.q}</div>
                      <p className="mt-1.5 sm:mt-2 text-[12px] sm:text-[12.5px] leading-7 text-slate-500">{entry.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* پلن‌ها */}
            <aside className="space-y-4">
              <div className="rounded-[22px] sm:rounded-[26px] border border-slate-100 bg-white p-4 sm:p-5">
                <h2 className="font-display text-[15px] font-extrabold text-[#0a1b33]">پلن‌های موجود</h2>
                <div className="mt-4 space-y-2.5 sm:space-y-3">
                  {item.plans.map((plan) => (
                    <div
                      key={plan.title}
                      className="rounded-2xl border border-slate-100 p-3.5 sm:p-4 transition-colors hover:border-[#1b39f5]/40"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[12.5px] sm:text-[13px] font-bold text-[#0a1b33]">{plan.title}</div>
                        <div className="font-latin shrink-0 text-[13.5px] sm:text-[14px] font-bold text-[#1b39f5]" dir="ltr">
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
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#1b39f5]/10 text-[#1b39f5]">
                      <assurance.icon className="h-4 w-4" />
                    </span>
                    {assurance.text}
                  </div>
                ))}
              </div>
            </aside>
          </div>

          {/* سایر تازه‌رسیده‌ها */}
          <section className="mt-10 sm:mt-14">
            <h2 className="font-display flex items-center gap-2.5 text-[16px] sm:text-[17px] font-extrabold text-[#0a1b33]">
              <span className="h-6 w-1.5 rounded-full bg-[#1b39f5]" />
              بقیهٔ تازه‌رسیده‌ها
            </h2>
            <div className="mt-4 sm:mt-5 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
