import type { CSSProperties, ReactElement } from "react";
import type { PrimaryResultInsight } from "@/lib/group-stats";
import { primaryResultInsight } from "@/lib/group-stats";
import type { ResultsRoom } from "@/lib/types";
import { ANTLER_LOGO_PATHS } from "@/components/landing/antler-logo-paths";

const row: CSSProperties = { display: "flex", alignItems: "center" };
const column: CSSProperties = { display: "flex", flexDirection: "column" };

function responsiveFontSize(text: string, normal: number, medium: number, long: number): number {
  if (text.length > 55) return long;
  if (text.length > 32) return medium;
  return normal;
}

function InsightContent({ insight }: { insight: PrimaryResultInsight }): ReactElement {
  if (insight.kind === "best-pair") {
    const names = `${insight.pair.a.nickname}, ${insight.pair.b.nickname}`;
    return (
      <div style={{ ...column, gap: 22 }}>
        <div style={{ fontSize: 25, color: "#92400e", fontWeight: 700 }}>최고 궁합</div>
        <div
          style={{
            fontSize: responsiveFontSize(names, 60, 52, 44),
            lineHeight: 1.2,
            color: "#1c1917",
            fontWeight: 700,
            overflowWrap: "anywhere",
          }}
        >
          {names}
        </div>
        <div style={{ ...row, alignItems: "baseline", gap: 14 }}>
          <span style={{ fontSize: 92, lineHeight: 1, color: "#b45309", fontWeight: 700 }}>
            {insight.pair.pct}%
          </span>
          <span style={{ fontSize: 24, color: "#57534e" }}>
            {insight.pair.comparable}개 질문에서 비교했어요
          </span>
        </div>
      </div>
    );
  }

  if (insight.kind === "closest-balance") {
    const { question, countA, countB } = insight.result;
    const total = countA + countB;
    const pctA = total ? Math.round((countA / total) * 100) : 0;
    return (
      <div style={{ ...column, gap: 22 }}>
        <div style={{ fontSize: 25, color: "#92400e", fontWeight: 700 }}>가장 팽팽한 질문</div>
        <div
          style={{
            fontSize: responsiveFontSize(question.title, 48, 43, 37),
            lineHeight: 1.25,
            color: "#1c1917",
            fontWeight: 700,
            overflowWrap: "anywhere",
          }}
        >
          {question.title}
        </div>
        <div style={{ ...column, gap: 14 }}>
          <div style={{ display: "flex", height: 24, width: "100%", overflow: "hidden", borderRadius: 999 }}>
            {countA > 0 && <div style={{ width: `${pctA}%`, background: "#e8a038" }} />}
            {countB > 0 && <div style={{ width: `${100 - pctA}%`, background: "#0f766e" }} />}
          </div>
          <div style={{ ...row, justifyContent: "space-between", gap: 24, fontSize: 23, color: "#57534e" }}>
            <span style={{ overflowWrap: "anywhere" }}>{question.optionA}: {countA}명</span>
            <span style={{ overflowWrap: "anywhere", textAlign: "right" }}>{question.optionB}: {countB}명</span>
          </div>
        </div>
      </div>
    );
  }

  const { aggregate } = insight;
  const top = aggregate.options.find((option) => option.count === aggregate.topCount);
  const title = insight.kind === "unanimous" ? "만장일치" : "가장 많이 모인 답";
  return (
    <div style={{ ...column, gap: 22 }}>
      <div style={{ fontSize: 25, color: "#92400e", fontWeight: 700 }}>{title}</div>
      <div
        style={{
          fontSize: responsiveFontSize(aggregate.question.title, 48, 43, 37),
          lineHeight: 1.25,
          color: "#1c1917",
          fontWeight: 700,
          overflowWrap: "anywhere",
        }}
      >
        {aggregate.question.title}
      </div>
      {top && (
        <div style={{ ...row, alignItems: "flex-end", justifyContent: "space-between", gap: 32 }}>
          <span
            style={{
              maxWidth: 650,
              fontSize: responsiveFontSize(top.label, 42, 38, 34),
              lineHeight: 1.25,
              color: "#78350f",
              fontWeight: 700,
              overflowWrap: "anywhere",
            }}
          >
            {top.label}
          </span>
          <span style={{ flexShrink: 0, fontSize: 72, lineHeight: 1, color: "#b45309", fontWeight: 700 }}>
            {top.pct}%
          </span>
        </div>
      )}
    </div>
  );
}

export function ShareImage({ room }: { room: ResultsRoom }): ReactElement {
  const insight = room.participants.length >= 2 ? primaryResultInsight(room) : null;

  return (
    <div
      lang="ko-KR"
      style={{
        ...column,
        position: "relative",
        width: 1080,
        height: 1080,
        padding: 68,
        boxSizing: "border-box",
        backgroundColor: "#fafaf8",
        backgroundImage: "radial-gradient(#f3d9a8 1.5px, transparent 1.5px)",
        backgroundSize: "28px 28px",
        color: "#1c1917",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ ...row, gap: 14 }}>
        <svg
          viewBox="0 0 24 28"
          width="32"
          height="38"
          fill="none"
          stroke="#d97706"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {ANTLER_LOGO_PATHS.map((path) => <path key={path} d={path} />)}
        </svg>
        <span style={{ fontSize: 25, fontWeight: 700, letterSpacing: -0.5 }}>Deerlink</span>
      </div>

      <div
        style={{
          marginTop: 42,
          fontSize: responsiveFontSize(room.title, 52, 46, 40),
          lineHeight: 1.2,
          fontWeight: 700,
          letterSpacing: -1,
          overflowWrap: "anywhere",
        }}
      >
        {room.title}
      </div>

      <div
        style={{
          ...column,
          justifyContent: "center",
          minHeight: 480,
          marginTop: 38,
          padding: "46px 48px",
          border: "2px solid #fde6c1",
          borderRadius: 30,
          backgroundColor: "#ffffff",
        }}
      >
        {insight ? (
          <InsightContent insight={insight} />
        ) : (
          <div style={{ ...column, gap: 20 }}>
            <div style={{ fontSize: 26, color: "#92400e", fontWeight: 700 }}>
              {room.participants.length === 1 ? "첫 답변 도착" : "결과를 기다리는 중"}
            </div>
            <div style={{ fontSize: 48, lineHeight: 1.3, fontWeight: 700 }}>
              {room.participants.length === 1
                ? "한 명 더 오면 비교가 시작돼요."
                : "첫 답변이 도착하면 비교가 시작돼요."}
            </div>
          </div>
        )}
      </div>

      <div style={{ ...row, justifyContent: "space-between", marginTop: "auto", fontSize: 23, color: "#57534e" }}>
        <span>{room.participants.length}명 참여, 질문 {room.questions.length}개</span>
        <span style={{ color: "#92400e", fontWeight: 700 }}>deerlink.kr</span>
      </div>
    </div>
  );
}
