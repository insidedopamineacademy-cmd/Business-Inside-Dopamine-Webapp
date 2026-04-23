import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { anthropic, buildSystemPrompt } from "@/lib/ai";

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_MESSAGES = 10;

// Signals that indicate the model is collecting lead info
const LEAD_CAPTURE_PATTERNS = [
  /what.s your name/i,
  /best email/i,
  /email address/i,
  /reach you/i,
  /noted that down/i,
];

function isLeadCaptureTriggered(text: string): boolean {
  return LEAD_CAPTURE_PATTERNS.some((re) => re.test(text));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, sessionId, history } = body as {
      message: unknown;
      sessionId: unknown;
      history: unknown;
    };

    if (
      typeof message !== "string" ||
      message.trim().length === 0 ||
      message.length > MAX_MESSAGE_LENGTH
    ) {
      return NextResponse.json(
        { error: "Message must be a non-empty string under 500 characters." },
        { status: 400 }
      );
    }

    if (typeof sessionId !== "string" || sessionId.trim().length === 0) {
      return NextResponse.json(
        { error: "A valid sessionId is required." },
        { status: 400 }
      );
    }

    const safeHistory = (
      Array.isArray(history) ? history : []
    ).filter(
      (m): m is { role: "user" | "assistant"; content: string } =>
        m !== null &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    );

    const faqs = await prisma.faq.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    const systemPrompt = buildSystemPrompt(faqs);

    const trimmedHistory = safeHistory.slice(-MAX_HISTORY_MESSAGES);

    const completion = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: systemPrompt,
      messages: [
        ...trimmedHistory,
        { role: "user", content: message.trim() },
      ],
    });

    const responseText =
      completion.content.find((b) => b.type === "text")?.text ?? "";

    const leadCaptureTriggered = isLeadCaptureTriggered(responseText);

    const existingConversation = await prisma.conversation.findUnique({
      where: { sessionId },
    });

    const existingMessages = Array.isArray(existingConversation?.messages)
      ? (existingConversation.messages as Array<{ role: string; content: string }>)
      : [];

    const updatedMessages = [
      ...existingMessages,
      { role: "user", content: message.trim() },
      { role: "assistant", content: responseText },
    ];

    await prisma.conversation.upsert({
      where: { sessionId },
      create: {
        sessionId,
        messages: updatedMessages,
      },
      update: {
        messages: updatedMessages,
      },
    });

    return NextResponse.json({ response: responseText, leadCaptureTriggered });
  } catch (err) {
    console.error("[/api/chat]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
