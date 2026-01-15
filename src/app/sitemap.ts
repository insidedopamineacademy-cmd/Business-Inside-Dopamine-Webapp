import type { MetadataRoute } from "next";

const baseUrl = "https://insidedopamine.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/services",
    "/services/data-analytics-power-bi",
    "/services/web-platforms",
    "/services/ai-solutions",
    "/work",
    "/about",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}