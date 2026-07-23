"use client";

import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  Field,
  Input,
  Select,
  Textarea,
} from "@/components/ui";
import type {
  FAQEditorActions,
  FAQListItem,
} from "./contract";

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

function sortFAQs(faqs: FAQListItem[]) {
  return [...faqs].sort((left, right) => left.order - right.order);
}

function replaceFAQ(faqs: FAQListItem[], updated: FAQListItem) {
  return sortFAQs(faqs.map((faq) => (faq.id === updated.id ? updated : faq)));
}

export default function FAQEditor({
  initialFaqs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
}: {
  initialFaqs: FAQListItem[];
} & FAQEditorActions) {
  const [faqs, setFaqs] = useState(initialFaqs);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [saving, setSaving] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowForm(true);
  }

  function openEdit(faq: FAQListItem) {
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
        const updated = await updateFAQ(editingId, data);
        setFaqs((current) => replaceFAQ(current, updated));
      } else {
        const created = await createFAQ(data);
        setFaqs((current) => sortFAQs([...current, created]));
      }

      cancelForm();
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(faq: FAQListItem) {
    setPendingId(faq.id);
    try {
      const updated = await updateFAQ(faq.id, { isActive: !faq.isActive });
      setFaqs((current) => replaceFAQ(current, updated));
    } finally {
      setPendingId(null);
    }
  }

  async function handleDelete(faq: FAQListItem) {
    if (!window.confirm(`Delete: "${faq.question}"?`)) return;

    setPendingId(faq.id);
    try {
      await deleteFAQ(faq.id);
      setFaqs((current) => current.filter((candidate) => candidate.id !== faq.id));
    } finally {
      setPendingId(null);
    }
  }

  const grouped = CATEGORIES.reduce<Record<string, FAQListItem[]>>((acc, cat) => {
    acc[cat] = faqs.filter((faq) => faq.category === cat);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
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

      {showForm && (
        <Card variant="bordered" className="mb-8 p-6">
          <h2 className="mb-5 text-base font-semibold text-[var(--color-text-primary)]">
            {editingId ? "Edit FAQ" : "New FAQ"}
          </h2>

          <div className="flex flex-col gap-4">
            <Field
              htmlFor="faq-question"
              label="Question"
              error={errors.question}
              messageId="faq-question-error"
            >
              <Input
                id="faq-question"
                value={form.question}
                onChange={(event) => {
                  setForm((previous) => ({ ...previous, question: event.target.value }));
                  if (errors.question) {
                    setErrors((previous) => ({ ...previous, question: undefined }));
                  }
                }}
                error={!!errors.question}
                aria-describedby={errors.question ? "faq-question-error" : undefined}
                placeholder="What do potential clients typically ask?"
              />
            </Field>

            <Field
              htmlFor="faq-answer"
              label="Answer"
              error={errors.answer}
              messageId="faq-answer-error"
            >
              <Textarea
                id="faq-answer"
                rows={4}
                value={form.answer}
                onChange={(event) => {
                  setForm((previous) => ({ ...previous, answer: event.target.value }));
                  if (errors.answer) {
                    setErrors((previous) => ({ ...previous, answer: undefined }));
                  }
                }}
                aria-describedby={errors.answer ? "faq-answer-error" : undefined}
                error={Boolean(errors.answer)}
                placeholder="Confident, concise answer (2–4 sentences)."
                className="placeholder:text-[var(--color-text-secondary)]"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field htmlFor="faq-category" label="Category">
                <Select
                  id="faq-category"
                  value={form.category}
                  onChange={(event) => {
                    setForm((previous) => ({
                      ...previous,
                      category: event.target.value as Category,
                    }));
                  }}
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Select>
              </Field>

              <Field htmlFor="faq-order" label="Order">
                <Input
                  id="faq-order"
                  type="number"
                  min={0}
                  value={form.order}
                  onChange={(event) => {
                    setForm((previous) => ({ ...previous, order: event.target.value }));
                  }}
                  placeholder="0"
                />
              </Field>
            </div>

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

      {faqs.length === 0 ? (
        <p className="text-sm text-[var(--color-text-secondary)]">No FAQs yet. Add one above.</p>
      ) : (
        <div className="flex flex-col gap-10">
          {CATEGORIES.filter((category) => grouped[category].length > 0).map((category) => (
            <section key={category}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
                {category}
              </h2>
              <div className="flex flex-col gap-3">
                {grouped[category].map((faq) => {
                  const isPending = pendingId === faq.id;

                  return (
                    <Card key={faq.id} variant="bordered" className="p-5">
                      <div className="flex items-start justify-between gap-4">
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

                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggle(faq)}
                            disabled={isPending}
                            aria-label={faq.isActive ? "Deactivate FAQ" : "Activate FAQ"}
                            className={[
                              "rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:cursor-wait disabled:opacity-60",
                              faq.isActive
                                ? "bg-[rgba(52,199,89,0.12)] text-[var(--color-success)] hover:bg-[rgba(52,199,89,0.2)]"
                                : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]",
                            ].join(" ")}
                          >
                            {faq.isActive ? "Active" : "Inactive"}
                          </button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(faq)}
                            disabled={isPending}
                          >
                            Edit
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(faq)}
                            disabled={isPending}
                            className="text-[var(--color-error)] hover:bg-[rgba(255,59,48,0.08)]"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
