"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Conversation } from "@prisma/client";
import { getConversations } from "@/app/admin/conversations/actions";
import { Card, Badge } from "@/components/ui";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function messageCount(messages: unknown): number {
  return Array.isArray(messages) ? messages.length : 0;
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConversations()
      .then(setConversations)
      .finally(() => setLoading(false));
  }, []);

  const total = conversations.length;
  const leadsCount = conversations.filter((c) => c.bookedCall).length;
  const conversionRate =
    total > 0 ? Math.round((leadsCount / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Chat Conversations
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          All customer chat sessions with the Dopamine agent
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card variant="bordered" className="p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
            Total Conversations
          </p>
          <p className="mt-2 text-3xl font-semibold text-[var(--color-text-primary)]">
            {loading ? "—" : total}
          </p>
        </Card>

        <Card variant="bordered" className="p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
            Leads Captured
          </p>
          <p className="mt-2 text-3xl font-semibold text-[var(--color-text-primary)]">
            {loading ? "—" : leadsCount}
          </p>
        </Card>

        <Card variant="bordered" className="p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
            Conversion Rate
          </p>
          <p className="mt-2 text-3xl font-semibold text-[var(--color-text-primary)]">
            {loading ? "—" : `${conversionRate}%`}
          </p>
        </Card>
      </div>

      {/* List */}
      {loading ? (
        <p className="text-sm text-[var(--color-text-secondary)]">Loading…</p>
      ) : conversations.length === 0 ? (
        <Card variant="bordered" className="p-8 text-center">
          <p className="text-sm text-[var(--color-text-secondary)]">
            No conversations yet — the chat widget will populate this once
            visitors start chatting.
          </p>
        </Card>
      ) : (
        <Card variant="bordered" className="overflow-hidden p-0">
          {/* Table header */}
          <div className="hidden grid-cols-[1.6fr_1fr_1.4fr_0.6fr_0.8fr_0.4fr] gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)] sm:grid">
            <span>Date / Time</span>
            <span>Name</span>
            <span>Email</span>
            <span>Messages</span>
            <span>Booked</span>
            <span />
          </div>

          {/* Rows */}
          <ul className="divide-y divide-[var(--color-border)]">
            {conversations.map((conv) => (
              <li key={conv.id}>
                {/* Desktop row */}
                <div className="hidden grid-cols-[1.6fr_1fr_1.4fr_0.6fr_0.8fr_0.4fr] items-center gap-4 px-5 py-4 text-sm transition-colors hover:bg-[var(--color-surface)] sm:grid">
                  <span className="text-[var(--color-text-secondary)]">
                    {formatDate(conv.createdAt)}
                  </span>
                  <span className="truncate font-medium text-[var(--color-text-primary)]">
                    {conv.leadName ?? "Anonymous"}
                  </span>
                  <span className="truncate text-[var(--color-text-secondary)]">
                    {conv.leadEmail ?? "—"}
                  </span>
                  <span className="text-[var(--color-text-secondary)]">
                    {messageCount(conv.messages)}
                  </span>
                  <span>
                    <Badge variant={conv.bookedCall ? "accent" : "default"}>
                      {conv.bookedCall ? "Booked" : "No"}
                    </Badge>
                  </span>
                  <span>
                    <Link
                      href={`/admin/conversations/${conv.id}`}
                      className="text-xs font-medium text-[var(--color-accent)] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1"
                    >
                      View
                    </Link>
                  </span>
                </div>

                {/* Mobile card */}
                <div className="flex items-start justify-between gap-3 px-5 py-4 sm:hidden">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-[var(--color-text-primary)]">
                        {conv.leadName ?? "Anonymous"}
                      </span>
                      <Badge variant={conv.bookedCall ? "accent" : "default"}>
                        {conv.bookedCall ? "Booked" : "No"}
                      </Badge>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-[var(--color-text-secondary)]">
                      {conv.leadEmail ?? "No email"} · {messageCount(conv.messages)} messages
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                      {formatDate(conv.createdAt)}
                    </p>
                  </div>
                  <Link
                    href={`/admin/conversations/${conv.id}`}
                    className="shrink-0 text-xs font-medium text-[var(--color-accent)] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1"
                  >
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
