"use client"

import { Check, Clock3, CreditCard, PackageCheck, RotateCcw, XCircle } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import {
  buildOrderTrackerModel,
  type OrderTrackerStep,
  type OrderTrackerTone,
} from "@/lib/orders/orderTracker"
import { orderStatusLabels, type DeliveryMethod, type OrderStatus } from "@/lib/types"
import { cn, faDate } from "@/lib/utils"

type Props = {
  status: OrderStatus
  delivery: DeliveryMethod
  createdAt?: string
  deliveryNote?: string
  statusLabels?: Record<OrderStatus, string>
  className?: string
}

const bannerToneStyles: Record<OrderTrackerTone, string> = {
  amber: "border-[#f2e2c6] bg-[#fdf8ef] text-[#8a5719]",
  blue: "border-[#cfe0fc] bg-[#f2f6fe] text-[#1733b8]",
  green: "border-[#cce8d7] bg-[#effaf3] text-[#246340]",
  red: "border-[#f6d1cd] bg-[#fdf2f1] text-[#9b2f24]",
  gray: "border-slate-200 bg-slate-50 text-slate-700",
}

const trackFillToneStyles: Record<OrderTrackerTone, string> = {
  amber: "bg-[#d97706]",
  blue: "bg-[#1b39f5]",
  green: "bg-[#2f7a50]",
  red: "bg-[#dc2626]",
  gray: "bg-slate-500",
}

function getStepIcon(step: OrderTrackerStep) {
  if (step.state === "error") {
    return <XCircle className="h-4 w-4" aria-hidden />
  }
  if (step.state === "refunded") {
    return <RotateCcw className="h-4 w-4" aria-hidden />
  }
  if (step.state === "completed") {
    return step.stepNumber === 3 ? (
      <PackageCheck className="h-4 w-4" aria-hidden />
    ) : (
      <Check className="h-4 w-4" aria-hidden />
    )
  }
  if (step.stepNumber === 1) {
    return <Clock3 className="h-4 w-4" aria-hidden />
  }
  if (step.stepNumber === 2) {
    return <CreditCard className="h-4 w-4" aria-hidden />
  }
  return <PackageCheck className="h-4 w-4" aria-hidden />
}

function getNodeClasses(step: OrderTrackerStep, tone: OrderTrackerTone): string {
  if (step.state === "error") {
    return "border-[#dc2626] bg-[#dc2626] text-white ring-4 ring-[#dc2626]/15"
  }
  if (step.state === "refunded") {
    return "border-slate-600 bg-slate-600 text-white ring-4 ring-slate-200"
  }
  if (step.state === "completed") {
    const isSuccessTerminal = tone === "green" && step.isCurrent
    if (isSuccessTerminal) {
      return "border-[#2f7a50] bg-[#2f7a50] text-white ring-4 ring-[#2f7a50]/15"
    }
    return tone === "green"
      ? "border-[#2f7a50] bg-[#2f7a50] text-white"
      : "border-[#1b39f5] bg-[#1b39f5] text-white"
  }
  if (step.state === "current") {
    if (tone === "amber") {
      return "border-[#d97706] bg-white text-[#b45309] ring-4 ring-[#d97706]/15"
    }
    return "border-[#1b39f5] bg-white text-[#1b39f5] ring-4 ring-[#1b39f5]/12"
  }
  return "border-slate-200 bg-white text-slate-400"
}

function getLabelClasses(step: OrderTrackerStep): string {
  if (step.state === "error") return "text-[#9b2f24]"
  if (step.state === "refunded") return "text-slate-700"
  if (step.state === "upcoming") return "text-slate-400"
  return "text-[#0a1b33]"
}

