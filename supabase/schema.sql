-- ============================================================
-- Legends EOR — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- after creating the project. Safe to run once on a fresh project.
-- ============================================================

-- Shared trigger to keep updated_at fresh
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------- Content tables ----------
-- All content types share the same core columns (title, slug, body,
-- SEO fields, status). Type-specific columns noted per table.

create table if not exists blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  body text,
  excerpt text,
  featured_image text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  meta_title text,
  meta_description text,
  noindex boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists news_articles (
  like blogs including all
);

create table if not exists guides (
  like blogs including all
);

create table if not exists case_studies (
  like blogs including all,
  client text,
  cost_reduction text,
  team_location text,
  logo_image text
);

create table if not exists services (
  like blogs including all,
  icon text,
  sort_order int not null default 0
);

create table if not exists hr_glossary (
  like blogs including all,
  letter char(1)
);

create table if not exists problem_pillars (
  like blogs including all,
  sort_order int not null default 0
);

create table if not exists problem_clusters (
  like blogs including all,
  pillar_id uuid references problem_pillars (id) on delete set null
);

create table if not exists tools (
  like blogs including all,
  tool_url text
);

-- updated_at triggers
do $$
declare t text;
begin
  foreach t in array array['blogs','news_articles','guides','case_studies','services','hr_glossary','problem_pillars','problem_clusters','tools']
  loop
    execute format('drop trigger if exists %I_updated_at on %I', t, t);
    execute format('create trigger %I_updated_at before update on %I for each row execute function set_updated_at()', t, t);
  end loop;
end $$;

-- ---------- Leads ----------
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  audience text not null default 'employer' check (audience in ('employer', 'jobseeker')),
  company text,
  message text,
  source text,
  created_at timestamptz not null default now()
);

-- ---------- Salary benchmarking (editable via CMS later) ----------
create table if not exists salary_benchmarks (
  id bigint generated always as identity primary key,
  country_code char(2) not null,
  job_title text not null,
  period text not null check (period in ('monthly', 'annual')),
  base_currency char(3) not null default 'USD',
  low numeric(18, 2) not null,
  median numeric(18, 2) not null,
  high numeric(18, 2) not null,
  unique (country_code, job_title, period)
);

create table if not exists salary_countries (
  code char(2) primary key,
  name text not null
);

-- ---------- Row Level Security ----------
-- Public (anon) may READ published content only. Writing requires an
-- authenticated user (the CMS admin). Leads: anon may INSERT only.

do $$
declare t text;
begin
  foreach t in array array['blogs','news_articles','guides','case_studies','services','hr_glossary','problem_pillars','problem_clusters','tools']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "public read published" on %I', t);
    execute format('create policy "public read published" on %I for select using (status = ''published'')', t);
    execute format('drop policy if exists "authenticated full access" on %I', t);
    execute format('create policy "authenticated full access" on %I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

alter table leads enable row level security;
drop policy if exists "anon can insert leads" on leads;
create policy "anon can insert leads" on leads for insert with check (true);
drop policy if exists "authenticated read leads" on leads;
create policy "authenticated read leads" on leads for select to authenticated using (true);

alter table salary_benchmarks enable row level security;
drop policy if exists "public read benchmarks" on salary_benchmarks;
create policy "public read benchmarks" on salary_benchmarks for select using (true);
drop policy if exists "authenticated write benchmarks" on salary_benchmarks;
create policy "authenticated write benchmarks" on salary_benchmarks for all to authenticated using (true) with check (true);

alter table salary_countries enable row level security;
drop policy if exists "public read countries" on salary_countries;
create policy "public read countries" on salary_countries for select using (true);
drop policy if exists "authenticated write countries" on salary_countries;
create policy "authenticated write countries" on salary_countries for all to authenticated using (true) with check (true);

-- ---------- Storage bucket for CMS image uploads ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "authenticated upload media" on storage.objects;
create policy "authenticated upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');
drop policy if exists "authenticated manage media" on storage.objects;
create policy "authenticated manage media" on storage.objects
  for update to authenticated using (bucket_id = 'media');
