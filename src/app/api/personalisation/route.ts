import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { segment, source, intent, path } = body as {
      segment: unknown;
      source: unknown;
      intent: unknown;
      path: unknown;
    };

    if (
      typeof segment !== "string" || !segment.trim() ||
      typeof source !== "string" || !source.trim() ||
      typeof intent !== "string" || !intent.trim() ||
      typeof path !== "string" || !path.trim()
    ) {
      return NextResponse.json(
        { error: "segment, source, intent, and path are all required." },
        { status: 400 }
      );
    }

    await prisma.segmentEvent.create({
      data: {
        segment: segment.trim(),
        source: source.trim(),
        intent: intent.trim(),
        path: path.trim(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/personalisation]", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
