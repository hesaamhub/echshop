/** لوگوی برندهای واقعی محصولات برای اسکرولر صفحه اصلی */
export type BrandLogo = {
  name: string
  src: string
  gradient: { from: string; to: string }
}

export const brandLogos: BrandLogo[] = [
  {
    name: "Spotify",
    src: "https://svgl.app/library/spotify.svg",
    gradient: { from: "#1DB954", to: "#0f7a37" },
  },
  {
    name: "Netflix",
    src: "https://svgl.app/library/netflix.svg",
    gradient: { from: "#E50914", to: "#8b0209" },
  },
  {
    name: "OpenAI",
    src: "https://svgl.app/library/openai.svg",
    gradient: { from: "#10A37F", to: "#0b6b54" },
  },
  {
    name: "Adobe",
    src: "https://svgl.app/library/adobe.svg",
    gradient: { from: "#FF0000", to: "#990000" },
  },
  {
    name: "Canva",
    src: "https://svgl.app/library/canva.svg",
    gradient: { from: "#00C4CC", to: "#7D2AE8" },
  },
  {
    name: "YouTube",
    src: "https://svgl.app/library/youtube.svg",
    gradient: { from: "#FF0033", to: "#a30022" },
  },
  {
    name: "Discord",
    src: "https://svgl.app/library/discord.svg",
    gradient: { from: "#5865F2", to: "#2f39ac" },
  },
  {
    name: "Telegram",
    src: "https://svgl.app/library/telegram.svg",
    gradient: { from: "#2AABEE", to: "#1a6f9c" },
  },
  {
    name: "Apple",
    src: "https://svgl.app/library/apple.svg",
    gradient: { from: "#4b5563", to: "#111827" },
  },
  {
    name: "Microsoft",
    src: "https://svgl.app/library/microsoft.svg",
    gradient: { from: "#00A4EF", to: "#0b5d8a" },
  },
  {
    name: "Google",
    src: "https://svgl.app/library/google.svg",
    gradient: { from: "#4285F4", to: "#1a4fa0" },
  },
  {
    name: "Figma",
    src: "https://svgl.app/library/figma.svg",
    gradient: { from: "#F24E1E", to: "#a2260a" },
  },
  {
    name: "Notion",
    src: "https://svgl.app/library/notion.svg",
    gradient: { from: "#6b7280", to: "#111827" },
  },
  {
    name: "Slack",
    src: "https://svgl.app/library/slack.svg",
    gradient: { from: "#E01E5A", to: "#611f69" },
  },
  {
    name: "LinkedIn",
    src: "https://svgl.app/library/linkedin.svg",
    gradient: { from: "#0A66C2", to: "#053f7a" },
  },
  {
    name: "Dropbox",
    src: "https://svgl.app/library/dropbox.svg",
    gradient: { from: "#0061FF", to: "#0039a0" },
  },
]
