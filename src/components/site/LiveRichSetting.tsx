"use client"

import { useEffect, useState } from "react"
import RichTextContent from "@/components/site/RichTextContent"
import { fetchSiteSettings, type FirestoreSiteSettings } from "@/lib/firebase/repository"

type RichField = "heroSubheadline" | "footerAbout" | "aboutDescription"

export default function LiveRichSetting({
  field,
  fallback,
  className,
}: {
  field: RichField
  fallback: string
  className?: string
}) {
  const [content, setContent] = useState(fallback)

  useEffect(() => {
    let active = true
    fetchSiteSettings()
      .then((res) => {
        if (!active) return
        const value = res.data[field as keyof FirestoreSiteSettings]
        if (typeof value === "string" && value.trim()) {
          setContent(value)
        }
      })
      .catch(() => {
        // در صورت خطا از مقدار پیش‌فرض SSR استفاده می‌شود
      })
    return () => {
      active = false
    }
  }, [field])

  return <RichTextContent content={content} className={className} />
}
