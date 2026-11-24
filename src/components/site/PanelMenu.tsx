"use client"

import Link from "next/link"
import {
  Bell,
  ChevronLeft,
  Heart,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Package,
  Plus,
  ShieldCheck,
  UserCheck,
  UserRound,
  Wallet,
  type LucideIcon,
} from "lucide-react"
import { useFirebase } from "@/components/providers/FirebaseProvider"
import { cn, num, toman } from "@/lib/utils"

type PanelItem = {
  label: string
  href: string
  icon: LucideIcon
  badge?: number
  accent?: boolean
}

export default function PanelMenu({
  onNavigate,
  unreadNotifications = 0,
  variant ="desktop",
}: {
  onNavigate?: () => void
  unreadNotifications?: number
  variant?:"desktop" |"mobile"
}) {
  const { user, publicProfile, privateProfile, isAdmin, signOutUser } = useFirebase()

  const displayName = publicProfile?.displayName || user?.displayName || "کاربر اچ‌شاپ"
  const email = privateProfile?.email || user?.email || ""
  const plan = publicProfile?.plan || "عادی"
  const walletBalance = publicProfile?.walletBalance ?? 0
  const favoritesCount = publicProfile?.favorites?.length ?? 0
  const initial = displayName.trim().charAt(0) || "ک"

  const groups: PanelItem[][] = [
    [
      { label:"پیشخوان", href:"/dashboard", icon: LayoutDashboard },
      { label:"سفارش‌ها و تحویل", href:"/dashboard/orders", icon: Package },
      { label:"علاقه‌مندی‌ها", href:"/dashboard/favorites", icon: Heart, badge: favoritesCount || undefined },
    ],
    [
      { label:"تیکت‌های پشتیبانی", href:"/dashboard/tickets", icon: LifeBuoy },
      {
        label:"اطلاع‌رسانی‌ها",
        href:"/dashboard/notifications",
        icon: Bell,
        badge: unreadNotifications || undefined,
        accent: unreadNotifications > 0,
      },
      { label:"پروفایل و امنیت", href:"/dashboard/profile", icon: UserRound },
    ],
  ]

  return (
    <div className={cn("space-y-2", variant === "mobile" && "pt-1")}>
      <div className="flex items-center gap-2.5 px-1.5 pt-1">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#1b39f5] to-[#7d92ff] text-[15px] font-bold text-white shadow-[0_10px_22px_-12px_rgba(27,57,245,0.9)]">
          {initial}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="truncate text-[13px] font-bold text-[#0a1b33]">{displayName}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#1b39f5]/8 px-1.5 py-0.5 text-[9.5px] font-bold text-[#1b39f5]">
              <ShieldCheck className="h-3 w-3" />
              {plan}
            </span>
          </span>
          <span dir="ltr" className="num mt-0.5 block truncate text-right text-[10.5px] text-slate-400">
            {email}
          </span>
        </span>
      </div>

      <Link
        href="/dashboard/wallet"
        onClick={onNavigate}
        className="group flex items-center gap-2.5 rounded-[20px] bg-gradient-to-l from-[#1b39f5] to-[#4c63ff] px-3 py-2.5 text-white shadow-[0_18px_36px_-22px_rgba(27,57,245,0.95)] transition-transform hover:-translate-y-[1px]"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/18 backdrop-blur-sm">
          <Wallet className="h-4 w-4" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-semibold text-white/70">موجودی کیف پول</span>
          <span className="block text-[13px] font-bold">
            <span className="num">{toman(walletBalance)}</span>
            <span className="mr-1 text-[10.5px] font-semibold text-white/75">تومان</span>
          </span>
        </span>

        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10.5px] font-bold text-[#1b39f5]">
          <Plus className="h-3 w-3" />
          مشاهده
        </span>
      </Link>

      {isAdmin ? (
        <Link
          href="/admin"
          onClick={onNavigate}
          className="flex items-center justify-between rounded-[18px] bg-[#1b39f5]/8 px-3 py-2.5 text-[12px] font-bold text-[#1b39f5] transition-colors hover:bg-[#1b39f5]/14"
        >
          <span className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            پنل مدیریت فروشگاه
          </span>
          <ChevronLeft className="h-3.5 w-3.5" />
        </Link>
      ) : null}

      {groups.map((group, index) => (
        <div key={index} className="rounded-[20px] bg-[#f3f5fb] p-1">
          {group.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="group flex items-center gap-2.5 rounded-2xl px-2.5 py-2 transition-all hover:bg-white hover:shadow-[0_12px_26px_-20px_rgba(10,27,51,0.75)]"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors group-hover:bg-[#1b39f5]/8 group-hover:text-[#1b39f5]">
                <item.icon className="h-4 w-4" />
              </span>

              <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold text-[#334155] group-hover:text-[#0a1b33]">
                {item.label}
              </span>

              {item.badge ? (
                <span
                  className={cn(
                    "num grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[10px] font-bold",
                    item.accent
                      ? "bg-[#E56458] text-white"
                      : "bg-[#1b39f5]/8 text-[#1b39f5]",
                  )}
                >
                  {num(item.badge)}
                </span>
              ) : null}

              <ChevronLeft className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-transform group-hover:-translate-x-0.5 group-hover:text-[#1b39f5]" />
            </Link>
          ))}
        </div>
      ))}

      <button
        type="button"
        onClick={() => {
          void signOutUser()
          onNavigate?.()
        }}
        className="flex w-full items-center gap-2.5 rounded-[20px] bg-[#FDF1EF] px-3 py-2.5 text-[12px] font-bold text-[#A8382C] transition-colors hover:bg-[#FCE4E0]"
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/70 text-[#A8382C]">
          <LogOut className="h-4 w-4" />
        </span>
        خروج از حساب کاربری
      </button>
    </div>
  )
}
