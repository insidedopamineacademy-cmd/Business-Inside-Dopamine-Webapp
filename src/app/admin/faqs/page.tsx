"use client";

import { useEffect, useState } from "react";
import type { Faq } from "@prisma/client";
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from "@/app/admin/faqs/actions";
import { Button, Card, Badge, Input, Label, HelperText } from "@/components/ui";

const CATEGORIES = ["General", "Services", "Process", "AI", "Pricing"] as const;
type Category = (typeof CATEGORIES)[number];

type FormState = {
  question: string;
  answer: string;
  category: Category;
  order: string;
};

const EMPTY_FORM: FormState = { question: "", answer: "", category: "General", order: "0" };

function categoryVariant(cat: string): "default" | "accent" | "success" | "error" {
  const map: Record<string, "default" | "accent" | "success" | "error"> = {
    AI: "accent",
    Services: "success",
    Pricing: "error",
  };
  return map[cat] ?? "default";
}

export default function FAQManagerPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [saving, setSaving] = useState(false);

  async function loadFAQs() {
    setLoading(true);
    try {
      setFaqs(await getFAQs());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadFAQs(); }, []);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowForm(true);
  }

  function openEdit(faq: Faq) {
    setEditingId(faq.id);
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category as Category,
      order: String(faq.order),
    });
    setErrors({});
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setErrors({});
  }

  function validate(): boolean {
    const next: Partial<FormState> = {};
    if (!form.question.trim()) next.question = "Question is required.";
    if (!form.answer.trim()) next.answer = "Answer is required.";
    if (!form.category) next.category = "Category is required." as Category;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      const data = {
        question: form.question.trim(),
        answer: form.answer.trim(),
        category: form.category,
        order: parseInt(form.order, 10) || 0,
      };
      if (editingId) {
        await updateFAQ(editingId, data);
      } else {
        await createFAQ(data);
      }
      cancelForm();
      await loadFAQs();
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(faq: Faq) {
    await updateFAQ(faq.id, { isActive: !faq.isActive });
    await loadFAQs();
  }

  async function handleDelete(faq: Faq) {
    if (!window.confirm(`Delete: "${faq.question}"?`)) return;
    await deleteFAQ(faq.id);
    await loadFAQs();
  }

  const grouped = CATEGORIES.reduce<Record<string, Faq[]>>((acc, cat) => {
    acc[cat] = faqs.filter((f) => f.category === cat);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">FAQ Manager</h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Manage the knowledge base for the Dopamine chat agent
          </p>
        </div>
        {!showForm && (
          <Button variant="primary" size="sm" onClick={openAdd}>
            Add FAQ
          </Button>
        )}
      </div>

      {/* Inline form */}
      {showForm && (
        <Card variant="bordered" className="mb-8 p-6">
          <h2 className="mb-5 text-base font-semibold text-[var(--color-text-primary)]">
            {editingId ? "Edit FAQ" : "New FAQ"}
          </h2>

          <div className="flex flex-col gap-4">
            {/* Question */}
            <div>
              <Label htmlFor="faq-question">Question</Label>
              <Input
                id="faq-question"
                value={form.question}
                onChange={(e) => {
                  setForm((p) => ({ ...p, question: e.target.value }));
                  if (errors.question) setErrors((p) => ({ ...p, question: undefined }));
                }}
                error={!!errors.question}
                aria-describedby={errors.question ? "faq-question-error" : undefined}
                placeholder="What do potential clients typically ask?"
              />
              {errors.question && (
                <HelperText id="faq-question-error" error>{errors.question}</HelperText>
              )}
            </div>

            {/* Answer */}
            <div>
              <Label htmlFor="faq-answer">Answer</Label>
              <textarea
                id="faq-answer"
                rows={4}
                value={form.answer}
                onChange={(e) => {
                  setForm((p) => ({ ...p, answer: e.target.value }));
                  if (errors.answer) setErrors((p) => ({ ...p, answer: undefined }));
                }}
                aria-describedby={errors.answer ? "faq-answer-error" : undefined}
                aria-invalid={!!errors.answer || undefined}
                placeholder="Confident, concise answer (2–4 sentences)."
                className={[
                  "w-full resize-y rounded-xl border bg-white px-4 py-3 text-[17px]",
                  "text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]",
                  "outline-none transition-[border-color,box-shadow] duration-200",
                  errors.answer
                    ? "border-[var(--color-error)] ring-2 ring-[var(--color-error)]/20 focus:border-[var(--color-error)]"
                    : "border-[var(--color-border)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20",
                ].join(" ")}
              />
              {errors.answer && (
                <HelperText id="faq-answer-error" error>{errors.answer}</HelperText>
              )}
            </div>

            {/* Category + Order */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="faq-category">Category</Label>
                <select
                  id="faq-category"
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as Category }))}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-[17px] text-[var(--color-text-primary)] outline-none transition-[border-color] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="faq-order">Order</Label>
                <Input
                  id="faq-order"
                  type="number"
                  min={0}
                  value={form.order}
                  onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button variant="primary" size="sm" isLoading={saving} onClick={handleSave}>
                {editingId ? "Save Changes" : "Create FAQ"}
              </Button>
              <Button variant="ghost" size="sm" onClick={cancelForm} disabled={saving}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* FAQ list */}
      {loading ? (
        <p className="text-sm text-[var(--color-text-secondary)]">Loading…</p>
      ) : faqs.length === 0 ? (
        <p className="text-sm text-[var(--color-text-secondary)]">No FAQs yet. Add one above.</p>
      ) : (
        <div className="flex flex-col gap-10">
          {CATEGORIES.filter((cat) => grouped[cat].length > 0).map((cat) => (
            <section key={cat}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
                {cat}
              </h2>
              <div className="flex flex-col gap-3">
                {grouped[cat].map((faq) => (
                  <Card key={faq.id} variant="bordered" className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-[var(--color-text-primary)]">
                            {faq.question}
                          </span>
                          <Badge variant={categoryVariant(faq.category)}>{faq.category}</Badge>
                        </div>
                        <p className="mt-1.5 line-clamp-2 text-sm text-[var(--color-text-secondary)]">
                          {faq.answer}
                        </p>
                        <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                          Order: {faq.order}
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex shrink-0 items-center gap-2">
                        {/* Active toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggle(faq)}
                          aria-label={faq.isActive ? "Deactivate FAQ" : "Activate FAQ"}
                          className={[
                            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                            faq.isActive
                              ? "bg-[rgba(52,199,89,0.12)] text-[var(--color-success)] hover:bg-[rgba(52,199,89,0.2)]"
                              : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]",
                          ].join(" ")}
                        >
                          {faq.isActive ? "Active" : "Inactive"}
                        </button>

                        <Button variant="ghost" size="sm" onClick={() => openEdit(faq)}>
                          Edit
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(faq)}
                          className="text-[var(--color-error)] hover:bg-[rgba(255,59,48,0.08)]"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
