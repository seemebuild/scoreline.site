import { defineConfig } from "sanity";

export default defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "scoreline",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  title: "Scoreline",
  name: "scoreline",
  basePath: "/studio",
});
