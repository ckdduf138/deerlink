/**
 * 시계 아이콘 옆에 붙는 값만 반환한다 ("남음" 없이 "6일"). "남음"은 아이콘이 대신 말한다.
 * `formatRemaining()`은 이 값에 "남음"을 붙여 문장 속에 박아 쓰는 버전이다 — 로비·결과
 * 페이지의 "한 명 답할 때마다 하루 더 열려요, 지금 6일 남음" 같은 문장은 이 함수가 아니라
 * `formatRemaining()`을 쓴다.
 */
export function formatRemainingShort(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "만료";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  // 공개방은 7일까지 살아 있다. 그걸 "167시간"으로 쓰면 아무도 못 읽는다.
  if (hours >= 48) return `${Math.floor(hours / 24)}일`;
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}시간`;
  return `${Math.max(minutes, 1)}분`;
}

export function formatRemaining(expiresAt: string): string {
  const short = formatRemainingShort(expiresAt);
  return short === "만료" ? short : `${short} 남음`;
}

export function formatEstimatedDuration(questionCount: number): string {
  const minutes = Math.max(1, Math.ceil(questionCount / 4));
  return `약 ${minutes}분`;
}
