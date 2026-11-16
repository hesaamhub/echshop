import { toDisplayHtml } from "@/lib/richText"
import { cn } from "@/lib/utils"

export default function RichTextContent({
  content,
  className,
}: {
  content: string
  className?: string
}) {
  const html = toDisplayHtml(content)
  if (!html) return null

  return (
    <div
      className={cn(
        "[&_p]:mb-2.5 [&_p:last-child]:mb-0",
        "[&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:font-display [&_h2]:text-[18px] [&_h2]:font-bold [&_h2]:text-[#0a1b33]",
        "[&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:font-display [&_h3]:text-[15px] [&_h3]:font-bold [&_h3]:text-[#0a1b33]",
        "[&_h4]:mt-2 [&_h4]:mb-1 [&_h4]:text-[13.5px] [&_h4]:font-bold [&_h4]:text-[#0a1b33]",
        "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pr-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pr-5 [&_li]:mb-1",
        "[&_blockquote]:my-3 [&_blockquote]:rounded-l-2xl [&_blockquote]:border-r-3 [&_blockquote]:border-[#1b39f5] [&_blockquote]:bg-[#f6f8ff] [&_blockquote]:px-4 [&_blockquote]:py-2.5 [&_blockquote]:text-slate-600",
        "[&_a]:font-semibold [&_a]:text-[#1b39f5] [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-[#1530d8]",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
