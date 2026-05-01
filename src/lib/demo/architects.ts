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

export type VerifiedStatus = "sample" | "public" | "pending" | "verified";
export type DataSource = "sample" | "public" | "user_submitted";

export type DemoArchitect = {
  id: string;
  name: string;
  region: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  specialties: BuildSpecialty[];
  serviceAreas: string[];
  description: string;
  portfolioImages: string[];
  rating?: number;
  reviewCount?: number;
  /** 데모 시드 여부 (UI 라벨에 사용) */
  isSample: boolean;
  /** 동의 없이 공개 자료에 의해 등재되었는지 */
  isListedWithoutConsent: boolean;
  /** 사업자/개인정보 노출 동의 여부 */
  consentGiven: boolean;
  /** 연락처 공개 동의 여부 */
  contactPublic: boolean;
  /** 데이터 출처 */
  dataSource: DataSource;
  /** 검증 상태 */
  verifiedStatus: VerifiedStatus;
};

/**
 * Status 별 UI 정책의 단일 진입점.
 * 상세 페이지·지도·디렉토리에서 같은 함수로 가시성을 결정해 일관성 유지.
 */
export function visibilityPolicy(a: DemoArchitect): {
  /** 연락처 노출 가능 여부 */
  canShowContact: boolean;
  /** 포트폴리오·후기 등 상세 정보 노출 여부 */
  canShowRichDetail: boolean;
  /** 표시용 배지 */
  badge: { label: string; cls: string };
  /** 노출 라벨 (상태 설명) */
  statusLabel: string;
} {
  switch (a.verifiedStatus) {
    case "verified":
      return {
        canShowContact: a.contactPublic,
        canShowRichDetail: true,
        badge: { label: "입점 업체", cls: "bg-green-100 text-green-700" },
        statusLabel: "사업자 확인 및 본인 동의 완료",
      };
    case "pending":
      return {
        canShowContact: false,
        canShowRichDetail: false,
        badge: { label: "검토중", cls: "bg-blue-100 text-blue-700" },
        statusLabel: "입점 신청을 검토하고 있습니다",
      };
    case "public":
      return {
        canShowContact: false,
        canShowRichDetail: false,
        badge: { label: "공개자료 기반", cls: "bg-gray-200 text-gray-700" },
        statusLabel:
          "공개 자료를 기반으로 표시되며, 해당 업체는 집마켓에 입점하지 않았을 수 있습니다",
      };
    case "sample":
    default:
      return {
        canShowContact: false,
        canShowRichDetail: false,
        badge: { label: "샘플", cls: "bg-yellow-100 text-yellow-700" },
        statusLabel: "데모용 샘플 데이터",
      };
  }
}

const SAMPLE_PORTFOLIO_PLACEHOLDER = [
  "/images/portfolio-placeholder-1.svg",
  "/images/portfolio-placeholder-2.svg",
  "/images/portfolio-placeholder-3.svg",
];

/**
 * Synthetic demo dataset for the architect map.
 * - 모든 회사는 "[샘플]" 접두사 + 가상 회사명 (실존 업체 사칭 방지).
 * - 좌표는 실제 시·군 중심점이지만 회사는 가상.
 * - 실제 업체는 /apply 입점 신청 + 사업자 확인 후에만 노출.
 * - 모든 entry: isSample=true, verifiedStatus="sample".
 */
