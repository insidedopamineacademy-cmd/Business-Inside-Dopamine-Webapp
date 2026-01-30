"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

const ORBIT_DURATION = 64; // seconds (outer orbit + counter-rotation)
const EASE_IN_OUT: [number, number, number, number] = [0.42, 0, 0.58, 1];
const EASE_LINEAR: [number, number, number, number] = [0, 0, 1, 1];

type Node = {
  label: string;
  tag: "data" | "insight" | "action";
};

const NODES: Node[] = [
  { label: "BI Dashboards", tag: "insight" },
  { label: "RAG", tag: "insight" },
  { label: "ETL", tag: "data" },
  { label: "APIs", tag: "data" },
  { label: "Web Apps", tag: "action" },
  { label: "Automations", tag: "action" },
];

export default function DopamineSystemCore() {
  const reduce = useReducedMotion() ?? false;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 block overflow-visible opacity-60 md:opacity-100"
    >
      <motion.div
        className="absolute right-1/2 top-[58%] h-[380px] w-[380px] translate-x-1/2 -translate-y-1/2 md:right-0 md:top-1/2 md:h-[520px] md:w-[520px] md:translate-x-[6%] [mask-image:radial-gradient(circle at center,black_58%,transparent_82%)]"
        animate={reduce ? undefined : { y: [0, -6, 0] }}
        transition={
          reduce
            ? { duration: 0 }
            : { duration: 6.5, ease: EASE_IN_OUT, repeat: Infinity }
        }
      >
        {/* Ambient base glow */}
        <div
          className="absolute inset-0 rounded-full blur-[72px] opacity-35 mix-blend-screen will-change-transform dark:opacity-55"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, rgba(139,92,246,.55), transparent 55%), radial-gradient(circle at 70% 55%, rgba(56,189,248,.38), transparent 60%), radial-gradient(circle at 45% 75%, rgba(99,102,241,.42), transparent 60%)",
          }}
        />

        {/* Wide starfield + subtle noise (adds depth without heavy libs) */}
        <div
          className="absolute inset-0 rounded-full opacity-[0.55]"
          style={{
            background:
              "radial-gradient(circle at 20% 25%, rgba(255,255,255,.18) 0 1px, transparent 2px), radial-gradient(circle at 72% 28%, rgba(255,255,255,.16) 0 1px, transparent 2px), radial-gradient(circle at 55% 62%, rgba(255,255,255,.14) 0 1px, transparent 2px), radial-gradient(circle at 82% 72%, rgba(255,255,255,.12) 0 1px, transparent 2px), radial-gradient(circle at 35% 78%, rgba(255,255,255,.10) 0 1px, transparent 2px)",
            filter: "blur(.2px)",
          }}
        />
        <div
          className="absolute inset-0 rounded-full opacity-[0.14] mix-blend-overlay"
          style={{
            background:
              "repeating-linear-gradient(45deg, rgba(255,255,255,.06) 0 1px, transparent 1px 6px)",
          }}
        />

        {/* Core (galaxy) */}
        <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-border bg-card shadow-sm">
          {/* galaxy swirl */}
          <motion.div
            className="absolute inset-[-40%]"
            animate={reduce ? undefined : { rotate: 360 }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 28, ease: EASE_LINEAR, repeat: Infinity }
            }
            style={{
              background:
                "conic-gradient(from 180deg at 50% 50%, rgba(139,92,246,.55), rgba(56,189,248,.35), rgba(99,102,241,.45), rgba(139,92,246,.55))",
              filter: "blur(10px)",
              opacity: 0.9,
            }}
          />

          {/* starfield */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 20% 25%, rgba(255,255,255,.20) 0 1px, transparent 2px), radial-gradient(circle at 70% 35%, rgba(255,255,255,.16) 0 1px, transparent 2px), radial-gradient(circle at 45% 70%, rgba(255,255,255,.14) 0 1px, transparent 2px), radial-gradient(circle at 80% 75%, rgba(255,255,255,.12) 0 1px, transparent 2px)",
              opacity: 0.65,
            }}
          />
          {/* micro twinkles */}
          <motion.div
            className="absolute inset-0"
            animate={reduce ? undefined : { opacity: [0.55, 0.85, 0.55] }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 3.8, ease: EASE_IN_OUT, repeat: Infinity }
            }
            style={{
              background:
                "radial-gradient(circle at 28% 38%, rgba(255,255,255,.24) 0 1px, transparent 2px), radial-gradient(circle at 62% 30%, rgba(255,255,255,.22) 0 1px, transparent 2px), radial-gradient(circle at 48% 62%, rgba(255,255,255,.20) 0 1px, transparent 2px), radial-gradient(circle at 74% 58%, rgba(255,255,255,.18) 0 1px, transparent 2px)",
              filter: "blur(.2px)",
            }}
          />

          {/* subtle vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, rgba(255,255,255,.10), rgba(0,0,0,.28) 70%)",
              mixBlendMode: "overlay",
              opacity: 0.65,
            }}
          />

          {/* single star spiraling into the core */}
          <motion.div
            className="absolute left-1/2 top-1/2"
            style={{ width: 0, height: 0 }}
            animate={
              reduce
                ? undefined
                : {
                    // A spiral-ish inwards path (x/y keyframes) + slight shrink.
                    // This keeps the visual light but feels like a spiral pull.
                    x: [0, 10, 18, 14, 4, -8, -14, -8, -2],
                    y: [-78, -64, -44, -28, -18, -12, -9, -6, -4],
                    scale: [1, 0.95, 0.85, 0.72, 0.58, 0.46, 0.36, 0.3, 0.26],
                    rotate: [0, 120, 240, 360, 480, 600, 720, 840, 960],
                  }
            }
            transition={
              reduce
                ? { duration: 0 }
                : {
                    duration: 7.2,
                    ease: EASE_LINEAR,
                    repeat: Infinity,
                    repeatType: "loop",
                  }
            }
          >
            <div
              className="absolute -left-1 -top-1 h-2 w-2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,1), rgba(255,255,255,.25) 55%, transparent 70%)",
                boxShadow:
                  "0 0 14px rgba(255,255,255,.55), 0 0 28px rgba(139,92,246,.22)",
              }}
            />
            {/* tiny trail */}
            <div
              className="absolute -left-1 -top-1 h-6 w-6"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,.35), transparent 55%)",
                filter: "blur(6px)",
                opacity: 0.55,
              }}
            />
          </motion.div>

          {/* inner ring */}
          <div className="absolute inset-[10px] rounded-full border border-border/60" />
          {/* tiny center spark */}
          <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(255,255,255,.85)] shadow-[0_0_18px_rgba(139,92,246,.35)]" />
        </div>

        {/* Ring 1 */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-90"
          animate={reduce ? undefined : { rotate: -360 }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 46, ease: EASE_LINEAR, repeat: Infinity }
          }
        >
          <div className="absolute left-1/2 top-0 -translate-x-1/2">
            <div className="h-2 w-2 rounded-full bg-[rgba(255,255,255,.9)] shadow-[0_0_18px_rgba(139,92,246,.35)]" />
            <div
              className="-mt-2 h-6 w-6"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(139,92,246,.35), transparent 60%)",
                filter: "blur(8px)",
                opacity: 0.7,
              }}
            />
          </div>
          <Ring strokeOpacity={0.55} />
        </motion.div>

        {/* Ring 2 */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-90"
          animate={reduce ? undefined : { rotate: -360 }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 62, ease: EASE_LINEAR, repeat: Infinity }
          }
        >
          <div className="absolute left-1/2 top-0 -translate-x-1/2">
            <div className="h-2 w-2 rounded-full bg-[rgba(255,255,255,.7)] shadow-[0_0_16px_rgba(56,189,248,.28)]" />
            <div
              className="-mt-2 h-6 w-6"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(56,189,248,.28), transparent 60%)",
                filter: "blur(9px)",
                opacity: 0.55,
              }}
            />
          </div>
          <Ring strokeOpacity={0.42} dashed />
        </motion.div>

        {/* Ring 3 */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-90"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 78, ease: EASE_LINEAR, repeat: Infinity }
          }
        >
          <div className="absolute left-1/2 top-0 -translate-x-1/2 opacity-80">
            <div className="h-1.5 w-1.5 rounded-full bg-[rgba(255,255,255,.55)]" />
            <div
              className="-mt-1.5 h-5 w-5"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(99,102,241,.22), transparent 62%)",
                filter: "blur(10px)",
                opacity: 0.45,
              }}
            />
          </div>
          <Ring strokeOpacity={0.32} />
        </motion.div>

        {/* Outer orbit nodes (clockwise) */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: ORBIT_DURATION, ease: EASE_LINEAR, repeat: Infinity }
          }
        >
          {NODES.map((n, i) => (
            <PeripheralNode
              key={n.label}
              idx={i}
              node={n}
              reduce={reduce}
              orbitDuration={ORBIT_DURATION}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

function Ring({ strokeOpacity, dashed }: { strokeOpacity: number; dashed?: boolean }) {
  return (
    <div
      className={
        "absolute inset-0 rounded-full border border-white/20 " +
        (dashed ? "[border-style:dashed] [border-width:1px]" : "")
      }
      style={{
        opacity: strokeOpacity,
      }}
    />
  );
}

function toneClasses(tone: "data" | "insight" | "action") {
  switch (tone) {
    case "data":
      return {
        dot: "bg-[rgba(56,189,248,.95)]",
        halo: "shadow-[0_0_0_6px_rgba(56,189,248,.10)]",
        text: "text-[rgba(56,189,248,.95)]",
      };
    case "insight":
      return {
        dot: "bg-[rgba(99,102,241,.95)]",
        halo: "shadow-[0_0_0_6px_rgba(99,102,241,.10)]",
        text: "text-[rgba(99,102,241,.95)]",
      };
    case "action":
      return {
        dot: "bg-[rgba(139,92,246,.95)]",
        halo: "shadow-[0_0_0_6px_rgba(139,92,246,.10)]",
        text: "text-[rgba(139,92,246,.95)]",
      };
  }
}

function PeripheralNode({
  idx,
  node,
  reduce,
  orbitDuration,
}: {
  idx: number;
  node: Node;
  reduce: boolean;
  orbitDuration: number;
}) {
  // Spread around in a tasteful, uneven way.
  const angles = [
    24, 68, 118, 198, 252, 318, // 6 nodes
  ];
  const radii = [252, 238, 244, 250, 236, 246];

  const a = angles[idx % angles.length];
  const r = radii[idx % radii.length];
  const t = toneClasses(node.tag);

  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        transform: `translate(-50%, -50%) rotate(${a}deg) translateY(-${r}px)`,
      }}
    >
      <motion.div
        className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-2 backdrop-blur"
        // Keep the pill upright relative to the viewport while the parent orbit rotates.
        // parent rotation (theta) + wrapper rotation (a) + this rotation (-a - theta) => 0
        animate={
          reduce
            ? undefined
            : {
                rotate: [-a, -a - 360],
              }
        }
        transition={
          reduce
            ? { duration: 0 }
            : {
                duration: orbitDuration,
                ease: EASE_LINEAR,
                repeat: Infinity,
              }
        }
      >
        <span className={`h-2.5 w-2.5 rounded-full ${t.dot} ${t.halo}`} />
        <span className="text-[11px] font-medium text-muted">{node.label}</span>
      </motion.div>
    </div>
  );
}