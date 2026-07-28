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
  { name: "Anthropic", slug: "anthropic", color: "D97757", gradient: { from: "#D97757", to: "#8f4229" } },
  { name: "Perplexity", slug: "perplexity", color: "1FB8CD", gradient: { from: "#1FB8CD", to: "#10707e" } },
  { name: "GitHub", slug: "github", color: "181717", gradient: { from: "#4b5563", to: "#181717" } },
  { name: "JetBrains", slug: "jetbrains", color: "000000", gradient: { from: "#fe2857", to: "#293896" } },
  { name: "Autodesk", slug: "autodesk", color: "0696D7", gradient: { from: "#0696D7", to: "#045a82" } },
  { name: "Epic Games", slug: "epicgames", color: "313131", gradient: { from: "#5b5b5b", to: "#313131" } },
  { name: "Nintendo", slug: "nintendo", color: "E60012", gradient: { from: "#E60012", to: "#8c000b" } },
  { name: "Twitch", slug: "twitch", color: "9146FF", gradient: { from: "#9146FF", to: "#5a1fb0" } },
  { name: "SoundCloud", slug: "soundcloud", color: "FF5500", gradient: { from: "#FF5500", to: "#a33600" } },
  { name: "Crunchyroll", slug: "crunchyroll", color: "F47521", gradient: { from: "#F47521", to: "#a04a0d" } },
  { name: "Udemy", slug: "udemy", color: "A435F0", gradient: { from: "#A435F0", to: "#63189c" } },
  { name: "Coursera", slug: "coursera", color: "0056D2", gradient: { from: "#0056D2", to: "#003585" } },
  { name: "NordVPN", slug: "nordvpn", color: "4687FF", gradient: { from: "#4687FF", to: "#2450a8" } },
  { name: "Envato", slug: "envato", color: "81B441", gradient: { from: "#81B441", to: "#4e7024" } },
  { name: "Freepik", slug: "freepik", color: "1273EB", gradient: { from: "#1273EB", to: "#0a4694" } },
  { name: "WeTransfer", slug: "wetransfer", color: "409FFF", gradient: { from: "#409FFF", to: "#1f5fa8" } },
]
