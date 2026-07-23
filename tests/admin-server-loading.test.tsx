import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/admin-auth", () => ({ requireAdmin: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: {} }));

import FAQEditor from "../src/app/admin/faqs/FAQEditor";

const root = process.cwd();

function source(path: string) {
  return readFileSync(resolve(root, path), "utf8");
}

describe("server-first admin list boundaries", () => {
  const faqPage = source("src/app/admin/faqs/page.tsx");
  const faqEditor = source("src/app/admin/faqs/FAQEditor.tsx");
  const faqActions = source("src/app/admin/faqs/actions.ts");
  const conversationsPage = source("src/app/admin/conversations/page.tsx");

  it("keeps both routes async, dynamic Server Components without mount-time effects", () => {
    for (const page of [faqPage, conversationsPage]) {
      expect(page).not.toMatch(/^\s*["']use client["'];/);
      expect(page).not.toContain("useEffect");
      expect(page).not.toContain("useState");
      expect(page).toContain('export const dynamic = "force-dynamic"');
      expect(page).toMatch(/export default async function/);
    }

    expect(faqPage).toContain("await getFAQs()");
    expect(conversationsPage).toContain("await getConversationListPage(params)");
  });

  it("isolates FAQ state and mutations without restoring a full-list client fetch", () => {
    expect(faqEditor).toMatch(/^"use client";/);
    expect(faqEditor).toContain("useState(initialFaqs)");
    expect(faqEditor).not.toContain("useEffect");
    expect(faqEditor).not.toContain("getFAQs");
    expect(faqEditor).toContain("const updated = await updateFAQ");
    expect(faqEditor).toContain("const created = await createFAQ");
    expect(faqEditor).toContain("current.filter");

    expect(faqActions.match(/revalidatePath\("\/admin\/faqs"\)/g)).toHaveLength(3);
  });

  it("renders server-loaded FAQ content in the focused editor island", () => {
    const markup = renderToStaticMarkup(
      <FAQEditor
        initialFaqs={[
          {
            id: "faq_123",
            question: "What do you build?",
            answer: "Business applications.",
            category: "Services",
            isActive: true,
            order: 2,
          },
        ]}
        createFAQ={vi.fn()}
        updateFAQ={vi.fn()}
        deleteFAQ={vi.fn()}
      />,
    );

    expect(markup).toContain("FAQ Manager");
    expect(markup).toContain("What do you build?");
    expect(markup).toContain("Business applications.");
    expect(markup).toContain("Order: 2");
    expect(markup).not.toContain("Loading…");
  });
});
