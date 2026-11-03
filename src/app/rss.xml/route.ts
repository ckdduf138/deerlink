import { archivePath, getArchivedRooms } from "@/lib/room-archive";

/**
 * 네이버 서치어드바이저용 RSS.
 *
 * 사이트맵이 "사이트에 어떤 페이지가 있나"라면 RSS는 "최근에 뭐가 새로 생겼나"다.
 * 네이버는 둘을 따로 받고 RSS 쪽을 새 글 발견에 쓴다. 구글은 사이트맵만으로 충분해서
 * robots.txt 에는 사이트맵만 적어둔다 - RSS 는 서치어드바이저에 직접 제출한다.
 *
 * 항목은 동결 보존된 방만 담는다. 날짜가 실제로 있는 콘텐츠가 이것뿐이기 때문이다.
 * 질문 상세 페이지는 한 번 쓰면 거의 안 바뀌어서 RSS 에 넣으면 날짜가 거짓말이 된다
 * (사이트맵이 lastmod 를 안 다는 것과 같은 이유다).
 */
export const revalidate = 3600;

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://deerlink.kr";
const ITEM_LIMIT = 50;

/** XML 에 그대로 들어가는 값은 전부 거쳐야 한다. 사이트맵의 & 사고를 반복하지 않는다. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const rooms = await getArchivedRooms({ limit: ITEM_LIMIT }).catch(() => []);
  const updated = rooms[0] ? new Date(rooms[0].frozenAt) : new Date();

  const items = rooms
    .map((room) => {
      const url = `${baseUrl}${archivePath(room.id)}`;
      const title = escapeXml(room.title);
      const description = escapeXml(
        `${room.participantCount}명이 답한 밸런스 게임 결과. 질문 ${room.questionCount}개의 선택이 어떻게 갈렸는지 확인해보세요.`
      );
      return [
        "    <item>",
        `      <title>${title}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <description>${description}</description>`,
        `      <pubDate>${new Date(room.frozenAt).toUTCString()}</pubDate>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>디어링크 - 밸런스 게임 결과</title>",
    `    <link>${baseUrl}</link>`,
    `    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />`,
    "    <description>사람들이 실제로 답한 밸런스 게임 결과를 모아 보여줍니다.</description>",
    "    <language>ko</language>",
    `    <lastBuildDate>${updated.toUTCString()}</lastBuildDate>`,
    items,
    "  </channel>",
    "</rss>",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
