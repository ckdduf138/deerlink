"use client";

import { useSyncExternalStore } from "react";

const neverChanges = () => () => {};

/**
 * 서버 렌더와 첫 클라이언트 렌더에서는 false, 하이드레이션 이후 true.
 * localStorage나 window.location처럼 브라우저에만 있는 값을 읽기 전에 세운다.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    neverChanges,
    () => true,
    () => false
  );
}
