-- Enable Write Access for the demo
-- Note: In a real production app with Auth, you would restrict these 'to authenticated' users only.

create policy "Enable insert for all users"
on public.cars
for insert
to public
with check (true);

create policy "Enable update for all users"
on public.cars
for update
to public
using (true);

create policy "Enable delete for all users"
on public.cars
for delete
to public
using (true);