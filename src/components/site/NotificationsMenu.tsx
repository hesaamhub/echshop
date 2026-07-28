import Link from "next/link"
import { BellRing, CheckCheck, ChevronLeft, Gift, PackageCheck, TicketCheck } from "lucide-react"
import { notifications } from "@/lib/data"
import { cn, faDate, num } from "@/lib/utils"

export const unreadCount = notifications.filter((item) => item.unread).length

const toneIcons = [PackageCheck, TicketCheck, Gift]

export default function NotificationsMenu({
  onNavigate,
  limit = 4,
}: {
  onNavigate?: () => void
  limit?: number
}) {
  const items = notifications.slice(0, limit)

  return (
    <div className="space-y-1">
      {/* سربرگ */}
      <div className="flex items-center justify-between gap-2 border-b border-[#1b39f5]/10 px-2.5 pb-2.5 pt-1.5">
        <span className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-[14px] bg-gradient-to-br from-[#1b39f5] to-[#7d92ff] text-white shadow-[0_10px_22px_-14px_rgba(27,57,245,0.9)]">
            <BellRing className="h-4 w-4" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[13px] font-bold text-[#0a1b33]">اطلاع‌رسانی‌ها</span>
            <span className="text-[10.5px] text-slate-400">
              <span className="num">{num(unreadCount)}</span> پیام خوانده‌نشده
            </span>
          </span>
        </span>

        <button
          type="button"
          className="flex items-center gap-1 rounded-full bg-[#1b39f5]/8 px-2.5 py-1.5 text-[10px] font-bold text-[#1b39f5] transition-colors hover:bg-[#1b39f5]/14"
        >
          <CheckCheck className="h-3.5 w-3.5" />
          خواندم
        </button>
      </div>

      {/* فهرست پیام‌ها */}
      <div className="space-y-0.5 rounded-[20px] bg-[#f3f5fb] p-1">
        {items.map((item, index) => {
          const Icon = toneIcons[index % toneIcons.length]

          return (
            <Link
              key={item.id}
              href="/dashboard/notifications"
              onClick={onNavigate}
              className="group flex gap-2.5 rounded-[16px] px-2.5 py-2.5 transition-all hover:bg-white hover:shadow-[0_12px_26px_-20px_rgba(10,27,51,0.75)]"
            >
              <span
                className={cn(
                  "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl",
                  item.unread
                    ? "bg-[#1b39f5]/10 text-[#1b39f5]"
                    : "bg-white text-slate-400 group-hover:bg-[#f3f5fb]",
                )}
              >
                <Icon className="h-4 w-4" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="truncate text-[12.5px] font-bold text-[#0a1b33]">
                    {item.title}
                  </span>
                  {item.unread ? (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#E56458]" aria-hidden />
                  ) : null}
                </span>
                <span className="mt-1 block line-clamp-2 text-[11px] leading-6 text-slate-500">
                  {item.body}
                </span>
                <span className="mt-1 block text-[10px] text-slate-400">{faDate(item.at)}</span>
              </span>
            </Link>
          )
        })}
      </div>

      {/* پاورقی */}
      <Link
        href="/dashboard/notifications"
        onClick={onNavigate}
        className="flex items-center justify-between rounded-[16px] bg-[#1b39f5]/6 px-3 py-2.5 text-[11.5px] font-bold text-[#1b39f5] transition-colors hover:bg-[#1b39f5]/12"
      >
        مشاهدهٔ همهٔ اطلاع‌رسانی‌ها
        <ChevronLeft className="h-4 w-4" />
      </Link>
    </div>
  )
}
