import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/contact", "/news", "/authors", "/categories", "/policy", "/scores", "/fixtures", "/results", "/sports", "/studio"],
      },
    ],
    sitemap: "https://scoreline.site/sitemap.xml",
  };
}
