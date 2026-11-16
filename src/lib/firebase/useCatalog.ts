"use client"

import { useEffect, useState } from "react"
import { categories as defaultCategories, products as defaultProducts } from "@/lib/data"
import { fetchCategories, fetchProducts } from "@/lib/firebase/repository"
import type { Category, Product } from "@/lib/types"

export function useCatalog() {
  const [products, setProducts] = useState<Product[]>(defaultProducts)
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [fromFirestore, setFromFirestore] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let active = true
    Promise.all([
      fetchProducts(false).catch(() => ({ items: defaultProducts, fromFirestore: false })),
      fetchCategories(false).catch(() => ({ items: defaultCategories, fromFirestore: false })),
    ]).then(([prodRes, catRes]) => {
      if (!active) return
      setProducts(prodRes.items.length ? prodRes.items : defaultProducts)
      setCategories(catRes.items.length ? catRes.items : defaultCategories)
      setFromFirestore(prodRes.fromFirestore || catRes.fromFirestore)
      setLoaded(true)
    })
    return () => {
      active = false
    }
  }, [])

  return { products, categories, fromFirestore, loaded }
}
