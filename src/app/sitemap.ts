import type { MetadataRoute } from "next";

const editorialRoutes = ["/news", "/authors", "/categories", "/policy", "/policy/editorial", "/policy/privacy", "/policy/terms", "/studio"] as const;
const coreRoutes = ["/", "/about", "/contact", "/scores", "/fixtures", "/results"] as const;
const sportsRoutes = ["/sports/soccer", "/sports/nba", "/sports/american-football", "/sports/baseball", "/sports/mma", "/sports/tennis", "/sports/golf"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [...coreRoutes, ...sportsRoutes, ...editorialRoutes].map((route) => ({
    url: `https://scoreline.site${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/studio" ? "weekly" : route.startsWith("/sports") ? "daily" : "monthly",
    priority: route === "/news" ? 0.9 : route === "/" ? 1 : 0.6,
  }));
}
