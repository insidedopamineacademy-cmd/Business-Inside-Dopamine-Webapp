export interface VisitorProfile {
  segment: "ai" | "dashboard" | "platform" | "enterprise" | "general";
  source: "linkedin" | "google" | "direct" | "referral" | "other";
  intent: "high" | "medium" | "low";
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrer: string | null;
}

const AI_KEYWORDS = ["ai", "copilot", "machine-learning", "artificial", "llm", "gpt"];
const DASHBOARD_KEYWORDS = ["dashboard", "analytics", "bi", "reporting", "data-viz"];
const PLATFORM_KEYWORDS = ["platform", "saas", "product", "mvp", "build"];
const ENTERPRISE_KEYWORDS = ["enterprise", "scale", "corporate", "b2b"];

function matchesAny(haystack: string, needles: string[]): boolean {
  const lower = haystack.toLowerCase();
  return needles.some((n) => lower.includes(n));
}

function detectSegment(
  utmSource: string | null,
  utmCampaign: string | null
): VisitorProfile["segment"] {
  const signals = [utmSource, utmCampaign].filter(Boolean).join(" ");
  if (!signals) return "general";
  if (matchesAny(signals, AI_KEYWORDS)) return "ai";
  if (matchesAny(signals, DASHBOARD_KEYWORDS)) return "dashboard";
  if (matchesAny(signals, PLATFORM_KEYWORDS)) return "platform";
  if (matchesAny(signals, ENTERPRISE_KEYWORDS)) return "enterprise";
  return "general";
}

function detectSource(
  utmSource: string | null,
  referrer: string | null
): VisitorProfile["source"] {
  const src = utmSource?.toLowerCase() ?? "";
  const ref = referrer?.toLowerCase() ?? "";

  if (src.includes("linkedin") || ref.includes("linkedin")) return "linkedin";
  if (src.includes("google") || ref.includes("google")) return "google";
  if (!referrer && !utmSource) return "direct";
  if (referrer) return "referral";
  return "other";
}

function detectIntent(
  utmSource: string | null,
  utmMedium: string | null,
  utmCampaign: string | null,
  referrer: string | null,
  source: VisitorProfile["source"]
): VisitorProfile["intent"] {
  const medium = utmMedium?.toLowerCase() ?? "";
  if (medium === "cpc" || medium === "paid" || source === "linkedin") return "high";
  if (utmSource || utmMedium || utmCampaign || referrer) return "medium";
  return "low";
}

export function detectVisitorProfile(request: Request): VisitorProfile {
  const url = new URL(request.url);
  const params = url.searchParams;

  const utmSource = params.get("utm_source");
  const utmMedium = params.get("utm_medium");
  const utmCampaign = params.get("utm_campaign");
  const referrer = request.headers.get("referer");

  const source = detectSource(utmSource, referrer);
  const segment = detectSegment(utmSource, utmCampaign);
  const intent = detectIntent(utmSource, utmMedium, utmCampaign, referrer, source);

  return { segment, source, intent, utmSource, utmMedium, utmCampaign, referrer };
}

export function profileToSegmentKey(profile: VisitorProfile): string {
  return profile.segment;
}
