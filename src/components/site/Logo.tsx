/* eslint-disable @next/next/no-img-element -- نشان برند data-URI است و بهینه‌سازی next/image سودی ندارد */
import { LOGO_MARK_URI } from "@/lib/brandMark"

/**
 * نشان (لوگو) رسمی اچ‌شاپ — کلید سه‌بعدی آبی با لبخند، بدون پس‌زمینه.
 * تصویر به‌صورت data URI در src/lib/brandMark.ts نگه‌داری می‌شود تا
 * بدون هیچ درخواست شبکه‌ای در همهٔ بخش‌های سایت آماده باشد.
 */
export default function Logo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <img
      src={LOGO_MARK_URI}
      alt="اچ‌شاپ"
      width={144}
      height={144}
      loading="eager"
      className={`${className} object-cover`}
    />
  )
}
