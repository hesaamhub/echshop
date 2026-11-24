import { NextResponse } from "next/server"
import { resolveSiteUrl } from "@/lib/seo/structuredData"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({
    ok: true,
    siteUrl: resolveSiteUrl(),
    timestamp: new Date().toISOString(),
  })
}
