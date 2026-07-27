import type { Category, Order, Post, Product, Ticket } from "./types"

/* -------------------------------------------------------------------------- */
/*  محتوای قابل ویرایش از پنل مدیریت (متن‌ها، تصاویر، تنظیمات)                */
/* -------------------------------------------------------------------------- */

export const siteContent = {
  brand: {
    nameFa: "اچ‌شاپ",
    nameEn: "echshop",
    tagline: "فروشگاه اکانت و لایسنس دیجیتال",
    logoMark: "✦",
  },
  hero: {
    headlineTop: "بنیانِ نسل تازهٔ",
    headlineBottom: "خرید اکانت‌های دیجیتال",
    subheadline:
      "اچ‌شاپ اکانت‌ها و لایسنس‌های اورجینال را با تحویل فوری، گارانتی بازگشت وجه و پشتیبانی شبانه‌روزی در اختیار شما می‌گذارد.",
    ctaLabel: "تماس با ما",
    ctaHref: "/contact",
    videoSrc:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4",
    navLinks: [
      { label: "محصولات", href: "/products" },
      { label: "بلاگ", href: "/blog" },
    ],
    navCta: { label: "ارتباط با ما", href: "/contact" },
  },
  features: [
    {
      icon: "Zap",
      title: "تحویل فوری و خودکار",
      body: "بلافاصله پس از پرداخت، اکانت یا لایسنس از انبار برداشته و در پنل کاربری شما قرار می‌گیرد.",
    },
    {
      icon: "ShieldCheck",
      title: "گارانتی و جایگزینی",
      body: "در تمام مدت اشتراک، در صورت بروز مشکل اکانت جایگزین یا مبلغ بازگردانده می‌شود.",
    },
    {
      icon: "Headphones",
      title: "پشتیبانی ۲۴ ساعته",
      body: "تیم پشتیبانی از طریق تیکت و چت، شبانه‌روزی پاسخگوی شماست.",
    },
    {
      icon: "BadgeCheck",
      title: "محصولات اورجینال",
      body: "همهٔ اکانت‌ها از تامین‌کنندگان رسمی و معتبر تهیه می‌شوند.",
    },
  ],
  stats: [
    { value: "۴۸٬۰۰۰+", label: "سفارش موفق" },
    { value: "۱۲۰+", label: "محصول فعال" },
    { value: "۹۹٪", label: "رضایت مشتری" },
    { value: "۲ دقیقه", label: "میانگین تحویل" },
  ],
  contact: {
    phone: "۰۲۱-۹۱۰۰۰۰۰۰",
    email: "support@echshop.ir",
    telegram: "@echshop_support",
    address: "تهران، خیابان ولیعصر، برج نگین، طبقه ۱۲",
    hours: "پشتیبانی تیکت ۲۴/۷ — تماس تلفنی ۹ تا ۲۱",
  },
  footer: {
    about:
      "اچ‌شاپ از سال ۱۳۹۹ در حوزهٔ فروش اکانت‌های پرمیوم و لایسنس‌های نرم‌افزاری فعالیت می‌کند و تا امروز بیش از ۴۸ هزار سفارش را با موفقیت تحویل داده است.",
    columns: [
      {
        title: "فروشگاه",
        links: [
          { label: "همهٔ محصولات", href: "/products" },
          { label: "دسته‌بندی‌ها", href: "/products" },
          { label: "سبد خرید", href: "/cart" },
          { label: "پنل کاربری", href: "/dashboard" },
        ],
      },
      {
        title: "اچ‌شاپ",
        links: [
          { label: "درباره ما", href: "/about" },
          { label: "تماس با ما", href: "/contact" },
          { label: "بلاگ", href: "/blog" },
          { label: "پشتیبانی", href: "/dashboard/tickets" },
        ],
      },
      {
        title: "قوانین",
        links: [
          { label: "قوانین و مقررات", href: "/about" },
          { label: "حریم خصوصی", href: "/about" },
          { label: "شرایط بازگشت وجه", href: "/about" },
          { label: "سوالات متداول", href: "/about" },
        ],
      },
    ],
  },
}

/* -------------------------------------------------------------------------- */
/*  دسته‌بندی‌ها                                                              */
/* -------------------------------------------------------------------------- */

