import { createHmac, randomBytes, timingSafeEqual } from "node:crypto"

// Ephemeral fallback secret per server process when PAYMENT_SESSION_SECRET is not set.
let ephemeralSecret: string | null = null

function getSigningSecret(): string {
  const envSecret = process.env.PAYMENT_SESSION_SECRET?.trim()
  if (envSecret && envSecret.length >= 16) return envSecret
  if (!ephemeralSecret) {
    ephemeralSecret = randomBytes(32).toString("hex")
  }
  return ephemeralSecret
}

export function signCookiePayload<T>(payload: T, secretOverride?: string): string {
  const secret = secretOverride || getSigningSecret()
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url")
  const signature = createHmac("sha256", secret).update(encoded).digest("base64url")
  return `${encoded}.${signature}`
}

export function verifyCookiePayload<T>(
  rawCookie: string | undefined | null,
  secretOverride?: string,
): T | null {
  if (!rawCookie || typeof rawCookie !== "string") return null
  const dotIdx = rawCookie.indexOf(".")
  if (dotIdx <= 0 || dotIdx === rawCookie.length - 1) return null

  const encoded = rawCookie.slice(0, dotIdx)
  const providedSig = rawCookie.slice(dotIdx + 1)
  const secret = secretOverride || getSigningSecret()
  const expectedSig = createHmac("sha256", secret).update(encoded).digest("base64url")

  const providedBuf = Buffer.from(providedSig, "utf8")
  const expectedBuf = Buffer.from(expectedSig, "utf8")
  if (providedBuf.length !== expectedBuf.length || !timingSafeEqual(providedBuf, expectedBuf)) {
    return null
  }

  try {
    return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as T
  } catch {
    return null
  }
}

export function resolveAppOrigin(req?: {
  url: string
  headers: { get(name: string): string | null }
}): string {
  const envOrigin = (process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "")
    .trim()
    .replace(/\/+$/, "")

  if (envOrigin && /^https?:\/\/[^/\s]+/i.test(envOrigin) && !envOrigin.includes("yourdomain.com")) {
    return envOrigin
  }

  if (req) {
    const forwardedHost = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim()
    const forwardedProto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https"
    if (forwardedHost) {
      return `${forwardedProto}://${forwardedHost}`.replace(/\/+$/, "")
    }
    try {
      return new URL(req.url).origin
    } catch {
      // fall through
    }
  }

  return "http://localhost:3000"
}

export function buildSecureCookieHeader(
  name: string,
  value: string,
  options: { maxAge: number; isHttps: boolean },
): string {
  const parts = [
    `${name}=${value}`,
    "Path=/",
    "HttpOnly",
    `Max-Age=${Math.max(0, Math.floor(options.maxAge))}`,
  ]
  if (options.isHttps) {
    parts.push("SameSite=None", "Secure", "Partitioned")
  } else {
    parts.push("SameSite=Lax")
  }
  return parts.join("; ")
}

export function isTrustedSameOriginRequest(req: {
  url: string
  headers: { get(name: string): string | null }
}): boolean {
  const originHeader = req.headers.get("origin")?.trim()
  if (!originHeader) {
    const secFetchSite = req.headers.get("sec-fetch-site")?.trim().toLowerCase()
    return secFetchSite !== "cross-site"
  }

  try {
    const reqOrigin = new URL(resolveAppOrigin(req)).origin
    const parsedOrigin = new URL(originHeader).origin
    if (parsedOrigin === reqOrigin) return true
    const reqUrlOrigin = new URL(req.url).origin
    if (parsedOrigin === reqUrlOrigin) return true
    if (parsedOrigin.endsWith(".run.app") && reqOrigin.endsWith(".run.app")) return true
    return false
  } catch {
    return false
  }
}
