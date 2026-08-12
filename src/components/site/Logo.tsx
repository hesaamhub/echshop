import { LOGO_DATA_URI } from "@/lib/logoData"

/**
 * نشان (لوگو) رسمی اچ‌شاپ — کلید سه‌بعدی آبی با لبخند.
 * تصویر به‌صورت data URI در src/lib/logoData.ts نگه‌داری می‌شود تا
 * بدون هیچ درخواست شبکه‌ای در همهٔ بخش‌های سایت آماده باشد.
 */
export default function Logo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <img
      src={LOGO_DATA_URI}
      alt="اچ‌شاپ"
      width={128}
      height={128}
      loading="eager"
      className={`${className} object-cover`}
    />
  )
}
