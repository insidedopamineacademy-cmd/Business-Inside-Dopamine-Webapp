"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  // Detect system theme
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (mode: "light" | "dark") => {
      document.documentElement.classList.toggle("dark", mode === "dark");
      setResolvedTheme(mode);
    };

    const stored = localStorage.getItem("theme") as Theme | null;

    if (stored && stored !== "system") {
      applyTheme(stored);
      setThemeState(stored);
    } else {
      applyTheme(media.matches ? "dark" : "light");
      setThemeState("system");
    }

    const listener = () => {
      if (theme === "system") {
        applyTheme(media.matches ? "dark" : "light");
      }
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const setTheme = (value: Theme) => {
    localStorage.setItem("theme", value);
    setThemeState(value);

    if (value === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", isDark);
      setResolvedTheme(isDark ? "dark" : "light");
    } else {
      document.documentElement.classList.toggle("dark", value === "dark");
      setResolvedTheme(value);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}