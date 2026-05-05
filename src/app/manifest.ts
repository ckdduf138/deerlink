import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Deerlink — 밸런스게임 만들기",
    short_name: "Deerlink",
    description:
      "링크 하나로 밸런스게임, 투표, 설문을 만들고 친구들과 생각을 비교해요.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf8",
    theme_color: "#e8a038",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
