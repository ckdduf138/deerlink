export type QuestionType = "balance" | "multiple" | "subjective";

export interface PopularQuestion {
  id: string;
  type: QuestionType;
  title: string;
  optionA?: string;
  optionB?: string;
  options?: string[];
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
  },
  {
    id: "b-tangsuyuk",
    type: "balance",
    title: "탕수육은 부먹 vs 찍먹",
    optionA: "부먹",
    optionB: "찍먹",
  },
  {
    id: "b-mintcho",
    type: "balance",
    title: "민트초코는 맛있다 vs 치약 맛이다",
    optionA: "맛있다",
    optionB: "치약 맛",
  },
  {
    id: "b-jjajang",
    type: "balance",
    title: "짜장면 vs 짬뽕",
    optionA: "짜장면",
    optionB: "짬뽕",
  },
  {
    id: "b-saeu",
    type: "balance",
    title: "애인이 내 친구 새우 까주는 거 괜찮다 vs 안 된다",
    optionA: "괜찮다",
    optionB: "안 된다",
  },
  {
    id: "b-1eok-jeolyeon",
    type: "balance",
    title: "1억 받고 절친과 영원히 절연 vs 1억 포기하고 평생 절친",
    optionA: "1억 받고 절연",
    optionB: "1억 포기하고 절친",
  },
  {
    id: "b-200man-1000man",
    type: "balance",
    title: "월급 200만원 좋아하는 일 vs 월급 1,000만원 하기 싫은 일",
    optionA: "200만원 좋아하는 일",
    optionB: "1,000만원 싫은 일",
  },
  {
    id: "b-jjaksarang",
    type: "balance",
    title: "내가 미치게 좋아하는 사람과 연애 vs 나를 미치게 좋아하는 사람과 연애",
    optionA: "내가 좋아하는 사람",
    optionB: "나를 좋아하는 사람",
  },
  {
    id: "b-chicken",
    type: "balance",
    title: "치킨은 후라이드 vs 양념",
    optionA: "후라이드",
    optionB: "양념",
  },
  {
    id: "b-padding",
    type: "balance",
    title: "애인이 내 친구 롱패딩 지퍼 올려주는 거 괜찮다 vs 안 된다",
    optionA: "괜찮다",
    optionB: "안 된다",
  },
  {
    id: "b-aircon",
    type: "balance",
    title: "평생 에어컨 없는 여름 vs 평생 난방 없는 겨울",
    optionA: "에어컨 없는 여름",
    optionB: "난방 없는 겨울",
  },
  {
    id: "b-tumyeong-maeum",
    type: "balance",
    title: "모든 사람이 내 속마음을 읽을 수 있음 vs 나만 모든 사람 속마음을 읽을 수 있음",
    optionA: "내 마음이 투명",
    optionB: "남의 마음이 보임",
  },
  {
    id: "b-10nyeon-1eok",
    type: "balance",
    title: "지금 기억 그대로 10년 전으로 돌아가기 vs 지금 1억 받기",
    optionA: "10년 전으로",
    optionB: "지금 1억",
  },
  {
    id: "b-superpower",
    type: "balance",
    title: "투명인간 되기 vs 순간이동 하기",
    optionA: "투명인간",
    optionB: "순간이동",
  },
  {
    id: "b-10eok-50eok",
    type: "balance",
    title: "100% 확률로 10억 받기 vs 50% 확률로 50억 받기",
    optionA: "확실한 10억",
    optionB: "반반 확률 50억",
  },
  {
    id: "b-gwageo-mirae",
    type: "balance",
    title: "딱 한 번 과거로 가보기 vs 딱 한 번 미래로 가보기",
    optionA: "과거로",
    optionB: "미래로",
  },
  {
    id: "b-yeonrak-jaemi",
    type: "balance",
    title: "연락은 잘 되는데 재미없는 애인 vs 재밌는데 연락 안 되는 애인",
    optionA: "연락 잘 되는 애인",
    optionB: "재밌는 애인",
  },
  {
    id: "b-lotto",
    type: "balance",
    title: "로또 1등 되고 평생 아무한테도 말 못 함 vs 로또 3등 되고 마음껏 자랑",
    optionA: "1등, 비밀",
    optionB: "3등, 자랑",
  },
  {
    id: "b-gwisin-bakwi",
    type: "balance",
    title: "자다 깼는데 방에 귀신 vs 자다 깼는데 얼굴 위에 바퀴벌레",
    optionA: "귀신",
    optionB: "바퀴벌레",
  },
  {
    id: "b-seontok-katok",
    type: "balance",
    title: "선톡 절대 안 하는 애인 vs 하루종일 카톡 폭격하는 애인",
    optionA: "선톡 안 하는 애인",
    optionB: "카톡 폭격 애인",
  },
  {
    id: "b-gonggam-haegyeol",
    type: "balance",
    title: "고민 말하면 공감만 해주는 애인 vs 해결책만 말해주는 애인",
    optionA: "공감만",
    optionB: "해결책만",
  },
  {
    id: "b-jeon-aein",
    type: "balance",
    title: "내가 친구의 전 애인과 사귀기 vs 친구가 내 전 애인과 사귀기",
    optionA: "내가 친구 전 애인과",
    optionB: "친구가 내 전 애인과",
  },
  {
    id: "b-yeosachin-sul",
    type: "balance",
    title: "애인이 이성 친구와 단둘이 술 마시는 거 괜찮다 vs 안 된다",
    optionA: "괜찮다",
    optionB: "안 된다",
  },
  {
    id: "b-honja-gachi",
    type: "balance",
    title: "평생 혼자지만 원하는 모든 것을 가짐 vs 사랑하는 사람과 함께지만 항상 가난",
    optionA: "혼자지만 풍요",
    optionB: "함께지만 가난",
  },
  {
    id: "b-ramyeon-chicken",
    type: "balance",
    title: "평생 라면 못 먹기 vs 평생 치킨 못 먹기",
    optionA: "라면 포기",
    optionB: "치킨 포기",
  },
  {
    id: "b-phone-friend",
    type: "balance",
    title: "1년 동안 스마트폰 없이 살기 vs 1년 동안 친구 못 만나기",
    optionA: "스마트폰 없이",
    optionB: "친구 없이",
  },
  {
    id: "b-dog-cat",
    type: "balance",
    title: "평생 한 마리만 키운다면 강아지 vs 고양이",
    optionA: "강아지",
    optionB: "고양이",
  },
  {
    id: "b-sanbada",
    type: "balance",
    title: "여행지 고르면 산 vs 바다",
    optionA: "산",
    optionB: "바다",
  },
  {
    id: "b-dapjang",
    type: "balance",
    title: "1초 만에 오는 단답 vs 3시간 뒤에 오는 장문 답장",
    optionA: "빠른 단답",
    optionB: "느린 장문",
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
    id: "b-kkamjjak-pyohyeon",
    type: "balance",
    title: "기념일마다 깜짝 이벤트 해주는 애인 vs 이벤트는 없지만 매일 표현해주는 애인",
    optionA: "깜짝 이벤트",
    optionB: "매일 표현",
  },
  {
    id: "b-ju4il",
    type: "balance",
    title: "주 4일 근무에 월급 20% 삭감 vs 주 5일 근무에 월급 그대로",
    optionA: "주 4일, 20% 삭감",
    optionB: "주 5일, 그대로",
  },
  {
    id: "b-dongryo",
    type: "balance",
    title: "일 잘하는데 성격 나쁜 동료 vs 착한데 일 못하는 동료",
    optionA: "일 잘하는 동료",
    optionB: "착한 동료",
  },
  {
    id: "b-yeonbong-anjeong",
    type: "balance",
    title: "연봉 2배지만 언제 망할지 모르는 회사 vs 지금 연봉에 정년 보장",
    optionA: "연봉 2배, 불안정",
    optionB: "정년 보장",
  },
  {
    id: "b-bihaenggi-sukso",
    type: "balance",
    title: "평생 비행기표 공짜 vs 평생 숙소 공짜",
    optionA: "비행기표 공짜",
    optionB: "숙소 공짜",
  },
  {
    id: "b-sowon-changpi",
    type: "balance",
    title: "친구 10명한테 욕먹는 소문 퍼짐 vs SNS에서 1만 명한테 공개 망신",
    optionA: "친구들한테 욕",
    optionB: "1만 명 공개 망신",
  },
  {
    id: "b-achim-jeonyeok",
    type: "balance",
    title: "새벽 5시에 일어나는 아침형 vs 새벽 3시에 자는 저녁형",
    optionA: "아침형",
    optionB: "저녁형",
  },
  {
    id: "b-bus",
    type: "balance",
    title: "꽉 찬 버스로 30분 vs 텅 빈 버스로 1시간 30분",
    optionA: "꽉 찬 30분",
    optionB: "텅 빈 1시간 30분",
  },
  {
    id: "b-cola-gamja",
    type: "balance",
    title: "김 빠진 콜라 vs 눅눅한 감자튀김",
    optionA: "김 빠진 콜라",
    optionB: "눅눅한 감자튀김",
  },
  {
    id: "b-ramyeon",
    type: "balance",
    title: "라면은 꼬들꼬들한 면 vs 푹 퍼진 면",
    optionA: "꼬들면",
    optionB: "퍼진 면",
  },
  {
    id: "b-bungeoppang",
    type: "balance",
    title: "붕어빵 먹을 때 머리부터 vs 꼬리부터",
    optionA: "머리부터",
    optionB: "꼬리부터",
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
    id: "b-syawo",
    type: "balance",
    title: "샤워는 아침에 vs 자기 전에",
    optionA: "아침 샤워",
    optionB: "자기 전 샤워",
  },
  {
    id: "b-yeohaeng-style",
    type: "balance",
    title: "여행 스타일: 빡빡한 일정표 vs 그때그때 즉흥",
    optionA: "일정표파",
    optionB: "즉흥파",
  },
  {
    id: "b-camping-hocance",
    type: "balance",
    title: "주말 여행은 캠핑 vs 호캉스",
    optionA: "캠핑",
    optionB: "호캉스",
  },
  {
    id: "b-sukso-meokgi",
    type: "balance",
    title: "여행 가면 숙소에 돈 쓰기 vs 먹는 데 돈 쓰기",
    optionA: "숙소에 투자",
    optionB: "먹는 데 투자",
  },
  {
    id: "b-maeil-juil",
    type: "balance",
    title: "애인과 매일 잠깐씩 만나기 vs 일주일에 한 번 하루 종일 만나기",
    optionA: "매일 잠깐씩",
    optionB: "주 1회 하루 종일",
  },
  {
    id: "b-sagwa",
    type: "balance",
    title: "싸우고 나서 내가 먼저 사과하기 vs 상대가 사과할 때까지 기다리기",
    optionA: "먼저 사과",
    optionB: "기다리기",
  },
  {
    id: "b-jaetaek",
    type: "balance",
    title: "평생 재택근무 vs 평생 사무실 출근",
    optionA: "평생 재택",
    optionB: "평생 출근",
  },
  {
    id: "b-sangsa",
    type: "balance",
    title: "매일 칭찬하는데 연봉 동결 vs 매일 잔소리하는데 연봉 20% 인상",
    optionA: "칭찬, 연봉 동결",
    optionB: "잔소리, 연봉 인상",
  },
  {
    id: "b-hoesik-menu",
    type: "balance",
    title: "점심에 끝나는 파스타 회식 vs 저녁까지 가는 한우 회식",
    optionA: "점심 파스타",
    optionB: "저녁 한우",
  },
  {
    id: "b-eoneo-akgi",
    type: "balance",
    title: "세상 모든 언어 하기 vs 세상 모든 악기 연주하기",
    optionA: "모든 언어",
    optionB: "모든 악기",
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
    id: "m-yeonae-jungyo",
    type: "multiple",
    title: "연애할 때 제일 중요한 건?",
    options: ["대화가 잘 통함", "외모", "경제력", "가치관"],
  },
  {
    id: "m-10eok",
    type: "multiple",
    title: "10억 생기면 가장 먼저?",
    options: ["집 구매", "세계 일주", "투자·사업", "부모님께 드림"],
  },
  {
    id: "m-animal",
    type: "multiple",
    title: "나를 동물에 비유하면?",
    options: ["강아지", "고양이", "곰", "여우"],
  },
  {
    id: "m-position",
    type: "multiple",
    title: "우리 그룹에서 내 포지션은?",
    options: ["분위기 메이커", "조용한 관찰자", "분위기 파악러", "중재자"],
  },
  {
    id: "m-galdeung",
    type: "multiple",
    title: "갈등 생기면 나는?",
    options: ["바로 직접 말함", "삭히다가 폭발함", "그냥 넘어감", "슬쩍 멀어짐"],
  },
  {
    id: "m-stress",
    type: "multiple",
    title: "스트레스 받을 때 나는?",
    options: ["혼자 조용히", "친구 만나서 풀기", "먹방", "잠으로 해결"],
  },
  {
    id: "m-dantokbang",
    type: "multiple",
    title: "단톡방에서 나는?",
    options: ["대화 주도", "리액션 담당", "눈팅만 함", "한참 뒤에 몰아서 읽음"],
  },
  {
    id: "m-don-billyeo",
    type: "multiple",
    title: "친구가 돈 빌려달라고 하면?",
    options: ["바로 빌려줌", "액수 보고 결정", "정중하게 거절", "그냥 줘버림"],
  },
  {
    id: "m-date",
    type: "multiple",
    title: "최고의 주말 데이트는?",
    options: ["집에서 영화", "맛집 탐방", "근교 드라이브", "전시나 공연"],
  },
  {
    id: "m-yaesik",
    type: "multiple",
    title: "야식 딱 하나만 고르면?",
    options: ["치킨", "피자", "족발", "떡볶이"],
  },
  {
    id: "m-choeak-sseulsaram",
    type: "multiple",
    title: "제일 참기 힘든 사람은?",
    options: ["약속마다 늦는 사람", "말 끊는 사람", "쩝쩝거리는 사람", "읽씹하는 사람"],
  },
  {
    id: "m-gongpo-movie",
    type: "multiple",
    title: "공포영화 보면 나는?",
    options: ["눈 딱 감음", "소리 지름", "옆사람 붙잡음", "멀쩡하게 봄"],
  },
  {
    id: "m-hoesik",
    type: "multiple",
    title: "회식 자리에서 나는?",
    options: ["1차만 하고 빠짐", "끝까지 남음", "분위기 봐서 결정", "애초에 안 감"],
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
    id: "m-yeohaeng-yeokhal",
    type: "multiple",
    title: "같이 여행 가면 내 역할은?",
    options: ["돈 관리하는 총무", "길 찾기 담당", "사진 담당", "따라만 감"],
  },
  {
    id: "m-seonmul",
    type: "multiple",
    title: "제일 받고 싶은 선물은?",
    options: ["현금", "손편지", "갖고 싶던 물건", "여행이나 공연"],
  },
  {
    id: "m-toegeun",
    type: "multiple",
    title: "퇴근하고 나서 나는?",
    options: ["바로 집 가서 누움", "운동하러 감", "약속 잡음", "자기계발"],
  },
  {
    id: "m-gibun-nalssi",
    type: "multiple",
    title: "요즘 내 기분을 날씨로 치면?",
    options: ["맑음", "구름 조금", "비", "태풍"],
  },
  {
    id: "m-noraebang",
    type: "multiple",
    title: "노래방 가면 나는?",
    options: ["마이크 안 놓음", "탬버린 담당", "듣기만 함", "발라드만 부름"],
  },
  {
    id: "m-yeonrak-bindo",
    type: "multiple",
    title: "애인과 연락은 어느 정도가 적당해?",
    options: ["수시로", "하루 몇 번", "자기 전에 한 번", "필요할 때만"],
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
    id: "m-hyuga",
    type: "multiple",
    title: "일주일 휴가가 생기면?",
    options: ["해외여행", "국내 여행", "집에서 푹 쉬기", "밀린 일 처리"],
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
    id: "s-cheotinsang",
    type: "subjective",
    title: "내 첫인상은 어땠어? 솔직하게 한 줄로",
  },
  {
    id: "s-want-to-say",
    type: "subjective",
    title: "이 그룹 사람들한테 하고 싶었던 말이 있다면?",
  },
  {
    id: "s-ten-years",
    type: "subjective",
    title: "10년 후 나는 어디서 뭘 하고 있을 것 같아?",
  },
  {
    id: "s-anywhere",
    type: "subjective",
    title: "지금 당장 어디든 갈 수 있다면 어디 가고 싶어?",
  },
  {
    id: "s-three-words",
    type: "subjective",
    title: "나를 세 단어로 소개한다면?",
  },
  {
    id: "s-into-lately",
    type: "subjective",
    title: "요즘 꽂혀있는 것 하나만 말해봐",
  },
  {
    id: "s-choneungryeok",
    type: "subjective",
    title: "초능력 하나를 가질 수 있다면 뭘 고를래? (이유도)",
  },
  {
    id: "s-don-geokjeong",
    type: "subjective",
    title: "돈 걱정이 전혀 없다면 무슨 일을 하고 싶어?",
  },
  {
    id: "s-chueok",
    type: "subjective",
    title: "우리가 같이 한 일 중에 제일 기억에 남는 순간은?",
  },
  {
    id: "s-childhood-dream",
    type: "subjective",
    title: "어릴 때 꿈은 뭐였어?",
  },
  {
    id: "s-gachi-yeohaeng",
    type: "subjective",
    title: "이 그룹이랑 같이 가고 싶은 여행지 한 곳만 말해봐",
  },
  {
    id: "s-han-eumsik",
    type: "subjective",
    title: "평생 한 가지 음식만 먹어야 한다면 뭘 고를래?",
  },
  {
    id: "s-choegeun-utgin",
    type: "subjective",
    title: "최근 본 것 중에 제일 웃겼던 거 하나만",
  },
  {
    id: "s-gomin",
    type: "subjective",
    title: "요즘 제일 큰 고민 하나만 말해줘",
  },
  {
    id: "s-proud",
    type: "subjective",
    title: "올해 제일 잘한 일 하나만 자랑해줘",
  },
  {
    id: "s-wish-list",
    type: "subjective",
    title: "올해가 가기 전에 꼭 해보고 싶은 것 하나",
  },
  {
    id: "s-perfect-day",
    type: "subjective",
    title: "하루를 완벽하게 보낸다면 뭘 하고 싶어?",
  },
  {
    id: "s-uioe",
    type: "subjective",
    title: "이 그룹에서 알고 보니 제일 의외였던 사람은? (이유도)",
  },
  {
    id: "s-song",
    type: "subjective",
    title: "요즘 제일 많이 듣는 노래는?",
  },
  {
    id: "s-regret",
    type: "subjective",
    title: "과거로 돌아가면 절대 안 할 일 하나만",
  },
  {
    id: "s-nickname",
    type: "subjective",
    title: "나한테 별명을 하나 붙여준다면?",
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
