"use client";

import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex h-9 w-16 items-center rounded-full border border-border bg-muted px-1 transition"
    >
      {/* glow */}
      <span
        className={`absolute inset-0 rounded-full blur-md transition ${
          isDark ? "bg-violet-500/30" : "bg-indigo-400/30"
        }`}
      />

      {/* knob */}
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-card shadow"
        style={{ marginLeft: isDark ? "1.75rem" : "0" }}
      >
        {isDark ? "🌙" : "☀️"}
      </motion.span>
    </button>
  );
}