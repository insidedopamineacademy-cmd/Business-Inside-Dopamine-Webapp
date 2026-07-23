import "server-only";

import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { isUuid } from "@/lib/server/public-api-core";
import {
  ChatServiceError,
  type StoredChatMessage,
} from "./chat-types";

const MAX_STORED_MESSAGES = 50;

export type ConversationSnapshot = {
  id: string;
  version: number;
  messages: Prisma.JsonValue;
  lead: { id: string } | null;
};

export function storedChatMessages(
  value: Prisma.JsonValue,
): StoredChatMessage[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry) => {
    if (
      entry === null ||
      typeof entry !== "object" ||
      Array.isArray(entry) ||
      (entry.role !== "user" && entry.role !== "assistant") ||
      typeof entry.content !== "string" ||
      entry.content.length < 1 ||
      entry.content.length > 4_000
    ) {
      return [];
    }

    return [{
      id: typeof entry.id === "string" && isUuid(entry.id) ? entry.id : undefined,
      role: entry.role,
      content: entry.content,
      replyToId:
        typeof entry.replyToId === "string" && isUuid(entry.replyToId)
          ? entry.replyToId
          : undefined,
      createdAt: typeof entry.createdAt === "string" ? entry.createdAt : undefined,
    }];
  });
}

export function findExistingReply(
  messages: readonly StoredChatMessage[],
  messageId: string,
) {
  return messages.find(
    (message) => message.role === "assistant" && message.replyToId === messageId,
  )?.content;
}

export function assertMessageIdMatches(
  messages: readonly StoredChatMessage[],
  messageId: string,
  userText: string,
) {
  const existing = messages.find(
    (message) => message.role === "user" && message.id === messageId,
  );
  if (existing && existing.content !== userText) {
    throw new ChatServiceError({
      code: "CHAT_IDEMPOTENCY_CONFLICT",
      status: 409,
      retryable: false,
      userMessage: "That message retry did not match the original request.",
      diagnostic: "A chat message id was reused with different normalized text.",
    });
  }
}

function boundedTranscript(messages: readonly StoredChatMessage[]) {
  const bounded = messages.slice(-MAX_STORED_MESSAGES);
  const firstUser = bounded.findIndex((message) => message.role === "user");
  return firstUser < 0 ? [] : bounded.slice(firstUser);
}

export function conversationPersistenceError() {
  return new ChatServiceError({
    code: "CHAT_PERSISTENCE_FAILED",
    status: 503,
    retryable: true,
    userMessage:
      "Chat is temporarily unavailable. Please try again or use the contact form.",
    diagnostic: "Conversation persistence failed.",
  });
}

export async function loadConversation(sessionId: string) {
  try {
    return await prisma.conversation.findUnique({
      where: { sessionId },
      select: {
        id: true,
        version: true,
        messages: true,
        lead: { select: { id: true } },
      },
    });
  } catch {
    throw conversationPersistenceError();
  }
}

function isUniqueConflict(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

export async function persistConversationExchange(options: {
  snapshot: ConversationSnapshot | null;
  sessionId: string;
  messageId: string;
  userText: string;
  assistantText: string;
}) {
  const now = new Date().toISOString();
  const exchange: StoredChatMessage[] = [
    {
      id: options.messageId,
      role: "user",
      content: options.userText,
      createdAt: now,
    },
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: options.assistantText,
      replyToId: options.messageId,
      createdAt: now,
    },
  ];
  let snapshot = options.snapshot;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const currentMessages = snapshot
      ? storedChatMessages(snapshot.messages)
      : [];
    assertMessageIdMatches(currentMessages, options.messageId, options.userText);
    const reply = findExistingReply(currentMessages, options.messageId);
    if (reply) return reply;
    const nextMessages = boundedTranscript([...currentMessages, ...exchange]);

    try {
      if (!snapshot) {
        await prisma.conversation.create({
          data: {
            sessionId: options.sessionId,
            messages: nextMessages as Prisma.InputJsonValue,
            messageCount: nextMessages.length,
          },
          select: { id: true },
        });
        return options.assistantText;
      }

      const updated = await prisma.conversation.updateMany({
        where: { id: snapshot.id, version: snapshot.version },
        data: {
          messages: nextMessages as Prisma.InputJsonValue,
          messageCount: nextMessages.length,
          version: { increment: 1 },
        },
      });
      if (updated.count === 1) return options.assistantText;
    } catch (error) {
      if (!isUniqueConflict(error)) throw conversationPersistenceError();
    }

    snapshot = await loadConversation(options.sessionId);
  }

  throw conversationPersistenceError();
}
