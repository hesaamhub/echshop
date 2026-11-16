import { doc, serverTimestamp, writeBatch } from "firebase/firestore"
import { categories, posts, products, siteContent } from "@/lib/data"
import { db, handleFirestoreError, OperationType } from "@/lib/firebase/client"

export async function seedInitialDatabase(): Promise<{
  categories: number
  products: number
  posts: number
  discounts: number
}> {
  const batch = writeBatch(db)
  const now = serverTimestamp()

  categories.forEach((category, index) => {
    const ref = doc(db, "categories", category.slug)
    batch.set(ref, {
      slug: category.slug,
      title: category.title,
      description: category.description,
      icon: category.icon,
      count: category.count,
      order: index + 1,
      isActive: true,
      updatedAt: now,
    })
  })

  products.forEach((product) => {
    const ref = doc(db, "products", product.id)
    batch.set(ref, {
      id: product.id,
      slug: product.slug,
      title: product.title,
      brand: product.brand,
      logo: product.logo,
      categorySlug: product.categorySlug,
      excerpt: product.excerpt,
      description: product.description,
      ...(product.badge ? { badge: product.badge } : {}),
      rating: product.rating,
      sold: product.sold,
      gradient: product.gradient,
      plans: product.plans,
      features: product.features,
      faq: product.faq,
      isActive: true,
      updatedAt: now,
    })
  })

  posts.forEach((post) => {
    const ref = doc(db, "posts", post.slug)
    batch.set(ref, {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      body: post.body,
      category: post.category,
      author: post.author,
      readMinutes: post.readMinutes,
      publishedAt: post.publishedAt,
      cover: post.cover,
      isPublished: true,
      updatedAt: now,
    })
  })

  batch.set(doc(db, "site_settings", "main"), {
    brandNameFa: siteContent.brand.nameFa,
    brandNameEn: siteContent.brand.nameEn,
    tagline: siteContent.brand.tagline,
    logoMark: siteContent.brand.logoMark,
    heroBadge: siteContent.hero.badge,
    heroHeadlineLead: siteContent.hero.headlineLead,
    heroHeadlineTail: siteContent.hero.headlineTail,
    heroSubheadline: siteContent.hero.subheadline,
    contactPhone: siteContent.contact.phone,
    contactEmail: siteContent.contact.email,
    contactTelegram: siteContent.contact.telegram,
    contactAddress: siteContent.contact.address,
    contactHours: siteContent.contact.hours,
    footerAbout: siteContent.footer.about,
    maintenanceMode: false,
    updatedAt: now,
  })

  const defaultDiscounts = [
    {
      code: "ECH20",
      type: "percent",
      value: 20,
      limit: 500,
      used: 0,
      minOrder: 200000,
      expiresAt: "2027-03-20",
      firstPurchaseOnly: false,
      isActive: true,
    },
    {
      code: "WELCOME",
      type: "fixed",
      value: 50000,
      limit: 1000,
      used: 0,
      minOrder: 100000,
      expiresAt: "",
      firstPurchaseOnly: false,
      isActive: true,
    },
  ]

  defaultDiscounts.forEach((d) => {
    batch.set(doc(db, "discounts", d.code), {
      ...d,
      updatedAt: now,
    })
  })

  try {
    await batch.commit()
    return {
      categories: categories.length,
      products: products.length,
      posts: posts.length,
      discounts: defaultDiscounts.length,
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "seedInitialDatabase")
  }
}
