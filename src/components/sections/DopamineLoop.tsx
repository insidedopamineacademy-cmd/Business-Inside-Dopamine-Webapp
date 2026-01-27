"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";

type StepKey = "data" | "insight" | "action";

const steps: Array<{
  key: StepKey;
  title: string;
  subtitle: string;
  bullets: string[];
  outcomes: string[];
}> = [
  {
    key: "data",
    title: "Data",
    subtitle: "Ingest, model, and prepare data that teams can trust.",
    bullets: [
      "Data cleanup, modeling, and semantic layers",
      "KPI definitions and governance",
      "Automated refresh, alerts, and quality checks",
    ],
    outcomes: [
      "One source of truth",
      "Fewer reporting conflicts",
      "Reliable, scalable foundations",
    ],
  },
  {
    key: "insight",
    title: "Insight",
    subtitle: "BI dashboards built for clarity and decision speed.",
    bullets: [
      "Executive dashboards and operational views",
      "Drilldowns, segmentation, and filters",
      "Storytelling visuals and performance tuning",
    ],
    outcomes: ["Faster decisions", "Self-serve reporting", "Actionable visibility"],
  },
  {
    key: "action",
    title: "Action",
    subtitle: "AI copilots + platforms that turn insights into execution.",
    bullets: [
      "LLM copilots (RAG) for internal knowledge",
      "Workflow automation and smart assistants",
      "Web platforms that ship fast and scale",
    ],
    outcomes: ["Less manual work", "Smarter operations", "Measurable outcomes"],
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
    // Desktop-only behavior: when the user leaves the loop area, softly return to the default stage.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <p className="mt-3 max-w-2xl text-muted">
            We move teams from raw data to real decisions — then automate the next step.
            Hover or tap a stage to explore.
          </p>
        </div>

        <div className="text-sm text-muted">
          <span className="rounded-full border border-border bg-card px-3 py-2">
            Data → Insight → Action
          </span>
        </div>
      </motion.div>

      {/* Loop Row */}
      <motion.div
        className="relative mt-10 touch-pan-y rounded-3xl border border-border bg-card p-6 shadow-sm"
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
                  "group relative w-full touch-pan-y rounded-3xl border border-border bg-muted p-5 text-left transition",
                  "hover:shadow-sm focus:outline-none",
                  isActive ? "bg-card shadow-sm" : "opacity-90 hover:opacity-100",
                ].join(" ")}
              >
                {/* Node dot */}
                <span
                  aria-hidden="true"
                  className="absolute -top-2 left-6 hidden h-4 w-4 rounded-full border border-border md:block"
                  style={{
                    background: isActive ? "rgb(var(--card))" : "rgb(var(--muted))",
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

                <p className="mt-2 text-sm text-muted">{s.subtitle}</p>

                {/* Compact preview bullets */}
                <ul className="mt-4 space-y-2 text-sm">
                  {s.bullets.slice(0, 2).map((b) => (
                    <li key={b} className="flex gap-2 text-muted">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
                      <span className="leading-5">{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 text-sm font-medium">
                  {isActive ? "Selected" : "Explore"}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="relative mt-6 rounded-3xl border border-border bg-muted p-6">
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
                  <div className="text-xs text-muted">Active stage</div>
                  <div className="mt-2 text-2xl font-semibold">{activeStep.title}</div>
                  <p className="mt-2 text-sm text-muted">{activeStep.subtitle}</p>

                  <div className="mt-5 grid gap-2">
                    {activeStep.bullets.map((b) => (
                      <div key={b} className="flex gap-2 text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
                        <span className="text-muted">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full md:max-w-xs">
                  <div className="text-xs text-muted">Client outcomes</div>
                  <div className="mt-3 grid gap-2">
                    {activeStep.outcomes.map((o) => (
                      <div
                        key={o}
                        className="rounded-2xl border border-border bg-card px-4 py-3 text-sm"
                      >
                        {o}
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