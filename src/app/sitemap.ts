import type { MetadataRoute } from "next";

const editorialRoutes = ["/news", "/authors", "/policy", "/policy/editorial", "/policy/privacy", "/policy/terms", "/studio"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return editorialRoutes.map((route) => ({
    url: `https://scoreline.site${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/studio" ? "weekly" : "monthly",
    priority: route === "/news" ? 0.9 : 0.6,
  }));
}
