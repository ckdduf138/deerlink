import { MetadataRoute } from "next";
import { POPULAR_QUESTIONS, popularQuestionPath } from "@/data/popular-questions";
import { QUESTION_TOPICS } from "@/data/question-topics";
import { archivePath, getArchivedRooms } from "@/lib/room-archive";
import { getAnsweredQuestionIds } from "@/lib/question-stats";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://deerlink.kr";

export const revalidate = 3600;

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
  if (archived.length === 0) return staticEntries;

  return [
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
}
