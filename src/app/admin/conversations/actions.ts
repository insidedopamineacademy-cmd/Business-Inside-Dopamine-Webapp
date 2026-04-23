"use server";

import { prisma } from "@/lib/prisma";
import type { Conversation } from "@prisma/client";

export async function getConversations(): Promise<Conversation[]> {
  try {
    return await prisma.conversation.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("[getConversations]", err);
    throw new Error("Failed to fetch conversations.");
  }
}
