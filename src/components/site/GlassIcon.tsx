import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type GlassIconSize = "sm" | "md" | "lg"

const boxSize: Record<GlassIconSize, string> = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-14 w-14",
}

const glyphSize: Record<GlassIconSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
}

/**
 * آیکون شیشه‌ای دولایه:
 * یک فرم توپر آبی پشت، یک صفحهٔ شیشه‌ای نیمه‌شفاف روی آن، و نماد آبی در بالاترین لایه.
 */
export default function GlassIcon({
  icon: Icon,
  size = "md",
  className,
}: {
  icon: LucideIcon
  size?: GlassIconSize
  className?: string
}) {
  return (
    <span className={cn("glass-icon shrink-0", boxSize[size], className)}>
      <span className="glass-icon-blob" aria-hidden />
      <span className="glass-icon-plate" aria-hidden />
      <Icon
        className={cn("relative z-10 text-[#1b39f5]", glyphSize[size])}
        strokeWidth={2.1}
      />
    </span>
  )
}
