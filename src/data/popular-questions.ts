export type QuestionType = "balance" | "multiple" | "subjective";

/**
 * 질문 상세 페이지(/popular/q/[id])의 고유 본문. 없으면 그 자리를 아예 그리지 않는다.
 *
 * 왜 필요한가: 질문 페이지 100여 개가 제목 한 줄만 다른 같은 틀이라 구글이 전부
 * "크롤링됨 - 현재 색인이 생성되지 않음"으로 판단했다 (2026-09 Search Console 확인).
 * 실제 답변 집계는 10개 이상 모여야 나오니 그때까지 그 페이지에만 있는 문장이 하나도 없었다.
 * why는 왜 의견이 갈리는지, tip은 어떤 자리에서 쓰면 좋은지다. 두 문장 다 그 질문에만
 * 해당하는 내용이어야 한다 — 다른 질문에 그대로 옮겨 붙일 수 있으면 안 쓴 것과 같다.
 */
export interface QuestionBrief {
  why: string;
  tip: string;
}

export interface PopularQuestion {
  id: string;
  type: QuestionType;
  title: string;
  optionA?: string;
  optionB?: string;
  options?: string[];
  brief?: QuestionBrief;
}

/**
 * 인기 질문의 단일 출처. **유형 안에서의 배열 순서가 곧 순위다** — /popular가 유형별로
 * 앞에서부터 20개씩 잘라 "TOP 20"과 다음 페이지를 만든다. 순위는 커뮤니티·블로그에서
 * 가장 자주 인용되는 질문(깻잎·부먹찍먹·민초 같은 고전)을 앞에 두는 큐레이션이다.
 * 실제 답변 수로 매주 순위를 바꾸지 않는다 — 검색 진입 페이지 본문이 흔들린다.
 * id는 URL(/popular/q/[id])과 테마·주제가 참조하니 바꾸거나 지우지 말 것.
 */
