import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // www.deerlink.kr이 리다이렉트 없이 200으로 같은 페이지를 내주고 있었다. 검색엔진 입장에선
  // 사이트가 두 벌이라 순위 신호가 갈린다. canonical만으로는 부족해서 호스트 자체를 합친다.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.deerlink.kr" }],
        destination: "https://deerlink.kr/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
