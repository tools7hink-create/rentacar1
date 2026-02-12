-- 1. Create the 'cars' table (if it doesn't exist)
create table if not exists public.cars (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  brand text not null,
  category text not null,
  price_per_day numeric not null,
  image_url text not null,
  gallery_images text[] default '{}',
  engine text not null,
  horsepower numeric not null,
  acceleration text not null,
  seats numeric not null,
  transmission text not null,
  features text[] not null,
  available boolean default true,
  description text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security
alter table public.cars enable row level security;

-- 3. STORAGE: Create the 'fleet' bucket for images
insert into storage.buckets (id, name, public)
values ('fleet', 'fleet', true)
on conflict (id) do nothing;

-- 4. CLEANUP: Drop existing policies to ensure clean state (avoids conflicts)
drop policy if exists "Enable read access for all users" on public.cars;
drop policy if exists "Enable insert for all users" on public.cars;
drop policy if exists "Enable update for all users" on public.cars;
drop policy if exists "Enable delete for all users" on public.cars;
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Public Insert" on storage.objects;

-- 5. DATA POLICIES: Allow public access (Demo Mode)
-- In a real production app with Auth, you would change 'to public' to 'to authenticated' for write operations.

create policy "Enable read access for all users"
on public.cars for select to public using (true);

create policy "Enable insert for all users"
on public.cars for insert to public with check (true);

create policy "Enable update for all users"
on public.cars for update to public using (true);

create policy "Enable delete for all users"
on public.cars for delete to public using (true);

-- 6. STORAGE POLICIES: Allow public image hosting

create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'fleet' );

create policy "Public Insert"
on storage.objects for insert
with check ( bucket_id = 'fleet' );
