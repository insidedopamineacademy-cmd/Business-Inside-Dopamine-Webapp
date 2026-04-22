"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";

type StepKey = "data" | "insight" | "action";

const steps: Array<{
  key: StepKey;
  title: string;
  micro: string;
  subtitle: string;
  bullets: string[];
  outcomes: Array<{ value: string; label: string }>;
}> = [
  {
    key: "data",
    title: "Data",
    micro: "Raw signal",
    subtitle: "Ingest, model, and prepare data that teams can trust.",
    bullets: [
      "Data cleanup, modeling, and semantic layers",
      "KPI definitions and governance",
      "Automated refresh, alerts, and quality checks",
    ],
    outcomes: [
      { value: "1", label: "source of truth" },
      { value: "-35%", label: "reporting conflict" },
      { value: "24/7", label: "data reliability" },
    ],
  },
  {
    key: "insight",
    title: "Insight",
    micro: "Pattern clarity",
    subtitle: "BI dashboards built for clarity and decision speed.",
    bullets: [
      "Executive dashboards and operational views",
      "Drilldowns, segmentation, and filters",
      "Storytelling visuals and performance tuning",
    ],
    outcomes: [
      { value: "3x", label: "decision speed" },
      { value: "70%", label: "self-serve usage" },
      { value: "<5m", label: "time to answer" },
    ],
  },
  {
    key: "action",
    title: "Action",
    micro: "Execution loop",
    subtitle: "AI copilots + platforms that turn insights into execution.",
    bullets: [
      "LLM copilots (RAG) for internal knowledge",
      "Workflow automation and smart assistants",
      "Web platforms that ship fast and scale",
    ],
    outcomes: [
      { value: "-40%", label: "manual tasks" },
      { value: "2x", label: "workflow throughput" },
      { value: "+22%", label: "outcome lift" },
    ],
  },
];

function stepAccent(key: StepKey) {
  if (key === "data") return "rgba(255,122,64,.35)"; // orange
  if (key === "insight") return "rgba(100,180,255,.35)"; // blue
  return "rgba(180,255,122,.28)"; // lime
}

export default function DopamineLoop() {
  const [active, setActive] = useState<StepKey>("data");
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { amount: 0.2, once: true });

  const resetTimerRef = useRef<number | null>(null);

  const clearResetTimer = () => {
    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  };

  const scheduleResetToData = () => {
    clearResetTimer();
    resetTimerRef.current = window.setTimeout(() => {
      setActive("data");
    }, 650);
  };

  const activeStep = useMemo(
    () => steps.find((s) => s.key === active) ?? steps[1],
    [active]
  );

  const glow = stepAccent(active);

  useEffect(() => {
    return () => clearResetTimer();
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      className="mx-auto max-w-6xl px-4 py-16"
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={reduce ? { duration: 0 } : { duration: 0.7, ease: [0.21, 0.47, 0.22, 0.9] }}
    >
      <motion.div
        className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={reduce ? { duration: 0 } : { duration: 0.6, delay: 0.05, ease: [0.21, 0.47, 0.22, 0.9] }}
      >
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">
            The Dopamine Loop
          </h2>
          <p className="mt-3 max-w-2xl text-[var(--color-text-secondary)]">
            We move teams from raw data to real decisions — then automate the next step.
            Hover or tap a stage to explore.
          </p>
        </div>

        <div className="text-sm text-[var(--color-text-secondary)]">
          <span className="rounded-full border border-[var(--color-border)] bg-white px-3 py-2">
            Data → Insight → Action
          </span>
        </div>
      </motion.div>

      {/* Loop Row */}
      <motion.div
        className="relative mt-10 touch-pan-y rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm"
        onMouseEnter={clearResetTimer}
        onMouseLeave={scheduleResetToData}
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={reduce ? { duration: 0 } : { duration: 0.65, delay: 0.12, ease: [0.21, 0.47, 0.22, 0.9] }}
      >
        {/* Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-10 opacity-70 blur-3xl"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${glow}, transparent 55%)`,
          }}
        />

        {/* Connector line */}
        <div
          aria-hidden="true"
          className="absolute left-8 right-8 top-14 hidden h-px md:block"
          style={{
            background:
              "linear-gradient(to right, rgba(255,122,64,.35), rgba(100,180,255,.35), rgba(180,255,122,.28))",
          }}
        />

        <div className="relative grid gap-4 md:grid-cols-3">
          {steps.map((s) => {
            const isActive = s.key === active;
            return (
              <motion.button
                key={s.key}
                type="button"
                onMouseEnter={() => setActive(s.key)}
                onFocus={() => setActive(s.key)}
                onClick={() => setActive(s.key)}
                whileHover={reduce ? undefined : { y: -2 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
                className={[
                  "group relative w-full touch-pan-y rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-left transition",
                  "hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
                  isActive ? "bg-white shadow-sm" : "opacity-90 hover:opacity-100",
                ].join(" ")}
              >
                {/* Node dot */}
                <span
                  aria-hidden="true"
                  className="absolute -top-2 left-6 hidden h-4 w-4 rounded-full border border-[var(--color-border)] md:block"
                  style={{
                    background: isActive ? "#ffffff" : "var(--color-surface)",
                    boxShadow: isActive ? `0 0 0 6px ${stepAccent(s.key)}` : "none",
                  }}
                />

                <div className="flex items-center justify-between gap-3">
                  <div className="text-lg font-semibold">{s.title}</div>
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded-2xl text-black transition"
                    style={{ background: stepAccent(s.key) }}
                  >
                    →
                  </span>
                </div>

                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{s.micro}</p>

                <div className="mt-4 text-sm font-medium">
                  {isActive ? "Selected" : "Explore"}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="relative mt-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep.key}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={reduce ? { duration: 0 } : { duration: 0.22 }}
            >
              <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                <div className="max-w-2xl">
                  <div className="text-xs text-[var(--color-text-secondary)]">Active stage</div>
                  <div className="mt-2 text-2xl font-semibold">{activeStep.title}</div>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{activeStep.subtitle}</p>

                  <div className="mt-5 grid gap-2">
                    {activeStep.bullets.map((b) => (
                      <div key={b} className="flex gap-2 text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                        <span className="text-[var(--color-text-secondary)]">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full md:max-w-xs">
                  <div className="text-xs text-[var(--color-text-secondary)]">Stage stats</div>
                  <div className="mt-3 grid grid-cols-3 gap-2 md:grid-cols-1">
                    {activeStep.outcomes.map((o) => (
                      <div
                        key={o.label}
                        className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3"
                      >
                        <div className="text-base font-semibold">{o.value}</div>
                        <div className="text-[11px] text-[var(--color-text-secondary)]">{o.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.section>
  );
}
