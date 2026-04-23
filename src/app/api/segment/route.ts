import { NextRequest, NextResponse } from "next/server";
import { detectVisitorProfile } from "@/lib/visitor";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const profile = detectVisitorProfile(request);
    return NextResponse.json(
      { segment: profile.segment, source: profile.source, intent: profile.intent },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { segment: "general", source: "other", intent: "low" },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
