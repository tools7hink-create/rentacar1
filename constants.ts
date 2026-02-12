import { Car, CarCategory } from './types';

export const FEATURED_CARS: Car[] = [
  {
    id: 'c1',
    name: '911 Carrera S',
    brand: 'Porsche',
    category: CarCategory.SPORTS,
    pricePerDay: 450,
    imageUrl: 'https://picsum.photos/seed/porsche911/800/600',
    specs: {
      engine: '3.0L Twin-Turbo Flat-6',
      horsepower: 443,
      acceleration: '3.5s',
      seats: 4,
      transmission: 'PDK Automatic'
    },
    features: ['Sport Chrono Package', 'Bose Surround Sound', 'Apple CarPlay', 'Leather Interior'],
    available: true,
    description: 'The quintessential sports car. Experience the perfect blend of performance, comfort, and everyday usability with the iconic 911.'
  },
  {
    id: 'c2',
    name: 'Range Rover Autobiography',
    brand: 'Land Rover',
    category: CarCategory.SUV,
    pricePerDay: 600,
    imageUrl: 'https://picsum.photos/seed/rangerover/800/600',
    specs: {
      engine: '4.4L Twin-Turbo V8',
      horsepower: 523,
      acceleration: '4.4s',
      seats: 5,
      transmission: 'Automatic'
    },
    features: ['Massage Seats', 'Executive Class Rear Seating', 'Meridian Sound System', 'All-Wheel Steering'],
    available: true,
    description: 'Unmatched luxury and capability. The Range Rover Autobiography offers a sanctuary on wheels for any terrain.'
  },
  {
    id: 'c3',
    name: 'Model S Plaid',
    brand: 'Tesla',
    category: CarCategory.ELECTRIC,
    pricePerDay: 350,
    imageUrl: 'https://picsum.photos/seed/tesla/800/600',
    specs: {
      engine: 'Tri-Motor Electric',
      horsepower: 1020,
      acceleration: '1.99s',
      seats: 5,
      transmission: 'Direct Drive'
    },
    features: ['Full Self-Driving Capability', 'Yoke Steering', 'Gaming Computer', 'Immersive Sound'],
    available: true,
    description: 'The fastest accelerating production car. Futuristic technology meets incredible range and utility.'
  },
  {
    id: 'c4',
    name: 'Huracán EVO Spyder',
    brand: 'Lamborghini',
    category: CarCategory.CONVERTIBLE,
    pricePerDay: 1200,
    imageUrl: 'https://picsum.photos/seed/lambo/800/600',
    specs: {
      engine: '5.2L V10',
      horsepower: 630,
      acceleration: '3.1s',
      seats: 2,
      transmission: '7-speed Dual Clutch'
    },
    features: ['Convertible Top', 'Forged Composites', 'LDVI System', 'Virtual Cockpit'],
    available: true,
    description: 'Feel the sky and the roar of the V10. The Huracán EVO Spyder is designed to amplify your senses.'
  },
  {
    id: 'c5',
    name: 'S-Class S 580',
    brand: 'Mercedes-Benz',
    category: CarCategory.LUXURY,
    pricePerDay: 500,
    imageUrl: 'https://picsum.photos/seed/merc/800/600',
    specs: {
      engine: '4.0L V8 Biturbo',
      horsepower: 496,
      acceleration: '4.4s',
      seats: 5,
      transmission: '9G-TRONIC'
    },
    features: ['MBUX Hyperscreen', 'Burmester 4D Sound', 'Rear-Axle Steering', 'Ambient Lighting'],
    available: true,
    description: 'The benchmark for luxury sedans. Advanced technology wrapped in timeless elegance.'
  },
  {
    id: 'c6',
    name: 'Escalade ESV',
    brand: 'Cadillac',
    category: CarCategory.SUV,
    pricePerDay: 400,
    imageUrl: 'https://picsum.photos/seed/escalade/800/600',
    specs: {
      engine: '6.2L V8',
      horsepower: 420,
      acceleration: '5.9s',
      seats: 7,
      transmission: '10-speed Automatic'
    },
    features: ['Super Cruise', 'OLED Display', 'AKG Studio Reference System', 'Console Refrigerator'],
    available: true,
    description: 'Commanding presence and vast space. Perfect for executive travel or family road trips in style.'
  }
];

export const APP_NAME = "Prestige Motors";