export const categories: Category[] = [
  {
    slug: "music-video",
    title: "موسیقی و ویدیو",
    description: "اشتراک اسپاتیفای، یوتیوب پرمیوم، نتفلیکس و سرویس‌های استریم.",
    icon: "Music",
    count: 24,
  },
  {
    slug: "ai-tools",
    title: "هوش مصنوعی",
    description: "اکانت ChatGPT Plus، Claude، Midjourney و ابزارهای مولد.",
    icon: "Sparkles",
    count: 18,
  },
  {
    slug: "design",
    title: "طراحی و گرافیک",
    description: "لایسنس Adobe، Canva Pro، Figma و منابع طراحی.",
    icon: "PenTool",
    count: 15,
  },
  {
    slug: "gaming",
    title: "گیمینگ",
    description: "گیفت‌کارت استیم، اکانت گیم‌پس، پلی‌استیشن پلاس.",
    icon: "Gamepad2",
    count: 21,
  },
  {
    slug: "software",
    title: "نرم‌افزار و لایسنس",
    description: "ویندوز، آفیس، آنتی‌ویروس و ابزارهای کاربردی.",
    icon: "MonitorSmartphone",
    count: 27,
  },
  {
    slug: "social",
    title: "شبکه‌های اجتماعی",
    description: "تلگرام پرمیوم، دیسکورد نیترو و خدمات ارتقای اکانت.",
    icon: "MessageCircle",
    count: 12,
  },
]

/* -------------------------------------------------------------------------- */
/*  محصولات                                                                   */
/* -------------------------------------------------------------------------- */

