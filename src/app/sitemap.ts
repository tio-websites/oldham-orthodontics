import type { MetadataRoute } from "next";
import { posts } from "./about-us/blog/posts";

const BASE_URL = "https://www.oldhamorthodontics.co.uk";

const staticRoutes: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "monthly", priority: 1.0 },
  { path: "/treatments", changeFrequency: "monthly", priority: 0.9 },
  { path: "/treatments/clear-aligners", changeFrequency: "monthly", priority: 0.8 },
  { path: "/treatments/clear-aligners/invisalign", changeFrequency: "monthly", priority: 0.8 },
  { path: "/treatments/clear-aligners/clarity", changeFrequency: "monthly", priority: 0.8 },
  { path: "/treatments/clear-aligners/clearcorrect", changeFrequency: "monthly", priority: 0.8 },
  { path: "/treatments/braces", changeFrequency: "monthly", priority: 0.8 },
  { path: "/treatments/braces/metal", changeFrequency: "monthly", priority: 0.8 },
  { path: "/treatments/braces/ceramic", changeFrequency: "monthly", priority: 0.8 },
  { path: "/treatments/braces/lingual", changeFrequency: "monthly", priority: 0.8 },
  { path: "/treatments/treatment-for", changeFrequency: "monthly", priority: 0.8 },
  { path: "/treatments/treatment-for/adults", changeFrequency: "monthly", priority: 0.8 },
  { path: "/treatments/treatment-for/teens", changeFrequency: "monthly", priority: 0.8 },
  { path: "/treatments/treatment-for/children", changeFrequency: "monthly", priority: 0.8 },
  { path: "/treatments/other-services", changeFrequency: "monthly", priority: 0.7 },
  { path: "/treatments/other-services/jaw-surgery", changeFrequency: "monthly", priority: 0.8 },
  { path: "/treatments/other-services/retainers", changeFrequency: "monthly", priority: 0.8 },
  { path: "/results", changeFrequency: "monthly", priority: 0.8 },
  { path: "/costs", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about-us", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about-us/meet-our-team", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about-us/our-practice", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about-us/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
  { path: "/free-consultation", changeFrequency: "monthly", priority: 0.9 },
  { path: "/dentist-referrals", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.3 },
  { path: "/cookies-policy", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...staticRoutes.map((r) => ({
      url: `${BASE_URL}${r.path}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...posts.map((p) => ({
      url: `${BASE_URL}/about-us/blog/${p.slug}`,
      lastModified: new Date(p.published),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
