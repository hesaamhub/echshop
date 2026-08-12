import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* سازنده‌های Intl یک بار ساخته می‌شوند و در همهٔ فراخوان‌ها بازاستفاده می‌شوند */
const numberFormatter = new Intl.NumberFormat("en-US")
const dateFormatter = new Intl.DateTimeFormat("fa-IR-u-nu-latn", {
  year: "numeric",
  month: "long",
  day: "numeric",
})

/** تبدیل ارقام فارسی و عربی به لاتین */
export function latinDigits(value: string | number) {
  const fa = "۰۱۲۳۴۵۶۷۸۹"
  const ar = "٠١٢٣٤٥٦٧٨٩"

  return String(value)
    .split("")
    .map((char) => {
      const faIndex = fa.indexOf(char)
      if (faIndex > -1) return String(faIndex)
      const arIndex = ar.indexOf(char)
      if (arIndex > -1) return String(arIndex)
      return char
    })
    .join("")
}

/** همهٔ عددهای دادهای (قیمت، تعداد، درصد) با رقم لاتین نمایش داده می‌شوند */
export function num(value: number) {
  return numberFormatter.format(value)
}

/** قیمت با جداکنندهٔ هزارگان و رقم لاتین */
export function toman(value: number) {
  return num(value)
}

/** تاریخ شمسی با نام ماه فارسی و رقم لاتین */
export function faDate(iso: string) {
  return dateFormatter.format(new Date(iso))
}

export function discountPercent(price: number, compareAt?: number) {
  if (!compareAt || compareAt <= price) return 0
  return Math.round(((compareAt - price) / compareAt) * 100)
}
