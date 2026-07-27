import Header from "@/components/site/Header"
import Footer from "@/components/site/Footer"

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
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 md:px-6 py-10">
        {breadcrumb?.length ? (
          <nav className="mb-4 flex flex-wrap items-center gap-2 text-[12px] text-slate-400">
            {breadcrumb.map((item, index) => (
              <span key={`${item.label}-${index}`} className="flex items-center gap-2">
                {item.href ? (
                  <a href={item.href} className="hover:text-[#0a1b33] transition-colors">
                    {item.label}
                  </a>
                ) : (
                  <span className="text-slate-600">{item.label}</span>
                )}
                {index < breadcrumb.length - 1 ? <span>/</span> : null}
              </span>
            ))}
          </nav>
        ) : null}

        {title ? (
          <header className="mb-8">
            <h1 className="font-display text-[26px] md:text-[32px] font-semibold text-[#0a1b33]">
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
