import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/news", "/authors", "/policy", "/studio"],
      },
    ],
    sitemap: "https://scoreline.site/sitemap.xml",
  };
}
