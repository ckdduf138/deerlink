/**
 * 메모리 기반 슬라이딩 윈도우 레이트리밋.
 *
 * 인스턴스 하나 안에서만 유효하다 — Vercel처럼 인스턴스가 여러 개 뜨는
 * 환경에서는 인스턴스마다 카운터가 따로 논다. 그래도 스크립트 하나가
 * 단일 요청 경로로 두들기는 가장 흔한 남용은 막아준다. 트래픽이
 * 실제로 커지면 Upstash/KV 같은 공유 저장소로 옮길 것.
 */

const buckets = new Map<string, number[]>();
const MAX_TRACKED_KEYS = 5000;

export interface RateLimitResult {
  ok: boolean;
  retryAfterSeconds: number;
}

export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  // 메모리가 무한정 자라지 않도록 — 흔치 않은 대량 유입 시 오래된 키부터 정리
  if (buckets.size > MAX_TRACKED_KEYS) {
    for (const [k, hits] of buckets) {
      if (hits.every((t) => t < windowStart)) buckets.delete(k);
    }
  }

  const hits = (buckets.get(key) ?? []).filter((t) => t > windowStart);

  if (hits.length >= limit) {
    const retryAfterMs = hits[0] + windowMs - now;
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
  }

  hits.push(now);
  buckets.set(key, hits);
  return { ok: true, retryAfterSeconds: 0 };
}

export function clientKey(request: Request): string {
  const headers = request.headers;
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