export const products: Product[] = [
  {
    id: "p-1",
    slug: "spotify-premium",
    title: "اشتراک اسپاتیفای پرمیوم",
    brand: "Spotify",
    logo: "https://svgl.app/library/spotify.svg",
    categorySlug: "music-video",
    excerpt: "موسیقی بدون تبلیغ، دانلود آفلاین و کیفیت بالا روی اکانت شخصی خودتان.",
    description:
      "اشتراک پرمیوم اسپاتیفای روی ایمیل شخصی خودتان فعال می‌شود؛ بدون تغییر رمز و بدون نیاز به اشتراک‌گذاری اکانت. پس از پرداخت، ایمیل اکانت خود را وارد کنید و اشتراک طی چند دقیقه ارتقا می‌یابد.",
    badge: "پرفروش‌ترین",
    rating: 4.9,
    sold: 8420,
    gradient: "from-[#1DB954] to-[#0f7a37]",
    plans: [
      { id: "pl-1", title: "۱ ماهه — ارتقای اکانت شخصی", price: 285000, compareAt: 340000, delivery: "upgrade", stock: 999 },
      { id: "pl-2", title: "۳ ماهه — ارتقای اکانت شخصی", price: 760000, compareAt: 950000, delivery: "upgrade", stock: 999 },
      { id: "pl-3", title: "۱۲ ماهه — ارتقای اکانت شخصی", price: 2450000, compareAt: 3200000, delivery: "upgrade", stock: 120 },
    ],
    features: [
      "فعال‌سازی روی ایمیل شخصی شما",
      "بدون تبلیغ و با امکان دانلود آفلاین",
      "کیفیت صدای Very High",
      "گارانتی کل مدت اشتراک",
    ],
    faq: [
      { q: "آیا رمز اکانتم را باید بدهم؟", a: "خیر. تنها ایمیل اکانت اسپاتیفای شما لازم است و اشتراک از سمت ما ارتقا می‌یابد." },
      { q: "چقدر طول می‌کشد؟", a: "معمولاً بین ۵ تا ۳۰ دقیقه؛ در ساعات شلوغ حداکثر ۲ ساعت." },
    ],
  },
  {
    id: "p-2",
    slug: "chatgpt-plus",
    title: "اکانت ChatGPT Plus",
    brand: "OpenAI",
    logo: "https://svgl.app/library/openai.svg",
    categorySlug: "ai-tools",
    excerpt: "دسترسی به مدل‌های پیشرفته، حالت صوتی و آپلود فایل با سرعت بالا.",
    description:
      "اکانت ChatGPT Plus با دسترسی کامل به مدل‌های پیشرفته، تحلیل داده، آپلود فایل و ساخت GPT اختصاصی. تحویل به‌صورت خودکار از انبار انجام می‌شود و اطلاعات ورود در پنل کاربری شما قرار می‌گیرد.",
    badge: "محبوب",
    rating: 4.8,
    sold: 6210,
    gradient: "from-[#10A37F] to-[#0b6b54]",
    plans: [
      { id: "pl-4", title: "۱ ماهه — اکانت اختصاصی", price: 1180000, compareAt: 1450000, delivery: "stock", stock: 42 },
      { id: "pl-5", title: "۱ ماهه — ارتقای اکانت خودتان", price: 1290000, delivery: "upgrade", stock: 999 },
      { id: "pl-6", title: "۳ ماهه — اکانت اختصاصی", price: 3350000, compareAt: 4100000, delivery: "stock", stock: 15 },
    ],
    features: [
      "اکانت کاملاً اختصاصی و قابل تغییر رمز",
      "دسترسی به جدیدترین مدل‌ها",
      "پشتیبانی از آپلود فایل و تحلیل داده",
      "تحویل خودکار بلافاصله پس از پرداخت",
    ],
    faq: [
      { q: "اکانت اشتراکی است؟", a: "خیر، اکانت اختصاصی شماست و می‌توانید رمز را تغییر دهید." },
      { q: "امکان تمدید دارد؟", a: "بله، از پنل کاربری روی همان اکانت تمدید انجام می‌شود." },
    ],
  },
  {
    id: "p-3",
    slug: "adobe-creative-cloud",
    title: "لایسنس ادوبی کریتیو کلاد",
    brand: "Adobe",
    logo: "https://svgl.app/library/adobe.svg",
    categorySlug: "design",
    excerpt: "دسترسی کامل به فتوشاپ، ایلاستریتور، پریمیر و تمام اپلیکیشن‌های ادوبی.",
    description:
      "لایسنس رسمی Creative Cloud All Apps با دسترسی به بیش از ۲۰ نرم‌افزار ادوبی و ۱۰۰ گیگابایت فضای ابری. لایسنس روی ایمیل شما فعال می‌شود.",
    rating: 4.7,
    sold: 3180,
    gradient: "from-[#FF0000] to-[#990000]",
    plans: [
      { id: "pl-7", title: "۱ ماهه — All Apps", price: 1650000, delivery: "upgrade", stock: 200 },
      { id: "pl-8", title: "۱۲ ماهه — All Apps", price: 8900000, compareAt: 11500000, delivery: "upgrade", stock: 40 },
    ],
    features: [
      "دسترسی به تمام اپلیکیشن‌های ادوبی",
      "۱۰۰ گیگابایت فضای ابری",
      "فعال‌سازی روی ایمیل شخصی",
      "به‌روزرسانی رسمی و بدون کرک",
    ],
    faq: [{ q: "روی چند دستگاه فعال می‌شود؟", a: "همزمان روی دو دستگاه قابل استفاده است." }],
  },
  {
    id: "p-4",
    slug: "netflix-premium",
    title: "اشتراک نتفلیکس پرمیوم",
    brand: "Netflix",
    logo: "https://svgl.app/library/netflix.svg",
    categorySlug: "music-video",
    excerpt: "تماشای فیلم و سریال با کیفیت 4K روی پروفایل اختصاصی.",
    description:
      "اشتراک نتفلیکس پرمیوم با پروفایل اختصاصی و کیفیت 4K UHD. اطلاعات ورود بلافاصله پس از پرداخت در پنل کاربری قرار می‌گیرد.",
    badge: "تحویل فوری",
    rating: 4.6,
    sold: 5240,
    gradient: "from-[#E50914] to-[#8b0209]",
    plans: [
      { id: "pl-9", title: "۱ ماهه — پروفایل اختصاصی", price: 420000, compareAt: 520000, delivery: "stock", stock: 63 },
      { id: "pl-10", title: "۳ ماهه — پروفایل اختصاصی", price: 1150000, delivery: "stock", stock: 28 },
    ],
    features: ["کیفیت 4K UHD", "پروفایل اختصاصی با پین شخصی", "تحویل فوری از انبار", "گارانتی جایگزینی"],
    faq: [{ q: "چند نفر همزمان استفاده می‌کنند؟", a: "پروفایل مخصوص شماست و همزمان تنها یک دستگاه فعال است." }],
  },
  {
    id: "p-5",
    slug: "canva-pro",
    title: "اشتراک کانوا پرو",
    brand: "Canva",
    logo: "https://svgl.app/library/canva.svg",
    categorySlug: "design",
    excerpt: "میلیون‌ها قالب و عکس پریمیوم با ابزار حذف پس‌زمینه.",
    description:
      "اشتراک Canva Pro روی ایمیل شخصی شما فعال می‌شود؛ شامل تمام قالب‌ها، فونت‌ها، عکس‌های پریمیوم و ابزارهای هوش مصنوعی کانوا.",
    rating: 4.9,
    sold: 4110,
    gradient: "from-[#00C4CC] to-[#7D2AE8]",
    plans: [
      { id: "pl-11", title: "۱۲ ماهه — تیمی", price: 690000, compareAt: 950000, delivery: "upgrade", stock: 500 },
      { id: "pl-12", title: "۱۲ ماهه — اکانت اختصاصی", price: 1150000, delivery: "stock", stock: 34 },
    ],
    features: ["دسترسی به تمام قالب‌های پریمیوم", "حذف پس‌زمینه نامحدود", "فضای ابری ۱ ترابایت", "ابزارهای هوش مصنوعی"],
    faq: [{ q: "روی اکانت خودم فعال می‌شود؟", a: "بله، تنها ایمیل کانوای شما لازم است." }],
  },
  {
    id: "p-6",
    slug: "youtube-premium",
    title: "اشتراک یوتیوب پرمیوم",
    brand: "YouTube",
    logo: "https://svgl.app/library/youtube.svg",
    categorySlug: "music-video",
    excerpt: "یوتیوب بدون تبلیغ، پخش در پس‌زمینه و یوتیوب موزیک.",
    description:
      "اشتراک YouTube Premium روی اکانت گوگل شخصی شما فعال می‌شود. بدون تبلیغ، با امکان دانلود و پخش در پس‌زمینه و دسترسی کامل به YouTube Music.",
    rating: 4.8,
    sold: 3920,
    gradient: "from-[#FF0033] to-[#a30022]",
    plans: [
      { id: "pl-13", title: "۱ ماهه — ارتقای اکانت گوگل", price: 320000, delivery: "upgrade", stock: 999 },
      { id: "pl-14", title: "۱۲ ماهه — ارتقای اکانت گوگل", price: 2850000, compareAt: 3600000, delivery: "upgrade", stock: 90 },
    ],
    features: ["حذف کامل تبلیغات", "پخش در پس‌زمینه", "دانلود ویدیو", "YouTube Music رایگان"],
    faq: [{ q: "اکانت گوگلم امن است؟", a: "بله، فقط اشتراک ارتقا می‌یابد و رمز شما لازم نیست." }],
  },
  {
    id: "p-7",
    slug: "discord-nitro",
    title: "دیسکورد نیترو",
    brand: "Discord",
    logo: "https://svgl.app/library/discord.svg",
    categorySlug: "social",
    excerpt: "استریم با کیفیت، آپلود حجیم و استیکرهای اختصاصی.",
    description:
      "اشتراک Discord Nitro با دریافت خودکار گیفت‌لینک؛ بلافاصله پس از پرداخت لینک هدیه در پنل کاربری شما قرار می‌گیرد.",
    rating: 4.5,
    sold: 1870,
    gradient: "from-[#5865F2] to-[#2f39ac]",
    plans: [
      { id: "pl-15", title: "۱ ماهه — گیفت‌لینک", price: 380000, delivery: "gift_code", stock: 75 },
      { id: "pl-16", title: "۱۲ ماهه — گیفت‌لینک", price: 3600000, compareAt: 4200000, delivery: "gift_code", stock: 12 },
    ],
    features: ["استریم 4K و ۶۰ فریم", "آپلود تا ۵۰۰ مگابایت", "بوست سرور", "دریافت فوری گیفت‌لینک"],
    faq: [{ q: "گیفت‌لینک چطور استفاده می‌شود؟", a: "لینک را باز کنید و روی اکانت خودتان فعال کنید." }],
  },
  {
    id: "p-8",
    slug: "telegram-premium",
    title: "تلگرام پرمیوم",
    brand: "Telegram",
    logo: "https://svgl.app/library/telegram.svg",
    categorySlug: "social",
    excerpt: "آپلود ۴ گیگابایتی، استیکرهای ویژه و بدون تبلیغ.",
    description:
      "تلگرام پرمیوم با ارتقای مستقیم روی یوزرنیم شما؛ تحویل از طریق API تامین‌کننده و به‌صورت خودکار انجام می‌شود.",
    badge: "تحویل خودکار",
    rating: 4.7,
    sold: 2640,
    gradient: "from-[#2AABEE] to-[#1a6f9c]",
    plans: [
      { id: "pl-17", title: "۳ ماهه — ارتقای یوزرنیم", price: 950000, delivery: "api", stock: 999 },
      { id: "pl-18", title: "۱۲ ماهه — ارتقای یوزرنیم", price: 2900000, compareAt: 3400000, delivery: "api", stock: 999 },
    ],
    features: ["آپلود فایل تا ۴ گیگابایت", "سرعت دانلود نامحدود", "استیکر و ایموجی ویژه", "تحویل خودکار از API"],
    faq: [{ q: "یوزرنیم لازم است؟", a: "بله، فقط یوزرنیم تلگرام شما برای ارتقا کافی است." }],
  },
]

