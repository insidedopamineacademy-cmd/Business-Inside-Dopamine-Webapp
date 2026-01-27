"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

export default function WorkHeroBackdrop() {
  const reduce = useReducedMotion();

  const orbAProps: Partial<HTMLMotionProps<"div">> = reduce
    ? {}
    : {
        animate: { y: [0, -10, 0] },
        transition: { duration: 8, repeat: Infinity, ease: [0.42, 0, 0.58, 1] },
      };

  const orbBProps: Partial<HTMLMotionProps<"div">> = reduce
    ? {}
    : {
        animate: { x: [0, 10, 0], y: [0, -6, 0] },
        transition: { duration: 10, repeat: Infinity, ease: [0.42, 0, 0.58, 1] },
      };

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(99,102,241,0.20),transparent_55%),radial-gradient(900px_circle_at_80%_30%,rgba(16,185,129,0.14),transparent_55%),radial-gradient(700px_circle_at_50%_90%,rgba(236,72,153,0.10),transparent_55%)]" />
      <motion.div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 dark:bg-white/8 blur-3xl" {...orbAProps} />
      <motion.div className="absolute top-10 right-[-120px] h-80 w-80 rounded-full bg-white/8 dark:bg-white/6 blur-3xl" {...orbBProps} />
      <div className="absolute inset-0 opacity-[0.10] dark:opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.25)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)] bg-black/10 dark:bg-black/40" />
    </div>
  );
}