export const PARTICIPANT_COOKIE_MAX_AGE = 60 * 60 * 24;

export function participantCookieName(roomId: string): string {
  return `participant_${roomId}`;
}

/**
 * Answer Lock — 모든 질문에 답한 참여자만 다른 사람의 답변을 볼 수 있다.
 * 방에 참여했다는 사실만으로는 부족하다.
 */
export function hasCompletedAnswers(
  participant: { answers: unknown[] } | undefined,
  totalQuestions: number
): boolean {
  return participant !== undefined && participant.answers.length >= totalQuestions;
}

export function canViewResults({
  isPublic,
  participant,
  totalQuestions,
}: {
  isPublic: boolean;
  participant: { answers: unknown[] } | undefined;
  totalQuestions: number;
}): boolean {
  return isPublic || hasCompletedAnswers(participant, totalQuestions);
}
