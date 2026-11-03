import { MetadataRoute } from "next";
import { POPULAR_QUESTIONS, popularQuestionPath } from "@/data/popular-questions";
import { QUESTION_TOPICS } from "@/data/question-topics";
import { archivePath, getArchivedRooms } from "@/lib/room-archive";
import { getAnsweredQuestionIds } from "@/lib/question-stats";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://deerlink.kr";

export const revalidate = 3600;

/**
 * Next.js는 loc 값을 이스케이프 없이 그대로 끼워 넣는다
 * (next/dist/build/webpack/loaders/metadata/resolve-route-data.js의 `<loc>${item.url}</loc>`).
 * 그래서 쿼리 구분자 &가 날것으로 나가면 XML 구문 오류가 되고, 파서는 거기서 멈춘다 —
 * 2026-09-23부터 /popular?type=multiple&page=2 한 줄 때문에 구글이 사이트맵 전체를
 * "발견된 페이지 0개"로 버리고 있었다. 뒤에 어떤 URL이 와도 전달되지 않는다.
 * 나중에 누가 또 쿼리 URL을 넣어도 같은 사고가 나지 않게 전 항목에 적용한다.
 */
function escapeLoc(url: string): string {
  return url
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 유형 안에서의 순서가 곧 순위다 (/popular가 20개씩 끊어 보여준다).
  const rankInType = new Map<string, number>();
  const seen = new Map<string, number>();
  for (const question of POPULAR_QUESTIONS) {
    const next = seen.get(question.type) ?? 0;
    rankInType.set(question.id, next);
    seen.set(question.type, next + 1);
  }
  // DB가 죽어도 사이트맵이 통째로 깨지면 안 된다. 집계를 못 읽으면 전부 기본 우선순위다.
  const answered = await getAnsweredQuestionIds().catch(() => new Set<string>());
  // 정적 페이지에는 lastModified를 넣지 않는다. 예전엔 new Date()라 요청마다 "방금 바뀜"이
  // 찍혔고, 구글은 lastmod가 늘 틀리는 사이트의 lastmod를 통째로 무시한다. 그러면 정말
  // 날짜가 의미 있는 아카이브 항목(frozenAt)까지 신호를 잃는다.
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/create`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/popular`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // 전체 목록의 다음 페이지. 카테고리 필터(?category=)는 넣지 않는다 - 전용 페이지인
    // /popular/[slug] 와 같은 목록이라 canonical 이 그쪽으로 넘어간다.
    ...Array.from(
      { length: Math.ceil(POPULAR_QUESTIONS.length / 20) - 1 },
      (_, index) => ({
        url: `${baseUrl}/popular?page=${index + 2}`,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })
    ),
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/discover`,
      changeFrequency: "daily",
      priority: 0.7,
    },
    ...QUESTION_TOPICS.map((topic) => ({
      url: `${baseUrl}/popular/${topic.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // 질문 페이지는 전부 남기되 우선순위를 나눈다. 106개를 같은 값으로 올리면 크롤러가
    // 어디부터 볼지 알 수 없다 (2026-09 기준 27개가 "크롤링됨 - 색인 생성되지 않음"이었다).
    // 실제 답이 쌓인 질문 > 유형별 상위 20(= /popular 1페이지) > 나머지 순으로 둔다.
    // 얇다고 빼지는 않는다. 질문마다 그 페이지에만 있는 본문(brief)이 있다.
    ...POPULAR_QUESTIONS.map((question) => ({
      url: `${baseUrl}${popularQuestionPath(question.id)}`,
      changeFrequency: (answered.has(question.id) ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: answered.has(question.id) ? 0.7 : rankInType.get(question.id)! < 20 ? 0.5 : 0.3,
    })),
  ];

  // 동결 보존된 방은 사람들이 실제로 답한 유일한 색인 대상이다.
  // DB가 죽어도 사이트맵 전체가 깨지면 안 되니 실패는 빈 배열로 흡수한다.
  const archived = await getArchivedRooms({ limit: 500 }).catch(() => []);

  const entries: MetadataRoute.Sitemap =
    archived.length === 0
      ? staticEntries
      : [
          ...staticEntries,
          {
            url: `${baseUrl}/archive`,
            lastModified: new Date(archived[0].frozenAt),
            changeFrequency: "weekly",
            priority: 0.7,
          },
          ...archived.map((room) => ({
            url: `${baseUrl}${archivePath(room.id)}`,
            lastModified: new Date(room.frozenAt),
            changeFrequency: "yearly" as const,
            priority: 0.6,
          })),
        ];

  return entries.map((entry) => ({ ...entry, url: escapeLoc(entry.url) }));
}
