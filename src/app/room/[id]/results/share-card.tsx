"use client";

import { forwardRef } from "react";
import { bestPair } from "@/lib/group-stats";
import { parseOptions, type Participant, type Question, type ResultsRoom } from "@/lib/types";

const ANTLER_PATHS = [
  "M12 28 C11 24 9 20 7 16 C5 12 3 8 4 4",
  "M12 28 C13 24 15 20 17 16 C19 12 21 8 20 4",
  "M7.5 14 C5 13 3.5 11 4 8",
  "M16.5 14 C19 13 20.5 11 20 8",
  "M5.5 9 C3 7 1.5 5 2 2",
  "M18.5 9 C21 7 22.5 5 22 2",
];

interface ShareCardProps {
  room: ResultsRoom;
}

function getFeaturedQuestion(room: ResultsRoom): Question | null {
  const candidate = room.questions.find((q) => q.type !== "subjective");
  return candidate ?? room.questions[0] ?? null;
}

/**
 * 인스타 피드 썸네일 크기에서도 한눈에 읽히도록, 숫자를 카드의 가장 큰 시각 요소로 둔다.
 * "제목 → 뱃지 → 카드 → 구석의 작은 숫자" 순서였던 이전 레이아웃은 숫자가 안 보였다.
 */
function renderFeatured(question: Question, participants: Participant[]) {
  const values = participants
    .map((p) => p.answers.find((a) => a.questionId === question.id)?.value)
    .filter((v): v is string => v != null);

  if (question.type === "balance") {
    const countA = values.filter((v) => v === "A").length;
    const countB = values.filter((v) => v === "B").length;
    const total = countA + countB || 1;
    const pctA = Math.round((countA / total) * 100);
    const pctB = 100 - pctA;
    return (
      <div style={{ width: "100%" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 32 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#b45309",
                marginBottom: 6,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {question.optionA}
            </div>
            <div
              style={{
                fontSize: 132,
                fontWeight: 800,
                color: "#92400e",
                lineHeight: 1,
                letterSpacing: -4,
              }}
            >
              {pctA}
              <span style={{ fontSize: 48 }}>%</span>
            </div>
          </div>
          <div style={{ width: 2, height: 120, background: "#e7e5e4", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0, textAlign: "right" }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#0f766e",
                marginBottom: 6,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {question.optionB}
            </div>
            <div
              style={{
                fontSize: 132,
                fontWeight: 800,
                color: "#115e59",
                lineHeight: 1,
                letterSpacing: -4,
              }}
            >
              {pctB}
              <span style={{ fontSize: 48 }}>%</span>
            </div>
          </div>
        </div>
        {/* 비율 막대 — 폭이 곧 비율이라 결과 페이지 숫자와 항상 같은 이야기를 한다 */}
        <div
          style={{
            display: "flex",
            height: 18,
            width: "100%",
            borderRadius: 10,
            overflow: "hidden",
            background: "#f5f5f4",
            marginTop: 32,
          }}
        >
          {countA > 0 && <div style={{ width: `${pctA}%`, background: "#d97706" }} />}
          {countB > 0 && <div style={{ width: `${pctB}%`, background: "#0d9488" }} />}
        </div>
      </div>
    );
  }

  if (question.type === "multiple") {
    const options = parseOptions(question.options);
    const counts = options.map((_, i) => values.filter((v) => v === String(i)).length);
    const total = counts.reduce((a, b) => a + b, 0) || 1;
    const maxIdx = counts.indexOf(Math.max(...counts));
    const topPct = Math.round((counts[maxIdx] / total) * 100);

    return (
      <div style={{ width: "100%" }}>
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: "#78350f",
              marginBottom: 4,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {options[maxIdx]}
          </div>
          <div
            style={{
              fontSize: 112,
              fontWeight: 800,
              color: "#92400e",
              lineHeight: 1,
              letterSpacing: -3,
            }}
          >
            {topPct}
            <span style={{ fontSize: 44 }}>%</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {options.map((opt, i) => {
            const pct = Math.round((counts[i] / total) * 100);
            const isTop = i === maxIdx && counts[i] > 0;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    flex: 1,
                    fontSize: 20,
                    color: isTop ? "#1c1917" : "#78716c",
                    fontWeight: isTop ? 700 : 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {opt}
                </div>
                <div
                  style={{
                    width: 220,
                    height: 10,
                    borderRadius: 6,
                    background: "#f5f5f4",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      background: isTop ? "#e8a038" : "#d6d3d1",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 56,
                    textAlign: "right",
                    fontSize: 20,
                    color: "#78716c",
                    flexShrink: 0,
                  }}
                >
                  {pct}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        padding: "36px 32px",
        borderRadius: 24,
        background: "#fff8ec",
        border: "2px solid #fde6c1",
        fontSize: 30,
        color: "#78350f",
        lineHeight: 1.5,
        fontStyle: "italic",
      }}
    >
      &ldquo;자유 응답으로 모은 우리들의 진심&rdquo;
    </div>
  );
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(function ShareCard(
  { room },
  ref
) {
  const featured = getFeaturedQuestion(room);
  // 궁합 통계는 "이름 붙은 우리 그룹" 전제다 — 공개방은 익명이라 이 전제가 없다
  const match = room.isPublic ? null : bestPair(room);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: 1080,
        height: 1080,
        background: "#fafaf8",
        overflow: "hidden",
        fontFamily:
          "'Gowun Dodum', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
      }}
    >
      {/* 은은한 amber 도트 텍스처 — 흰 카드가 평면적으로 보이지 않게 하는 배경 한 겹 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(#f3d9a8 2px, transparent 2px)",
          backgroundSize: "28px 28px",
          opacity: 0.4,
        }}
      />

      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 64,
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
          <svg
            viewBox="0 0 24 28"
            width="30"
            height="36"
            fill="none"
            stroke="#e8a038"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {ANTLER_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </svg>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#1c1917", letterSpacing: -1 }}>
            Deerlink
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#1c1917",
            lineHeight: 1.15,
            letterSpacing: -1.5,
            marginBottom: 32,
          }}
        >
          {room.title}
        </div>

        {/* Featured question — 숫자가 이 카드의 주인공이다 */}
        {featured && (
          <div
            style={{
              background: "white",
              border: "1px solid #fde6c1",
              borderRadius: 32,
              padding: 48,
              marginBottom: 32,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div
              style={{
                fontSize: 30,
                fontWeight: 700,
                color: "#1c1917",
                lineHeight: 1.3,
                letterSpacing: -0.5,
              }}
            >
              {featured.title}
            </div>
            {renderFeatured(featured, room.participants)}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: "auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              borderRadius: 9999,
              background: "#fff8ec",
              border: "1px solid #fde6c1",
              fontSize: 20,
              fontWeight: 600,
              color: "#78350f",
            }}
          >
            {room.participants.length}명 참여
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              borderRadius: 9999,
              background: "#fafaf8",
              border: "1px solid #e7e5e4",
              fontSize: 20,
              color: "#57534e",
            }}
          >
            질문 {room.questions.length}개
          </div>
          {match && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 9999,
                background: "#f0fdfa",
                border: "1px solid #b8e6df",
                fontSize: 20,
                fontWeight: 600,
                color: "#0f766e",
              }}
            >
              {match.a.nickname}·{match.b.nickname} 궁합 {match.pct}%
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 32,
            paddingTop: 28,
            borderTop: "1px solid #e7e5e4",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 20, color: "#78716c" }}>링크 하나로 친구들과 의견 비교</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: "#e8a038" }}>deerlink.kr</div>
        </div>
      </div>
    </div>
  );
});
