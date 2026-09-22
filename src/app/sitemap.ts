import type { MetadataRoute } from "next";
import { site } from "@/data/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return site.url
    ? [
        { url: site.url, changeFrequency: "monthly", priority: 1 },
        {
          url: site.url + "/experience",
          changeFrequency: "monthly",
          priority: 0.8,
        },
        {
          url: site.url + "/works",
          changeFrequency: "monthly",
          priority: 0.9,
        },
      ]
    : [];
}
