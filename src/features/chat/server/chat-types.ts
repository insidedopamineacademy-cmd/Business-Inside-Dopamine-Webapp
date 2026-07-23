import "server-only";

export type StoredChatMessage = {
  id?: string;
  role: "user" | "assistant";
  content: string;
  replyToId?: string;
  createdAt?: string;
};

export type ChatServiceInput = {
  requestId: string;
  requestHeaders: Headers;
  message: string;
  sessionId: string;
  messageId: string;
};

export type ChatServiceResponse = {
  response: string;
  leadCaptureTriggered: boolean;
  duplicate: boolean;
};

export type ChatServiceFailureCode =
  | "CHAT_RATE_LIMITED"
  | "CHAT_RATE_LIMIT_UNAVAILABLE"
  | "CHAT_DATABASE_NOT_CONFIGURED"
  | "CHAT_PERSISTENCE_FAILED"
  | "CHAT_IDEMPOTENCY_CONFLICT"
  | "CHAT_NOT_CONFIGURED"
  | "CHAT_PROVIDER_AUTH"
  | "CHAT_PROVIDER_MODEL_UNAVAILABLE"
  | "CHAT_PROVIDER_QUOTA"
  | "CHAT_PROVIDER_TIMEOUT"
  | "CHAT_PROVIDER_UNAVAILABLE"
  | "CHAT_PROVIDER_REQUEST_REJECTED"
  | "CHAT_PROVIDER_INVALID_RESPONSE"
  | "CHAT_OVERLOADED"
  | "CHAT_INTERNAL_ERROR";

export type ChatServiceFailure = {
  code: ChatServiceFailureCode;
  status: number;
  retryable: boolean;
  userMessage: string;
  diagnostic: string;
};

export type ChatServiceResult =
  | {
      ok: true;
      data: ChatServiceResponse;
    }
  | {
      ok: false;
      error: ChatServiceFailure;
      retryAfterSeconds?: number;
    };

export class ChatServiceError extends Error {
  readonly failure: ChatServiceFailure;

  constructor(failure: ChatServiceFailure) {
    super(failure.diagnostic);
    this.name = "ChatServiceError";
    this.failure = failure;
  }
}
