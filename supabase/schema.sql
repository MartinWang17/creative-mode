-- Creative Mode database. Paste this whole file into Supabase > SQL Editor > New query, then Run.
-- Safe to run again.

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  stripe_customer_id text unique,
  stripe_subscription_id text,
  plan text,
  status text,
  founding boolean default false,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.breakdowns (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  creator_handle text,
  summary text,
  html text not null,
  published boolean not null default false,
  is_free boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- Emails from the sales page after doors close, for the next launch.
create table if not exists public.waitlist (
  email text primary key,
  created_at timestamptz not null default now()
);

-- Only the server (secret key) can read or write these. No public access.
alter table public.members enable row level security;
alter table public.breakdowns enable row level security;
alter table public.waitlist enable row level security;

-- Member resources: free training, checklist, Hook Vault, Script Pack, future bonuses.
-- Files and covers live in the private storage bucket "resources"; the site hands out short-lived links.
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  blurb text,
  storage_path text,
  cover_path text,
  link text,
  annual_only boolean not null default false,
  available_at timestamptz,
  published boolean not null default false,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.resources enable row level security;

insert into storage.buckets (id, name, public)
values ('resources', 'resources', false)
on conflict (id) do nothing;

-- Answers from the branded survey page (/survey), sent in launch emails.
create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  email text,
  followers text,
  answer text not null,
  created_at timestamptz not null default now()
);
alter table public.survey_responses enable row level security;

-- Library tags: the creator's main winning format, and how hard it is to copy.
alter table public.breakdowns add column if not exists format text;
alter table public.breakdowns add column if not exists difficulty text;

-- Library: where the creator started (Blew up from under 10K / 10K to 100K / Already 100K+),
-- and a one-line "went from X to Y in Z months" shown at the top of each breakdown.
alter table public.breakdowns add column if not exists size text;
alter table public.breakdowns add column if not exists growth text;

-- Private feedback from the box under free breakdowns. Only Admin reads it (never shown publicly).
create table if not exists public.breakdown_feedback (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  rating text,
  answer text,
  email text,
  created_at timestamptz not null default now()
);
alter table public.breakdown_feedback enable row level security;
