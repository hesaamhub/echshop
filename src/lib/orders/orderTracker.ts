import {
  deliveryLabels,
  orderStatusLabels,
  type DeliveryMethod,
  type OrderStatus,
} from "@/lib/types"

export type OrderTrackerStepState =
  | "completed"
  | "current"
  | "upcoming"
  | "error"
  | "refunded"

export type OrderTrackerTone = "amber" | "blue" | "green" | "red" | "gray"

export type OrderTrackerStep = {
  key: "order-placed" | "payment-processing" | "delivery-outcome"
  stepNumber: 1 | 2 | 3
  status: OrderStatus
  label: string
  description: string
  state: OrderTrackerStepState
  isCurrent: boolean
}

export type OrderTrackerModel = {
  currentStatus: OrderStatus
  currentLabel: string
  deliveryLabel: string
  tone: OrderTrackerTone
  progressPercent: number
  /** Ratio from 0 to 1 representing connector fill between step 1 center and step 3 center */
  trackFillRatio: number
  headline: string
  subtext: string
  steps: [OrderTrackerStep, OrderTrackerStep, OrderTrackerStep]
}

const deliveryStepTwoCopy: Record<DeliveryMethod, string> = {
  stock: "تایید پرداخت و تخصیص خودکار از انبار آماده",
  api: "تایید پرداخت و ارسال درخواست فعال‌سازی خودکار",
  manual: "تایید پرداخت و ارجاع به کارشناس پشتیبانی برای فعال‌سازی",
  upgrade: "تایید پرداخت و بررسی اطلاعات اکانت شما برای ارتقا",
  gift_code: "تایید پرداخت و آماده‌سازی کد فعال‌سازی اختصاصی",
  scheduled: "تایید پرداخت و قرارگیری در نوبت فعال‌سازی زمان‌بندی‌شده",
}

const deliveryStepThreeCopy: Record<DeliveryMethod, string> = {
  stock: "اطلاعات اشتراک از انبار اختصاص یافت و آمادهٔ استفاده است.",
  api: "سرویس به‌صورت خودکار روی حساب شما فعال و تحویل شد.",
  manual: "کارشناس پشتیبانی سفارش را فعال کرد و جزئیات ارسال شد.",
  upgrade: "اشتراک روی اکانت شخصی شما با موفقیت ارتقا یافت.",
  gift_code: "کد فعال‌سازی در بخش اطلاعات تحویل همین سفارش ثبت شد.",
  scheduled: "فعال‌سازی طبق زمان‌بندی انجام و اطلاعات تحویل ثبت شد.",
}