/* -------------------------------------------------------------------------- */
/*  بلاگ                                                                      */
/* -------------------------------------------------------------------------- */

export const posts: Post[] = [
  {
    slug: "how-to-buy-safe-account",
    title: "راهنمای کامل خرید امن اکانت‌های پرمیوم",
    excerpt: "چطور بفهمیم یک فروشنده اکانت معتبر است؟ هفت نشانهٔ مهم که قبل از پرداخت باید بررسی کنید.",
    body: "بازار فروش اکانت‌های دیجیتال در ایران بزرگ شده و همین موضوع باعث شده فروشندگان غیرمعتبر هم وارد شوند. در این مقاله هفت معیار کلیدی را بررسی می‌کنیم: وجود درگاه پرداخت رسمی، گارانتی مکتوب، پنل کاربری برای پیگیری سفارش، سابقهٔ فعالیت، شفافیت در نوع تحویل، کیفیت پشتیبانی، و سیاست بازگشت وجه.",
    category: "راهنمای خرید",
    author: "تیم اچ‌شاپ",
    readMinutes: 7,
    publishedAt: "2026-06-14",
    cover: "linear-gradient(135deg,#2783de,#0a1b33)",
  },
  {
    slug: "chatgpt-plus-vs-free",
    title: "ChatGPT Plus در برابر نسخهٔ رایگان: آیا ارزش خرید دارد؟",
    excerpt: "مقایسهٔ دقیق سرعت، مدل‌ها و امکانات دو نسخه برای اینکه بدانید کدام مناسب کار شماست.",
    body: "نسخهٔ رایگان برای پرسش‌های روزمره کافی است، اما اگر با فایل کار می‌کنید، به تحلیل داده نیاز دارید یا حجم استفادهٔ روزانه‌تان بالاست، تفاوت محسوس می‌شود. در این مقاله بر اساس سنجه‌های واقعی مقایسه می‌کنیم.",
    category: "هوش مصنوعی",
    author: "تیم اچ‌شاپ",
    readMinutes: 5,
    publishedAt: "2026-06-28",
    cover: "linear-gradient(135deg,#10A37F,#0a1b33)",
  },
  {
    slug: "spotify-upgrade-guide",
    title: "ارتقای اکانت اسپاتیفای بدون دادن رمز — چطور کار می‌کند؟",
    excerpt: "روش ارتقای اکانت شخصی را قدم‌به‌قدم توضیح می‌دهیم و می‌گوییم چرا امن‌ترین گزینه است.",
    body: "در روش ارتقا، اشتراک روی همان اکانتی که خودتان ساخته‌اید فعال می‌شود؛ پلی‌لیست‌ها، تاریخچه و توصیه‌های شخصی‌سازی‌شده حفظ می‌شوند و نیازی به اشتراک‌گذاری رمز نیست.",
    category: "آموزش",
    author: "تیم اچ‌شاپ",
    readMinutes: 4,
    publishedAt: "2026-07-05",
    cover: "linear-gradient(135deg,#1DB954,#0a1b33)",
  },
  {
    slug: "design-license-comparison",
    title: "ادوبی، کانوا یا فیگما؟ انتخاب لایسنس مناسب طراحان",
    excerpt: "سه اکوسیستم محبوب طراحی را از نظر هزینه، کاربرد و منحنی یادگیری مقایسه می‌کنیم.",
    body: "اگر کار شما ادیت عکس و ویدیوی حرفه‌ای است، ادوبی جایگزین ندارد. برای محتوای سریع شبکه‌های اجتماعی کانوا سرعت بی‌نظیری دارد و برای طراحی محصول و رابط کاربری، فیگما استاندارد صنعت است.",
    category: "طراحی",
    author: "تیم اچ‌شاپ",
    readMinutes: 6,
    publishedAt: "2026-07-19",
    cover: "linear-gradient(135deg,#7D2AE8,#0a1b33)",
  },
]

