import type { Metadata } from "next";
import { PopularNav } from "@/components/popular/popular-nav";
import { SiteFooter } from "@/components/SiteFooter";
import { GA_MEASUREMENT_ID } from "@/components/GoogleAnalytics";
import { FREEZE_MIN_PARTICIPANTS } from "@/lib/room-archive";
import {
  PARTICIPANT_COOKIE_MAX_AGE,
  participantCookieName,
} from "@/lib/participant-session";
import {
  PUBLIC_ROOM_EXTENSION_LABEL,
  PUBLIC_ROOM_MAX_LABEL,
  roomLifetimeLabel,
} from "@/lib/room-lifetime";
import { SITE_OPEN_GRAPH } from "@/lib/site-metadata";

/**
 * 개인정보처리방침.
 *
 * 숫자와 쿠키 이름은 전부 실제 상수에서 끌어온다. 방침에 손으로 적은 "24시간"이
 * 코드의 24시간과 어긋나는 순간 이 문서는 거짓말이 되는데, 그걸 알아챌 방법이 없다.
 * 보유 기간 정책을 바꾸면 이 페이지도 같이 바뀌어야 한다 - 그래서 import 한다.
 *
 * 문의 창구는 이메일이 아니라 사이트 안의 피드백 카드다 (운영자 요청).
 */
export const metadata: Metadata = {
  title: "개인정보처리방침",
  description:
    "디어링크가 수집하는 정보, 보유 기간, 쿠키 사용과 처리 위탁 업체를 안내합니다. 회원가입을 받지 않으며 계정 정보를 수집하지 않습니다.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    ...SITE_OPEN_GRAPH,
    title: "개인정보처리방침 | 디어링크",
    description: "디어링크가 수집하는 정보와 보유 기간, 쿠키 사용을 안내합니다.",
    url: "/privacy",
  },
};

