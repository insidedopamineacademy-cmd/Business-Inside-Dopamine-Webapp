import type { Variants } from "framer-motion";

const easeApple = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * Shared viewport config — spread onto every whileInView motion element.
 * once: true  → animates once, no replay on scroll-back
 * margin      → triggers 80px before the element enters the viewport
 */
export const viewport = { once: true, margin: "-80px" } as const;

/**
 * fadeUp
 * Hero text, section intros, any copy that enters from below.
 * duration: 0.6s (duration-slow)
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeApple },
  },
};

/**
 * fadeIn
 * Images, cards, decorative elements — pure opacity, no movement.
 * duration: 0.6s (duration-slow)
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: easeApple },
  },
};

/**
 * staggerContainer
 * Wrap a list of children that each use any variant above.
 * The container itself is invisible; it just schedules children 0.1s apart.
 * Pair with delayChildren when the container itself needs to be delayed.
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0,
    },
  },
};

/**
 * slideInLeft / slideInRight
 * Split-layout sections: text column slides in from the left, media from the right.
 * duration: 0.6s (duration-slow)
 */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: easeApple },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: easeApple },
  },
};

/**
 * scaleIn
 * Cards entering on scroll — subtle grow from 0.96 so it feels physical.
 * Slightly longer duration (0.8s / duration-slower) to let the scale breathe.
 */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: easeApple },
  },
};
