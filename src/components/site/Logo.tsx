import Image from "next/image"

/**
 * نشان (لوگو) رسمی اچ‌شاپ.
 * فایل اصلی در public/logo.png قرار دارد؛ برای عوض کردن لوگو فقط
 * همان فایل را جایگزین کنید — همهٔ سایت خودبه‌خود به‌روز می‌شود.
 */
export default function Logo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="اچ‌شاپ"
      width={128}
      height={128}
      priority
      className={`${className} object-contain`}
    />
  )
}
