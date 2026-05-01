# 집마켓 (House Market)

AI로 집을 구상하고, 가까운 건축 전문가에게 상담을 요청하는 한국 부동산·건축 전문 플랫폼.

## 스택
- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **카카오맵** JavaScript SDK (지도, 주소 자동완성)
- **Anthropic Claude** SDK (AI 평면도 생성, mock 폴백)
- **Three.js + R3F** (3D 평면도 뷰어)
- **Supabase** (Auth + Postgres + RLS) — *선택, 미설정 시 localStorage 데모 모드*
- **Prisma** (스키마 문서화 + 향후 ORM)

## 빠른 시작

```bash
npm install
cp .env.example .env.local
# 필요한 키 채우기 (모두 비워둬도 데모 모드로 동작)
npm run dev
```

## 환경변수

| 변수 | 설명 | 없을 때 |
|---|---|---|
| `NEXT_PUBLIC_KAKAO_MAP_KEY` | 카카오 JS 키 | 지도 페이지에 안내 박스 |
| `ANTHROPIC_API_KEY` | Claude API 키 | AI 설계 mock 응답으로 폴백 |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | 로그인 비활성, localStorage 데모 모드 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key | 동상 |

## Supabase 설정 (선택)

### 1. 프로젝트 만들기
1. [supabase.com](https://supabase.com) → New Project
2. Database password 설정, region은 Northeast Asia (Seoul) 추천
3. 프로젝트 생성 후 **Project Settings → API**에서:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` 키 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. 스키마 마이그레이션
1. Supabase 대시보드 → **SQL Editor** → **New query**
2. `supabase/migrations/0001_init.sql` 내용 전체 붙여넣기 → **Run**
3. 같은 방식으로 `0002_rls.sql` 실행 (Row Level Security)
4. **`0003_seed_demo_companies.sql`** 실행 (데모 업체 27개 시드 — 상담/관심 기능에 필수)

### 3. 매직 링크 이메일 설정
- **Authentication → URL Configuration**:
  - Site URL: `https://home-market-ai.netlify.app` (또는 본인 도메인)
  - Redirect URLs에 다음 추가:
    ```
    http://localhost:3000/auth/callback
    https://home-market-ai.netlify.app/auth/callback
    ```

### 4. Netlify 환경변수
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 등록 후 재배포

설정이 끝나면 `/login`에서 이메일 매직 링크로 로그인할 수 있습니다.

## 주요 페이지

```
/                  홈 — 히어로 + 3단계 설명
/projects/new      AI 설계 5단계 위저드 (요구사항→평면도→3D→견적→매칭)
/map               전국 전문가 지도 (카카오맵 + 카테고리 필터)
/architects        업체 디렉토리 + 상태 배지
/architects/[id]   업체 상세 + 상담 요청 폼
/consultations     내 상담함
/owner/consultations 업체 상담 관리 (mock)
/favorites         관심 업체
/compare           업체 비교 (최대 3개)
/apply             업체 입점 신청 + 사업자번호 검증
/removal-request   정보 수정·삭제 요청
/login             매직 링크 로그인
```

## 데이터 정책 (요약)

업체는 4가지 상태로 구분되며 단일 `visibilityPolicy()` 함수로 노출이 결정됩니다:

| 상태 | 회사명 | 연락처 | 포트폴리오 | 상담 가능 |
|---|---|:---:|:---:|:---:|
| sample | [샘플] | ❌ | ❌ | ❌ |
| public | 공개자료 기반 | ❌ | ❌ | ❌ |
| pending | 검토중 | ❌ | ❌ | ❌ |
| verified | 입점 업체 | contactPublic 시 | ✅ | ✅ |

- "추천 업체 / TOP / 검증 완료 / 집마켓이 선정" 등 보증성 표현 사용 금지
- 모든 페이지에 `LegalNotice` + `SafetyNotice` 노출
- `/removal-request`로 정보 수정·삭제 요청 가능

## 로드맵
- [x] MVP 스캐폴드 + 카카오맵
- [x] AI 콘셉트 설계 (Claude + Three.js)
- [x] 카카오 주소 검색 + 가까운 전문가 매칭
- [x] 입점/공개자료 분리 + 상태별 노출 정책
- [x] 상담 요청 → 메시지 → 알림 (localStorage)
- [x] Supabase Auth (매직 링크) + DB 스키마
- [ ] 데이터 store를 Supabase로 마이그레이션
- [ ] 카카오 OAuth 추가
- [ ] 국세청 사업자번호 검증 API
- [ ] React Native(Expo) 포팅
