export type BrandLogo = {
  name: string
  slug: string
  color: string
  gradient: { from: string; to: string }
}

/**
 * منابع لوگو به ترتیب امتحان می‌شوند تا در صورت در دسترس نبودن یک CDN،
 * لوگو از منبع بعدی بارگذاری شود.
 */
export function logoSources(logo: BrandLogo): string[] {
  return [
    "https://cdn.simpleicons.org/" + logo.slug + "/" + logo.color,
    "https://cdn.jsdelivr.net/npm/simple-icons@13/icons/" + logo.slug + ".svg",
    "https://unpkg.com/simple-icons@13/icons/" + logo.slug + ".svg",
  ]
}

export const brandLogos: BrandLogo[] = [
  { name: "Spotify", slug: "spotify", color: "1DB954", gradient: { from: "#1DB954", to: "#0f7a37" } },
  { name: "Netflix", slug: "netflix", color: "E50914", gradient: { from: "#E50914", to: "#8b0209" } },
  { name: "OpenAI", slug: "openai", color: "10A37F", gradient: { from: "#10A37F", to: "#0b6b54" } },
  { name: "Adobe", slug: "adobe", color: "FF0000", gradient: { from: "#FF0000", to: "#990000" } },
  { name: "Canva", slug: "canva", color: "00C4CC", gradient: { from: "#00C4CC", to: "#7D2AE8" } },
  { name: "YouTube", slug: "youtube", color: "FF0033", gradient: { from: "#FF0033", to: "#a30022" } },
  { name: "Discord", slug: "discord", color: "5865F2", gradient: { from: "#5865F2", to: "#2f39ac" } },
  { name: "Telegram", slug: "telegram", color: "26A5E4", gradient: { from: "#2AABEE", to: "#1a6f9c" } },
  { name: "Apple", slug: "apple", color: "111827", gradient: { from: "#4b5563", to: "#111827" } },
  { name: "Microsoft", slug: "microsoft", color: "0078D4", gradient: { from: "#00A4EF", to: "#0b5d8a" } },
  { name: "Google", slug: "google", color: "4285F4", gradient: { from: "#4285F4", to: "#1a4fa0" } },
  { name: "Figma", slug: "figma", color: "F24E1E", gradient: { from: "#F24E1E", to: "#a2260a" } },
  { name: "Notion", slug: "notion", color: "111827", gradient: { from: "#6b7280", to: "#111827" } },
  { name: "Slack", slug: "slack", color: "4A154B", gradient: { from: "#E01E5A", to: "#611f69" } },
  { name: "Steam", slug: "steam", color: "1b2838", gradient: { from: "#3b5f8a", to: "#171a21" } },
  { name: "PlayStation", slug: "playstation", color: "003791", gradient: { from: "#0d63d6", to: "#00256b" } },
  { name: "Xbox", slug: "xbox", color: "107C10", gradient: { from: "#107C10", to: "#0a4f0a" } },
  { name: "Zoom", slug: "zoom", color: "0B5CFF", gradient: { from: "#0B5CFF", to: "#0736a0" } },
  { name: "Duolingo", slug: "duolingo", color: "58CC02", gradient: { from: "#58CC02", to: "#3a8a01" } },
  { name: "LinkedIn", slug: "linkedin", color: "0A66C2", gradient: { from: "#0A66C2", to: "#053f7a" } },
  { name: "Dropbox", slug: "dropbox", color: "0061FF", gradient: { from: "#0061FF", to: "#0039a0" } },
  { name: "Grammarly", slug: "grammarly", color: "15C39A", gradient: { from: "#15C39A", to: "#0c7a60" } },
]
