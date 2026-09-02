export function participantPath(roomId: string): string {
  return `/room/${encodeURIComponent(roomId)}`;
}

export function participantUrl(origin: string, roomId: string): string {
  return new URL(participantPath(roomId), origin).toString();
}
