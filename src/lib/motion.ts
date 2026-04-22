"use client";

/**
 * Central re-export for Framer Motion.
 *
 * Import from here instead of "framer-motion" directly so:
 *  1. The "use client" boundary is declared once, not in every component.
 *  2. Swapping the animation library later only touches this file.
 *
 * Usage:
 *   import { MotionDiv, MotionSection, viewport } from "@/lib/motion";
 *   import { fadeUp, staggerContainer } from "@/lib/animations";
 *
 *   <MotionDiv
 *     variants={fadeUp}
 *     initial="hidden"
 *     whileInView="visible"
 *     viewport={viewport}
 *   />
 */

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
export type { Variants, HTMLMotionProps, MotionProps } from "framer-motion";
export { AnimatePresence, useReducedMotion };

export const MotionDiv     = motion.div;
export const MotionSection = motion.section;
export const MotionH1      = motion.h1;
export const MotionH2      = motion.h2;
export const MotionP       = motion.p;
export const MotionSpan    = motion.span;
export const MotionUl      = motion.ul;
export const MotionOl      = motion.ol;
export const MotionLi      = motion.li;

export { viewport } from "@/lib/animations";
