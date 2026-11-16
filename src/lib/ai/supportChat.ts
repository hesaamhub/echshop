import type { Category, Product } from "../types"

export type SupportChatMode = "smart" | "fast"

export type SupportChatModelOption = {
  id: "gemini-4-hydrogen" | "gemini-3.1-flash-lite"
  label: string
  hint: string
}

/**
 * مدل‌های رایگان و سریع پشتیبانی اچ‌شاپ
 */
export const SUPPORT_CHAT_MODELS: Record<SupportChatMode, SupportChatModelOption> = {
  smart: {
    id: "gemini-4-hydrogen",
    label: "هوشمند",
    hint: "مقایسه پلن و مشاوره دقیق خرید",
  },
  fast: {
    id: "gemini-3.1-flash-lite",
    label: "سریع",
    hint: "پاسخ فوری به سوالات متداول",
  },
}

export const QUICK_QUESTIONS: { id: string; label: string; prompt: string }[] = [
  {
    id: "delivery-time",
    label: "تحویل چقدر طول می‌کشه؟",
    prompt: "سفارش اکانت چقدر طول می‌کشه تا تحویل داده بشه و کجا اطلاعات رو ببینم؟",
  },
  {
    id: "upgrade-vs-stock",
    label: "تفاوت ارتقا و اکانت اختصاصی",
    prompt: "تفاوت «ارتقای اکانت شخصی» با «اکانت اختصاصی از انبار» چیه و کدوم بهتره؟",
  },
  {
    id: "ai-advice",
    label: "بهترین اشتراک هوش مصنوعی",
    prompt: "برای کار روزمره و برنامه‌نویسی بین ChatGPT Plus، Claude و Perplexity کدوم رو پیشنهاد می‌دی؟",
  },
  {
    id: "warranty-support",
    label: "گارانتی و ثبت تیکت",
    prompt: "اگر اشتراکی وسط دوره به مشکل بخوره، گارانتی و پشتیبانی اچ‌شاپ چطور عمل می‌کنه؟",
  },
]

export type ChatTurn = {
  role: "user" | "model"
  text: string
}

export const MAX_HISTORY_TURNS = 12
export const MAX_MESSAGE_LENGTH = 1000

export function resolveSupportModel(mode: unknown): SupportChatModelOption["id"] {
  if (mode === "fast") return SUPPORT_CHAT_MODELS.fast.id
  return SUPPORT_CHAT_MODELS.smart.id
}

export function isAllowedSupportModel(modelId: string): boolean {
  return (
    modelId === SUPPORT_CHAT_MODELS.smart.id ||
    modelId === SUPPORT_CHAT_MODELS.fast.id
  )
}

/**
 * پاک‌سازی و نرمال‌سازی تاریخچه گفتگو برای ارسال امن به Gemini Chats API:
 * حفظ نوبت متناوب user/model، حذف پیام‌های خالی و محدودسازی طول تاریخچه.
 */
export function sanitizeChatHistory(input: unknown): ChatTurn[] {
  if (!Array.isArray(input)) return []

  const cleaned: ChatTurn[] = []
  for (const item of input) {
    if (!item || typeof item !== "object") continue
    const record = item as { role?: unknown; text?: unknown }
    const role = record.role === "user" || record.role === "model" ? record.role : null
    if (!role || typeof record.text !== "string") continue

    const trimmed = record.text.trim().slice(0, MAX_MESSAGE_LENGTH)
    if (!trimmed) continue

    const last = cleaned[cleaned.length - 1]
    if (last && last.role === role) {
      // ادغام پیام‌های هم‌نقش متوالی برای رعایت ترتیب نوبت‌های جمنای
      last.text = `${last.text}\n${trimmed}`.slice(0, MAX_MESSAGE_LENGTH)
    } else {
      cleaned.push({ role, text: trimmed })
    }
  }

  // حذف پیام آغازین از نقش model (در صورتی که پیام خوش‌آمدگویی فرانت‌اند در تاریخچه آمده باشد)
  while (cleaned.length > 0 && cleaned[0].role !== "user") {
    cleaned.shift()
  }

  // جمنای برای history انتظار دارد مکالمه با user شروع و با model تمام شود تا پیام فعلی user ارسال شود
  while (cleaned.length > 0 && cleaned[cleaned.length - 1].role !== "model") {
    cleaned.pop()
  }

  if (cleaned.length > MAX_HISTORY_TURNS) {
    return cleaned.slice(cleaned.length - MAX_HISTORY_TURNS)
  }

  return cleaned
}

/**
 * ساخت دستور سیستمی دقیق برای دستیار فروشگاه بر اساس محصولات و دسته‌بندی‌های واقعی سایت
 */