export function buildOrderTrackerModel(options: {
  status: OrderStatus
  delivery: DeliveryMethod
  statusLabels?: Record<OrderStatus, string>
  deliveryNote?: string
}): OrderTrackerModel {
  const labels = options.statusLabels ?? orderStatusLabels
  const { status, delivery, deliveryNote } = options
  const deliveryLabel = deliveryLabels[delivery]

  const step1Label = labels.pending
  const step2Label = status === "failed" ? labels.failed : labels.paid
  const step3Label = status === "refunded" ? labels.refunded : labels.delivered

  if (status === "pending") {
    return {
      currentStatus: status,
      currentLabel: labels.pending,
      deliveryLabel,
      tone: "amber",
      progressPercent: 33,
      trackFillRatio: 0,
      headline: `وضعیت فعلی: ${labels.pending}`,
      subtext:
        deliveryNote?.trim() ||
        `سفارش شما ثبت شده است. پس از تایید پرداخت، فرآیند «${deliveryLabel}» آغاز می‌شود.`,
      steps: [
        {
          key: "order-placed",
          stepNumber: 1,
          status: "pending",
          label: step1Label,
          description: "ثبت سفارش و انتظار برای تایید پرداخت",
          state: "current",
          isCurrent: true,
        },
        {
          key: "payment-processing",
          stepNumber: 2,
          status: "paid",
          label: step2Label,
          description: deliveryStepTwoCopy[delivery],
          state: "upcoming",
          isCurrent: false,
        },
        {
          key: "delivery-outcome",
          stepNumber: 3,
          status: "delivered",
          label: step3Label,
          description: `تکمیل نهایی و نمایش جزئیات (${deliveryLabel})`,
          state: "upcoming",
          isCurrent: false,
        },
      ],
    }
  }

  if (status === "paid") {
    return {
      currentStatus: status,
      currentLabel: labels.paid,
      deliveryLabel,
      tone: "blue",
      progressPercent: 67,
      trackFillRatio: 0.5,
      headline: `وضعیت فعلی: ${labels.paid}`,
      subtext:
        deliveryNote?.trim() ||
        `پرداخت با موفقیت تایید شده و سفارش در مرحلهٔ «${deliveryLabel}» قرار دارد.`,
      steps: [
        {
          key: "order-placed",
          stepNumber: 1,
          status: "pending",
          label: step1Label,
          description: "سفارش با موفقیت در سیستم ثبت شد",
          state: "completed",
          isCurrent: false,
        },
        {
          key: "payment-processing",
          stepNumber: 2,
          status: "paid",
          label: step2Label,
          description: deliveryStepTwoCopy[delivery],
          state: "current",
          isCurrent: true,
        },
        {
          key: "delivery-outcome",
          stepNumber: 3,
          status: "delivered",
          label: step3Label,
          description: `آماده‌سازی و تحویل نهایی (${deliveryLabel})`,
          state: "upcoming",
          isCurrent: false,
        },
      ],
    }
  }

  if (status === "delivered") {
    return {
      currentStatus: status,
      currentLabel: labels.delivered,
      deliveryLabel,
      tone: "green",
      progressPercent: 100,
      trackFillRatio: 1,
      headline: `وضعیت فعلی: ${labels.delivered}`,
      subtext:
        deliveryNote?.trim() || deliveryStepThreeCopy[delivery],
      steps: [
        {
          key: "order-placed",
          stepNumber: 1,
          status: "pending",
          label: step1Label,
          description: "سفارش در سیستم ثبت شد",
          state: "completed",
          isCurrent: false,
        },
        {
          key: "payment-processing",
          stepNumber: 2,
          status: "paid",
          label: step2Label,
          description: `تایید مالی و انجام «${deliveryLabel}»`,
          state: "completed",
          isCurrent: false,
        },
        {
          key: "delivery-outcome",
          stepNumber: 3,
          status: "delivered",
          label: step3Label,
          description: deliveryStepThreeCopy[delivery],
          state: "completed",
          isCurrent: true,
        },
      ],
    }
  }

  if (status === "failed") {
    return {
      currentStatus: status,
      currentLabel: labels.failed,
      deliveryLabel,
      tone: "red",
      progressPercent: 50,
      trackFillRatio: 0.5,
      headline: `وضعیت فعلی: ${labels.failed}`,
      subtext:
        deliveryNote?.trim() ||
        "پرداخت یا پردازش این سفارش با خطا متوقف شده است. در صورت کسر وجه، برای بررسی تیکت ثبت کنید.",
      steps: [
        {
          key: "order-placed",
          stepNumber: 1,
          status: "pending",
          label: step1Label,
          description: "درخواست سفارش ثبت شد",
          state: "completed",
          isCurrent: false,
        },
        {
          key: "payment-processing",
          stepNumber: 2,
          status: "failed",
          label: step2Label,
          description: "تراکنش یا بررسی سفارش ناموفق بود",
          state: "error",
          isCurrent: true,
        },
        {
          key: "delivery-outcome",
          stepNumber: 3,
          status: "delivered",
          label: step3Label,
          description: "تحویل سفارش انجام نشد",
          state: "upcoming",
          isCurrent: false,
        },
      ],
    }
  }

  // status === "refunded"
  return {
    currentStatus: status,
    currentLabel: labels.refunded,
    deliveryLabel,
    tone: "gray",
    progressPercent: 100,
    trackFillRatio: 1,
    headline: `وضعیت فعلی: ${labels.refunded}`,
    subtext:
      deliveryNote?.trim() ||
      "سفارش لغو شده و مبلغ آن طبق قوانین گارانتی بازگشت داده شده است.",
    steps: [
      {
        key: "order-placed",
        stepNumber: 1,
        status: "pending",
        label: step1Label,
        description: "سفارش در سیستم ثبت شد",
        state: "completed",
        isCurrent: false,
      },
      {
        key: "payment-processing",
        stepNumber: 2,
        status: "paid",
        label: step2Label,
        description: "پرداخت ثبت و سپس درخواست بازگشت تایید شد",
        state: "completed",
        isCurrent: false,
      },
      {
        key: "delivery-outcome",
        stepNumber: 3,
        status: "refunded",
        label: step3Label,
        description: "مبلغ سفارش مرجوع و پرونده بسته شد",
        state: "refunded",
        isCurrent: true,
      },
    ],
  }
}