export default function OrderStatusTracker({
  status,
  delivery,
  createdAt,
  deliveryNote,
  statusLabels = orderStatusLabels,
  className,
}: Props) {
  const prefersReducedMotion = useReducedMotion()
  const model = buildOrderTrackerModel({
    status,
    delivery,
    statusLabels,
    deliveryNote,
  })

  return (
    <div
      className={cn(
        "mt-5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5",
        className,
      )}
      data-testid="order-status-tracker"
      data-status={model.currentStatus}
    >
      {/* نوار خلاصه وضعیت فعلی */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 pb-3.5">
        <div className="flex min-w-0 flex-wrap items-center gap-2 text-[12px]">
          <span className="font-bold text-[#0a1b33]">{model.headline}</span>
          <span className="text-slate-300" aria-hidden>
            /
          </span>
          <span className="text-slate-600">{model.deliveryLabel}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          {createdAt ? <span>ثبت: {faDate(createdAt)}</span> : null}
          <span
            className="num font-semibold text-[#0a1b33]"
            aria-label={`پیشرفت سفارش ${model.progressPercent} درصد`}
          >
            {model.progressPercent}%
          </span>
        </div>
      </div>

      {/* نمای دسکتاپ و تبلت: مسیر افقی سه‌مرحله‌ای راست‌به‌چپ */}
      <div className="relative mt-5 hidden sm:block">
        <div
          className="pointer-events-none absolute top-4 right-[16.6667%] left-[16.6667%] h-[3px] overflow-hidden rounded-full bg-slate-200"
          aria-hidden
        >
          <motion.div
            className={cn("h-full w-full rounded-full", trackFillToneStyles[model.tone])}
            style={{ transformOrigin: "right center" }}
            initial={false}
            animate={{ scaleX: model.trackFillRatio }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <ol
          aria-label="مراحل وضعیت سفارش"
          className="relative grid grid-cols-3 gap-4"
        >
          {model.steps.map((step) => (
            <li
              key={step.key}
              aria-current={step.isCurrent ? "step" : undefined}
              className="flex flex-col items-center text-center"
            >
              <span
                className={cn(
                  "relative z-10 grid h-8 w-8 place-items-center rounded-full border-2 transition-colors",
                  getNodeClasses(step, model.tone),
                )}
              >
                {getStepIcon(step)}
              </span>
              <span
                className={cn(
                  "mt-2.5 text-[12px] font-bold leading-5",
                  getLabelClasses(step),
                )}
              >
                {step.label}
              </span>
              <p className="mt-1 max-w-[210px] text-[11px] leading-5 text-slate-500">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* نمای موبایل: تایم‌لاین عمودی بدون شکست یا برش متن */}
      <ol
        aria-label="مراحل وضعیت سفارش"
        className="mt-4 space-y-2 sm:hidden"
      >
        {model.steps.map((step, index) => {
          const isLast = index === model.steps.length - 1
          const connectorFilled =
            model.trackFillRatio >= 1 ||
            (model.trackFillRatio >= 0.5 && index === 0)
          return (
            <li
              key={step.key}
              aria-current={step.isCurrent ? "step" : undefined}
              className="relative flex items-stretch gap-3"
            >
              <div className="relative flex flex-col items-center">
                <span
                  className={cn(
                    "relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2",
                    getNodeClasses(step, model.tone),
                  )}
                >
                  {getStepIcon(step)}
                </span>
                {!isLast ? (
                  <span
                    className={cn(
                      "my-1 w-[2px] flex-1 min-h-5 rounded-full",
                      connectorFilled
                        ? trackFillToneStyles[model.tone]
                        : "bg-slate-200",
                    )}
                    aria-hidden
                  />
                ) : null}
              </div>
              <div className={cn("min-w-0 flex-1 pt-0.5", !isLast && "pb-3")}>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "text-[12px] font-bold",
                      getLabelClasses(step),
                    )}
                  >
                    {step.label}
                  </span>
                  <span className="tabular-nums text-[10.5px] text-slate-400">
                    مرحله {step.stepNumber} از ۳
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] leading-5 text-slate-500">
                  {step.description}
                </p>
              </div>
            </li>
          )
        })}
      </ol>

      {/* توضیح راهنمای وضعیت جاری */}
      <div
        className={cn(
          "mt-4 rounded-xl border px-3.5 py-2.5 text-[11.5px] leading-6",
          bannerToneStyles[model.tone],
        )}
      >
        {model.subtext}
      </div>
    </div>
  )
}
