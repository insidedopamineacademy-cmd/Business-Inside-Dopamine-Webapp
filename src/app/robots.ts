import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/env";

const siteUrl = getPublicSiteUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/admin/" }],
    host: siteUrl,
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