export const DEMO_ARCHITECTS: DemoArchitect[] = [
  {
    id: "demo-001",
    name: "[샘플] 한강건축사사무소",
    region: "서울",
    address: "서울 강남구",
    lat: 37.5172,
    lng: 127.0473,
    phone: "02-000-0001",
    specialties: ["COUNTRY_HOUSE", "PASSIVE_HOUSE"],
    serviceAreas: ["서울", "경기"],
    description: "전원주택과 패시브하우스 콘셉트 상담을 받습니다 (샘플)",
    portfolioImages: SAMPLE_PORTFOLIO_PLACEHOLDER,
    rating: 4.7,
    reviewCount: 24,
    isSample: true,
    isListedWithoutConsent: false,
    consentGiven: false,
    contactPublic: false,
    dataSource: "sample",
    verifiedStatus: "sample",
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
    serviceAreas: ["서울", "경기", "강원"],
    description: "이동식 주택과 체류형 쉼터 상담 가능 (샘플)",
    portfolioImages: SAMPLE_PORTFOLIO_PLACEHOLDER,
    rating: 4.5,
    reviewCount: 18,
    isSample: true,
    isListedWithoutConsent: false,
    consentGiven: false,
    contactPublic: false,
    dataSource: "sample",
    verifiedStatus: "sample",
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
    serviceAreas: ["경기", "강원"],
    description: "체류형 쉼터·전원주택 콘셉트 상담 (샘플)",
    portfolioImages: SAMPLE_PORTFOLIO_PLACEHOLDER,
    rating: 4.6,
    reviewCount: 12,
    isSample: true,
    isListedWithoutConsent: false,
    consentGiven: false,
    contactPublic: false,
    dataSource: "sample",
    verifiedStatus: "sample",
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
    serviceAreas: ["인천", "경기"],
    description: "모듈러·이동식 주택 콘셉트 (샘플)",
    portfolioImages: SAMPLE_PORTFOLIO_PLACEHOLDER,
    rating: 4.4,
    reviewCount: 9,
    isSample: true,
    isListedWithoutConsent: false,
    consentGiven: false,
    contactPublic: false,
    dataSource: "sample",
    verifiedStatus: "sample",
  },
  {
    id: "demo-005",
    name: "[샘플] 강원소나무하우스",
    region: "강원",
    address: "강원 평창군",
    lat: 37.3705,
    lng: 128.3905,
    phone: "033-000-0001",
    specialties: ["COUNTRY_HOUSE", "STAY_REST_HOUSE"],
    serviceAreas: ["강원"],
    description: "강원 전원주택·체류형 쉼터 상담 (샘플)",
    portfolioImages: SAMPLE_PORTFOLIO_PLACEHOLDER,
    rating: 4.8,
    reviewCount: 31,
    isSample: true,
    isListedWithoutConsent: false,
    consentGiven: false,
    contactPublic: false,
    dataSource: "sample",
    verifiedStatus: "sample",
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
    serviceAreas: ["강원"],
    description: "이동식 주택·체류형 쉼터 (샘플)",
    portfolioImages: SAMPLE_PORTFOLIO_PLACEHOLDER,
    rating: 4.5,
    reviewCount: 15,
    isSample: true,
    isListedWithoutConsent: false,
    consentGiven: false,
    contactPublic: false,
    dataSource: "sample",
    verifiedStatus: "sample",
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
    serviceAreas: ["강원", "경기"],
    description: "전원주택·리모델링 콘셉트 (샘플)",
    portfolioImages: SAMPLE_PORTFOLIO_PLACEHOLDER,
    rating: 4.6,
    reviewCount: 21,
    isSample: true,
    isListedWithoutConsent: false,
    consentGiven: false,
    contactPublic: false,
    dataSource: "sample",
    verifiedStatus: "sample",
  },
  {
    id: "demo-008",
    name: "[샘플] 충북패시브하우스",
    region: "충북",
    address: "충북 청주시",
    lat: 36.6424,
    lng: 127.4890,
    phone: "043-000-0001",
    specialties: ["PASSIVE_HOUSE", "COUNTRY_HOUSE"],
    serviceAreas: ["충북", "충남"],
    description: "패시브하우스·전원주택 (샘플)",
    portfolioImages: SAMPLE_PORTFOLIO_PLACEHOLDER,
    rating: 4.9,
    reviewCount: 28,
    isSample: true,
    isListedWithoutConsent: false,
    consentGiven: false,
    contactPublic: false,
    dataSource: "sample",
    verifiedStatus: "sample",
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
    serviceAreas: ["충남", "충북"],
    description: "모듈러·이동식 주택 (샘플)",
    portfolioImages: SAMPLE_PORTFOLIO_PLACEHOLDER,
    rating: 4.3,
    reviewCount: 11,
    isSample: true,
    isListedWithoutConsent: false,
    consentGiven: false,
    contactPublic: false,
    dataSource: "sample",
    verifiedStatus: "sample",
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
    serviceAreas: ["충북"],
    description: "체류형 쉼터 콘셉트 (샘플)",
    portfolioImages: SAMPLE_PORTFOLIO_PLACEHOLDER,
    rating: 4.5,
    reviewCount: 7,
    isSample: true,
    isListedWithoutConsent: false,
    consentGiven: false,
    contactPublic: false,
    dataSource: "sample",
    verifiedStatus: "sample",
  },
  {
    id: "demo-011",
    name: "[샘플] 부산해운대건축사",
    region: "부산",
    address: "부산 해운대구",
    lat: 35.1631,
    lng: 129.1639,
    phone: "051-000-0001",
    specialties: ["COUNTRY_HOUSE", "REMODEL"],
    serviceAreas: ["부산", "경남"],
    description: "전원주택·리모델링 (샘플)",
    portfolioImages: SAMPLE_PORTFOLIO_PLACEHOLDER,
    rating: 4.7,
    reviewCount: 33,
    isSample: true,
    isListedWithoutConsent: false,
    consentGiven: false,
    contactPublic: false,
    dataSource: "sample",
    verifiedStatus: "sample",
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
    serviceAreas: ["경남", "부산"],
    description: "이동식 주택·체류형 쉼터 (샘플)",
    portfolioImages: SAMPLE_PORTFOLIO_PLACEHOLDER,
    rating: 4.4,
    reviewCount: 14,
    isSample: true,
    isListedWithoutConsent: false,
    consentGiven: false,
    contactPublic: false,
    dataSource: "sample",
    verifiedStatus: "sample",
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
    serviceAreas: ["경북"],
    description: "전원주택 콘셉트 (샘플)",
    portfolioImages: SAMPLE_PORTFOLIO_PLACEHOLDER,
    rating: 4.6,
    reviewCount: 19,
    isSample: true,
    isListedWithoutConsent: false,
    consentGiven: false,
    contactPublic: false,
    dataSource: "sample",
    verifiedStatus: "sample",
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
    serviceAreas: ["경북"],
    description: "이동식 주택·전원주택 (샘플)",
    portfolioImages: SAMPLE_PORTFOLIO_PLACEHOLDER,
    rating: 4.5,
    reviewCount: 16,
    isSample: true,
    isListedWithoutConsent: false,
    consentGiven: false,
    contactPublic: false,
    dataSource: "sample",
    verifiedStatus: "sample",
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
    serviceAreas: ["경남"],
    description: "체류형 쉼터·이동식 주택 (샘플)",
    portfolioImages: SAMPLE_PORTFOLIO_PLACEHOLDER,
    rating: 4.7,
    reviewCount: 22,
    isSample: true,
    isListedWithoutConsent: false,
    consentGiven: false,
    contactPublic: false,
    dataSource: "sample",
    verifiedStatus: "sample",
  },
  {
    id: "demo-016",
    name: "[샘플] 전주한옥건축",
    region: "전북",
    address: "전북 전주시",
    lat: 35.8242,
    lng: 127.1480,
    phone: "063-000-0001",
    specialties: ["COUNTRY_HOUSE", "REMODEL"],
    serviceAreas: ["전북"],
    description: "전원주택·한옥 리모델링 (샘플)",
    portfolioImages: SAMPLE_PORTFOLIO_PLACEHOLDER,
    rating: 4.8,
    reviewCount: 27,
    isSample: true,
    isListedWithoutConsent: false,
    consentGiven: false,
    contactPublic: false,
    dataSource: "sample",
    verifiedStatus: "sample",
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
    serviceAreas: ["전남", "광주"],
    description: "체류형 쉼터·전원주택 (샘플)",
    portfolioImages: SAMPLE_PORTFOLIO_PLACEHOLDER,
    rating: 4.6,
    reviewCount: 20,
    isSample: true,
    isListedWithoutConsent: false,
    consentGiven: false,
    contactPublic: false,
    dataSource: "sample",
    verifiedStatus: "sample",
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
    serviceAreas: ["전남"],
    description: "이동식 주택 (샘플)",
    portfolioImages: SAMPLE_PORTFOLIO_PLACEHOLDER,
    rating: 4.4,
    reviewCount: 10,
    isSample: true,
    isListedWithoutConsent: false,
    consentGiven: false,
    contactPublic: false,
    dataSource: "sample",
    verifiedStatus: "sample",
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
    serviceAreas: ["광주", "전남", "전북"],
    description: "모듈러·패시브하우스 (샘플)",
    portfolioImages: SAMPLE_PORTFOLIO_PLACEHOLDER,
    rating: 4.7,
    reviewCount: 25,
    isSample: true,
    isListedWithoutConsent: false,
    consentGiven: false,
    contactPublic: false,
    dataSource: "sample",
    verifiedStatus: "sample",
  },
  {
    id: "demo-020",
    name: "[샘플] 제주돌담건축사",
    region: "제주",
    address: "제주 제주시",
    lat: 33.4996,
    lng: 126.5312,
    phone: "064-000-0001",
    specialties: ["COUNTRY_HOUSE", "STAY_REST_HOUSE"],
    serviceAreas: ["제주"],
    description: "전원주택·체류형 쉼터 (샘플)",
    portfolioImages: SAMPLE_PORTFOLIO_PLACEHOLDER,
    rating: 4.9,
    reviewCount: 35,
    isSample: true,
    isListedWithoutConsent: false,
    consentGiven: false,
    contactPublic: false,
    dataSource: "sample",
    verifiedStatus: "sample",
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
    serviceAreas: ["제주"],
    description: "체류형 쉼터·이동식 주택 (샘플)",
    portfolioImages: SAMPLE_PORTFOLIO_PLACEHOLDER,
    rating: 4.7,
    reviewCount: 26,
    isSample: true,
    isListedWithoutConsent: false,
    consentGiven: false,
    contactPublic: false,
    dataSource: "sample",
    verifiedStatus: "sample",
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
    serviceAreas: ["제주"],
    description: "이동식 주택 (샘플)",
    portfolioImages: SAMPLE_PORTFOLIO_PLACEHOLDER,
    rating: 4.5,
    reviewCount: 13,
    isSample: true,
    isListedWithoutConsent: false,
    consentGiven: false,
    contactPublic: false,
    dataSource: "sample",
    verifiedStatus: "sample",
  },

  // ─── 공개자료 시나리오 (UI 검증용 가상 데이터) ────────────────
  // 실제 배포 시 공공데이터·인허가 정보 등에서 가져온 케이스를 시뮬레이션.
  // 동의를 받지 않았으므로 연락처·포트폴리오 등 상세 정보는 노출하지 않음.
  {
    id: "public-001",
    name: "북촌 한옥 시공 사례 (공개자료 예시)",
    region: "서울",
    address: "서울 종로구",
    lat: 37.5824,
    lng: 126.9852,
    phone: "",
    specialties: ["REMODEL", "COUNTRY_HOUSE"],
    serviceAreas: ["서울"],
    description: "공개 자료 기반 표시 항목입니다 (가상).",
    portfolioImages: [],
    isSample: false,
    isListedWithoutConsent: true,
    consentGiven: false,
    contactPublic: false,
    dataSource: "public",
    verifiedStatus: "public",
  },
  {
    id: "public-002",
    name: "강원 산촌형 주택 사례 (공개자료 예시)",
    region: "강원",
    address: "강원 홍천군",
    lat: 37.6907,
    lng: 127.8842,
    phone: "",
    specialties: ["COUNTRY_HOUSE", "STAY_REST_HOUSE"],
    serviceAreas: ["강원"],
    description: "공개 자료 기반 표시 항목입니다 (가상).",
    portfolioImages: [],
    isSample: false,
    isListedWithoutConsent: true,
    consentGiven: false,
    contactPublic: false,
    dataSource: "public",
    verifiedStatus: "public",
  },
  {
    id: "public-003",
    name: "남해 모듈러 시공 사례 (공개자료 예시)",
    region: "경남",
    address: "경남 남해군",
    lat: 34.8378,
    lng: 127.8923,
    phone: "",
    specialties: ["MOBILE_HOUSE", "PASSIVE_HOUSE"],
    serviceAreas: ["경남"],
    description: "공개 자료 기반 표시 항목입니다 (가상).",
    portfolioImages: [],
    isSample: false,
    isListedWithoutConsent: true,
    consentGiven: false,
    contactPublic: false,
    dataSource: "public",
    verifiedStatus: "public",
  },

  // ─── 입점 업체 (UI 검증용 가상 데이터) ────────────────
  // 본인 동의 + 사업자 확인 완료된 케이스를 시뮬레이션.
  {
    id: "verified-001",
    name: "동탄 전원주택 스튜디오 (예시 입점 업체)",
    region: "경기",
    address: "경기 화성시 동탄",
    lat: 37.2010,
    lng: 127.0744,
    phone: "031-555-1234",
    specialties: ["COUNTRY_HOUSE", "PASSIVE_HOUSE"],
    serviceAreas: ["경기", "서울", "충남"],
    description:
      "전원주택과 패시브하우스 콘셉트 상담을 받습니다 (예시 입점 업체).",
    portfolioImages: SAMPLE_PORTFOLIO_PLACEHOLDER,
    rating: 4.8,
    reviewCount: 42,
    isSample: false,
    isListedWithoutConsent: false,
    consentGiven: true,
    contactPublic: true,
    dataSource: "user_submitted",
    verifiedStatus: "verified",
  },
  {
    id: "verified-002",
    name: "양양 이동식 하우스 공방 (예시 입점 업체)",
    region: "강원",
    address: "강원 양양군",
    lat: 38.0900,
    lng: 128.6300,
    phone: "033-555-5678",
    specialties: ["MOBILE_HOUSE", "STAY_REST_HOUSE"],
    serviceAreas: ["강원", "경기"],
    description: "이동식 주택·체류형 쉼터 상담 (예시 입점 업체).",
    portfolioImages: SAMPLE_PORTFOLIO_PLACEHOLDER,
    rating: 4.7,
    reviewCount: 29,
    isSample: false,
    isListedWithoutConsent: false,
    consentGiven: true,
    contactPublic: true,
    dataSource: "user_submitted",
    verifiedStatus: "verified",
  },
];

export function findArchitect(id: string): DemoArchitect | undefined {
  return DEMO_ARCHITECTS.find((a) => a.id === id);
}

/** 카테고리 내 입점·검증 업체를 우선 노출하기 위한 정렬 키. */
export function statusRank(a: DemoArchitect): number {
  switch (a.verifiedStatus) {
    case "verified":
      return 0;
    case "pending":
      return 1;
    case "public":
      return 2;
    case "sample":
    default:
      return 3;
  }
}
