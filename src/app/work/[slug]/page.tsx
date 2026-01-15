import CaseStudyLayout from "@/components/sections/CaseStudyLayout";

export default function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  if (params.slug === "executive-sales-dashboard") {
    return (
      <CaseStudyLayout
        title="Executive Sales Dashboard"
        category="Data Analytics · Power BI"
        summary="A unified executive dashboard designed to give leadership real-time visibility into sales performance, churn, and regional trends."
        context="A growing organization struggled with fragmented reporting across departments, inconsistent KPIs, and delayed insights for leadership."
        problem={[
          "Multiple disconnected data sources",
          "Conflicting KPI definitions across teams",
          "Manual reporting cycles taking days each week",
          "Limited drill-down capability for executives",
        ]}
        solution={[
          "Defined a single semantic model for sales and churn",
          "Built executive and operational Power BI dashboards",
          "Implemented automated refresh and validation checks",
          "Designed drill-downs for regional and product analysis",
        ]}
        architecture={[
          "Centralized data model",
          "Power BI semantic layer",
          "Automated refresh pipelines",
          "Role-based dashboard access",
        ]}
        outcomes={[
          "60% reduction in reporting time",
          "Single source of truth for leadership",
          "Faster weekly decision-making",
          "Improved alignment across sales teams",
        ]}
      />
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      Case study not found.
    </main>
  );
}