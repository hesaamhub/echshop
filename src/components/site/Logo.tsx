/**
 * نشان (لوگو) اچ‌شاپ — ستارهٔ چهارپرِ چرخان با گرادیان آبی.
 * چون وکتور است، در هر اندازه‌ای (فاوآیکون تا بنر) کاملاً شارپ می‌ماند.
 */
export default function Logo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="اچ‌شاپ"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="echshopMark" x1="6%" y1="4%" x2="94%" y2="96%">
          <stop offset="0%" stopColor="#3AA6F7" />
          <stop offset="42%" stopColor="#1546CF" />
          <stop offset="100%" stopColor="#0A1A6B" />
        </linearGradient>
      </defs>
      <path
        fill="url(#echshopMark)"
        d="M50 4 C 52 30, 70 48, 96 50 C 70 52, 52 70, 50 96 C 48 70, 30 52, 4 50 C 30 48, 48 30, 50 4 Z"
      />
    </svg>
  )
}