export const POPULAR_QUESTIONS: PopularQuestion[] = [
  // 밸런스
  {
    id: "b-kkaennip",
    type: "balance",
    title: "애인이 내 친구 깻잎 떼어주는 거 괜찮다 vs 안 된다",
    optionA: "괜찮다",
    optionB: "안 된다",
    brief: {
      why: "한국 커뮤니티에서 가장 오래 싸운 연애 질문이다. 깻잎 한 장이 문제가 아니라 '내 사람이 남에게 베푸는 친절'을 어디까지 허용하느냐를 묻기 때문에, 평소 연애관이 그대로 드러난다.",
      tip: "커플끼리 하면 진짜 싸움이 날 수 있다. 친구들끼리 서로의 연애관을 구경하는 자리에서 꺼내는 게 안전하다.",
    },
  },
  {
    id: "b-tangsuyuk",
    type: "balance",
    title: "탕수육은 부먹 vs 찍먹",
    optionA: "부먹",
    optionB: "찍먹",
    brief: {
      why: "부먹은 소스가 배어든 맛, 찍먹은 튀김의 바삭함을 지키는 쪽이다. 취향 차이인데도 서로를 놀리기 좋아서 중식 배달 때마다 되살아난다.",
      tip: "처음 만난 사이에서도 부담 없이 갈릴 수 있는 질문이라 첫 문항으로 쓰기 좋다.",
    },
  },
  {
    id: "b-mintcho",
    type: "balance",
    title: "민트초코는 맛있다 vs 치약 맛이다",
    optionA: "맛있다",
    optionB: "치약 맛",
    brief: {
      why: "같은 향을 누구는 시원한 디저트로, 누구는 치약으로 느낀다. 중간 의견이 거의 없어서 결과가 반반으로 갈리면 그 자체로 화제가 된다.",
      tip: "디저트 고르러 가기 전에 물어보면 주문이 빨라진다.",
    },
  },
  {
    id: "b-jjajang",
    type: "balance",
    title: "짜장면 vs 짬뽕",
    optionA: "짜장면",
    optionB: "짬뽕",
    brief: {
      why: "짬짜면이 나온 뒤에도 끝나지 않은 질문이다. 매운맛과 국물을 포기할 수 있느냐가 사람마다 다르다.",
      tip: "중국집 가는 길에 단톡방에 올리면 메뉴 정하기가 대신 끝난다.",
    },
  },
  {
    id: "b-saeu",
    type: "balance",
    title: "애인이 내 친구 새우 까주는 거 괜찮다 vs 안 된다",
    optionA: "괜찮다",
    optionB: "안 된다",
    brief: {
      why: "깻잎 논쟁의 다음 단계다. 껍질을 까주는 건 손이 더 많이 가는 일이라, 깻잎은 괜찮다던 사람도 여기서 갈리곤 한다.",
      tip: "깻잎 질문과 같이 넣어서 어디서 선을 긋는지 비교해보면 재밌다.",
    },
  },
  {
    id: "b-1eok-jeolyeon",
    type: "balance",
    title: "1억 받고 절친과 영원히 절연 vs 1억 포기하고 평생 절친",
    optionA: "1억 받고 절연",
    optionB: "1억 포기하고 절친",
    brief: {
      why: "금액이 크지도 작지도 않아서 진짜 고민이 된다. 1억이면 인생이 바뀌지는 않지만 무시하기도 어려운 돈이라, 우정의 값을 각자 계산하게 만든다.",
      tip: "오래된 친구 사이에서 하면 대답보다 이유를 듣는 재미가 크다.",
    },
  },
  {
    id: "b-200man-1000man",
    type: "balance",
    title: "월급 200만원 좋아하는 일 vs 월급 1,000만원 하기 싫은 일",
    optionA: "200만원 좋아하는 일",
    optionB: "1,000만원 싫은 일",
    brief: {
      why: "직장인이 매일 하는 고민을 숫자로 못박은 질문이다. 좋아하는 일의 값을 월 800만원으로 칠 수 있느냐를 묻는다.",
      tip: "회식이나 동기 모임에서 꺼내면 서로의 직업관이 바로 드러난다.",
    },
  },
  {
    id: "b-jjaksarang",
    type: "balance",
    title: "내가 미치게 좋아하는 사람과 연애 vs 나를 미치게 좋아하는 사람과 연애",
    optionA: "내가 좋아하는 사람",
    optionB: "나를 좋아하는 사람",
    brief: {
      why: "사랑받는 편안함과 사랑하는 설렘 중 뭘 택하냐는 질문이다. 연애 경험에 따라 답이 정반대로 바뀐다.",
      tip: "연애 이야기로 자리를 데우고 싶을 때 첫 질문으로 좋다.",
    },
  },
  {
    id: "b-chicken",
    type: "balance",
    title: "치킨은 후라이드 vs 양념",
    optionA: "후라이드",
    optionB: "양념",
    brief: {
      why: "후라이드는 튀김 그대로, 양념은 소스가 주인공이다. 반반이라는 도피처가 있어서 오히려 하나만 고르라고 하면 진심이 나온다.",
      tip: "치킨 시키기 직전에 던지면 주문이 정해진다.",
    },
  },
  {
    id: "b-padding",
    type: "balance",
    title: "애인이 내 친구 롱패딩 지퍼 올려주는 거 괜찮다 vs 안 된다",
    optionA: "괜찮다",
    optionB: "안 된다",
    brief: {
      why: "깻잎, 새우에 이은 세 번째 논쟁이다. 손이 몸에 닿는다는 점 때문에 앞의 둘보다 훨씬 강하게 갈린다.",
      tip: "깻잎 질문과 묶어서 쓰면 허용선이 어디서 무너지는지 보인다.",
    },
  },
  {
    id: "b-aircon",
    type: "balance",
    title: "평생 에어컨 없는 여름 vs 평생 난방 없는 겨울",
    optionA: "에어컨 없는 여름",
    optionB: "난방 없는 겨울",
    brief: {
      why: "한국의 여름과 겨울 중 어느 쪽이 더 견딜 만한지 묻는 질문이다. 사는 지역과 체질에 따라 답이 확 갈린다.",
      tip: "계절이 바뀔 때 물어보면 지금 날씨 탓에 답이 쏠려서 더 재밌다.",
    },
  },
  {
    id: "b-tumyeong-maeum",
    type: "balance",
    title: "모든 사람이 내 속마음을 읽을 수 있음 vs 나만 모든 사람 속마음을 읽을 수 있음",
    optionA: "내 마음이 투명",
    optionB: "남의 마음이 보임",
    brief: {
      why: "남이 나를 다 아는 세상과 내가 남을 다 아는 세상 중 하나를 고르는 질문이다. 후자를 고르는 사람이 많지만 그 이유는 제각각이다.",
      tip: "가치관 질문으로 넘어가는 다리로 쓰기 좋다.",
    },
  },
  {
    id: "b-10nyeon-1eok",
    type: "balance",
    title: "지금 기억 그대로 10년 전으로 돌아가기 vs 지금 1억 받기",
    optionA: "10년 전으로",
    optionB: "지금 1억",
    brief: {
      why: "과거로 돌아가 다시 살 기회와 지금의 현금을 맞바꾸는 질문이다. 10년 전으로 돌아가고 싶은지부터 사람마다 다르다.",
      tip: "나이대가 섞인 모임에서 하면 세대별로 답이 갈리는 게 보인다.",
    },
  },
  {
    id: "b-superpower",
    type: "balance",
    title: "투명인간 되기 vs 순간이동 하기",
    optionA: "투명인간",
    optionB: "순간이동",
    brief: {
      why: "투명인간은 몰래 보는 능력, 순간이동은 시간을 버는 능력이다. 고른 쪽이 평소 뭘 아쉬워하는지 말해준다.",
      tip: "가볍게 웃고 넘어갈 수 있어서 어색한 자리 초반에 좋다.",
    },
  },
  {
    id: "b-10eok-50eok",
    type: "balance",
    title: "100% 확률로 10억 받기 vs 50% 확률로 50억 받기",
    optionA: "확실한 10억",
    optionB: "반반 확률 50억",
    brief: {
      why: "확실한 10억과 기댓값이 더 큰 도박 중 고르는 질문이다. 수학적으로는 후자가 유리한데도 절반은 안전을 택한다.",
      tip: "투자나 돈 이야기가 오가는 자리에서 성향을 확인하기 좋다.",
    },
  },
  {
    id: "b-gwageo-mirae",
    type: "balance",
    title: "딱 한 번 과거로 가보기 vs 딱 한 번 미래로 가보기",
    optionA: "과거로",
    optionB: "미래로",
    brief: {
      why: "과거는 후회를, 미래는 불안을 건드린다. 알고 싶은 쪽이 지금 무엇에 매여 있는지 보여준다.",
      tip: "연말이나 새해에 물어보면 답이 유난히 진지해진다.",
    },
  },
  {
    id: "b-yeonrak-jaemi",
    type: "balance",
    title: "연락은 잘 되는데 재미없는 애인 vs 재밌는데 연락 안 되는 애인",
    optionA: "연락 잘 되는 애인",
    optionB: "재밌는 애인",
    brief: {
      why: "연애에서 안정감과 재미 중 무엇을 포기할 수 있느냐는 질문이다. 연애 스타일이 정면으로 드러난다.",
      tip: "커플 모임보다 친구끼리 연애 성향을 비교할 때 낫다.",
    },
  },
  {
    id: "b-lotto",
    type: "balance",
    title: "로또 1등 되고 평생 아무한테도 말 못 함 vs 로또 3등 되고 마음껏 자랑",
    optionA: "1등, 비밀",
    optionB: "3등, 자랑",
    brief: {
      why: "돈보다 자랑을 포기하는 게 더 어려운 사람이 의외로 많다. 액수 차이가 커서 더 고민된다.",
      tip: "돈 이야기를 웃으면서 할 수 있게 만드는 질문이다.",
    },
  },
  {
    id: "b-gwisin-bakwi",
    type: "balance",
    title: "자다 깼는데 방에 귀신 vs 자다 깼는데 얼굴 위에 바퀴벌레",
    optionA: "귀신",
    optionB: "바퀴벌레",
    brief: {
      why: "무서움과 징그러움 중 어느 쪽을 덜 견디는지 묻는다. 논리가 필요 없어서 답이 즉각 나온다.",
      tip: "MT나 밤늦은 자리에서 분위기 띄우기 좋다.",
    },
  },
  {
    id: "b-seontok-katok",
    type: "balance",
    title: "선톡 절대 안 하는 애인 vs 하루종일 카톡 폭격하는 애인",
    optionA: "선톡 안 하는 애인",
    optionB: "카톡 폭격 애인",
    brief: {
      why: "연락이 너무 없는 쪽과 너무 많은 쪽, 둘 다 피곤한데 하나를 골라야 한다. 연락 빈도에 대한 기준이 서로 다르다는 게 드러난다.",
      tip: "연애 중인 친구들끼리 하면 각자의 불만이 자연스럽게 나온다.",
    },
  },
  {
    id: "b-gonggam-haegyeol",
    type: "balance",
    title: "고민 말하면 공감만 해주는 애인 vs 해결책만 말해주는 애인",
    optionA: "공감만",
    optionB: "해결책만",
    brief: {
      why: "힘들 때 원하는 게 위로인지 답인지가 사람마다 다르다. 서로 반대를 고른 커플이 가장 자주 부딪히는 지점이기도 하다.",
      tip: "연애 중인 친구들끼리 하면 각자 서운했던 이유가 설명된다.",
    },
  },
  {
    id: "b-jeon-aein",
    type: "balance",
    title: "내가 친구의 전 애인과 사귀기 vs 친구가 내 전 애인과 사귀기",
    optionA: "내가 친구 전 애인과",
    optionB: "친구가 내 전 애인과",
    brief: {
      why: "내가 하면 괜찮고 남이 하면 안 된다는 마음이 그대로 드러나는 질문이다. 두 상황이 사실상 같은데도 답이 갈린다.",
      tip: "친구 관계가 얽힌 이야기라 농담으로 시작해도 진지해지기 쉽다.",
    },
  },
  {
    id: "b-yeosachin-sul",
    type: "balance",
    title: "애인이 이성 친구와 단둘이 술 마시는 거 괜찮다 vs 안 된다",
    optionA: "괜찮다",
    optionB: "안 된다",
    brief: {
      why: "이성 친구를 어디까지 인정하느냐를 묻는다. 술자리라는 조건 하나로 답이 크게 움직인다.",
      tip: "깻잎 질문보다 현실적이라 연애관 비교에 더 잘 쓰인다.",
    },
  },
  {
    id: "b-honja-gachi",
    type: "balance",
    title: "평생 혼자지만 원하는 모든 것을 가짐 vs 사랑하는 사람과 함께지만 항상 가난",
    optionA: "혼자지만 풍요",
    optionB: "함께지만 가난",
    brief: {
      why: "돈과 사람 중 무엇을 포기할 수 있느냐는 오래된 질문이다. 가난의 기준을 각자 다르게 상상해서 답도 갈린다.",
      tip: "가치관 질문을 모을 때 마지막 문항으로 두면 여운이 남는다.",
    },
  },
  {
    id: "b-ramyeon-chicken",
    type: "balance",
    title: "평생 라면 못 먹기 vs 평생 치킨 못 먹기",
    optionA: "라면 포기",
    optionB: "치킨 포기",
    brief: {
      why: "둘 다 자주 먹는 음식이라 상상이 바로 된다. 야식 습관에 따라 답이 정해지는 편이다.",
      tip: "배달 앱을 켜기 전에 던지면 반응이 제일 크다.",
    },
  },
  {
    id: "b-phone-friend",
    type: "balance",
    title: "1년 동안 스마트폰 없이 살기 vs 1년 동안 친구 못 만나기",
    optionA: "스마트폰 없이",
    optionB: "친구 없이",
    brief: {
      why: "스마트폰이 곧 친구와의 연결이라 두 선택지가 사실 겹친다. 그 점을 깨닫는 순간이 이 질문의 재미다.",
      tip: "스마트폰을 오래 쥐고 있는 모임에서 하면 말이 많아진다.",
    },
  },
  {
    id: "b-dog-cat",
    type: "balance",
    title: "평생 한 마리만 키운다면 강아지 vs 고양이",
    optionA: "강아지",
    optionB: "고양이",
    brief: {
      why: "반려동물 취향은 잘 안 바뀌고, 고른 이유가 생활 방식을 그대로 말해준다.",
      tip: "처음 만난 사이에서도 안전하게 이야기가 이어지는 질문이다.",
    },
  },
  {
    id: "b-sanbada",
    type: "balance",
    title: "여행지 고르면 산 vs 바다",
    optionA: "산",
    optionB: "바다",
    brief: {
      why: "휴가 스타일이 갈리는 지점이다. 쉬러 가는지 움직이러 가는지가 답에 드러난다.",
      tip: "여행 계획을 세우기 전에 물어보면 목적지 후보가 정리된다.",
    },
  },
  {
    id: "b-dapjang",
    type: "balance",
    title: "1초 만에 오는 단답 vs 3시간 뒤에 오는 장문 답장",
    optionA: "빠른 단답",
    optionB: "느린 장문",
    brief: {
      why: "답장의 속도와 정성 중 무엇을 더 치는지 묻는다. 연락 방식 때문에 서운했던 경험이 답을 가른다.",
      tip: "카톡 습관 질문들과 묶으면 한 세트가 된다.",
    },
  },
  {
    id: "b-cheotnun-chingu",
    type: "balance",
    title: "첫눈에 반한 사람과 연애 vs 오래 알던 친구와 연애",
    optionA: "첫눈에 반한 사람",
    optionB: "오래된 친구",
    brief: {
      why: "설렘으로 시작할지 신뢰로 시작할지의 문제다. 연애 경험이 쌓일수록 후자로 옮겨가는 사람이 많다.",
      tip: "오래 알고 지낸 친구들끼리 하면 묘하게 조용해진다.",
    },
  },
  {
    id: "b-gobaek",
    type: "balance",
    title: "짝사랑 고백하고 차이기 vs 고백 못 하고 평생 궁금해하기",
    optionA: "고백하고 차이기",
    optionB: "평생 궁금해하기",
    brief: {
      why: "차이는 아픔과 모르는 채로 남는 답답함 중 하나를 고른다. 후회의 종류가 다르다.",
      tip: "짝사랑 이야기가 나올 만한 자리에서 꺼내기 좋다.",
    },
  },
  {
    id: "b-kkamjjak-pyohyeon",
    type: "balance",
    title: "기념일마다 깜짝 이벤트 해주는 애인 vs 이벤트는 없지만 매일 표현해주는 애인",
    optionA: "깜짝 이벤트",
    optionB: "매일 표현",
    brief: {
      why: "큰 이벤트 한 번과 매일의 표현 중 무엇이 사랑으로 느껴지는지 묻는다. 받고 싶은 방식이 서로 다르다.",
      tip: "기념일이 다가올 때 물어보면 실제로 참고가 된다.",
    },
  },
  {
    id: "b-ju4il",
    type: "balance",
    title: "주 4일 근무에 월급 20% 삭감 vs 주 5일 근무에 월급 그대로",
    optionA: "주 4일, 20% 삭감",
    optionB: "주 5일, 그대로",
    brief: {
      why: "시간과 돈의 교환비를 숫자로 물어본다. 20%라는 폭이 현실적이라 진지하게 고민하게 된다.",
      tip: "직장인 모임에서 하면 답보다 이유가 훨씬 길어진다.",
    },
  },
  {
    id: "b-dongryo",
    type: "balance",
    title: "일 잘하는데 성격 나쁜 동료 vs 착한데 일 못하는 동료",
    optionA: "일 잘하는 동료",
    optionB: "착한 동료",
    brief: {
      why: "같이 일할 때 실력과 성격 중 무엇을 더 참을 수 있는지 묻는다. 직급과 경험에 따라 답이 바뀐다.",
      tip: "팀 회식이나 동기 모임에서 특히 반응이 갈린다.",
    },
  },
  {
    id: "b-yeonbong-anjeong",
    type: "balance",
    title: "연봉 2배지만 언제 망할지 모르는 회사 vs 지금 연봉에 정년 보장",
    optionA: "연봉 2배, 불안정",
    optionB: "정년 보장",
    brief: {
      why: "안정과 보상 중 무엇을 택하는지 묻는 질문이다. 나이와 상황에 따라 답이 정반대가 된다.",
      tip: "이직 이야기가 오가는 자리에서 자연스럽게 이어진다.",
    },
  },
  {
    id: "b-bihaenggi-sukso",
    type: "balance",
    title: "평생 비행기표 공짜 vs 평생 숙소 공짜",
    optionA: "비행기표 공짜",
    optionB: "숙소 공짜",
    brief: {
      why: "여행에서 이동과 머무름 중 어디에 돈을 쓰는지가 드러난다. 여행 빈도에 따라 답이 갈린다.",
      tip: "여행 좋아하는 사람들끼리 하면 계획 이야기로 번진다.",
    },
  },
  {
    id: "b-sowon-changpi",
    type: "balance",
    title: "친구 10명한테 욕먹는 소문 퍼짐 vs SNS에서 1만 명한테 공개 망신",
    optionA: "친구들한테 욕",
    optionB: "1만 명 공개 망신",
    brief: {
      why: "가까운 사람들의 미움과 모르는 다수의 조롱 중 무엇이 더 견디기 힘든지 묻는다.",
      tip: "SNS를 많이 쓰는 모임에서 특히 답이 갈린다.",
    },
  },
  {
    id: "b-achim-jeonyeok",
    type: "balance",
    title: "새벽 5시에 일어나는 아침형 vs 새벽 3시에 자는 저녁형",
    optionA: "아침형",
    optionB: "저녁형",
    brief: {
      why: "생활 리듬은 의지보다 체질에 가깝다. 반대 성향끼리는 같이 여행 가면 바로 부딪힌다.",
      tip: "같이 여행이나 합숙을 앞두고 물어보면 일정 짜기가 쉬워진다.",
    },
  },
  {
    id: "b-bus",
    type: "balance",
    title: "꽉 찬 버스로 30분 vs 텅 빈 버스로 1시간 30분",
    optionA: "꽉 찬 30분",
    optionB: "텅 빈 1시간 30분",
    brief: {
      why: "시간을 아낄지 편함을 살지 고르는 질문이다. 출퇴근 경험이 답을 좌우한다.",
      tip: "통근 이야기가 나올 때 꺼내면 공감이 몰린다.",
    },
  },
  {
    id: "b-cola-gamja",
    type: "balance",
    title: "김 빠진 콜라 vs 눅눅한 감자튀김",
    optionA: "김 빠진 콜라",
    optionB: "눅눅한 감자튀김",
    brief: {
      why: "둘 다 최악인데 하나를 골라야 해서 웃으면서 진지해진다. 탄산과 바삭함 중 무엇을 더 치는지의 문제다.",
      tip: "음식 질문들 사이에 넣으면 분위기가 가벼워진다.",
    },
  },
  {
    id: "b-ramyeon",
    type: "balance",
    title: "라면은 꼬들꼬들한 면 vs 푹 퍼진 면",
    optionA: "꼬들면",
    optionB: "퍼진 면",
    brief: {
      why: "면 삶는 시간 1분 차이로 집집마다 싸움이 난다. 같이 끓여 먹을 때 바로 부딪히는 취향이다.",
      tip: "같이 라면 끓이기 전에 정해두면 평화롭다.",
    },
  },
  {
    id: "b-bungeoppang",
    type: "balance",
    title: "붕어빵 먹을 때 머리부터 vs 꼬리부터",
    optionA: "머리부터",
    optionB: "꼬리부터",
    brief: {
      why: "먹는 순서에 이유가 없는데도 다들 확고하다. 그래서 결과가 갈리면 더 웃기다.",
      tip: "겨울 간식 이야기와 같이 쓰면 좋다.",
    },
  },
  {
    id: "b-naengmyeon",
    type: "balance",
    title: "냉면은 물냉면 vs 비빔냉면",
    optionA: "물냉면",
    optionB: "비빔냉면",
    brief: {
      why: "국물로 시원하게 갈지 매운맛으로 갈지의 차이다. 고깃집에서 매번 반복되는 선택이다.",
      tip: "여름 모임이나 고깃집 가기 전에 쓰기 좋다.",
    },
  },
  {
    id: "b-sundae",
    type: "balance",
    title: "순대 찍어 먹을 때 소금 vs 쌈장",
    optionA: "소금",
    optionB: "쌈장",
    brief: {
      why: "지역과 자란 환경에 따라 당연하다고 생각하는 쪽이 다르다. 그래서 서로 놀란다.",
      tip: "출신 지역이 섞인 모임에서 하면 이야기가 커진다.",
    },
  },
  {
    id: "b-syawo",
    type: "balance",
    title: "샤워는 아침에 vs 자기 전에",
    optionA: "아침 샤워",
    optionB: "자기 전 샤워",
    brief: {
      why: "씻는 시점은 생활 습관이자 위생 기준이라 서로 못 바꾼다. 같이 사는 사이에서 자주 부딪힌다.",
      tip: "여행이나 합숙 전에 물어보면 욕실 순서를 정하기 쉽다.",
    },
  },
  {
    id: "b-yeohaeng-style",
    type: "balance",
    title: "여행 스타일: 빡빡한 일정표 vs 그때그때 즉흥",
    optionA: "일정표파",
    optionB: "즉흥파",
    brief: {
      why: "계획형과 즉흥형은 같이 여행 가면 반드시 부딪힌다. 미리 알아두는 게 이득이다.",
      tip: "여행 계획을 짜기 전에 제일 먼저 물어볼 질문이다.",
    },
  },
  {
    id: "b-camping-hocance",
    type: "balance",
    title: "주말 여행은 캠핑 vs 호캉스",
    optionA: "캠핑",
    optionB: "호캉스",
    brief: {
      why: "쉬는 방식이 정반대다. 불편함을 감수하고 얻는 것과 편하게 얻는 것 중 무엇을 택하는지가 보인다.",
      tip: "주말 계획을 정할 때 바로 결론이 난다.",
    },
  },
  {
    id: "b-sukso-meokgi",
    type: "balance",
    title: "여행 가면 숙소에 돈 쓰기 vs 먹는 데 돈 쓰기",
    optionA: "숙소에 투자",
    optionB: "먹는 데 투자",
    brief: {
      why: "여행 예산을 어디에 몰아주는지가 드러난다. 같이 가는 사람끼리 다르면 여행 내내 신경 쓰인다.",
      tip: "여행 경비를 나누기 전에 맞춰두면 좋다.",
    },
  },
  {
    id: "b-maeil-juil",
    type: "balance",
    title: "애인과 매일 잠깐씩 만나기 vs 일주일에 한 번 하루 종일 만나기",
    optionA: "매일 잠깐씩",
    optionB: "주 1회 하루 종일",
    brief: {
      why: "연애에서 빈도와 밀도 중 무엇을 택하는지 묻는다. 거리와 일정에 따라 현실적인 답이 갈린다.",
      tip: "장거리 연애를 해본 사람들 사이에서 답이 뚜렷해진다.",
    },
  },
  {
    id: "b-sagwa",
    type: "balance",
    title: "싸우고 나서 내가 먼저 사과하기 vs 상대가 사과할 때까지 기다리기",
    optionA: "먼저 사과",
    optionB: "기다리기",
    brief: {
      why: "자존심과 관계 회복 속도 사이의 문제다. 늘 먼저 사과하는 쪽은 지쳤다고 말하기도 한다.",
      tip: "오래된 커플이나 친구 사이에서 이야기가 깊어진다.",
    },
  },
  {
    id: "b-jaetaek",
    type: "balance",
    title: "평생 재택근무 vs 평생 사무실 출근",
    optionA: "평생 재택",
    optionB: "평생 출근",
    brief: {
      why: "출퇴근 시간과 사람 사이의 거리 중 무엇을 포기할지 묻는다. 재택을 해본 사람과 아닌 사람의 답이 다르다.",
      tip: "직장인 모임에서 요즘 가장 말이 많은 주제다.",
    },
  },
  {
    id: "b-sangsa",
    type: "balance",
    title: "매일 칭찬하는데 연봉 동결 vs 매일 잔소리하는데 연봉 20% 인상",
    optionA: "칭찬, 연봉 동결",
    optionB: "잔소리, 연봉 인상",
    brief: {
      why: "기분 좋은 직장과 돈 되는 직장 중 하나를 고르는 질문이다. 20%라는 숫자가 고민을 진짜로 만든다.",
      tip: "이직이나 연봉 이야기와 이어 붙이기 좋다.",
    },
  },
  {
    id: "b-hoesik-menu",
    type: "balance",
    title: "점심에 끝나는 파스타 회식 vs 저녁까지 가는 한우 회식",
    optionA: "점심 파스타",
    optionB: "저녁 한우",
    brief: {
      why: "메뉴보다 끝나는 시간이 진짜 쟁점이다. 회식을 어떻게 생각하는지가 드러난다.",
      tip: "회식 날짜를 잡기 전에 물어보면 원성이 줄어든다.",
    },
  },
  {
    id: "b-eoneo-akgi",
    type: "balance",
    title: "세상 모든 언어 하기 vs 세상 모든 악기 연주하기",
    optionA: "모든 언어",
    optionB: "모든 악기",
    brief: {
      why: "소통의 능력과 표현의 능력 중 무엇을 갖고 싶은지 묻는다. 여행을 좋아하는 사람은 전자로 몰린다.",
      tip: "가벼운 상상 질문이라 초반 분위기를 푸는 데 좋다.",
    },
  },
  {
    id: "b-yori-seolgeoji",
    type: "balance",
    title: "MT 가서 요리 담당 vs 설거지 담당",
    optionA: "요리 담당",
    optionB: "설거지 담당",
    brief: {
      why: "생색나는 일과 티 안 나는 일 중 무엇을 맡을지 묻는다. 요리 실력보다 성향이 답을 정한다.",
      tip: "MT나 워크숍 역할을 나누기 전에 쓰면 실제로 편하다.",
    },
  },
  {
    id: "b-chuksa-chukga",
    type: "balance",
    title: "친구 결혼식에서 축사 하기 vs 축가 부르기",
    optionA: "축사",
    optionB: "축가",
    brief: {
      why: "말로 떠는 긴장과 노래로 떠는 긴장 중 어느 쪽을 견딜 수 있는지 묻는다. 둘 다 싫다는 반응이 제일 많다.",
      tip: "결혼식이 잦아지는 나이대 모임에서 반응이 좋다.",
    },
  },
  // 객관식
  {
    id: "m-katok-wass",
    type: "multiple",
    title: "카톡 왔을 때 나는?",
    options: ["즉시 답장", "읽고 나중에 답장", "읽씹할 때 있음", "알림 꺼놓음"],
    brief: {
      why: "답장 속도는 성격이자 예의 기준이라 서로 다른 게 자주 오해를 만든다.",
      tip: "단톡방 사람들끼리 하면 서운했던 이유가 설명된다.",
    },
  },
  {
    id: "m-yaksok-sigan",
    type: "multiple",
    title: "약속 시간 나는?",
    options: ["30분 전 도착", "딱 맞게 도착", "5~10분 지각", "항상 30분+ 지각"],
    brief: {
      why: "약속 시간에 대한 감각은 좀처럼 안 바뀐다. 늘 늦는 사람과 늘 일찍 오는 사람이 한 모임에 있으면 매번 같은 일이 반복된다.",
      tip: "여행이나 모임 계획을 짜기 전에 물어보면 집합 시간을 현실적으로 잡을 수 있다.",
    },
  },
  {
    id: "m-yeonae-jungyo",
    type: "multiple",
    title: "연애할 때 제일 중요한 건?",
    options: ["대화가 잘 통함", "외모", "경제력", "가치관"],
    brief: {
      why: "연애에서 무엇을 1순위로 두는지에 따라 잘 맞는 사람이 완전히 달라진다.",
      tip: "소개팅이나 커플 모임 전에 하면 대화가 깊어진다.",
    },
  },
  {
    id: "m-10eok",
    type: "multiple",
    title: "10억 생기면 가장 먼저?",
    options: ["집 구매", "세계 일주", "투자·사업", "부모님께 드림"],
    brief: {
      why: "큰돈이 생겼을 때 제일 먼저 떠오르는 것이 그 사람의 현재 걱정이다.",
      tip: "돈 이야기를 무겁지 않게 시작할 수 있는 질문이다.",
    },
  },
  {
    id: "m-animal",
    type: "multiple",
    title: "나를 동물에 비유하면?",
    options: ["강아지", "고양이", "곰", "여우"],
    brief: {
      why: "자기가 생각하는 나와 남이 보는 나가 가장 크게 어긋나는 질문이다.",
      tip: "결과를 보고 서로 다르게 고른 이유를 물어보면 이야기가 길어진다.",
    },
  },
  {
    id: "m-position",
    type: "multiple",
    title: "우리 그룹에서 내 포지션은?",
    options: ["분위기 메이커", "조용한 관찰자", "분위기 파악러", "중재자"],
    brief: {
      why: "모임에는 분위기를 만드는 사람, 챙기는 사람, 지켜보는 사람이 있다. 본인 생각과 남의 평가가 다를 때 가장 재밌다.",
      tip: "동아리나 팀 모임에서 서로의 역할을 확인할 때 좋다.",
    },
  },
  {
    id: "m-galdeung",
    type: "multiple",
    title: "갈등 생기면 나는?",
    options: ["바로 직접 말함", "삭히다가 폭발함", "그냥 넘어감", "슬쩍 멀어짐"],
    brief: {
      why: "갈등 앞에서 부딪히는지 피하는지는 관계가 오래갈수록 크게 작용한다.",
      tip: "같이 일하거나 오래 볼 사람들과 해보면 도움이 된다.",
    },
  },
  {
    id: "m-stress",
    type: "multiple",
    title: "스트레스 받을 때 나는?",
    options: ["혼자 조용히", "친구 만나서 풀기", "먹방", "잠으로 해결"],
    brief: {
      why: "푸는 방식이 다르면 힘들 때 서로를 돕는 방법도 달라진다.",
      tip: "힘든 시기를 같이 지나는 사람들끼리 물어보기 좋다.",
    },
  },
  {
    id: "m-dantokbang",
    type: "multiple",
    title: "단톡방에서 나는?",
    options: ["대화 주도", "리액션 담당", "눈팅만 함", "한참 뒤에 몰아서 읽음"],
    brief: {
      why: "읽고 마는 사람, 대화를 끌고 가는 사람이 한 방에 섞여 있다. 각자 자기 위치를 어떻게 보는지가 갈린다.",
      tip: "단톡방이 조용해졌을 때 던지면 대화가 다시 붙는다.",
    },
  },
  {
    id: "m-don-billyeo",
    type: "multiple",
    title: "친구가 돈 빌려달라고 하면?",
    options: ["바로 빌려줌", "액수 보고 결정", "정중하게 거절", "그냥 줘버림"],
    brief: {
      why: "돈 앞에서 관계를 어떻게 다루는지가 그대로 나온다. 금액보다 기준이 사람마다 다르다.",
      tip: "가까운 사이일수록 미리 얘기해두면 좋은 주제다.",
    },
  },
  {
    id: "m-date",
    type: "multiple",
    title: "최고의 주말 데이트는?",
    options: ["집에서 영화", "맛집 탐방", "근교 드라이브", "전시나 공연"],
    brief: {
      why: "쉬는 데이트와 움직이는 데이트 중 무엇이 좋은 주말인지가 사람마다 다르다. 연애 스타일이 그대로 보인다.",
      tip: "주말 계획을 정하기 전에 물어보면 실제로 참고가 된다.",
    },
  },
  {
    id: "m-yaesik",
    type: "multiple",
    title: "야식 딱 하나만 고르면?",
    options: ["치킨", "피자", "족발", "떡볶이"],
    brief: {
      why: "배가 고플 때 제일 먼저 떠오르는 것이 취향의 본심이다. 하나만 고르라고 해야 답이 나온다.",
      tip: "야식 주문 직전에 던지면 메뉴가 바로 정해진다.",
    },
  },
  {
    id: "m-choeak-sseulsaram",
    type: "multiple",
    title: "제일 참기 힘든 사람은?",
    options: ["약속마다 늦는 사람", "말 끊는 사람", "쩝쩝거리는 사람", "읽씹하는 사람"],
    brief: {
      why: "무엇을 못 참는지는 그 사람이 중요하게 여기는 예의가 무엇인지를 말해준다.",
      tip: "결과를 보고 나면 서로 조심하게 되는 효과도 있다.",
    },
  },
  {
    id: "m-gongpo-movie",
    type: "multiple",
    title: "공포영화 보면 나는?",
    options: ["눈 딱 감음", "소리 지름", "옆사람 붙잡음", "멀쩡하게 봄"],
    brief: {
      why: "무서움을 처리하는 방식이 제각각이라 같이 보면 그 차이가 바로 드러난다.",
      tip: "같이 영화 보러 가기 전에 물어보면 자리 배치가 정해진다.",
    },
  },
  {
    id: "m-hoesik",
    type: "multiple",
    title: "회식 자리에서 나는?",
    options: ["1차만 하고 빠짐", "끝까지 남음", "분위기 봐서 결정", "애초에 안 감"],
    brief: {
      why: "회식을 일로 보는지 자리로 보는지가 갈린다. 직급과 나이에 따라 답이 다르다.",
      tip: "회식을 기획하는 사람이 미리 알아두면 좋은 질문이다.",
    },
  },
  {
    id: "m-alarm",
    type: "multiple",
    title: "아침 알람 스타일은?",
    options: ["한 번에 일어남", "5분 간격으로 여러 개", "다시 알림 무한 반복", "알람 없이 일어남"],
    brief: {
      why: "아침을 여는 방식은 잘 안 바뀌고, 같이 자는 사람에게 바로 영향을 준다.",
      tip: "여행이나 합숙 전에 물어보면 아침 풍경이 예상된다.",
    },
  },
  {
    id: "m-siheom",
    type: "multiple",
    title: "시험이나 마감 앞두고 나는?",
    options: ["미리미리 끝냄", "벼락치기", "책상 정리부터 함", "일단 포기"],
    brief: {
      why: "마감 앞에서 어떻게 움직이는지가 일하는 방식 그 자체다. 벼락치기파와 미리파는 같이 일하면 부딪힌다.",
      tip: "팀 과제나 협업을 시작하기 전에 맞춰두면 좋다.",
    },
  },
  {
    id: "m-yeohaeng-yeokhal",
    type: "multiple",
    title: "같이 여행 가면 내 역할은?",
    options: ["돈 관리하는 총무", "길 찾기 담당", "사진 담당", "따라만 감"],
    brief: {
      why: "여행에서 맡는 역할은 매번 비슷하게 정해진다. 아무도 총무를 안 하겠다고 하면 그게 또 답이다.",
      tip: "여행 준비를 시작할 때 역할 나누기로 바로 쓸 수 있다.",
    },
  },
  {
    id: "m-seonmul",
    type: "multiple",
    title: "제일 받고 싶은 선물은?",
    options: ["현금", "손편지", "갖고 싶던 물건", "여행이나 공연"],
    brief: {
      why: "받고 싶은 선물에는 실용을 치는지 마음을 치는지가 드러난다.",
      tip: "생일이 다가오는 사람이 있을 때 물어보면 유용하다.",
    },
  },
  {
    id: "m-toegeun",
    type: "multiple",
    title: "퇴근하고 나서 나는?",
    options: ["바로 집 가서 누움", "운동하러 감", "약속 잡음", "자기계발"],
    brief: {
      why: "퇴근 후의 시간을 쓰는 방식이 곧 요즘 체력과 여유를 말해준다.",
      tip: "직장인 모임에서 근황을 묻는 대신 쓰기 좋다.",
    },
  },
  {
    id: "m-gibun-nalssi",
    type: "multiple",
    title: "요즘 내 기분을 날씨로 치면?",
    options: ["맑음", "구름 조금", "비", "태풍"],
    brief: {
      why: "기분을 직접 말하긴 어려워도 날씨로는 말할 수 있다. 태풍이 나오면 대화가 그쪽으로 이어진다.",
      tip: "안부를 조심스럽게 묻고 싶을 때 좋은 질문이다.",
    },
  },
  {
    id: "m-noraebang",
    type: "multiple",
    title: "노래방 가면 나는?",
    options: ["마이크 안 놓음", "탬버린 담당", "듣기만 함", "발라드만 부름"],
    brief: {
      why: "노래방에서의 역할은 성격이 가장 솔직하게 나오는 자리다.",
      tip: "회식이나 모임 2차를 앞두고 물어보면 재밌다.",
    },
  },
  {
    id: "m-yeonrak-bindo",
    type: "multiple",
    title: "애인과 연락은 어느 정도가 적당해?",
    options: ["수시로", "하루 몇 번", "자기 전에 한 번", "필요할 때만"],
    brief: {
      why: "연락 빈도에 정답은 없지만 서로 다르면 매번 서운해진다. 기대치를 말로 확인하는 질문이다.",
      tip: "연애 이야기가 오가는 모임에서 특히 잘 붙는다.",
    },
  },
  {
    id: "m-jumal-achim",
    type: "multiple",
    title: "주말 아침에 눈뜨면 나는?",
    options: ["바로 일어나서 뭐라도 함", "핸드폰 보다가 다시 잠", "커피부터 내림", "정오까지 안 일어남"],
    brief: {
      why: "주말 아침을 어떻게 시작하는지가 쉬는 방식의 차이를 만든다.",
      tip: "같이 여행 가는 사람들끼리 확인해두면 좋다.",
    },
  },
  {
    id: "m-danche-sajin",
    type: "multiple",
    title: "단체 사진 찍을 때 나는?",
    options: ["항상 가운데로 감", "구석에서 조용히", "포즈 열심히 잡음", "눈 감아서 다시 찍자고 함"],
    brief: {
      why: "카메라 앞에서의 태도는 좀처럼 안 바뀐다. 매번 같은 자리에 서는 이유가 설명된다.",
      tip: "단체 사진을 자주 찍는 모임에서 반응이 좋다.",
    },
  },
  {
    id: "m-yeohaeng-jjim",
    type: "multiple",
    title: "여행 짐 쌀 때 나는?",
    options: ["며칠 전부터 리스트 작성", "전날 밤에 몰아서", "당일 아침에 대충", "캐리어 상시 대기"],
    brief: {
      why: "짐 싸는 시점은 계획 성향을 그대로 보여준다. 당일 아침파와 리스트파는 출발 전부터 다르다.",
      tip: "여행 전날 단톡방에 올리기 좋은 질문이다.",
    },
  },
  {
    id: "m-hyuga",
    type: "multiple",
    title: "일주일 휴가가 생기면?",
    options: ["해외여행", "국내 여행", "집에서 푹 쉬기", "밀린 일 처리"],
    brief: {
      why: "휴가를 회복에 쓰는지 경험에 쓰는지가 갈린다. 요즘 얼마나 지쳤는지도 드러난다.",
      tip: "연차 계획을 세우는 시기에 물어보면 좋다.",
    },
  },
  {
    id: "m-toesa",
    type: "multiple",
    title: "회사 그만두고 싶어지는 순간은?",
    options: ["월요일 아침", "상사한테 혼날 때", "월급날 통장 볼 때", "딱히 없음"],
    brief: {
      why: "그만두고 싶어지는 순간이 언제인지는 지금 무엇이 가장 힘든지를 말해준다.",
      tip: "직장인끼리는 말을 꺼내기만 해도 공감이 몰린다.",
    },
  },
  // 주관식
  {
    id: "s-first-married",
    type: "subjective",
    title: "이 그룹에서 제일 먼저 결혼할 것 같은 사람은? (이유도)",
    brief: {
      why: "근거 없이 지목하는 재미와 그 이유를 듣는 재미가 동시에 있다. 이유가 본론이다.",
      tip: "결혼식이 늘어나는 나이대 모임에서 반응이 제일 좋다.",
    },
  },
  {
    id: "s-cheotinsang",
    type: "subjective",
    title: "내 첫인상은 어땠어? 솔직하게 한 줄로",
    brief: {
      why: "첫인상은 본인만 모른다. 지금과 얼마나 달라졌는지 듣는 게 이 질문의 핵심이다.",
      tip: "알고 지낸 지 오래된 사이일수록 답이 재밌어진다.",
    },
  },
  {
    id: "s-want-to-say",
    type: "subjective",
    title: "이 그룹 사람들한테 하고 싶었던 말이 있다면?",
    brief: {
      why: "평소에 꺼내기 어려웠던 말을 글로 남길 자리를 만들어준다.",
      tip: "모임 마지막 질문으로 두면 분위기가 정리된다.",
    },
  },
  {
    id: "s-ten-years",
    type: "subjective",
    title: "10년 후 나는 어디서 뭘 하고 있을 것 같아?",
    brief: {
      why: "막연한 미래를 구체적으로 말해보게 만든다. 답이 진로 이야기로 이어진다.",
      tip: "연말이나 졸업 시즌에 하기 좋다.",
    },
  },
  {
    id: "s-anywhere",
    type: "subjective",
    title: "지금 당장 어디든 갈 수 있다면 어디 가고 싶어?",
    brief: {
      why: "가고 싶은 곳에는 지금 무엇에서 벗어나고 싶은지가 묻어난다.",
      tip: "여행 계획을 세우기 전 후보를 모으는 데도 쓸 수 있다.",
    },
  },
  {
    id: "s-three-words",
    type: "subjective",
    title: "나를 세 단어로 소개한다면?",
    brief: {
      why: "자기를 압축해야 해서 짧지만 오래 고민하게 된다.",
      tip: "새로 모인 사람들의 자기소개 대신 쓰기 좋다.",
    },
  },
  {
    id: "s-into-lately",
    type: "subjective",
    title: "요즘 꽂혀있는 것 하나만 말해봐",
    brief: {
      why: "요즘 관심사는 근황을 묻는 것보다 훨씬 구체적인 답이 나온다.",
      tip: "오랜만에 모인 자리에서 대화를 시작하기 좋다.",
    },
  },
  {
    id: "s-choneungryeok",
    type: "subjective",
    title: "초능력 하나를 가질 수 있다면 뭘 고를래? (이유도)",
    brief: {
      why: "고른 능력보다 이유에 그 사람의 불편함이 들어 있다.",
      tip: "가볍게 웃다가 의외로 진지해지는 질문이다.",
    },
  },
  {
    id: "s-don-geokjeong",
    type: "subjective",
    title: "돈 걱정이 전혀 없다면 무슨 일을 하고 싶어?",
    brief: {
      why: "돈이라는 조건을 지우면 진짜 하고 싶은 일이 남는다.",
      tip: "진로 고민이 많은 시기에 서로 답을 나누기 좋다.",
    },
  },
  {
    id: "s-chueok",
    type: "subjective",
    title: "우리가 같이 한 일 중에 제일 기억에 남는 순간은?",
    brief: {
      why: "같은 시간을 각자 다르게 기억한다는 걸 확인하게 된다.",
      tip: "오래된 모임의 마무리 질문으로 좋다.",
    },
  },
  {
    id: "s-childhood-dream",
    type: "subjective",
    title: "어릴 때 꿈은 뭐였어?",
    brief: {
      why: "어릴 때 꿈과 지금의 일이 얼마나 멀어졌는지 비교하게 된다. 답보다 그 뒤의 이야기가 길다.",
      tip: "오래 알고 지낸 사이에서 서로의 과거를 꺼내기 좋다.",
    },
  },
  {
    id: "s-gachi-yeohaeng",
    type: "subjective",
    title: "이 그룹이랑 같이 가고 싶은 여행지 한 곳만 말해봐",
    brief: {
      why: "가고 싶은 곳을 각자 말하게 해서 실제 계획으로 이어진다.",
      tip: "여행 후보지를 모을 때 투표 대신 쓰기 좋다.",
    },
  },
  {
    id: "s-han-eumsik",
    type: "subjective",
    title: "평생 한 가지 음식만 먹어야 한다면 뭘 고를래?",
    brief: {
      why: "평생이라는 조건이 붙으면 좋아하는 음식과 질리지 않는 음식이 갈린다.",
      tip: "밥 먹으러 가기 전 가볍게 던지기 좋다.",
    },
  },
  {
    id: "s-choegeun-utgin",
    type: "subjective",
    title: "최근 본 것 중에 제일 웃겼던 거 하나만",
    brief: {
      why: "요즘 뭘 보고 사는지가 자연스럽게 공유된다. 링크나 짤이 오가면서 대화가 이어진다.",
      tip: "단톡방이 조용할 때 던지면 반응이 가장 빠르다.",
    },
  },
  {
    id: "s-gomin",
    type: "subjective",
    title: "요즘 제일 큰 고민 하나만 말해줘",
    brief: {
      why: "평소 꺼내기 어려운 이야기를 각자 글로 적게 만든다. 먼저 답을 마쳐야 남의 답이 열리니 눈치 보고 쓰지 않는다.",
      tip: "가까운 사이에서만 쓰는 게 좋다.",
    },
  },
  {
    id: "s-proud",
    type: "subjective",
    title: "올해 제일 잘한 일 하나만 자랑해줘",
    brief: {
      why: "잘한 일을 스스로 인정하게 만드는 질문이다. 답하면서 한 해를 정리하게 된다.",
      tip: "연말 모임의 마무리 질문으로 좋다.",
    },
  },
  {
    id: "s-wish-list",
    type: "subjective",
    title: "올해가 가기 전에 꼭 해보고 싶은 것 하나",
    brief: {
      why: "남은 기간을 계산하게 만들어서 답이 구체적으로 나온다.",
      tip: "연말이 다가올수록 답이 진지해진다.",
    },
  },
  {
    id: "s-perfect-day",
    type: "subjective",
    title: "하루를 완벽하게 보낸다면 뭘 하고 싶어?",
    brief: {
      why: "완벽한 하루의 모습에 지금 부족한 것이 드러난다.",
      tip: "쉬는 방식이 다른 사람들끼리 비교하면 재밌다.",
    },
  },
  {
    id: "s-uioe",
    type: "subjective",
    title: "이 그룹에서 알고 보니 제일 의외였던 사람은? (이유도)",
    brief: {
      why: "첫인상과 지금이 가장 많이 달라진 사람을 찾게 된다. 지목보다 이유가 본론이다.",
      tip: "알고 지낸 지 오래된 모임에서 반응이 제일 좋다.",
    },
  },
  {
    id: "s-song",
    type: "subjective",
    title: "요즘 제일 많이 듣는 노래는?",
    brief: {
      why: "요즘 듣는 노래에는 기분이 묻어난다. 답이 모이면 그대로 모임 플레이리스트가 된다.",
      tip: "여행이나 드라이브 전에 물어보면 바로 쓸 수 있다.",
    },
  },
  {
    id: "s-regret",
    type: "subjective",
    title: "과거로 돌아가면 절대 안 할 일 하나만",
    brief: {
      why: "후회를 웃으면서 말할 수 있게 만드는 질문이다. 과장된 답과 진지한 답이 섞여 나온다.",
      tip: "친한 사이에서 술자리 대화로 이어가기 좋다.",
    },
  },
  {
    id: "s-nickname",
    type: "subjective",
    title: "나한테 별명을 하나 붙여준다면?",
    brief: {
      why: "남이 붙여주는 별명에는 내가 모르는 내 모습이 들어 있다.",
      tip: "모임의 마지막 질문으로 두면 이야기가 오래 간다.",
    },
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
