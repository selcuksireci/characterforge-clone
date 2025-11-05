create table if not exists public."Users" (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text unique not null,
  profile_photo text,
  created_at timestamptz default now()
);

create table if not exists public."FishSpecies" (
  id uuid primary key default gen_random_uuid(),
  tur_adi text not null,
  mevsim int[][] not null,
  yasak_donem int[] default array[null::int, null::int],
  av_limit text,
  yem_tavsiyesi text,
  igne_numara text,
  misina_tavsiyesi text,
  inserted_at timestamptz default now()
);

create table if not exists public."PopLocations" (
  id uuid primary key default gen_random_uuid(),
  location_name text not null,
  lat numeric not null,
  lng numeric not null,
  best_season text,
  fish_types_available text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists public."Diaries" (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public."Users"(id) on delete cascade,
  fish_type text not null,
  size_cm numeric,
  date date not null,
  lat numeric,
  lng numeric,
  photo_url text,
  inserted_at timestamptz default now()
);

create table if not exists public."FeedPosts" (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public."Users"(id) on delete cascade,
  photo text,
  comment text,
  date timestamptz default now()
);
