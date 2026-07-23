import "server-only";

import { applyChatOutputPolicy } from "@/lib/ai";
import type { StoredChatMessage } from "./chat-types";

const MAX_PROVIDER_MESSAGES = 9;

export function canonicalProviderMessages(
  messages: readonly StoredChatMessage[],
  currentMessage: string,
) {
  const completePairs: Array<[StoredChatMessage, StoredChatMessage]> = [];
  for (let index = 0; index < messages.length - 1; index += 1) {
    const user = messages[index];
    const assistant = messages[index + 1];
    if (user?.role === "user" && assistant?.role === "assistant") {
      completePairs.push([user, assistant]);
      index += 1;
    }
  }

  const prior = completePairs
    .slice(-Math.floor((MAX_PROVIDER_MESSAGES - 1) / 2))
    .flatMap(([user, assistant]) => [
      { role: "user" as const, content: user.content },
      {
        role: "assistant" as const,
        content: applyChatOutputPolicy(assistant.content).text,
      },
    ]);

  return [...prior, { role: "user" as const, content: currentMessage }];
}

export function shouldOfferLeadCapture(
  messages: readonly StoredChatMessage[],
  currentMessage: string,
  currentMessageIsStored = false,
  conversationHasLead = false,
) {
  if (conversationHasLead) return false;

  const userTurns =
    messages.filter((message) => message.role === "user").length +
    (currentMessageIsStored ? 0 : 1);
  return (
    userTurns >= 3 ||
    /\b(book|call|contact|meeting|speak|talk)\b/i.test(currentMessage)
  );
}
