-- ============================================================
-- Row Level Security 정책
-- 핵심 원칙:
--   - profiles: 본인만 read/update
--   - companies: 누구나 read (verified_status 별 노출은 클라이언트 정책으로)
--                기록은 owner 또는 인증된 사용자
--   - consultation_requests: user_id == auth.uid() 또는 company.owner_id == auth.uid()
--   - consultation_messages: 같은 상담의 user 또는 company owner
--   - notifications/favorites: 본인만
--   - company_removal_requests: 누구나 insert (요청자 보호용), read는 admin만 (지금은 막아둠)
-- ============================================================

alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.consultation_requests enable row level security;
alter table public.consultation_messages enable row level security;
alter table public.notifications enable row level security;
alter table public.favorite_companies enable row level security;
alter table public.company_removal_requests enable row level security;

-- ─── profiles ────────────────────────────────────────────────
drop policy if exists "profiles select own" on public.profiles;
create policy "profiles select own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
  for update using (auth.uid() = id);

-- ─── companies ──────────────────────────────────────────────
drop policy if exists "companies select all" on public.companies;
create policy "companies select all" on public.companies
  for select using (true);

drop policy if exists "companies update by owner" on public.companies;
create policy "companies update by owner" on public.companies
  for update using (auth.uid() = owner_id);

-- 입점 신청은 인증된 사용자가 자기 자신을 owner로 insert
drop policy if exists "companies insert by owner" on public.companies;
create policy "companies insert by owner" on public.companies
  for insert with check (auth.uid() = owner_id);

-- ─── consultation_requests ──────────────────────────────────
drop policy if exists "consultations select participant" on public.consultation_requests;
create policy "consultations select participant" on public.consultation_requests
  for select using (
    auth.uid() = user_id
    or auth.uid() in (
      select owner_id from public.companies where id = company_id
    )
  );

drop policy if exists "consultations insert by user" on public.consultation_requests;
create policy "consultations insert by user" on public.consultation_requests
  for insert with check (auth.uid() = user_id);

drop policy if exists "consultations update participant" on public.consultation_requests;
create policy "consultations update participant" on public.consultation_requests
  for update using (
    auth.uid() = user_id
    or auth.uid() in (
      select owner_id from public.companies where id = company_id
    )
  );

-- ─── consultation_messages ──────────────────────────────────
drop policy if exists "messages select participant" on public.consultation_messages;
create policy "messages select participant" on public.consultation_messages
  for select using (
    consultation_request_id in (
      select id from public.consultation_requests
      where user_id = auth.uid()
        or auth.uid() in (
          select owner_id from public.companies where id = company_id
        )
    )
  );

drop policy if exists "messages insert participant" on public.consultation_messages;
create policy "messages insert participant" on public.consultation_messages
  for insert with check (
    auth.uid() = sender_id
    and consultation_request_id in (
      select id from public.consultation_requests
      where user_id = auth.uid()
        or auth.uid() in (
          select owner_id from public.companies where id = company_id
        )
    )
  );

-- ─── notifications ──────────────────────────────────────────
drop policy if exists "notifications select own" on public.notifications;
create policy "notifications select own" on public.notifications
  for select using (auth.uid() = user_id);

drop policy if exists "notifications update own" on public.notifications;
create policy "notifications update own" on public.notifications
  for update using (auth.uid() = user_id);

-- 알림 insert는 SECURITY DEFINER 함수에서 처리 (직접 insert 금지)
-- 데모용으로 본인이 자기 알림 만들 수 있게 임시 허용:
drop policy if exists "notifications insert by self" on public.notifications;
create policy "notifications insert by self" on public.notifications
  for insert with check (auth.uid() = user_id);

-- ─── favorite_companies ─────────────────────────────────────
drop policy if exists "favorites select own" on public.favorite_companies;
create policy "favorites select own" on public.favorite_companies
  for select using (auth.uid() = user_id);

drop policy if exists "favorites insert own" on public.favorite_companies;
create policy "favorites insert own" on public.favorite_companies
  for insert with check (auth.uid() = user_id);

drop policy if exists "favorites delete own" on public.favorite_companies;
create policy "favorites delete own" on public.favorite_companies
  for delete using (auth.uid() = user_id);

-- ─── company_removal_requests ───────────────────────────────
-- 인증 없이도 누구나 요청 insert (악성 방지는 rate limit + 어드민 검토로)
drop policy if exists "removal insert anyone" on public.company_removal_requests;
create policy "removal insert anyone" on public.company_removal_requests
  for insert with check (true);
