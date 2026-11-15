import dbConnect from "./connect";
import User from "./models/User";
import Product from "./models/Product";
import Category from "./models/Category";

async function testConnection() {
  console.log("🔍 شروع تست اتصال به MongoDB...\n");

  try {
    // تست اتصال
    await dbConnect();
    console.log("✅ اتصال به MongoDB موفق بود!\n");

    // تست ایجاد یک دسته‌بندی
    console.log("📁 تست ایجاد دسته‌بندی...");
    const category = await Category.create({
      title: "هوش مصنوعی",
      slug: "ai-tools",
      description: "ابزارهای هوش مصنوعی",
      icon: "Sparkles",
      order: 1,
    });
    console.log(`✅ دسته‌بندی ایجاد شد: ${category.title} (ID: ${category._id})\n`);

    // تست ایجاد یک کاربر
    console.log("👤 تست ایجاد کاربر...");
    const user = await User.create({
      name: "کاربر تست",
      email: "test@example.com",
      phone: "09123456789",
      password: "password123",
      role: "user",
    });
    console.log(`✅ کاربر ایجاد شد: ${user.name} (ID: ${user._id})\n`);

    // تست ایجاد یک محصول
    console.log("📦 تست ایجاد محصول...");
    const product = await Product.create({
      title: "اشتراک اسپاتیفای پرمیوم",
      slug: "spotify-premium",
      brand: "Spotify",
      logo: "spotify",
      category: category._id,
      excerpt: "موسیقی بدون تبلیغ",
      description: "اشتراک پرمیوم اسپاتیفای",
      badge: "پرفروش‌ترین",
      rating: 4.9,
      sold: 100,
      gradient: "from-[#1DB954] to-[#0f7a37]",
      plans: [
        {
          title: "1 ماهه",
          price: 285000,
          compareAt: 340000,
          delivery: "upgrade",
          stock: 100,
        },
      ],
      features: ["بدون تبلیغ", "دانلود آفلاین"],
      faq: [
        { q: "چقدر طول می‌کشد؟", a: "بلافاصله" },
      ],
    });
    console.log(`✅ محصول ایجاد شد: ${product.title} (ID: ${product._id})\n`);

    // تست خواندن داده‌ها
    console.log("📖 تست خواندن داده‌ها...");
    const allCategories = await Category.find();
    const allUsers = await User.find().select("-password");
    const allProducts = await Product.find().populate("category");

    console.log(`✅ ${allCategories.length} دسته‌بندی یافت شد`);
    console.log(`✅ ${allUsers.length} کاربر یافت شد`);
    console.log(`✅ ${allProducts.length} محصول یافت شد\n`);

    // تست حذف داده‌های تست
    console.log("🗑️ پاک کردن داده‌های تست...");
    await User.deleteMany({ email: "test@example.com" });
    await Product.deleteMany({ slug: "spotify-premium" });
    await Category.deleteMany({ slug: "ai-tools" });
    console.log("✅ داده‌های تست پاک شدند\n");

    console.log("🎉 تمام تست‌ها با موفقیت انجام شدند!");
    process.exit(0);

  } catch (error: unknown) {
    const err = error as Error;
    console.error("❌ خطا در تست:", err.message);
    
    // راهنمایی برای حل مشکل
    if (err.message.includes("ECONNREFUSED")) {
      console.log("\n💡 راهنمایی: MongoDB در حال اجرا نیست");
      console.log("برای راه‌اندازی MongoDB محلی:");
      console.log("1. MongoDB را نصب کنید: https://www.mongodb.com/try/download/community");
      console.log("2. سرویس MongoDB را شروع کنید:");
      console.log("   - ویندوز: net start MongoDB");
      console.log("   - مک/لینوکس: mongod");
      console.log("3. یا از MongoDB Atlas استفاده کنید:");
      console.log("   https://www.mongodb.com/atlas/database");
    } else if (err.message.includes("authentication")) {
      console.log("\n💡 راهنمایی: مشکل در احراز هویت");
      console.log("فایل .env.local را چک کنید:");
      console.log("MONGODB_URI=mongodb://username:password@host:port/database");
    }
    
    process.exit(1);
  }
}

testConnection();
