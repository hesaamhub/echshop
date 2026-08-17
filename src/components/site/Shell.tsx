import Link from "next/link"
import Header from "@/components/site/Header"
import Footer from "@/components/site/Footer"

const SITE_URL = "https://echshop.ir"

/** پوستهٔ مشترک صفحات فروشگاه */
export default function Shell({
  children,
  title,
  subtitle,
  breadcrumb,
}: {
  children: React.ReactNode
  title?: string
  subtitle?: string
  breadcrumb?: { label: string; href?: string }[]
}) {
  // دادهٔ ساخت‌یافتهٔ مسیر صفحه — نمایش breadcrumb در نتایج گوگل
  const breadcrumbLd = breadcrumb?.length
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumb.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label,
          ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
        })),
      }
    : null

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1280px] px-4 md:px-6 py-10">
        {breadcrumbLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
          />
        ) : null}

        {breadcrumb?.length ? (
          <nav
            aria-label="مسیر صفحه"
            className="mb-4 flex flex-wrap items-center gap-2 text-[12px] text-slate-400"
          >
            {breadcrumb.map((item, index) => (
              <span key={`${item.label}-${index}`} className="flex items-center gap-2">
                {item.href ? (
                  <Link href={item.href} className="transition-colors hover:text-[#1b39f5]">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-slate-600">{item.label}</span>
                )}
                {index < breadcrumb.length - 1 ? <span aria-hidden>/</span> : null}
              </span>
            ))}
          </nav>
        ) : null}

        {title ? (
          <header className="mb-8">
            <h1 className="flex items-center gap-3 font-display text-[26px] md:text-[32px] font-semibold text-[#0a1b33]">
              <span className="h-7 w-1.5 shrink-0 rounded-full bg-[#1b39f5]" aria-hidden />
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-3 max-w-2xl text-[13px] leading-7 text-slate-500">{subtitle}</p>
            ) : null}
          </header>
        ) : null}

        {children}
      </main>
      <Footer />
    </>
  )
}
