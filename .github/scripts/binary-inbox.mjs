// پل آپلود باینری: چانک‌های base64 یا دانلود مستقیم از URL — به فایل باینری واقعی در ریپو
// مانیفست: { "files": [
//   { "target": "public/art/x.png", "chunks": ["x.001.b64", ...] },
//   { "target": "public/art/y.jpg", "url": "https://example.com/y.jpg" }
// ] }
import fs from "node:fs"
import path from "node:path"

const inboxDir = "inbox"
const manifest = JSON.parse(fs.readFileSync(path.join(inboxDir, "manifest.json"), "utf8"))

for (const item of manifest.files) {
  if (!item.target || (!item.url && (!Array.isArray(item.chunks) || item.chunks.length === 0))) {
    throw new Error(`invalid manifest entry: ${JSON.stringify(item)}`)
  }

  let buffer
  if (item.url) {
    const res = await fetch(item.url)
    if (!res.ok) throw new Error(`download failed (${res.status}): ${item.url}`)
    buffer = Buffer.from(await res.arrayBuffer())
    console.log(`downloaded ${item.url} — ${buffer.length} bytes`)
  } else {
    const b64 = item.chunks
      .map((chunk) => fs.readFileSync(path.join(inboxDir, chunk), "utf8"))
      .join("")
      .replace(/\s+/g, "")
    buffer = Buffer.from(b64, "base64")
    console.log(`decoded ${item.chunks.length} chunks — ${buffer.length} bytes`)
  }

  fs.mkdirSync(path.dirname(item.target), { recursive: true })
  fs.writeFileSync(item.target, buffer)
  console.log(`wrote ${item.target}`)
}

fs.rmSync(inboxDir, { recursive: true, force: true })
console.log("inbox cleaned")
