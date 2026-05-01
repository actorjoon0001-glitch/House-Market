-- 데모 업체 시드 데이터 (27개)
-- 적용: Supabase SQL Editor에서 이 파일 전체 붙여넣기 → Run
-- 멱등: 같은 id 있으면 update.

insert into public.companies (
  id, name, region, address, lat, lng, phone, specialties, description,
  rating, review_count, verified_status, data_source,
  is_listed_without_consent, consent_given, contact_public
) values
  ('demo-001', '[샘플] 한강건축사사무소', '서울', '서울 강남구', 37.5172, 127.0473, '02-000-0001', array['COUNTRY_HOUSE', 'PASSIVE_HOUSE']::text[], '전원주택과 패시브하우스 콘셉트 상담을 받습니다 (샘플)', 4.7, 24, 'sample', 'sample', false, false, false),
  ('demo-002', '[샘플] 경기북부이동식하우스', '경기', '경기 양주시', 37.7853, 127.0457, '031-000-0001', array['MOBILE_HOUSE', 'STAY_REST_HOUSE']::text[], '이동식 주택과 체류형 쉼터 상담 가능 (샘플)', 4.5, 18, 'sample', 'sample', false, false, false),
  ('demo-003', '[샘플] 가평쉼터빌더', '경기', '경기 가평군', 37.8315, 127.5099, '031-000-0002', array['STAY_REST_HOUSE', 'COUNTRY_HOUSE']::text[], '체류형 쉼터·전원주택 콘셉트 상담 (샘플)', 4.6, 12, 'sample', 'sample', false, false, false),
  ('demo-004', '[샘플] 인천모듈러건축', '인천', '인천 강화군', 37.7468, 126.4878, '032-000-0001', array['MOBILE_HOUSE']::text[], '모듈러·이동식 주택 콘셉트 (샘플)', 4.4, 9, 'sample', 'sample', false, false, false),
  ('demo-005', '[샘플] 강원소나무하우스', '강원', '강원 평창군', 37.3705, 128.3905, '033-000-0001', array['COUNTRY_HOUSE', 'STAY_REST_HOUSE']::text[], '강원 전원주택·체류형 쉼터 상담 (샘플)', 4.8, 31, 'sample', 'sample', false, false, false),
  ('demo-006', '[샘플] 양양바다이동주택', '강원', '강원 양양군', 38.075, 128.6189, '033-000-0002', array['MOBILE_HOUSE', 'STAY_REST_HOUSE']::text[], '이동식 주택·체류형 쉼터 (샘플)', 4.5, 15, 'sample', 'sample', false, false, false),
  ('demo-007', '[샘플] 춘천호반건축', '강원', '강원 춘천시', 37.8813, 127.7298, '033-000-0003', array['COUNTRY_HOUSE', 'REMODEL']::text[], '전원주택·리모델링 콘셉트 (샘플)', 4.6, 21, 'sample', 'sample', false, false, false),
  ('demo-008', '[샘플] 충북패시브하우스', '충북', '충북 청주시', 36.6424, 127.489, '043-000-0001', array['PASSIVE_HOUSE', 'COUNTRY_HOUSE']::text[], '패시브하우스·전원주택 (샘플)', 4.9, 28, 'sample', 'sample', false, false, false),
  ('demo-009', '[샘플] 천안모듈러센터', '충남', '충남 천안시', 36.8151, 127.1139, '041-000-0001', array['MOBILE_HOUSE']::text[], '모듈러·이동식 주택 (샘플)', 4.3, 11, 'sample', 'sample', false, false, false),
  ('demo-010', '[샘플] 단양체류쉼터', '충북', '충북 단양군', 36.9847, 128.3656, '043-000-0002', array['STAY_REST_HOUSE']::text[], '체류형 쉼터 콘셉트 (샘플)', 4.5, 7, 'sample', 'sample', false, false, false),
  ('demo-011', '[샘플] 부산해운대건축사', '부산', '부산 해운대구', 35.1631, 129.1639, '051-000-0001', array['COUNTRY_HOUSE', 'REMODEL']::text[], '전원주택·리모델링 (샘플)', 4.7, 33, 'sample', 'sample', false, false, false),
  ('demo-012', '[샘플] 김해이동주택', '경남', '경남 김해시', 35.2342, 128.8896, '055-000-0001', array['MOBILE_HOUSE', 'STAY_REST_HOUSE']::text[], '이동식 주택·체류형 쉼터 (샘플)', 4.4, 14, 'sample', 'sample', false, false, false),
  ('demo-013', '[샘플] 경주전원하우스', '경북', '경북 경주시', 35.8562, 129.2247, '054-000-0001', array['COUNTRY_HOUSE']::text[], '전원주택 콘셉트 (샘플)', 4.6, 19, 'sample', 'sample', false, false, false),
  ('demo-014', '[샘플] 안동한옥&이동', '경북', '경북 안동시', 36.5684, 128.7294, '054-000-0002', array['MOBILE_HOUSE', 'COUNTRY_HOUSE']::text[], '이동식 주택·전원주택 (샘플)', 4.5, 16, 'sample', 'sample', false, false, false),
  ('demo-015', '[샘플] 통영바닷가쉼터', '경남', '경남 통영시', 34.8544, 128.4331, '055-000-0002', array['STAY_REST_HOUSE', 'MOBILE_HOUSE']::text[], '체류형 쉼터·이동식 주택 (샘플)', 4.7, 22, 'sample', 'sample', false, false, false),
  ('demo-016', '[샘플] 전주한옥건축', '전북', '전북 전주시', 35.8242, 127.148, '063-000-0001', array['COUNTRY_HOUSE', 'REMODEL']::text[], '전원주택·한옥 리모델링 (샘플)', 4.8, 27, 'sample', 'sample', false, false, false),
  ('demo-017', '[샘플] 순천만쉼터빌더', '전남', '전남 순천시', 34.9506, 127.4872, '061-000-0001', array['STAY_REST_HOUSE', 'COUNTRY_HOUSE']::text[], '체류형 쉼터·전원주택 (샘플)', 4.6, 20, 'sample', 'sample', false, false, false),
  ('demo-018', '[샘플] 여수섬이동주택', '전남', '전남 여수시', 34.7604, 127.6622, '061-000-0002', array['MOBILE_HOUSE']::text[], '이동식 주택 (샘플)', 4.4, 10, 'sample', 'sample', false, false, false),
  ('demo-019', '[샘플] 광주모듈러스튜디오', '광주', '광주 북구', 35.174, 126.912, '062-000-0001', array['MOBILE_HOUSE', 'PASSIVE_HOUSE']::text[], '모듈러·패시브하우스 (샘플)', 4.7, 25, 'sample', 'sample', false, false, false),
  ('demo-020', '[샘플] 제주돌담건축사', '제주', '제주 제주시', 33.4996, 126.5312, '064-000-0001', array['COUNTRY_HOUSE', 'STAY_REST_HOUSE']::text[], '전원주택·체류형 쉼터 (샘플)', 4.9, 35, 'sample', 'sample', false, false, false),
  ('demo-021', '[샘플] 서귀포팜스테이', '제주', '제주 서귀포시', 33.2541, 126.5601, '064-000-0002', array['STAY_REST_HOUSE', 'MOBILE_HOUSE']::text[], '체류형 쉼터·이동식 주택 (샘플)', 4.7, 26, 'sample', 'sample', false, false, false),
  ('demo-022', '[샘플] 한경면이동하우스', '제주', '제주 한경면', 33.3457, 126.177, '064-000-0003', array['MOBILE_HOUSE']::text[], '이동식 주택 (샘플)', 4.5, 13, 'sample', 'sample', false, false, false),
  ('public-001', '북촌 한옥 시공 사례 (공개자료 예시)', '서울', '서울 종로구', 37.5824, 126.9852, '', array['REMODEL', 'COUNTRY_HOUSE']::text[], '공개 자료 기반 표시 항목입니다 (가상).', null, null, 'public', 'public', true, false, false),
  ('public-002', '강원 산촌형 주택 사례 (공개자료 예시)', '강원', '강원 홍천군', 37.6907, 127.8842, '', array['COUNTRY_HOUSE', 'STAY_REST_HOUSE']::text[], '공개 자료 기반 표시 항목입니다 (가상).', null, null, 'public', 'public', true, false, false),
  ('public-003', '남해 모듈러 시공 사례 (공개자료 예시)', '경남', '경남 남해군', 34.8378, 127.8923, '', array['MOBILE_HOUSE', 'PASSIVE_HOUSE']::text[], '공개 자료 기반 표시 항목입니다 (가상).', null, null, 'public', 'public', true, false, false),
  ('verified-001', '동탄 전원주택 스튜디오 (예시 입점 업체)', '경기', '경기 화성시 동탄', 37.201, 127.0744, '031-555-1234', array['COUNTRY_HOUSE', 'PASSIVE_HOUSE']::text[], '전원주택과 패시브하우스 콘셉트 상담을 받습니다 (예시 입점 업체).', 4.8, 42, 'verified', 'user_submitted', false, true, true),
  ('verified-002', '양양 이동식 하우스 공방 (예시 입점 업체)', '강원', '강원 양양군', 38.09, 128.63, '033-555-5678', array['MOBILE_HOUSE', 'STAY_REST_HOUSE']::text[], '이동식 주택·체류형 쉼터 상담 (예시 입점 업체).', 4.7, 29, 'verified', 'user_submitted', false, true, true)
on conflict (id) do update set
  name = excluded.name,
  region = excluded.region,
  address = excluded.address,
  lat = excluded.lat,
  lng = excluded.lng,
  phone = excluded.phone,
  specialties = excluded.specialties,
  description = excluded.description,
  rating = excluded.rating,
  review_count = excluded.review_count,
  verified_status = excluded.verified_status,
  data_source = excluded.data_source,
  is_listed_without_consent = excluded.is_listed_without_consent,
  consent_given = excluded.consent_given,
  contact_public = excluded.contact_public,
  updated_at = now();

