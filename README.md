# 집마켓 (House Market)

건축주 · 건축사 · 시공사 · 자재상이 입점하고, 동네 중고거래까지 한 앱에서 보는 **집 전문 플랫폼**.

## 스택
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL (PostGIS 권장)
- 카카오맵 JavaScript SDK

## 시작하기

```bash
npm install
cp .env.example .env.local
# NEXT_PUBLIC_KAKAO_MAP_KEY, DATABASE_URL 채우기
npm run dev
```

카카오맵 JavaScript 키는 [Kakao Developers](https://developers.kakao.com)에서 발급받습니다. 도메인에 `http://localhost:3000` 등록 필수.

## 디렉토리

```
src/
  app/
    page.tsx         # 홈
    map/page.tsx     # 지도(카카오맵 + 내 위치)
    companies/       # 입점 업체
    market/          # 동네 중고거래
    chat/            # 채팅 (예정)
    me/              # 내정보
    login/           # 로그인
  components/
    KakaoMap.tsx
    BottomNav.tsx
  lib/
    prisma.ts
prisma/
  schema.prisma
```

## 로드맵
- [x] MVP 스캐폴드 + 카카오맵 데모
- [ ] 전화번호 인증 (NextAuth + SMS)
- [ ] 업체 등록 + 사업자번호 검증
- [ ] 중고매물 CRUD + 이미지 업로드
- [ ] 실시간 채팅 (소켓 / Pusher)
- [ ] 견적 요청 매칭
- [ ] PWA 푸시 알림
- [ ] React Native(Expo) 포팅
