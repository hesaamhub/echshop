"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, Trash2 } from "lucide-react"
import BrandIcon from "@/components/site/BrandIcon"
import { useFirebase } from "@/components/providers/FirebaseProvider"
import { Card } from "@/components/panel/Ui"
import { toggleUserFavorite } from "@/lib/firebase/repository"
import { useCatalog } from "@/lib/firebase/useCatalog"
import { lowestPrice } from "@/lib/data"
import { toman } from "@/lib/utils"

export default function FavoritesPage() {
  const { user, publicProfile, refreshProfile } = useFirebase()
  const { products } = useCatalog()
  const [busyId, setBusyId] = useState("")

  const favoriteIds = publicProfile?.favorites ?? []
  const favorites = products.filter((p) => favoriteIds.includes(p.id))

  async function handleRemove(productId: string) {
    if (!user) return
    setBusyId(productId)
    try {
      await toggleUserFavorite(user.uid, favoriteIds, productId)
      await refreshProfile()
    } finally {
      setBusyId("")
    }
  }

  return (
    <div className="space-y-4">
      <Card title="علاقه‌مندی‌های من">
        {favorites.length === 0 ? (
          <div className="py-8 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#FCEAE8] text-[#A8382C]">
              <Heart className="h-5 w-5" />
            </span>
            <p className="mt-3 text-[13px] font-semibold text-[#0a1b33]">هنوز محصولی به علاقه‌مندی‌ها اضافه نکرده‌اید</p>
            <Link
              href="/products"
              className="glass-solid mt-4 inline-flex rounded-full px-5 py-2.5 text-[12px] font-semibold"
            >
              مشاهدهٔ محصولات
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200/70 p-4"
              >
                <div
                  className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${product.gradient}`}
                >
                  <BrandIcon slug={product.logo} size={22} color="#ffffff" />
                </div>

                <div className="min-w-[160px] flex-1">
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-[13px] font-bold text-[#0a1b33] hover:text-[#1b39f5]"
                  >
                    {product.title}
                  </Link>
                  <p className="mt-1 text-[11.5px] text-slate-500">
                    شروع از <span className="num">{toman(lowestPrice(product))}</span> تومان
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/products/${product.slug}`}
                    className="rounded-full bg-[#0a152d] px-5 py-2.5 text-[11.5px] font-semibold text-white"
                  >
                    خرید
                  </Link>
                  <button
                    type="button"
                    disabled={busyId === product.id}
                    onClick={() => void handleRemove(product.id)}
                    className="grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-red-50 hover:text-[#E56458]"
                    aria-label={`حذف ${product.title} از علاقه‌مندی‌ها`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