/* -------------------------------------------------------------------------- */
/*  سفارش‌ها و تیکت‌ها (نمونه)                                                */
/* -------------------------------------------------------------------------- */

export const orders: Order[] = [
  { id: "ECH-10482", customer: "حسام رضایی", product: "اکانت ChatGPT Plus", plan: "۱ ماهه — اکانت اختصاصی", amount: 1180000, status: "delivered", delivery: "stock", createdAt: "2026-07-26" },
  { id: "ECH-10481", customer: "مریم احمدی", product: "اشتراک اسپاتیفای پرمیوم", plan: "۳ ماهه", amount: 760000, status: "paid", delivery: "upgrade", createdAt: "2026-07-26" },
  { id: "ECH-10480", customer: "سینا کریمی", product: "تلگرام پرمیوم", plan: "۱۲ ماهه", amount: 2900000, status: "delivered", delivery: "api", createdAt: "2026-07-25" },
  { id: "ECH-10479", customer: "نگار مرادی", product: "لایسنس ادوبی کریتیو کلاد", plan: "۱۲ ماهه", amount: 8900000, status: "pending", delivery: "manual", createdAt: "2026-07-25" },
  { id: "ECH-10478", customer: "امیر توکلی", product: "اشتراک نتفلیکس پرمیوم", plan: "۱ ماهه", amount: 420000, status: "failed", delivery: "stock", createdAt: "2026-07-24" },
  { id: "ECH-10477", customer: "زهرا نیک‌پور", product: "دیسکورد نیترو", plan: "۱ ماهه", amount: 380000, status: "refunded", delivery: "gift_code", createdAt: "2026-07-23" },
]

