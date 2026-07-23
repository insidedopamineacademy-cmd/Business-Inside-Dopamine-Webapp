import "server-only";

import { NextResponse } from "next/server";

import {
  PublicApiError,
  invalidRequest,
  payloadTooLarge,
} from "@/lib/server/public-api-core";

export type PublicErrorShape = {
  code: string;
  message: string;
  retryable: boolean;
  requestId: string;
};

export async function readBoundedJson(
  request: Request,
  maxBytes: number,
): Promise<unknown> {
  const contentType = request.headers.get("content-type");
  if (
    !contentType ||
    contentType.split(";", 1)[0]?.trim().toLowerCase() !== "application/json"
  ) {
    throw new PublicApiError({
      code: "UNSUPPORTED_MEDIA_TYPE",
      status: 415,
      userMessage: "This endpoint accepts JSON requests only.",
      diagnostic: "Missing or unsupported Content-Type.",
    });
  }

  const declaredLength = request.headers.get("content-length");
  if (
    declaredLength &&
    /^\d+$/.test(declaredLength) &&
    Number(declaredLength) > maxBytes
  ) {
    throw payloadTooLarge(maxBytes);
  }

  const reader = request.body?.getReader();
  if (!reader) throw invalidRequest("Request body was empty.");

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        throw payloadTooLarge(maxBytes);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return JSON.parse(text) as unknown;
  } catch (error) {
    if (error instanceof PublicApiError) throw error;
    throw invalidRequest("Request body was not valid UTF-8 JSON.");
  }
}

export function publicErrorResponse(
  error: PublicApiError,
  requestId: string,
  extraHeaders?: HeadersInit,
) {
  const body: { error: PublicErrorShape } = {
    error: {
      code: error.code,
      message: error.userMessage,
      retryable: error.retryable,
      requestId,
    },
  };

  const headers = new Headers(extraHeaders);
  headers.set("x-request-id", requestId);
  headers.set("cache-control", "no-store");
  return NextResponse.json(body, { status: error.status, headers });
}

export function publicJsonResponse(
  body: Record<string, unknown>,
  requestId: string,
  status = 200,
) {
  return NextResponse.json(
    { ...body, requestId },
    {
      status,
      headers: {
        "cache-control": "no-store",
        "x-request-id": requestId,
      },
    },
  );
}
