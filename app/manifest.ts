import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FieldOps Mobile",
    short_name: "FieldOps",
    description: "Mobile-first field service and job card management platform.",
    start_url: "/workspace",
    display: "standalone",
    background_color: "#f3f7ff",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml"
      },
      {
        src: "/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml"
      }
    ]
  };
}
