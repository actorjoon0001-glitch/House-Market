export type BuildSpecialty =
  | "STAY_REST_HOUSE"
  | "MOBILE_HOUSE"
  | "COUNTRY_HOUSE"
  | "PASSIVE_HOUSE"
  | "REMODEL";

export const SPECIALTY_LABEL: Record<BuildSpecialty, string> = {
  STAY_REST_HOUSE: "체류형 쉼터",
  MOBILE_HOUSE: "이동식 주택",
  COUNTRY_HOUSE: "전원주택",
  PASSIVE_HOUSE: "패시브하우스",
  REMODEL: "리모델링",
};

export const SPECIALTY_COLOR: Record<BuildSpecialty, string> = {
  STAY_REST_HOUSE: "#22C55E",
  MOBILE_HOUSE: "#3B82F6",
  COUNTRY_HOUSE: "#F59E0B",
  PASSIVE_HOUSE: "#A855F7",
  REMODEL: "#EF4444",
};

export type DemoArchitect = {
  id: string;
  name: string;
  region: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  specialties: BuildSpecialty[];
  description: string;
};

/**
 * Synthetic demo dataset for the architect map.
 * - All names are fictional ("[샘플]" prefixed) to avoid impersonating real
 *   businesses (Korean PIPA / right-of-publicity considerations).
 * - Coordinates are real city centers but companies do not exist.
 * - Real architects must opt in via /apply 입점 신청 to be listed.
 */
