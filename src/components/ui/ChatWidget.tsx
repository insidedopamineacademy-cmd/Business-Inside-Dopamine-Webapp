"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChatMessage from "@/components/ui/ChatMessage";
import ChatLeadCapture from "@/components/ui/ChatLeadCapture";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
};

const GREETING =
  "Hi! I'm Dopamine, Inside Dopamine's AI assistant. Ask me anything about our services, process, or how we work — I'm here to help.";

const BUBBLE_TEXT = "Wondering where to start? 👋";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [sessionId] = useState<string>(() => crypto.randomUUID());
  const [hasGreeted, setHasGreeted] = useState(false);

  // Proactive bubble state
  const [showBubble, setShowBubble] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Prevents bubble from ever appearing again after first dismiss
  const bubbleShownRef = useRef(false);
  // Stable ref to isOpen so the 8s timer sees current value, not stale closure
  const isOpenRef = useRef(false);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Show bubble once after 8 seconds if chat hasn't been opened
  useEffect(() => {
    const t = setTimeout(() => {
      if (!isOpenRef.current && !bubbleShownRef.current) {
        bubbleShownRef.current = true;
        setShowBubble(true);
      }
    }, 8000);
    return () => clearTimeout(t);
  }, []);

  // Typing animation + auto-hide when bubble becomes visible
  useEffect(() => {
    if (!showBubble) return;

    setTypedText("");
    setIsTypingDone(false);
    let i = 0;

    const typing = setInterval(() => {
      i++;
      setTypedText(BUBBLE_TEXT.slice(0, i));
      if (i >= BUBBLE_TEXT.length) {
        clearInterval(typing);
        setIsTypingDone(true);
      }
    }, 40);

    const autoHide = setTimeout(() => {
      setShowBubble(false);
    }, 6000);

    return () => {
      clearInterval(typing);
      clearTimeout(autoHide);
    };
  }, [showBubble]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 88)}px`;
  }, [inputValue]);

  function dismissBubble() {
    setShowBubble(false);
  }

  function openChat() {
    setShowBubble(false);
    setIsOpen(true);
    if (!hasGreeted) {
      setMessages([{ id: crypto.randomUUID(), role: "assistant", content: GREETING }]);
      setHasGreeted(true);
    }
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: trimmed };
    const loadingId = crypto.randomUUID();
    const loadingMsg: Message = { id: loadingId, role: "assistant", content: "", isLoading: true };

    const history = messages
      .filter((m) => !m.isLoading)
      .slice(-8)
      .map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, sessionId, history }),
      });

      const data = (await res.json()) as { response?: string; leadCaptureTriggered?: boolean };

      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? { id: loadingId, role: "assistant" as const, content: data.response ?? "Something went wrong. Please try again." }
            : m
        )
      );

      if (data.leadCaptureTriggered) setShowLeadCapture(true);
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? { id: loadingId, role: "assistant" as const, content: "Sorry, something went wrong. Please try again." }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLeadSubmit(name: string, email: string) {
    setShowLeadCapture(false);
    try {
      await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, name, email }),
      });
    } catch {
      // silent — confirmation message still shown
    }
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Perfect! We have your details and will be in touch within 24 hours. Is there anything else I can help you with?",
      },
    ]);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  }

  return (
    <>
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ originX: 1, originY: 1 }}
            className="fixed bottom-24 right-6 z-50 flex h-[520px] max-h-[calc(100vh-120px)] w-[380px] max-w-[calc(100vw-48px)] flex-col rounded-3xl border border-[var(--color-border)] bg-white shadow-[0_8px_48px_rgba(0,0,0,0.16)]"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between rounded-t-3xl bg-[var(--color-accent)] px-4 py-3 text-white">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-green-400" aria-hidden="true" />
                <div>
                  <div className="text-sm font-semibold leading-tight">Dopamine</div>
                  <div className="text-[11px] opacity-75">Inside Dopamine AI</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="rounded-lg p-1 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-4">
              {messages.map((m) => (
                <ChatMessage
                  key={m.id}
                  role={m.role}
                  content={m.content}
                  isLoading={m.isLoading}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Lead capture */}
            {showLeadCapture && (
              <div className="shrink-0 px-3 pb-2">
                <ChatLeadCapture
                  onSubmit={handleLeadSubmit}
                  onSkip={() => setShowLeadCapture(false)}
                />
              </div>
            )}

            {/* Input */}
            <div className="shrink-0 border-t border-[var(--color-border)] px-3 py-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  aria-label="Chat message input"
                  className="flex-1 resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] outline-none transition-[border-color] focus:border-[var(--color-accent)] disabled:opacity-50"
                  style={{ lineHeight: "1.5", overflowY: "hidden" }}
                />
                <button
                  type="button"
                  onClick={() => sendMessage(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  aria-label="Send message"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button + proactive bubble — fixed wrapper keeps them in sync */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Proactive bubble */}
        <AnimatePresence>
          {showBubble && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ originX: 1, originY: 1 }}
              className="absolute bottom-16 right-0 max-w-[200px] rounded-2xl rounded-br-sm border border-[var(--color-border)] bg-white px-4 py-3 shadow-lg"
            >
              {/* Dismiss button */}
              <button
                type="button"
                onClick={dismissBubble}
                aria-label="Dismiss"
                className="absolute right-2 top-1 text-xs text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              >
                ✕
              </button>

              {/* Typed text */}
              <p className="pr-3 text-[14px] font-medium leading-snug text-[var(--color-text-primary)]">
                {typedText}
                {!isTypingDone && (
                  <span className="ml-px inline-block animate-pulse">|</span>
                )}
              </p>

              {/* Triangle pointer toward chat button */}
              <div
                aria-hidden="true"
                className="absolute -bottom-[7px] right-4 h-3 w-3 rotate-45 border-b border-r border-[var(--color-border)] bg-white"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat trigger button */}
        <button
          type="button"
          onClick={openChat}
          aria-label="Open chat"
          aria-expanded={isOpen}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
        >
          {!hasGreeted && (
            <span
              aria-label="Unread message"
              className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500"
            />
          )}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