export const tickets: Ticket[] = [
  {
    id: "TK-2091",
    subject: "اکانت نتفلیکس پروفایل را نمی‌پذیرد",
    department: "پشتیبانی فنی",
    status: "answered",
    priority: "زیاد",
    updatedAt: "2026-07-26",
    messages: [
      { from: "user", body: "سلام، پین پروفایل کار نمی‌کند.", at: "2026-07-26" },
      { from: "support", body: "سلام، پین بازنشانی شد. لطفاً مجدد امتحان کنید و نتیجه را اعلام بفرمایید.", at: "2026-07-26" },
    ],
  },
  {
    id: "TK-2088",
    subject: "پرداخت انجام شد اما سفارش ثبت نشد",
    department: "مالی و پرداخت",
    status: "open",
    priority: "زیاد",
    updatedAt: "2026-07-25",
    messages: [{ from: "user", body: "مبلغ از حساب کسر شد ولی سفارشی ندارم.", at: "2026-07-25" }],
  },
  {
    id: "TK-2080",
    subject: "امکان تمدید اشتراک اسپاتیفای",
    department: "پیش از خرید",
    status: "closed",
    priority: "کم",
    updatedAt: "2026-07-21",
    messages: [
      { from: "user", body: "تمدید روی همان اکانت ممکن است؟", at: "2026-07-20" },
      { from: "support", body: "بله، از پنل کاربری گزینهٔ تمدید فعال است.", at: "2026-07-21" },
    ],
  },
]

export const notifications = [
  { id: "n-1", title: "سفارش ECH-10482 تحویل شد", body: "اطلاعات ورود اکانت در بخش سفارش‌ها قابل مشاهده است.", at: "2026-07-26", unread: true },
  { id: "n-2", title: "۲۵٪ تخفیف روی محصولات هوش مصنوعی", body: "تا پایان هفته با کد AI25 خرید کنید.", at: "2026-07-24", unread: true },
  { id: "n-3", title: "کیف پول شما شارژ شد", body: "مبلغ ۵۰۰٬۰۰۰ تومان به کیف پول شما اضافه شد.", at: "2026-07-20", unread: false },
]

/* -------------------------------------------------------------------------- */
/*  توابع کمکی                                                                */
/* -------------------------------------------------------------------------- */

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug)
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug)
}

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug)
}

export function productsByCategory(slug: string) {
  return products.filter((p) => p.categorySlug === slug)
}

export function lowestPrice(p: Product) {
  return Math.min(...p.plans.map((pl) => pl.price))
}
