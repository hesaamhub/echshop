import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // هدر اضافی X-Powered-By حذف شود
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // تصاویر به‌صورت خودکار با فرمت سبک وب سرو می‌شوند (AVIF اول، سپس WebP)
    formats: ["image/avif", "image/webp"],
    // کش بلندمدت برای تصاویر بهینه‌شده
    minimumCacheTTL: 31536000,
  },
  experimental: {
    // فقط آیکون‌های استفاده‌شده وارد باندل شوند — کاهش چشمگیر حجم جاوااسکریپت
    optimizePackageImports: ["lucide-react", "@icons-pack/react-simple-icons"],
  },
}

export default nextConfig
