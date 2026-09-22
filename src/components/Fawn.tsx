import { cn } from "@/lib/utils";

/**
 * 디어링크 아기 사슴. 2026-09에 사용자 요청으로 브랜드 캐릭터를 다시 들였다.
 *
 * 예전 DeerMascot은 손으로 세밀하게 그린 일러스트라 품질 격차가 컸다. 이번엔 일부러
 * 도형 몇 개(둥근 얼굴·큰 귀·돋은 뿔·이마 점무늬·큰 눈)로만 짓는다. 단순할수록 SVG로
 * 품질이 유지된다. 더 다듬은 버전이 오면 이 파일만 바꾸면 된다 (표정 prop은 유지).
 *
 * 표정은 상황을 말할 때만 바꾼다: 기본(default), 고른 뒤·완료(happy),
 * 비어 있음·길 잃음(curious), 결과 공개(wow).
 */
export type FawnMood = "default" | "happy" | "curious" | "wow";

const FUR = "#E39A3B";
const FUR_SHADE = "#C9802A";
const CREAM = "#FFF1DC";
const EAR_INNER = "#F6BFA6";
const ANTLER = "#9A6232";
const INK = "#2A1B12";
const BLUSH = "#F29A86";

export function Fawn({
  mood = "default",
  className,
  title,
}: {
  mood?: FawnMood;
  className?: string;
  /** 장식이 아니라 의미가 있을 때만 넘긴다 (예: 404의 "길을 잃었어요"). */
  title?: string;
}) {
  const tilt = mood === "curious" ? "rotate(-8 60 70)" : undefined;

  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("h-16 w-16", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <g transform={tilt}>
        {/* 뿔: 짧고 뭉툭하게. 아기라서 가지가 하나뿐이다 */}
        <g stroke={ANTLER} strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M47 40 L43 25" />
          <path d="M44.5 31 L38 27" />
          <path d="M73 40 L77 25" />
          <path d="M75.5 31 L82 27" />
        </g>

        {/* 귀 */}
        <g>
          <ellipse cx="26" cy="52" rx="18" ry="10" transform="rotate(-28 26 52)" fill={FUR_SHADE} />
          <ellipse cx="27" cy="52" rx="11.5" ry="5.5" transform="rotate(-28 27 52)" fill={EAR_INNER} />
          <ellipse cx="94" cy="52" rx="18" ry="10" transform="rotate(28 94 52)" fill={FUR_SHADE} />
          <ellipse cx="93" cy="52" rx="11.5" ry="5.5" transform="rotate(28 93 52)" fill={EAR_INNER} />
        </g>

        {/* 얼굴 */}
        <ellipse cx="60" cy="70" rx="34" ry="31" fill={FUR} />
        <ellipse cx="60" cy="86" rx="18" ry="12.5" fill={CREAM} />

        {/* 이마 점무늬 */}
        <g fill={CREAM} opacity="0.9">
          <ellipse cx="51" cy="50" rx="3" ry="2.4" />
          <ellipse cx="60" cy="46" rx="2.4" ry="2" />
          <ellipse cx="69" cy="50" rx="3" ry="2.4" />
        </g>

        {/* 볼 */}
        <g fill={BLUSH} opacity="0.55">
          <ellipse cx="37" cy="80" rx="6" ry="3.6" />
          <ellipse cx="83" cy="80" rx="6" ry="3.6" />
        </g>

        <Eyes mood={mood} />

        {/* 코 */}
        <ellipse cx="60" cy="80" rx="4.4" ry="3.2" fill={INK} />
        <ellipse cx="58.8" cy="79" rx="1.2" ry="0.8" fill="#fff" opacity="0.7" />

        <Mouth mood={mood} />
      </g>
    </svg>
  );
}

function Eyes({ mood }: { mood: FawnMood }) {
  if (mood === "happy") {
    return (
      <g stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M42 70 Q47 64 52 70" />
        <path d="M68 70 Q73 64 78 70" />
      </g>
    );
  }

  const r = mood === "wow" ? { rx: 6, ry: 7 } : { rx: 5.3, ry: 6.3 };
  return (
    <g>
      <ellipse cx="47" cy="69" {...r} fill={INK} />
      <ellipse cx="73" cy="69" {...r} fill={INK} />
      <circle cx="49" cy="66.4" r={mood === "wow" ? 2.4 : 2.1} fill="#fff" />
      <circle cx="75" cy="66.4" r={mood === "wow" ? 2.4 : 2.1} fill="#fff" />
      <circle cx="45.6" cy="71.4" r="0.9" fill="#fff" opacity="0.8" />
      <circle cx="71.6" cy="71.4" r="0.9" fill="#fff" opacity="0.8" />
    </g>
  );
}

function Mouth({ mood }: { mood: FawnMood }) {
  if (mood === "wow" || mood === "curious") {
    return <ellipse cx="60" cy="89" rx={mood === "wow" ? 3.2 : 2.2} ry={mood === "wow" ? 3.8 : 2.4} fill={INK} />;
  }
  if (mood === "happy") {
    return <path d="M54.5 86.5 Q60 94 65.5 86.5 Z" fill={INK} />;
  }
  return (
    <path
      d="M55 86 Q57.5 89 60 86 Q62.5 89 65 86"
      stroke={INK}
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
  );
}

/** 카드 모서리를 붙잡은 앞발 두 개. 카드 뒤에서 빼꼼 내다보는 Fawn과 같이 쓴다. */
export function FawnPaws({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 16" className={cn("h-4 w-16", className)} aria-hidden="true">
      <rect x="4" y="0" width="18" height="15" rx="7.5" fill={FUR} />
      <rect x="4" y="9" width="18" height="6" rx="3" fill={ANTLER} />
      <rect x="42" y="0" width="18" height="15" rx="7.5" fill={FUR} />
      <rect x="42" y="9" width="18" height="6" rx="3" fill={ANTLER} />
    </svg>
  );
}
