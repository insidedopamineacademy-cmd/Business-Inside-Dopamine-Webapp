"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

type Props = {
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

const dotVariants: Variants = {
  pulse: (i: number) => ({
    opacity: [0.3, 1, 0.3],
    transition: {
      duration: 1,
      repeat: Infinity,
      delay: i * 0.18,
      ease: "easeInOut" as const,
    },
  }),
};

export default function ChatMessage({ role, content, isLoading }: Props) {
  const isAssistant = role === "assistant";

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className={`flex items-end gap-2 ${isAssistant ? "justify-start" : "justify-end"}`}
    >
      {isAssistant && (
        <div
          aria-hidden="true"
          className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-bold text-white"
        >
          D
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-2xl p-3 px-4 text-[15px] leading-relaxed ${
          isAssistant
            ? "rounded-tl-sm bg-[var(--color-surface)] text-[var(--color-text-primary)]"
            : "rounded-tr-sm bg-[var(--color-accent)] text-white"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center gap-1.5 py-0.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                custom={i}
                animate="pulse"
                variants={dotVariants}
                className="block h-1.5 w-1.5 rounded-full bg-current opacity-60"
              />
            ))}
          </div>
        ) : (
          content
        )}
      </div>
    </motion.div>
  );
}
