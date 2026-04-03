import { MetadataRoute } from "next";
import { getAllPoints } from "@/app/lib/supabase";

function safeSitemapUrl(path: string): string {
  return path
    .replace(/&/g, "&amp;")
    .replace(/'/g, "&apos;")
    .replace(/"/g, "&quot;")
    .replace(/>/g, "&gt;")
    .replace(/</g, "&lt;");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const points = await getAllPoints();
  const baseUrl = "https://dancingwiththelions.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/map`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/calendar`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/glossary`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  const entryPages: MetadataRoute.Sitemap = points.map((point) => ({
    url: safeSitemapUrl(`${baseUrl}/archive/${point.id}`),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...entryPages];
}
