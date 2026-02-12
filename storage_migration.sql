-- 1. Create the 'fleet' bucket (if it doesn't exist)
insert into storage.buckets (id, name, public)
values ('fleet', 'fleet', true)
on conflict (id) do nothing;

-- 2. Drop existing policies to avoid conflicts during multiple runs
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Public Insert" on storage.objects;

-- 3. Allow public access to view images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'fleet' );

-- 4. Allow public insert (Required for the upload to work)
create policy "Public Insert"
on storage.objects for insert
with check ( bucket_id = 'fleet' );

-- 5. Update the cars table to support multiple gallery images
alter table public.cars 
add column if not exists gallery_images text[] default '{}';