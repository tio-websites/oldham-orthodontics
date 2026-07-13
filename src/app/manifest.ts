import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Oldham Orthodontics",
    short_name: "Oldham Ortho",
    description:
      "Specialist orthodontic care in Oldham — modern braces and clear aligner treatments in a warm, welcoming practice.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1a1a3e",
    icons: [
      { src: "/favicon.ico", sizes: "32x32", type: "image/png" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
