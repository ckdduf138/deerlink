export type QuestionType = "balance" | "multiple" | "subjective";

export interface PopularQuestion {
  id: string;
  type: QuestionType;
  title: string;
  optionA?: string;
  optionB?: string;
  options?: string[];
}

export const POPULAR_QUESTIONS: PopularQuestion[] = [
  // 밸런스
  {
    id: "b-1eok-jeolyeon",
    type: "balance",
    title: "1억 받고 절친과 영원히 절연 vs 1억 포기하고 평생 절친",
    optionA: "1억 받고 절연",
    optionB: "1억 포기하고 절친",
  },
  {
    id: "b-jjaksarang",
    type: "balance",
    title: "내가 미치게 좋아하는 사람과 연애 vs 나를 미치게 좋아하는 사람과 연애",
    optionA: "내가 좋아하는 사람",
    optionB: "나를 좋아하는 사람",
  },
  {
    id: "b-tumyeong-maeum",
    type: "balance",
    title: "모든 사람이 내 속마음을 읽을 수 있음 vs 나만 모든 사람 속마음을 읽을 수 있음",
    optionA: "내 마음이 투명",
    optionB: "남의 마음이 보임",
  },
  {
    id: "b-seontok-katok",
    type: "balance",
    title: "선톡 절대 안 하는 애인 vs 하루종일 카톡 폭격하는 애인",
    optionA: "선톡 안 하는 애인",
    optionB: "카톡 폭격 애인",
  },
  {
    id: "b-200man-1000man",
    type: "balance",
    title: "월급 200만원 좋아하는 일 vs 월급 1,000만원 하기 싫은 일",
    optionA: "200만원 좋아하는 일",
    optionB: "1,000만원 싫은 일",
  },
  {
    id: "b-tangsuyuk",
    type: "balance",
    title: "탕수육은 부먹 vs 찍먹",
    optionA: "부먹",
    optionB: "찍먹",
  },
  {
    id: "b-sowon-changpi",
    type: "balance",
    title: "친구 10명한테 욕먹는 소문 퍼짐 vs SNS에서 1만 명한테 공개 망신",
    optionA: "친구들한테 욕",
    optionB: "1만 명 공개 망신",
  },
  {
    id: "b-honja-gachi",
    type: "balance",
    title: "평생 혼자지만 원하는 모든 것을 가짐 vs 사랑하는 사람과 함께지만 항상 가난",
    optionA: "혼자지만 풍요",
    optionB: "함께지만 가난",
  },
  {
    id: "b-chicken",
    type: "balance",
    title: "치킨은 후라이드 vs 양념",
    optionA: "후라이드",
    optionB: "양념",
  },
  {
    id: "b-yeohaeng-style",
    type: "balance",
    title: "여행 스타일: 빡빡한 일정표 vs 그때그때 즉흥",
    optionA: "일정표파",
    optionB: "즉흥파",
  },
  {
    id: "b-sanbada",
    type: "balance",
    title: "여행지 고르면 산 vs 바다",
    optionA: "산",
    optionB: "바다",
  },
  {
    id: "b-jjajang",
    type: "balance",
    title: "짜장면 vs 짬뽕",
    optionA: "짜장면",
    optionB: "짬뽕",
  },
  {
    id: "b-mintcho",
    type: "balance",
    title: "민트초코는 맛있다 vs 치약 맛이다",
    optionA: "맛있다",
    optionB: "치약 맛",
  },
  {
    id: "b-ramyeon",
    type: "balance",
    title: "라면은 꼬들꼬들한 면 vs 푹 퍼진 면",
    optionA: "꼬들면",
    optionB: "퍼진 면",
  },
  {
    id: "b-naengmyeon",
    type: "balance",
    title: "냉면은 물냉면 vs 비빔냉면",
    optionA: "물냉면",
    optionB: "비빔냉면",
  },
  {
    id: "b-sundae",
    type: "balance",
    title: "순대 찍어 먹을 때 소금 vs 쌈장",
    optionA: "소금",
    optionB: "쌈장",
  },
  {
    id: "b-bungeoppang",
    type: "balance",
    title: "붕어빵 먹을 때 머리부터 vs 꼬리부터",
    optionA: "머리부터",
    optionB: "꼬리부터",
  },
  {
    id: "b-ramyeon-chicken",
    type: "balance",
    title: "평생 라면 못 먹기 vs 평생 치킨 못 먹기",
    optionA: "라면 포기",
    optionB: "치킨 포기",
  },
  {
    id: "b-achim-jeonyeok",
    type: "balance",
    title: "새벽 5시에 일어나는 아침형 vs 새벽 3시에 자는 저녁형",
    optionA: "아침형",
    optionB: "저녁형",
  },
  {
    id: "b-syawo",
    type: "balance",
    title: "샤워는 아침에 vs 자기 전에",
    optionA: "아침 샤워",
    optionB: "자기 전 샤워",
  },
  {
    id: "b-aircon",
    type: "balance",
    title: "평생 에어컨 없는 여름 vs 평생 난방 없는 겨울",
    optionA: "에어컨 없는 여름",
    optionB: "난방 없는 겨울",
  },
  {
    id: "b-phone-friend",
    type: "balance",
    title: "1년 동안 스마트폰 없이 살기 vs 1년 동안 친구 못 만나기",
    optionA: "스마트폰 없이",
    optionB: "친구 없이",
  },
  {
    id: "b-gwageo-mirae",
    type: "balance",
    title: "딱 한 번 과거로 가보기 vs 딱 한 번 미래로 가보기",
    optionA: "과거로",
    optionB: "미래로",
  },
  {
    id: "b-superpower",
    type: "balance",
    title: "투명인간 되기 vs 순간이동 하기",
    optionA: "투명인간",
    optionB: "순간이동",
  },
  {
    id: "b-eoneo-akgi",
    type: "balance",
    title: "세상 모든 언어 하기 vs 세상 모든 악기 연주하기",
    optionA: "모든 언어",
    optionB: "모든 악기",
  },
  {
    id: "b-10nyeon-1eok",
    type: "balance",
    title: "지금 기억 그대로 10년 전으로 돌아가기 vs 지금 1억 받기",
    optionA: "10년 전으로",
    optionB: "지금 1억",
  },
  {
    id: "b-lotto",
    type: "balance",
    title: "로또 1등 되고 평생 아무한테도 말 못 함 vs 로또 3등 되고 마음껏 자랑",
    optionA: "1등, 비밀",
    optionB: "3등, 자랑",
  },
  {
    id: "b-sukso-meokgi",
    type: "balance",
    title: "여행 가면 숙소에 돈 쓰기 vs 먹는 데 돈 쓰기",
    optionA: "숙소에 투자",
    optionB: "먹는 데 투자",
  },
  {
    id: "b-yori-seolgeoji",
    type: "balance",
    title: "MT 가서 요리 담당 vs 설거지 담당",
    optionA: "요리 담당",
    optionB: "설거지 담당",
  },
  {
    id: "b-chuksa-chukga",
    type: "balance",
    title: "친구 결혼식에서 축사 하기 vs 축가 부르기",
    optionA: "축사",
    optionB: "축가",
  },
  {
    id: "b-kkaennip",
    type: "balance",
    title: "애인이 내 친구 깻잎 떼어주는 거 괜찮다 vs 안 된다",
    optionA: "괜찮다",
    optionB: "안 된다",
  },
  {
    id: "b-yeonrak-jaemi",
    type: "balance",
    title: "연락은 잘 되는데 재미없는 애인 vs 재밌는데 연락 안 되는 애인",
    optionA: "연락 잘 되는 애인",
    optionB: "재밌는 애인",
  },
  {
    id: "b-maeil-juil",
    type: "balance",
    title: "애인과 매일 잠깐씩 만나기 vs 일주일에 한 번 하루 종일 만나기",
    optionA: "매일 잠깐씩",
    optionB: "주 1회 하루 종일",
  },
  {
    id: "b-cheotnun-chingu",
    type: "balance",
    title: "첫눈에 반한 사람과 연애 vs 오래 알던 친구와 연애",
    optionA: "첫눈에 반한 사람",
    optionB: "오래된 친구",
  },
  {
    id: "b-gobaek",
    type: "balance",
    title: "짝사랑 고백하고 차이기 vs 고백 못 하고 평생 궁금해하기",
    optionA: "고백하고 차이기",
    optionB: "평생 궁금해하기",
  },
  {
    id: "b-sagwa",
    type: "balance",
    title: "싸우고 나서 내가 먼저 사과하기 vs 상대가 사과할 때까지 기다리기",
    optionA: "먼저 사과",
    optionB: "기다리기",
  },
  {
    id: "b-yeonbong-anjeong",
    type: "balance",
    title: "연봉 2배지만 언제 망할지 모르는 회사 vs 지금 연봉에 정년 보장",
    optionA: "연봉 2배, 불안정",
    optionB: "정년 보장",
  },
  {
    id: "b-ju4il",
    type: "balance",
    title: "주 4일 근무에 월급 20% 삭감 vs 주 5일 근무에 월급 그대로",
    optionA: "주 4일, 20% 삭감",
    optionB: "주 5일, 그대로",
  },
  {
    id: "b-jaetaek",
    type: "balance",
    title: "평생 재택근무 vs 평생 사무실 출근",
    optionA: "평생 재택",
    optionB: "평생 출근",
  },
  {
    id: "b-dongryo",
    type: "balance",
    title: "일 잘하는데 성격 나쁜 동료 vs 착한데 일 못하는 동료",
    optionA: "일 잘하는 동료",
    optionB: "착한 동료",
  },
  {
    id: "b-sangsa",
    type: "balance",
    title: "매일 칭찬하는데 연봉 동결 vs 매일 잔소리하는데 연봉 20% 인상",
    optionA: "칭찬, 연봉 동결",
    optionB: "잔소리, 연봉 인상",
  },

  // 객관식
  {
    id: "m-katok-wass",
    type: "multiple",
    title: "카톡 왔을 때 나는?",
    options: ["즉시 답장", "읽고 나중에 답장", "읽씹할 때 있음", "알림 꺼놓음"],
  },
  {
    id: "m-yaksok-sigan",
    type: "multiple",
    title: "약속 시간 나는?",
    options: ["30분 전 도착", "딱 맞게 도착", "5~10분 지각", "항상 30분+ 지각"],
  },
  {
    id: "m-galdeung",
    type: "multiple",
    title: "갈등 생기면 나는?",
    options: ["바로 직접 말함", "삭히다가 폭발함", "그냥 넘어감", "슬쩍 멀어짐"],
  },
  {
    id: "m-position",
    type: "multiple",
    title: "우리 그룹에서 내 포지션은?",
    options: ["분위기 메이커", "조용한 관찰자", "분위기 파악러", "중재자"],
  },
  {
    id: "m-10eok",
    type: "multiple",
    title: "10억 생기면 가장 먼저?",
    options: ["집 구매", "세계 일주", "투자·사업", "부모님께 드림"],
  },
  {
    id: "m-stress",
    type: "multiple",
    title: "스트레스 받을 때 나는?",
    options: ["혼자 조용히", "친구 만나서 풀기", "먹방", "잠으로 해결"],
  },
  {
    id: "m-gongpo-movie",
    type: "multiple",
    title: "공포영화 보면 나는?",
    options: ["눈 딱 감음", "소리 지름", "옆사람 붙잡음", "멀쩡하게 봄"],
  },
  {
    id: "m-jumal-achim",
    type: "multiple",
    title: "주말 아침에 눈뜨면 나는?",
    options: ["바로 일어나서 뭐라도 함", "핸드폰 보다가 다시 잠", "커피부터 내림", "정오까지 안 일어남"],
  },
  {
    id: "m-danche-sajin",
    type: "multiple",
    title: "단체 사진 찍을 때 나는?",
    options: ["항상 가운데로 감", "구석에서 조용히", "포즈 열심히 잡음", "눈 감아서 다시 찍자고 함"],
  },
  {
    id: "m-yeohaeng-jjim",
    type: "multiple",
    title: "여행 짐 쌀 때 나는?",
    options: ["며칠 전부터 리스트 작성", "전날 밤에 몰아서", "당일 아침에 대충", "캐리어 상시 대기"],
  },
  {
    id: "m-dantokbang",
    type: "multiple",
    title: "단톡방에서 나는?",
    options: ["대화 주도", "리액션 담당", "눈팅만 함", "한참 뒤에 몰아서 읽음"],
  },
  {
    id: "m-yeohaeng-yeokhal",
    type: "multiple",
    title: "같이 여행 가면 내 역할은?",
    options: ["돈 관리하는 총무", "길 찾기 담당", "사진 담당", "따라만 감"],
  },
  {
    id: "m-alarm",
    type: "multiple",
    title: "아침 알람 스타일은?",
    options: ["한 번에 일어남", "5분 간격으로 여러 개", "다시 알림 무한 반복", "알람 없이 일어남"],
  },
  {
    id: "m-siheom",
    type: "multiple",
    title: "시험이나 마감 앞두고 나는?",
    options: ["미리미리 끝냄", "벼락치기", "책상 정리부터 함", "일단 포기"],
  },
  {
    id: "m-don-billyeo",
    type: "multiple",
    title: "친구가 돈 빌려달라고 하면?",
    options: ["바로 빌려줌", "액수 보고 결정", "정중하게 거절", "그냥 줘버림"],
  },
  {
    id: "m-yeonae-jungyo",
    type: "multiple",
    title: "연애할 때 제일 중요한 건?",
    options: ["대화가 잘 통함", "외모", "경제력", "가치관"],
  },
  {
    id: "m-date",
    type: "multiple",
    title: "최고의 주말 데이트는?",
    options: ["집에서 영화", "맛집 탐방", "근교 드라이브", "전시나 공연"],
  },
  {
    id: "m-toegeun",
    type: "multiple",
    title: "퇴근하고 나서 나는?",
    options: ["바로 집 가서 누움", "운동하러 감", "약속 잡음", "자기계발"],
  },
  {
    id: "m-hoesik",
    type: "multiple",
    title: "회식 자리에서 나는?",
    options: ["1차만 하고 빠짐", "끝까지 남음", "분위기 봐서 결정", "애초에 안 감"],
  },
  {
    id: "m-toesa",
    type: "multiple",
    title: "회사 그만두고 싶어지는 순간은?",
    options: ["월요일 아침", "상사한테 혼날 때", "월급날 통장 볼 때", "딱히 없음"],
  },

  // 주관식
  {
    id: "s-first-married",
    type: "subjective",
    title: "이 그룹에서 제일 먼저 결혼할 것 같은 사람은? (이유도)",
  },
  {
    id: "s-anywhere",
    type: "subjective",
    title: "지금 당장 어디든 갈 수 있다면 어디 가고 싶어?",
  },
  {
    id: "s-want-to-say",
    type: "subjective",
    title: "이 그룹 사람들한테 하고 싶었던 말이 있다면?",
  },
  {
    id: "s-into-lately",
    type: "subjective",
    title: "요즘 꽂혀있는 것 하나만 말해봐",
  },
  {
    id: "s-ten-years",
    type: "subjective",
    title: "10년 후 나는 어디서 뭘 하고 있을 것 같아?",
  },
  {
    id: "s-choegeun-utgin",
    type: "subjective",
    title: "최근 본 것 중에 제일 웃겼던 거 하나만",
  },
  {
    id: "s-gachi-yeohaeng",
    type: "subjective",
    title: "이 그룹이랑 같이 가고 싶은 여행지 한 곳만 말해봐",
  },
  {
    id: "s-cheotinsang",
    type: "subjective",
    title: "내 첫인상은 어땠어? 솔직하게 한 줄로",
  },
  {
    id: "s-chueok",
    type: "subjective",
    title: "우리가 같이 한 일 중에 제일 기억에 남는 순간은?",
  },
  {
    id: "s-choneungryeok",
    type: "subjective",
    title: "초능력 하나를 가질 수 있다면 뭘 고를래? (이유도)",
  },
  {
    id: "s-han-eumsik",
    type: "subjective",
    title: "평생 한 가지 음식만 먹어야 한다면 뭘 고를래?",
  },
  {
    id: "s-gomin",
    type: "subjective",
    title: "요즘 제일 큰 고민 하나만 말해줘",
  },
  {
    id: "s-don-geokjeong",
    type: "subjective",
    title: "돈 걱정이 전혀 없다면 무슨 일을 하고 싶어?",
  },
];

/**
 * 방을 만들 때 "이 문항이 인기 질문에서 온 것인지" 판별하는 데 쓴다.
 * 서버가 클라이언트의 id를 그대로 믿지 않고 이 집합으로 걸러야, 사용자가 직접 쓴
 * 질문이나 조작된 값이 통계에 섞이지 않는다.
 */
export const POPULAR_QUESTION_IDS: ReadonlySet<string> = new Set(
  POPULAR_QUESTIONS.map((question) => question.id)
);

export function findPopularQuestion(id: string): PopularQuestion | null {
  return POPULAR_QUESTIONS.find((question) => question.id === id) ?? null;
}

/** 질문별 페이지(/popular/q/[id]) 경로. 목록 카드·사이트맵·관련 질문이 같이 쓴다. */
export function popularQuestionPath(id: string): string {
  return `/popular/q/${encodeURIComponent(id)}`;
}