export const DEMO_ARCHITECTS: DemoArchitect[] = [
  // 수도권
  {
    id: "demo-001",
    name: "[샘플] 한강건축사사무소",
    region: "서울",
    address: "서울 강남구",
    lat: 37.5172,
    lng: 127.0473,
    phone: "02-000-0001",
    specialties: ["COUNTRY_HOUSE", "PASSIVE_HOUSE"],
    description: "전원주택 · 패시브하우스 시공 가능 (샘플)",
  },
  {
    id: "demo-002",
    name: "[샘플] 경기북부이동식하우스",
    region: "경기",
    address: "경기 양주시",
    lat: 37.7853,
    lng: 127.0457,
    phone: "031-000-0001",
    specialties: ["MOBILE_HOUSE", "STAY_REST_HOUSE"],
    description: "이동식 주택 · 체류형 쉼터 (샘플)",
  },
  {
    id: "demo-003",
    name: "[샘플] 가평쉼터빌더",
    region: "경기",
    address: "경기 가평군",
    lat: 37.8315,
    lng: 127.5099,
    phone: "031-000-0002",
    specialties: ["STAY_REST_HOUSE", "COUNTRY_HOUSE"],
    description: "체류형 쉼터 · 전원주택 (샘플)",
  },
  {
    id: "demo-004",
    name: "[샘플] 인천모듈러건축",
    region: "인천",
    address: "인천 강화군",
    lat: 37.7468,
    lng: 126.4878,
    phone: "032-000-0001",
    specialties: ["MOBILE_HOUSE"],
    description: "모듈러 · 이동식 주택 전문 (샘플)",
  },

  // 강원
  {
    id: "demo-005",
    name: "[샘플] 강원소나무하우스",
    region: "강원",
    address: "강원 평창군",
    lat: 37.3705,
    lng: 128.3905,
    phone: "033-000-0001",
    specialties: ["COUNTRY_HOUSE", "STAY_REST_HOUSE"],
    description: "강원 전원주택 · 체류형 쉼터 (샘플)",
  },
  {
    id: "demo-006",
    name: "[샘플] 양양바다이동주택",
    region: "강원",
    address: "강원 양양군",
    lat: 38.0750,
    lng: 128.6189,
    phone: "033-000-0002",
    specialties: ["MOBILE_HOUSE", "STAY_REST_HOUSE"],
    description: "이동식 주택 · 체류형 쉼터 (샘플)",
  },
  {
    id: "demo-007",
    name: "[샘플] 춘천호반건축",
    region: "강원",
    address: "강원 춘천시",
    lat: 37.8813,
    lng: 127.7298,
    phone: "033-000-0003",
    specialties: ["COUNTRY_HOUSE", "REMODEL"],
    description: "전원주택 · 리모델링 (샘플)",
  },

  // 충청
  {
    id: "demo-008",
    name: "[샘플] 충북패시브하우스",
    region: "충북",
    address: "충북 청주시",
    lat: 36.6424,
    lng: 127.4890,
    phone: "043-000-0001",
    specialties: ["PASSIVE_HOUSE", "COUNTRY_HOUSE"],
    description: "패시브하우스 · 전원주택 (샘플)",
  },
  {
    id: "demo-009",
    name: "[샘플] 천안모듈러센터",
    region: "충남",
    address: "충남 천안시",
    lat: 36.8151,
    lng: 127.1139,
    phone: "041-000-0001",
    specialties: ["MOBILE_HOUSE"],
    description: "모듈러 · 이동식 주택 (샘플)",
  },
  {
    id: "demo-010",
    name: "[샘플] 단양체류쉼터",
    region: "충북",
    address: "충북 단양군",
    lat: 36.9847,
    lng: 128.3656,
    phone: "043-000-0002",
    specialties: ["STAY_REST_HOUSE"],
    description: "체류형 쉼터 전문 (샘플)",
  },

  // 경상
  {
    id: "demo-011",
    name: "[샘플] 부산해운대건축사",
    region: "부산",
    address: "부산 해운대구",
    lat: 35.1631,
    lng: 129.1639,
    phone: "051-000-0001",
    specialties: ["COUNTRY_HOUSE", "REMODEL"],
    description: "전원주택 · 리모델링 (샘플)",
  },
  {
    id: "demo-012",
    name: "[샘플] 김해이동주택",
    region: "경남",
    address: "경남 김해시",
    lat: 35.2342,
    lng: 128.8896,
    phone: "055-000-0001",
    specialties: ["MOBILE_HOUSE", "STAY_REST_HOUSE"],
    description: "이동식 주택 · 체류형 쉼터 (샘플)",
  },
  {
    id: "demo-013",
    name: "[샘플] 경주전원하우스",
    region: "경북",
    address: "경북 경주시",
    lat: 35.8562,
    lng: 129.2247,
    phone: "054-000-0001",
    specialties: ["COUNTRY_HOUSE"],
    description: "전원주택 전문 (샘플)",
  },
  {
    id: "demo-014",
    name: "[샘플] 안동한옥&이동",
    region: "경북",
    address: "경북 안동시",
    lat: 36.5684,
    lng: 128.7294,
    phone: "054-000-0002",
    specialties: ["MOBILE_HOUSE", "COUNTRY_HOUSE"],
    description: "이동식 주택 · 전원주택 (샘플)",
  },
  {
    id: "demo-015",
    name: "[샘플] 통영바닷가쉼터",
    region: "경남",
    address: "경남 통영시",
    lat: 34.8544,
    lng: 128.4331,
    phone: "055-000-0002",
    specialties: ["STAY_REST_HOUSE", "MOBILE_HOUSE"],
    description: "체류형 쉼터 · 이동식 주택 (샘플)",
  },

  // 전라
  {
    id: "demo-016",
    name: "[샘플] 전주한옥건축",
    region: "전북",
    address: "전북 전주시",
    lat: 35.8242,
    lng: 127.1480,
    phone: "063-000-0001",
    specialties: ["COUNTRY_HOUSE", "REMODEL"],
    description: "전원주택 · 한옥 리모델링 (샘플)",
  },
  {
    id: "demo-017",
    name: "[샘플] 순천만쉼터빌더",
    region: "전남",
    address: "전남 순천시",
    lat: 34.9506,
    lng: 127.4872,
    phone: "061-000-0001",
    specialties: ["STAY_REST_HOUSE", "COUNTRY_HOUSE"],
    description: "체류형 쉼터 · 전원주택 (샘플)",
  },
  {
    id: "demo-018",
    name: "[샘플] 여수섬이동주택",
    region: "전남",
    address: "전남 여수시",
    lat: 34.7604,
    lng: 127.6622,
    phone: "061-000-0002",
    specialties: ["MOBILE_HOUSE"],
    description: "이동식 주택 (샘플)",
  },
  {
    id: "demo-019",
    name: "[샘플] 광주모듈러스튜디오",
    region: "광주",
    address: "광주 북구",
    lat: 35.1740,
    lng: 126.9120,
    phone: "062-000-0001",
    specialties: ["MOBILE_HOUSE", "PASSIVE_HOUSE"],
    description: "모듈러 · 패시브하우스 (샘플)",
  },

  // 제주
  {
    id: "demo-020",
    name: "[샘플] 제주돌담건축사",
    region: "제주",
    address: "제주 제주시",
    lat: 33.4996,
    lng: 126.5312,
    phone: "064-000-0001",
    specialties: ["COUNTRY_HOUSE", "STAY_REST_HOUSE"],
    description: "전원주택 · 체류형 쉼터 (샘플)",
  },
  {
    id: "demo-021",
    name: "[샘플] 서귀포팜스테이",
    region: "제주",
    address: "제주 서귀포시",
    lat: 33.2541,
    lng: 126.5601,
    phone: "064-000-0002",
    specialties: ["STAY_REST_HOUSE", "MOBILE_HOUSE"],
    description: "체류형 쉼터 · 이동식 주택 (샘플)",
  },
  {
    id: "demo-022",
    name: "[샘플] 한경면이동하우스",
    region: "제주",
    address: "제주 한경면",
    lat: 33.3457,
    lng: 126.1770,
    phone: "064-000-0003",
    specialties: ["MOBILE_HOUSE"],
    description: "이동식 주택 (샘플)",
  },
];