const EFFECTIVE_DATE = "2026년 11월 4일";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-cute text-xl text-stone-900 md:text-2xl">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-stone-700">
        {children}
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li className="flex flex-col gap-0.5 border-b border-stone-200 py-3 last:border-b-0 sm:flex-row sm:gap-4">
      <span className="font-semibold text-stone-900 sm:w-40 sm:flex-shrink-0">{label}</span>
      <span className="min-w-0 flex-1">{children}</span>
    </li>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-page text-stone-900">
      <PopularNav />

      <main className="mx-auto max-w-2xl px-6 pb-20 pt-28">
        <h1 className="break-keep font-cute text-3xl leading-[1.2] text-stone-900 md:text-4xl">
          개인정보처리방침
        </h1>
        <p className="mt-3 text-sm text-stone-600">시행일 {EFFECTIVE_DATE}</p>

        <p className="mt-6 break-keep rounded-2xl bg-white p-5 text-[15px] leading-relaxed text-stone-700">
          디어링크는 회원가입을 받지 않습니다. 이름, 이메일, 전화번호, 생년월일, 결제 정보를
          수집하지 않고 계정도 만들지 않아요. 아래는 그 외에 어떤 정보가 오가고 언제
          사라지는지에 대한 설명입니다.
        </p>

        <Section title="1. 수집하는 정보">
          <ul className="rounded-2xl bg-white px-5">
            <Row label="방을 만들 때">
              방 제목, 질문과 선택지. 직접 입력한 내용만 저장됩니다.
            </Row>
            <Row label="답할 때">
              각 질문의 답변과 닉네임. 공개방에서는 닉네임을 받지 않고 서버가 &quot;참여자 1&quot;처럼
              순번을 붙입니다.
            </Row>
            <Row label="피드백을 보낼 때">
              별점, 의견(선택), 연락처(선택). 연락처는 직접 적은 경우에만 전달됩니다.
            </Row>
            <Row label="자동으로 남는 것">
              접속 IP 주소와 브라우저가 보내는 일반 정보. IP는 짧은 시간에 같은 요청이 반복되는
              것을 막는 용도로만 쓰고 서버 메모리에만 잠시 두며, 데이터베이스에 저장하지 않습니다.
            </Row>
          </ul>
          <p>
            답변 내용은 그 방에 들어온 사람들에게 보이기 위한 정보입니다. 닉네임을 실명으로 적을지
            별명으로 적을지는 이용자가 정할 수 있고, 공개방에서는 아예 받지 않습니다.
          </p>
        </Section>

        <Section title="2. 쿠키와 브라우저 저장소">
          <ul className="rounded-2xl bg-white px-5">
            <Row label={participantCookieName("<방ID>")}>
              같은 방에서 내가 쓴 답을 알아보고, 전 문항을 답하기 전에는 남의 답이 열리지 않도록
              하는 데 씁니다. 자바스크립트에서 읽을 수 없는 쿠키(httpOnly)이고{" "}
              {PARTICIPANT_COOKIE_MAX_AGE / 3600}시간 뒤 만료됩니다.
            </Row>
            <Row label="관리자 세션 쿠키">
              운영자 로그인에만 발급됩니다. 일반 이용자에게는 만들어지지 않습니다.
            </Row>
            <Row label="브라우저 저장소">
              작성 중인 방과 답변을 잃지 않도록 임시 저장하고, 피드백 카드를 다시 띄우지 않기 위한
              표시를 남깁니다. 브라우저 안에만 있고 서버로 전송되지 않습니다.
            </Row>
          </ul>
          <p>
            광고는 게재하지 않습니다. 광고용 추적 쿠키를 심지 않으며, 추후 광고를 넣게 되면 이
            방침을 먼저 갱신합니다.
          </p>
        </Section>

        <Section title="3. 보유 기간">
          <ul className="rounded-2xl bg-white px-5">
            <Row label="비공개방">
              만든 지 {roomLifetimeLabel(false)} 뒤 방과 답변이 함께 삭제됩니다.
            </Row>
            <Row label="공개방">
              {roomLifetimeLabel(true)} 동안 열리고, 새로 한 명이 답할 때마다{" "}
              {PUBLIC_ROOM_EXTENSION_LABEL}씩 늘어납니다. 만든 날부터 최대{" "}
              {PUBLIC_ROOM_MAX_LABEL}입니다.
            </Row>
            <Row label="보관되는 방">
              기간이 끝난 공개방 중 {FREEZE_MIN_PARTICIPANTS}명 이상이 답한 방은 지우지 않고
              결과를 남깁니다. 공개방은 닉네임을 받지 않으므로 누가 무엇을 골랐는지는 남지 않고
              집계만 남습니다. 비공개방은 어떤 경우에도 보관하지 않습니다.
            </Row>
            <Row label="피드백">
              전달된 뒤 운영자의 디스코드 채널에 남습니다. 삭제를 원하시면 아래 창구로 알려주세요.
            </Row>
          </ul>
          <p>
            삭제는 하루 한 번 자동으로 실행됩니다. 기간이 끝나기 전에 방을 지우고 싶으시면 아래
            창구로 방 주소와 함께 알려주시면 삭제해 드립니다.
          </p>
        </Section>

        <Section title="4. 처리 위탁과 국외 이전">
          <p>
            서비스를 운영하기 위해 아래 업체의 설비를 이용합니다. 이들 업체의 서버가 해외에 있어
            정보가 국외에 저장될 수 있습니다.
          </p>
          <ul className="rounded-2xl bg-white px-5">
            <Row label="Vercel Inc.">웹사이트 호스팅과 접속 통계</Row>
            <Row label="Turso">데이터베이스 보관</Row>
            <Row label="Google LLC">
              Google Analytics 4를 통한 방문 통계 (측정 ID {GA_MEASUREMENT_ID})
            </Row>
            <Row label="Discord Inc.">보내주신 피드백 전달</Row>
          </ul>
          <p>
            이 외에 개인정보를 제3자에게 제공하거나 판매하지 않습니다. 법령에 따라 요구받는 경우를
            제외하고는 외부에 넘기지 않습니다.
          </p>
        </Section>

        <Section title="5. 이용자의 권리">
          <p>
            열람, 정정, 삭제, 처리 정지를 요청하실 수 있습니다. 회원 정보가 없어 본인 확인 수단이
            제한되므로, 방 주소처럼 해당 정보를 특정할 수 있는 내용을 함께 알려주시면 확인 후
            처리합니다.
          </p>
          <p>
            Google Analytics 수집을 원하지 않으시면 브라우저에 Google 애널리틱스 차단 부가기능을
            설치하거나, 브라우저의 쿠키 차단 설정을 사용하실 수 있습니다.
          </p>
        </Section>

        <Section title="6. 만 14세 미만 이용자">
          <p>
            만 14세 미만 아동은 법정대리인의 동의를 받아 이용해 주세요. 디어링크는 나이를 확인할
            수단을 두고 있지 않으므로, 아동이 닉네임이나 답변에 실명과 학교 같은 개인정보를 적지
            않도록 보호자의 지도를 부탁드립니다.
          </p>
        </Section>

        <Section title="7. 문의">
          <p>
            개인정보 처리에 관한 문의와 삭제 요청은 화면 아래 &quot;피드백 보내기&quot;로 받습니다.
            연락처를 함께 남겨주시면 답변드릴 수 있습니다.
          </p>
        </Section>

        <Section title="8. 방침 변경">
          <p>
            내용이 바뀌면 이 페이지에 변경된 방침과 시행일을 올립니다. 수집 항목이나 이용 목적이
            늘어나는 변경은 적용 전에 미리 알립니다.
          </p>
        </Section>

        <SiteFooter className="mt-16" />
      </main>
    </div>
  );
}
