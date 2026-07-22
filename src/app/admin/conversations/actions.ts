"use server";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

function messageCount(messages: unknown) {
  return Array.isArray(messages) ? messages.length : 0;
}

export async function getConversations() {
  await requireAdmin();

  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        leadName: true,
        leadEmail: true,
        bookedCall: true,
        messages: true,
        lead: { select: { id: true } },
      },
    });

    return conversations.map((conversation) => ({
      id: conversation.id,
      createdAt: conversation.createdAt,
      leadName: conversation.leadName,
      leadEmail: conversation.leadEmail,
      bookedCall: conversation.bookedCall,
      leadCaptured: conversation.lead !== null,
      messageCount: messageCount(conversation.messages),
    }));
  } catch {
    throw new Error("Failed to fetch conversations.");
  }
}
