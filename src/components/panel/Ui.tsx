import { cn } from "@/lib/utils"

export function Card(props: {
  title?: string
  action?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      className={cn(
        "rounded-[28px] border border-[#1b39f5]/10 bg-white p-6 shadow-[0_20px_44px_-34px_rgba(27,57,245,0.5)]",
        props.className,
      )}
    >
      {props.title ? (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2.5 text-[14px] font-bold text-[#0a1b33]">
            <span className="h-4 w-1.5 rounded-full bg-[#1b39f5]" aria-hidden />
            {props.title}
          </h2>
          {props.action}
        </div>
      ) : null}
      {props.children}
    </section>
  )
}

export function StatCard(props: {
  label: string
  value: string
  hint?: string
  tone?: "neutral" | "up" | "down"
}) {
  const toneClass =
    props.tone === "up"
      ? "text-[#46A171]"
      : props.tone === "down"
        ? "text-[#E56458]"
        : "text-slate-400"
  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-[#1b39f5]/10 bg-white p-5 shadow-[0_18px_38px_-32px_rgba(27,57,245,0.5)] transition-all hover:border-[#1b39f5]/25 hover:shadow-[0_22px_46px_-30px_rgba(27,57,245,0.55)]">
      <span
        className="pointer-events-none absolute -top-8 -left-8 h-20 w-20 rounded-full bg-[#1b39f5]/10 blur-xl transition-transform duration-500 group-hover:scale-125"
        aria-hidden
      />
      <span className="relative text-[11.5px] text-slate-400">{props.label}</span>
      <div className="relative mt-2 text-[19px] font-bold text-[#0a1b33]">{props.value}</div>
      {props.hint ? (
        <div className={cn("relative mt-1.5 text-[11px]", toneClass)}>{props.hint}</div>
      ) : null}
    </div>
  )
}

const toneMap: Record<string, string> = {
  green: "bg-[#E7F4EC] text-[#2F7A50]",
  blue: "bg-[#1b39f5]/10 text-[#1b39f5]",
  amber: "bg-[#FBF1E2] text-[#9A6321]",
  red: "bg-[#FCEAE8] text-[#A8382C]",
  gray: "bg-slate-100 text-slate-600",
}

export function Badge(props: {
  children: React.ReactNode
  tone?: "green" | "blue" | "amber" | "red" | "gray"
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-1 text-[10.5px] font-bold",
        toneMap[props.tone ?? "gray"],
      )}
    >
      {props.children}
    </span>
  )
}

export function Table(props: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-right">
        <thead>
          <tr className="border-b border-[#1b39f5]/12">
            {props.head.map((cell) => (
              <th
                key={cell}
                className="whitespace-nowrap px-3 py-3 text-[11.5px] font-bold text-slate-400"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{props.children}</tbody>
      </table>
    </div>
  )
}

export function Td(props: { children: React.ReactNode; className?: string }) {
  return (
    <td className={cn("px-3 py-3.5 text-[12px] text-slate-600", props.className)}>
      {props.children}
    </td>
  )
}

export function Field(props: {
  label: string
  placeholder?: string
  defaultValue?: string
  textarea?: boolean
  latin?: boolean
  hint?: string
  rows?: number
}) {
  const base =
    "mt-2 w-full rounded-2xl border border-[#1b39f5]/12 bg-[#1b39f5]/4 px-4 py-3 text-[12px] leading-7 outline-none transition-all focus:border-[#1b39f5]/45 focus:bg-white focus:shadow-[0_0_0_4px_rgba(27,57,245,0.1)]"
  return (
    <label className="block">
      <span className="text-[12px] font-semibold text-[#0a1b33]">{props.label}</span>
      {props.textarea ? (
        <textarea
          rows={props.rows ?? 4}
          placeholder={props.placeholder}
          defaultValue={props.defaultValue}
          className={base}
        />
      ) : (
        <input
          placeholder={props.placeholder}
          defaultValue={props.defaultValue}
          dir={props.latin ? "ltr" : undefined}
          className={cn(base, props.latin && "font-latin")}
        />
      )}
      {props.hint ? (
        <span className="mt-1.5 block text-[10.5px] text-slate-400">{props.hint}</span>
      ) : null}
    </label>
  )
}

export function Button(props: {
  children: React.ReactNode
  variant?: "primary" | "ghost" | "danger"
}) {
  const variant = props.variant ?? "primary"
  return (
    <button
      type="button"
      className={cn(
        "rounded-full px-5 py-2.5 text-[12px] font-semibold transition-all",
        variant === "primary" && "glass-solid",
        variant === "ghost" && "glass-plate glass-plate-hover text-[#1b39f5]",
        variant === "danger" && "bg-[#FCEAE8] text-[#A8382C] hover:bg-[#f8ddda]",
      )}
    >
      {props.children}
    </button>
  )
}
