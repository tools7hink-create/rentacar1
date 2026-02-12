-- 1. Create the 'cars' table
create table public.cars (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  brand text not null,
  category text not null,
  price_per_day numeric not null,
  image_url text not null,
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

-- 2. Enable Row Level Security (RLS)
alter table public.cars enable row level security;

-- 3. Create a policy that allows public read access (essential for your app to work)
create policy "Enable read access for all users"
on public.cars
for select
to public
using (true);

-- 4. Seed the table with your initial fleet data (from constants.ts)
insert into public.cars (name, brand, category, price_per_day, image_url, engine, horsepower, acceleration, seats, transmission, features, available, description)
values
  (
    '911 Carrera S',
    'Porsche',
    'Sports',
    450,
    'https://picsum.photos/seed/porsche911/800/600',
    '3.0L Twin-Turbo Flat-6',
    443,
    '3.5s',
    4,
    'PDK Automatic',
    ARRAY['Sport Chrono Package', 'Bose Surround Sound', 'Apple CarPlay', 'Leather Interior'],
    true,
    'The quintessential sports car. Experience the perfect blend of performance, comfort, and everyday usability with the iconic 911.'
  ),
  (
    'Range Rover Autobiography',
    'Land Rover',
    'SUV',
    600,
    'https://picsum.photos/seed/rangerover/800/600',
    '4.4L Twin-Turbo V8',
    523,
    '4.4s',
    5,
    'Automatic',
    ARRAY['Massage Seats', 'Executive Class Rear Seating', 'Meridian Sound System', 'All-Wheel Steering'],
    true,
    'Unmatched luxury and capability. The Range Rover Autobiography offers a sanctuary on wheels for any terrain.'
  ),
  (
    'Model S Plaid',
    'Tesla',
    'Electric',
    350,
    'https://picsum.photos/seed/tesla/800/600',
    'Tri-Motor Electric',
    1020,
    '1.99s',
    5,
    'Direct Drive',
    ARRAY['Full Self-Driving Capability', 'Yoke Steering', 'Gaming Computer', 'Immersive Sound'],
    true,
    'The fastest accelerating production car. Futuristic technology meets incredible range and utility.'
  ),
  (
    'Huracán EVO Spyder',
    'Lamborghini',
    'Convertible',
    1200,
    'https://picsum.photos/seed/lambo/800/600',
    '5.2L V10',
    630,
    '3.1s',
    2,
    '7-speed Dual Clutch',
    ARRAY['Convertible Top', 'Forged Composites', 'LDVI System', 'Virtual Cockpit'],
    true,
    'Feel the sky and the roar of the V10. The Huracán EVO Spyder is designed to amplify your senses.'
  ),
  (
    'S-Class S 580',
    'Mercedes-Benz',
    'Luxury',
    500,
    'https://picsum.photos/seed/merc/800/600',
    '4.0L V8 Biturbo',
    496,
    '4.4s',
    5,
    '9G-TRONIC',
    ARRAY['MBUX Hyperscreen', 'Burmester 4D Sound', 'Rear-Axle Steering', 'Ambient Lighting'],
    true,
    'The benchmark for luxury sedans. Advanced technology wrapped in timeless elegance.'
  ),
  (
    'Escalade ESV',
    'Cadillac',
    'SUV',
    400,
    'https://picsum.photos/seed/escalade/800/600',
    '6.2L V8',
    420,
    '5.9s',
    7,
    '10-speed Automatic',
    ARRAY['Super Cruise', 'OLED Display', 'AKG Studio Reference System', 'Console Refrigerator'],
    true,
    'Commanding presence and vast space. Perfect for executive travel or family road trips in style.'
  );