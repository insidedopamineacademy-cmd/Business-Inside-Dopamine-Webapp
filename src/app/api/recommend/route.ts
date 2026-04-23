import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/ai";
import { caseStudies } from "@/data/caseStudies";

type RecommendResponse = { slug: string; title: string; reason: string };

function firstFallback(): RecommendResponse {
  const first = Object.values(caseStudies)[0];
  return { slug: first.slug, title: first.hero.title, reason: "Related work you might find interesting." };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { currentSlug, segment } = body as { currentSlug?: unknown; segment?: unknown };

    const allStudies = Object.values(caseStudies);
    const currentStudy = allStudies.find((s) => s.slug === currentSlug);
    const remaining = allStudies.filter((s) => s.slug !== currentSlug);

    if (remaining.length <= 1) {
      const pick = remaining[0] ?? allStudies[0];
      return NextResponse.json({ slug: pick.slug, title: pick.hero.title, reason: "Related work you might find interesting." });
    }

    const currentTitle = currentStudy?.hero.title ?? String(currentSlug);
    const segmentLabel = typeof segment === "string" && segment ? segment : "general";

    const studyList = remaining
      .map((s) => `- slug: "${s.slug}" | title: "${s.hero.title}" | description: "${s.hero.subtitle}"`)
      .join("\n");

    const completion = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      temperature: 0,
      system: "You are a content recommendation engine. Return only a JSON object, no explanation, no markdown.",
      messages: [
        {
          role: "user",
          content: `A visitor interested in ${segmentLabel} services just read the case study titled "${currentTitle}". From this list of case studies:\n${studyList}\nReturn the single most relevant next case study as JSON: { "slug": string, "reason": string } where reason is one sentence explaining why it is relevant to this visitor.`,
        },
      ],
    });

    const raw = completion.content.find((b) => b.type === "text")?.text ?? "";

    let parsed: { slug?: string; reason?: string };
    try {
      // Strip any accidental markdown fences before parsing
      const cleaned = raw.replace(/```[a-z]*\n?/gi, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(firstFallback());
    }

    const matched = allStudies.find((s) => s.slug === parsed.slug);
    if (!matched) return NextResponse.json(firstFallback());

    return NextResponse.json({
      slug: matched.slug,
      title: matched.hero.title,
      reason: parsed.reason ?? "Related work you might find interesting.",
    });
  } catch {
    return NextResponse.json(firstFallback());
  }
}
