/** لوگوی برندهای محصولات برای اسکرولر صفحه اصلی.
 *  منبع لوگوها: cdn.simpleicons.org (رنگ هر برند در خود آدرس تعیین می‌شود)
 *  اگر لوگویی لود نشود، نام برند به‌جایش نمایش داده می‌شود.
 */
export type BrandLogo = {
  name: string
  src: string
  gradient: { from: string; to: string }
}

const icon = (slug: string, color: string) =>
  `https://cdn.simpleicons.org/${slug}/${color}`

export const brandLogos: BrandLogo[] = [
  { name: "Spotify", src: icon("spotify", "1DB954"), gradient: { from: "#1DB954", to: "#0f7a37" } },
  { name: "Netflix", src: icon("netflix", "E50914"), gradient: { from: "#E50914", to: "#8b0209" } },
  { name: "OpenAI", src: icon("openai", "10A37F"), gradient: { from: "#10A37F", to: "#0b6b54" } },
  { name: "Adobe", src: icon("adobe", "FF0000"), gradient: { from: "#FF0000", to: "#990000" } },
  { name: "Canva", src: icon("canva", "00C4CC"), gradient: { from: "#00C4CC", to: "#7D2AE8" } },
  { name: "YouTube", src: icon("youtube", "FF0033"), gradient: { from: "#FF0033", to: "#a30022" } },
  { name: "Discord", src: icon("discord", "5865F2"), gradient: { from: "#5865F2", to: "#2f39ac" } },
  { name: "Telegram", src: icon("telegram", "26A5E4"), gradient: { from: "#2AABEE", to: "#1a6f9c" } },
  { name: "Apple", src: icon("apple", "111827"), gradient: { from: "#4b5563", to: "#111827" } },
  { name: "Microsoft", src: icon("microsoft", "0078D4"), gradient: { from: "#00A4EF", to: "#0b5d8a" } },
  { name: "Google", src: icon("google", "4285F4"), gradient: { from: "#4285F4", to: "#1a4fa0" } },
  { name: "Figma", src: icon("figma", "F24E1E"), gradient: { from: "#F24E1E", to: "#a2260a" } },
  { name: "Notion", src: icon("notion", "111827"), gradient: { from: "#6b7280", to: "#111827" } },
  { name: "Slack", src: icon("slack", "4A154B"), gradient: { from: "#E01E5A", to: "#611f69" } },
  { name: "Steam", src: icon("steam", "1b2838"), gradient: { from: "#3b5f8a", to: "#171a21" } },
  { name: "PlayStation", src: icon("playstation", "003791"), gradient: { from: "#0d63d6", to: "#00256b" } },
  { name: "Xbox", src: icon("xbox", "107C10"), gradient: { from: "#107C10", to: "#0a4f0a" } },
  { name: "Zoom", src: icon("zoom", "0B5CFF"), gradient: { from: "#0B5CFF", to: "#0736a0" } },
  { name: "Duolingo", src: icon("duolingo", "58CC02"), gradient: { from: "#58CC02", to: "#3a8a01" } },
  { name: "LinkedIn", src: icon("linkedin", "0A66C2"), gradient: { from: "#0A66C2", to: "#053f7a" } },
  { name: "Dropbox", src: icon("dropbox", "0061FF"), gradient: { from: "#0061FF", to: "#0039a0" } },
  { name: "Grammarly", src: icon("grammarly", "15C39A"), gradient: { from: "#15C39A", to: "#0c7a60" } },
]
