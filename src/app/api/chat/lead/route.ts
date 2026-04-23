import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, name, email } = body as {
      sessionId: unknown;
      name: unknown;
      email: unknown;
    };

    if (
      typeof sessionId !== "string" || sessionId.trim().length === 0 ||
      typeof name !== "string" || name.trim().length === 0 ||
      typeof email !== "string" || !email.includes("@")
    ) {
      return NextResponse.json(
        { error: "sessionId, name, and a valid email are required." },
        { status: 400 }
      );
    }

    await prisma.conversation.upsert({
      where: { sessionId: sessionId.trim() },
      update: {
        leadName: name.trim(),
        leadEmail: email.trim(),
        bookedCall: true,
      },
      create: {
        sessionId: sessionId.trim(),
        messages: [],
        leadName: name.trim(),
        leadEmail: email.trim(),
        bookedCall: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/chat/lead]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
