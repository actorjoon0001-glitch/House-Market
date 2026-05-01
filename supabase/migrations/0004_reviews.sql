-- 상담 후기 테이블 + RLS
-- 적용: Supabase SQL Editor에서 실행

create table if not exists public.consultation_reviews (
  id uuid primary key default gen_random_uuid(),
  consultation_request_id uuid not null references public.consultation_requests(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  company_id text not null references public.companies(id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  body text,
  created_at timestamptz default now(),
  unique (consultation_request_id)
);

create index if not exists idx_reviews_company on public.consultation_reviews(company_id);
create index if not exists idx_reviews_user on public.consultation_reviews(user_id);

alter table public.consultation_reviews enable row level security;

-- 모두 읽기 가능 (공개 후기)
drop policy if exists "reviews select all" on public.consultation_reviews;
create policy "reviews select all" on public.consultation_reviews
  for select using (true);

-- 본인이 자기 상담에 대해서만 insert 가능
drop policy if exists "reviews insert by user" on public.consultation_reviews;
create policy "reviews insert by user" on public.consultation_reviews
  for insert with check (
    auth.uid() = user_id
    and consultation_request_id in (
      select id from public.consultation_requests where user_id = auth.uid()
    )
  );

-- 본인 후기만 update / delete
drop policy if exists "reviews update own" on public.consultation_reviews;
create policy "reviews update own" on public.consultation_reviews
  for update using (auth.uid() = user_id);

drop policy if exists "reviews delete own" on public.consultation_reviews;
create policy "reviews delete own" on public.consultation_reviews
  for delete using (auth.uid() = user_id);
