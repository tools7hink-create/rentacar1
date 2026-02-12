
export enum CarCategory {
  SUV = 'SUV',
  SEDAN = 'Sedan',
  SPORTS = 'Sports',
  LUXURY = 'Luxury',
  CONVERTIBLE = 'Convertible',
  ELECTRIC = 'Electric'
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  category: CarCategory;
  pricePerDay: number;
  imageUrl: string;
  galleryImages: string[];
  specs: {
    engine: string;
    horsepower: number;
    acceleration: string; // 0-60 mph
    seats: number;
    transmission: string;
  };
  features: string[];
  available: boolean;
  description: string;
}

export interface Booking {
  id: string;
  carId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