export function buildStoreSystemInstruction(
  catalogProducts: Product[],
  catalogCategories: Category[],
): string {
  const categorySummary = catalogCategories
    .filter((c) => c.count > 0)
    .map((c) => `- ${c.title} (/category/${c.slug}): ${c.description}`)
    .join("\n")

  const topProducts = [...catalogProducts]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 14)
    .map((p) => {
      const minPrice = Math.min(...p.plans.map((pl) => pl.price))
      const planNames = p.plans.map((pl) => pl.title).slice(0, 3).join("، ")
      return `- ${p.title} (${p.brand}) | لینک: /products/${p.slug} | شروع از ${minPrice.toLocaleString("en-US")} تومان | پلن‌ها: ${planNames}`
    })
    .join("\n")

  return [
    "شما «دستیار پشتیبانی اچ‌شاپ (echshop)» هستید، دستیار مودب، دقیق و سریع فروشگاه اکانت و لایسنس دیجیتال اچ‌شاپ.",
    "قوانین پاسخ‌گویی:",
    "1. همیشه به زبان فارسی روان، محترمانه و مختصر (حداکثر ۲ تا ۴ جمله یا حداکثر ۳ بولت کوتاه) پاسخ دهید.",
    "2. هرگز شماره سفارش، کد لایسنس، قیمت جدید یا تخفیف جعلی اختراع نکنید.",
    "3. اگر کاربر درباره پیگیری پرداخت، کد سفارش، خطای ورود یا بازگشت وجه سوال داشت، با احترام به بخش تیکت پشتیبانی (/dashboard/tickets) یا ایمیل support@echshop.ir ارجاع دهید.",
    "4. برای مرور همه محصولات مسیر /products را معرفی کنید.",
    "",
    "اطلاعات تحویل و گارانتی اچ‌شاپ:",
    "- تحویل از انبار (stock) و کد هدیه (gift_code): بلافاصله و خودکار پس از پرداخت در پنل کاربری (/dashboard/orders) نمایش داده می‌شود.",
    "- ارتقای اکانت شخصی (upgrade): بدون نیاز به رمز عبور و تنها با ایمیل اکانت کاربر، معمولاً طی ۵ تا ۳۰ دقیقه (حداکثر ۲ ساعت در ساعات شلوغ) انجام می‌شود.",
    "- تحویل دستی/سازمانی (manual): فعال‌سازی توسط کارشناس ظرف ۳۰ دقیقه تا چند ساعت کاری.",
    "- گارانتی: تمام اشتراک‌ها تا آخرین روز دوره گارانتی تعویض یا بازگشت وجه دارند.",
    "",
    "دسته‌بندی‌های فعال فروشگاه:",
    categorySummary,
    "",
    "محصولات پرفروش و قیمت پایه (تومان):",
    topProducts,
  ].join("\n")
}

/**
 * پاک‌سازی کلید API سمت سرور (حذف فاصله و کوتیشن احتمالی یا مقادیر جایگزین نامعتبر)
 */
export function sanitizeGeminiApiKey(rawKey: string | undefined): string | null {
  if (!rawKey) return null
  const cleaned = rawKey.trim().replace(/^["']|["']$/g, "").trim()
  if (
    !cleaned ||
    cleaned === "undefined" ||
    cleaned === "null" ||
    cleaned.toUpperCase() === "YOUR_API_KEY"
  ) {
    return null
  }
  return cleaned
}

export type GeminiRouteError = {
  status: number
  code:
    | "GEMINI_KEY_MISSING"
    | "GEMINI_AUTH_ERROR"
    | "GEMINI_RATE_LIMIT"
    | "GEMINI_MODEL_NOT_FOUND"
    | "GEMINI_REQUEST_FAILED"
  message: string
}

/**
 * نگاشت استاندارد خطاهای سرویس جمنای به پاسخ فارسی و کد وضعیت مناسب
 */
export function classifyGeminiError(rawMessage: string): GeminiRouteError {
  const msg = rawMessage || ""

  if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
    return {
      status: 429,
      code: "GEMINI_RATE_LIMIT",
      message: "ترافیک درخواست‌ها موقتاً بالاست. چند ثانیه دیگر دوباره تلاش کنید.",
    }
  }

  if (
    msg.includes("403") ||
    msg.includes("PERMISSION_DENIED") ||
    msg.includes("API_KEY_INVALID") ||
    msg.includes("API key not valid") ||
    msg.includes("INVALID_ARGUMENT") ||
    msg.includes("400")
  ) {
    return {
      status: 503,
      code: "GEMINI_AUTH_ERROR",
      message:
        "کلید سرویس هوشمند در این محیط معتبر یا فعال نیست. لطفاً کلید GEMINI_API_KEY را در بخش Settings > Secrets بررسی کنید یا از بخش تیکت پشتیبانی اقدام نمایید.",
    }
  }

  if (msg.includes("404") || msg.includes("NOT_FOUND")) {
    return {
      status: 502,
      code: "GEMINI_MODEL_NOT_FOUND",
      message: "مدل پشتیبانی موقتاً در دسترس نیست. لطفاً حالت «سریع» یا بخش تیکت پشتیبانی را امتحان کنید.",
    }
  }

  return {
    status: 500,
    code: "GEMINI_REQUEST_FAILED",
    message: "خطا در برقراری ارتباط با دستیار هوشمند. لطفاً دوباره تلاش کنید یا تیکت ثبت کنید.",
  }
}
