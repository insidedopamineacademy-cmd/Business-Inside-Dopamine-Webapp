import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

function parseMessages(raw: unknown): Message[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (m): m is Message =>
      m !== null &&
      typeof m === "object" &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string"
  );
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const conversation = await prisma.conversation.findUnique({ where: { id } });
  if (!conversation) notFound();

  const messages = parseMessages(conversation.messages);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Back */}
      <Link
        href="/admin/conversations"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1"
      >
        ← All Conversations
      </Link>

      {/* Booked call banner */}
      {conversation.bookedCall && (
        <div className="mt-5 rounded-2xl border border-[rgba(52,199,89,0.3)] bg-[rgba(52,199,89,0.08)] px-5 py-3 text-sm text-[var(--color-success)]">
          <span className="font-semibold">This visitor booked a call</span>
          {" — "}
          {conversation.leadName && <>Name: <span className="font-medium">{conversation.leadName}</span></>}
          {conversation.leadName && conversation.leadEmail && " | "}
          {conversation.leadEmail && <>Email: <span className="font-medium">{conversation.leadEmail}</span></>}
        </div>
      )}

      {/* Header */}
      <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
              Session ID
            </p>
            <p className="mt-0.5 truncate font-mono text-sm text-[var(--color-text-primary)]">
              {conversation.sessionId}
            </p>
          </div>
          <div>
            {conversation.bookedCall ? (
              <span className="inline-flex items-center rounded-full bg-[var(--color-accent-light)] px-3 py-1 text-xs font-medium uppercase tracking-widest text-[var(--color-accent)]">
                Booked
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-[var(--color-surface)] px-3 py-1 text-xs font-medium uppercase tracking-widest text-[var(--color-text-secondary)]">
                No booking
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <p className="text-xs text-[var(--color-text-secondary)]">Date</p>
            <p className="mt-0.5 text-[var(--color-text-primary)]">{formatDate(conversation.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-secondary)]">Lead name</p>
            <p className="mt-0.5 text-[var(--color-text-primary)]">{conversation.leadName ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-secondary)]">Lead email</p>
            <p className="mt-0.5 text-[var(--color-text-primary)]">{conversation.leadEmail ?? "—"}</p>
          </div>
        </div>
      </div>

      {/* Message thread */}
      <div className="mx-auto mt-8 max-w-2xl">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-[var(--color-text-secondary)]">
            No messages recorded in this session.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg, i) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div
                  key={i}
                  className={`flex flex-col gap-1 ${isAssistant ? "items-start" : "items-end"}`}
                >
                  <span className="px-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
                    {isAssistant ? "Dopamine" : "Visitor"}
                  </span>

                  <div
                    className={[
                      "max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed",
                      isAssistant
                        ? "rounded-tl-sm bg-[var(--color-surface)] text-[var(--color-text-primary)]"
                        : "rounded-tr-sm bg-[var(--color-accent)] text-white",
                    ].join(" ")}
                  >
                    {msg.content}
                  </div>

                  {msg.timestamp && (
                    <span className="px-1 text-[11px] text-[var(--color-text-secondary)]">
                      {msg.timestamp}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
