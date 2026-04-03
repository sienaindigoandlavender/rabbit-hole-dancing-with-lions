import { MetadataRoute } from "next";
import { getAllPoints, getCitySlug, CITIES } from "@/app/lib/supabase";

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
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const cityPages: MetadataRoute.Sitemap = CITIES.map((city) => ({
    url: safeSitemapUrl(`${baseUrl}/${city.slug}`),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const pointPages: MetadataRoute.Sitemap = points.map((point) => ({
    url: safeSitemapUrl(`${baseUrl}/${getCitySlug(point.city)}/${point.id}`),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...cityPages, ...pointPages];
}
