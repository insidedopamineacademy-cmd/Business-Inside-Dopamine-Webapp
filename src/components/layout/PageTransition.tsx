"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AnimatePresence, MotionDiv, useReducedMotion } from "@/lib/motion";

const transitionEase = [0.22, 1, 0.36, 1] as const;

type PageTransitionProps = {
  children: ReactNode;
};

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const initial = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 };
  const animate = reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 };
  const exit = reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 };
  const transition = reduceMotion
    ? { duration: 0.12, ease: "linear" as const }
    : { duration: 0.3, ease: transitionEase };

  return (
    <AnimatePresence initial={false} mode="popLayout">
      <MotionDiv
        key={pathname}
        data-page-transition=""
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
      >
        {children}
      </MotionDiv>
    </AnimatePresence>
  );
}
