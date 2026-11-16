"use client"

import { useEffect, useState } from "react"
import RichTextContent from "@/components/site/RichTextContent"
import { siteContent } from "@/lib/data"
import { fetchSiteSettings } from "@/lib/firebase/repository"

export default function AboutStorySection() {
  const [aboutHtml, setAboutHtml] = useState(siteContent.about.description)

  useEffect(() => {
    let active = true
    fetchSiteSettings()
      .then((res) => {
        if (!active) return
        if (res.data.aboutDescription) {
          setAboutHtml(res.data.aboutDescription)
        } else if (res.data.footerAbout) {
          setAboutHtml(res.data.footerAbout)
        }
      })
      .catch(() => {
        // در حالت آفلاین متن پیش‌فرض نمایش داده می‌شود
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="mb-8 rounded-[32px] border border-[#1b39f5]/10 bg-white p-7 shadow-[0_22px_48px_-36px_rgba(27,57,245,0.45)] md:p-8">
      <h2 className="flex items-center gap-3 font-display text-[19px] font-semibold text-[#0a1b33]">
        <span className="h-5 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
        معرفی فروشگاه
      </h2>
      <RichTextContent
        content={aboutHtml}
        className="mt-4 text-[13.5px] leading-8 text-slate-600"
      />
    </section>
  )
}
