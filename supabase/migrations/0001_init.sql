-- ============================================================
-- 집마켓 (House Market) 초기 스키마
-- Supabase Postgres + auth.users 기반
--
-- 적용 방법:
--   Supabase 대시보드 → SQL Editor → New query → 이 파일 전체 붙여넣기 → Run
-- ============================================================

-- ─── 1) Enums ────────────────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'verified_status') then
    create type verified_status as enum ('sample', 'public', 'pending', 'verified');
  end if;
  if not exists (select 1 from pg_type where typname = 'data_source') then
    create type data_source as enum ('sample', 'public', 'user_submitted');
  end if;
  if not exists (select 1 from pg_type where typname = 'consultation_status') then
    create type consultation_status as enum ('REQUESTED', 'READ', 'REPLIED', 'CLOSED');
  end if;
  if not exists (select 1 from pg_type where typname = 'consultation_sender_role') then
    create type consultation_sender_role as enum ('USER', 'COMPANY');
  end if;
  if not exists (select 1 from pg_type where typname = 'notification_type') then
    create type notification_type as enum (
      'CONSULTATION_REPLIED',
      'CONSULTATION_READ',
      'SYSTEM'
    );
  end if;
end$$;

-- ─── 2) Profiles (auth.users 확장) ───────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  phone text,
  is_company_owner boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 신규 가입 시 profiles 자동 생성
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── 3) Companies ───────────────────────────────────────────
create table if not exists public.companies (
  id text primary key,                       -- 데모 데이터 id 호환 (demo-001 등)
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  category text,
  specialties text[] default '{}'::text[],   -- BuildSpecialty 코드 배열
  description text,
  biz_number text,
  phone text,
  address text,
  region text,
  lat double precision,
  lng double precision,
  verified_status verified_status default 'sample',
  data_source data_source default 'sample',
  is_listed_without_consent boolean default false,
  consent_given boolean default false,
  contact_public boolean default false,
  rating numeric(2,1),
  review_count int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_companies_verified_status on public.companies(verified_status);
create index if not exists idx_companies_lat_lng on public.companies(lat, lng);

-- ─── 4) Consultation Requests ───────────────────────────────
create table if not exists public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  company_id text not null references public.companies(id) on delete cascade,
  project_id uuid,
  title text not null,
  message text not null,
  budget_won bigint,
  desired_area text,
  contact text,
  requester_name text,
  status consultation_status default 'REQUESTED',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_consultations_user on public.consultation_requests(user_id);
create index if not exists idx_consultations_company on public.consultation_requests(company_id);
create index if not exists idx_consultations_status on public.consultation_requests(status);

-- ─── 5) Consultation Messages ───────────────────────────────
create table if not exists public.consultation_messages (
  id uuid primary key default gen_random_uuid(),
  consultation_request_id uuid not null references public.consultation_requests(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  sender_role consultation_sender_role not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_messages_request on public.consultation_messages(consultation_request_id);

-- ─── 6) Notifications ───────────────────────────────────────
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type notification_type not null,
  title text not null,
  body text not null,
  link text,
  read_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_notifications_user_read on public.notifications(user_id, read_at);

-- ─── 7) Favorite Companies ──────────────────────────────────
create table if not exists public.favorite_companies (
  user_id uuid not null references public.profiles(id) on delete cascade,
  company_id text not null references public.companies(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, company_id)
);

-- ─── 8) Company Removal Requests ────────────────────────────
create table if not exists public.company_removal_requests (
  id uuid primary key default gen_random_uuid(),
  company_id text not null references public.companies(id) on delete cascade,
  requester_name text not null,
  requester_phone text,
  requester_email text,
  reason text not null,
  resolved boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_removal_company on public.company_removal_requests(company_id);
