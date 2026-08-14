// پل آپلود باینری: چانک‌های base64 داخل inbox/ را به فایل باینری واقعی تبدیل می‌کند
// مانیفست: { "files": [ { "target": "public/art/x.png", "chunks": ["x.001.b64", ...] } ] }
import fs from "node:fs"
import path from "node:path"

const inboxDir = "inbox"
const manifest = JSON.parse(fs.readFileSync(path.join(inboxDir, "manifest.json"), "utf8"))

for (const item of manifest.files) {
  if (!item.target || !Array.isArray(item.chunks) || item.chunks.length === 0) {
    throw new Error(`invalid manifest entry: ${JSON.stringify(item)}`)
  }
  const b64 = item.chunks
    .map((chunk) => fs.readFileSync(path.join(inboxDir, chunk), "utf8"))
    .join("")
    .replace(/\s+/g, "")
  const buffer = Buffer.from(b64, "base64")
  fs.mkdirSync(path.dirname(item.target), { recursive: true })
  fs.writeFileSync(item.target, buffer)
  console.log(`decoded ${item.target} — ${buffer.length} bytes`)
}

fs.rmSync(inboxDir, { recursive: true, force: true })
console.log("inbox cleaned")
