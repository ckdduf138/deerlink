"use client";

import { forwardRef } from "react";

const ANTLER_PATHS = [
  "M12 28 C11 24 9 20 7 16 C5 12 3 8 4 4",
  "M12 28 C13 24 15 20 17 16 C19 12 21 8 20 4",
  "M7.5 14 C5 13 3.5 11 4 8",
  "M16.5 14 C19 13 20.5 11 20 8",
  "M5.5 9 C3 7 1.5 5 2 2",
  "M18.5 9 C21 7 22.5 5 22 2",
];

interface Answer {
  id: string;
  questionId: string;
  value: string;
}

interface Participant {
  id: string;
  nickname: string;
  answers: Answer[];
}

interface Question {
  id: string;
  type: "balance" | "multiple" | "subjective";
  title: string;
  optionA: string | null;
  optionB: string | null;
  options: string | null;
  order: number;
}

interface Room {
  id: string;
  title: string;
  questions: Question[];
  participants: Participant[];
}

interface ShareCardProps {
  room: Room;
}

function getFeaturedQuestion(room: Room): Question | null {
  const candidate = room.questions.find((q) => q.type !== "subjective");
  return candidate ?? room.questions[0] ?? null;
}

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
        <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
          <div
            style={{
              flex: 1,
              padding: "28px 24px",
              borderRadius: 24,
              border: "2px solid #fde6c1",
              background: "#fff8ec",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 18, color: "#b45309", fontWeight: 600, marginBottom: 8 }}>
              A
            </div>
            <div style={{ fontSize: 28, color: "#78350f", fontWeight: 700 }}>
              {question.optionA}
            </div>
          </div>
          <div
            style={{
              flex: 1,
              padding: "28px 24px",
              borderRadius: 24,
              border: "2px solid #b8e6df",
              background: "#effaf7",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 18, color: "#0f766e", fontWeight: 600, marginBottom: 8 }}>
              B
            </div>
            <div style={{ fontSize: 28, color: "#134e4a", fontWeight: 700 }}>
              {question.optionB}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            height: 20,
            borderRadius: 12,
            overflow: "hidden",
            background: "#f5f5f4",
            gap: 4,
          }}
        >
          {pctA > 0 && (
            <div style={{ width: `${pctA}%`, background: "#e8a038", height: "100%" }} />
          )}
          {pctB > 0 && (
            <div style={{ width: `${pctB}%`, background: "#14b8a6", height: "100%" }} />
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 12,
            fontSize: 22,
            color: "#57534e",
            fontWeight: 600,
          }}
        >
          <span style={{ color: "#b45309" }}>{pctA}%</span>
          <span style={{ color: "#0f766e" }}>{pctB}%</span>
        </div>
      </div>
    );
  }

  if (question.type === "multiple") {
    const options: string[] = question.options ? JSON.parse(question.options) : [];
    const counts = options.map((_, i) => values.filter((v) => v === String(i)).length);
    const total = counts.reduce((a, b) => a + b, 0) || 1;
    const maxIdx = counts.indexOf(Math.max(...counts));
    return (
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
        {options.map((opt, i) => {
          const pct = Math.round((counts[i] / total) * 100);
          const isTop = i === maxIdx && counts[i] > 0;
          return (
            <div key={i}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                  fontSize: 22,
                  color: isTop ? "#1c1917" : "#78716c",
                  fontWeight: isTop ? 700 : 500,
                }}
              >
                <span>{opt}</span>
                <span>{pct}%</span>
              </div>
              <div
                style={{
                  height: 12,
                  borderRadius: 8,
                  background: "#f5f5f4",
                  overflow: "hidden",
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
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        padding: "32px",
        borderRadius: 24,
        background: "#fff8ec",
        border: "2px solid #fde6c1",
        fontSize: 24,
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

  return (
    <div
      ref={ref}
      style={{
        width: 1080,
        height: 1080,
        background: "#fafaf8",
        display: "flex",
        flexDirection: "column",
        padding: 64,
        fontFamily:
          "'Gowun Dodum', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48 }}>
        <svg
          viewBox="0 0 24 28"
          width="36"
          height="44"
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
        <div style={{ fontSize: 28, fontWeight: 700, color: "#1c1917", letterSpacing: -1 }}>
          Deerlink
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            fontSize: 18,
            color: "#a8a29e",
            textTransform: "uppercase",
            letterSpacing: 4,
          }}
        >
          결과 비교
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: "#1c1917",
          lineHeight: 1.15,
          letterSpacing: -1.5,
          marginBottom: 24,
        }}
      >
        {room.title}
      </div>

      {/* Stats */}
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 48 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            borderRadius: 9999,
            background: "#fff8ec",
            border: "1px solid #fde6c1",
            fontSize: 22,
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
            fontSize: 22,
            color: "#57534e",
          }}
        >
          질문 {room.questions.length}개
        </div>
      </div>

      {/* Featured question */}
      {featured && (
        <div
          style={{
            background: "white",
            border: "1px solid #fde6c1",
            borderRadius: 32,
            padding: 48,
            marginBottom: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 18,
              color: "#a8a29e",
              textTransform: "uppercase",
              letterSpacing: 4,
            }}
          >
            {featured.type === "balance"
              ? "밸런스 게임"
              : featured.type === "multiple"
                ? "객관식"
                : "주관식"}
          </div>
          <div
            style={{
              fontSize: 36,
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

      {/* Footer */}
      <div
        style={{
          marginTop: 48,
          paddingTop: 32,
          borderTop: "1px solid #e7e5e4",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 22, color: "#78716c" }}>
          링크 하나로 친구들과 의견 비교
        </div>
        <div style={{ fontSize: 26, fontWeight: 600, color: "#e8a038" }}>
          deerlink.kr
        </div>
      </div>
    </div>
  );
});
