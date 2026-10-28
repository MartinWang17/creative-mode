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

-- Only the server (secret key) can read or write these. No public access.
alter table public.members enable row level security;
alter table public.breakdowns enable row level security;
