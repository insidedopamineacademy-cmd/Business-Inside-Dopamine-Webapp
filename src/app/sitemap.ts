import type { MetadataRoute } from "next";
import { caseStudySlugs } from "@/data/caseStudies";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://insidedopamine.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const coreRoutes = [
    "",
    "/about",
    "/contact",
    "/privacy",
    "/process",
    "/services",
    "/terms",
    "/work",
  ];

  const serviceRoutes = [
    "/services/data-analytics-power-bi",
    "/services/web-platforms",
    "/services/ai-solutions",
  ];

  const caseStudyRoutes = caseStudySlugs.map((slug) => `/work/${slug}`);
  const routes = [...coreRoutes, ...serviceRoutes, ...caseStudyRoutes];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
