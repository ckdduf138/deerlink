export function formatRemaining(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "만료";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}시간 남음`;
  return `${Math.max(minutes, 1)}분 남음`;
}

export function formatEstimatedDuration(questionCount: number): string {
  const minutes = Math.max(1, Math.ceil(questionCount / 4));
  return `약 ${minutes}분`;
}
