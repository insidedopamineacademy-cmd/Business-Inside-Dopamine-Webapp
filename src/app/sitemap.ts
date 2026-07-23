import type { MetadataRoute } from "next";
import { caseStudyRouteProjections, serviceRouteProjections } from "@/data/portfolio";
import { getPublicSiteUrl } from "@/lib/env";

const baseUrl = getPublicSiteUrl();

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

  const serviceRoutes = serviceRouteProjections.map((service) => service.href);
  const caseStudyRoutes = caseStudyRouteProjections.map((study) => study.href);
  const routes = [...coreRoutes, ...serviceRoutes, ...caseStudyRoutes];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
