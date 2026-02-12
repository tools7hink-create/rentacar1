import { supabase } from './supabase';
import { Car, CarCategory } from '../types';
import { FEATURED_CARS } from '../constants';

// Helper to map DB snake_case to App camelCase
const mapDbCarToCar = (dbCar: any): Car => {
  return {
    id: dbCar.id,
    name: dbCar.name,
    brand: dbCar.brand,
    category: dbCar.category as CarCategory,
    pricePerDay: Number(dbCar.price_per_day),
    imageUrl: dbCar.image_url,
    specs: {
      engine: dbCar.engine,
      horsepower: Number(dbCar.horsepower),
      acceleration: dbCar.acceleration,
      seats: Number(dbCar.seats),
      transmission: dbCar.transmission,
    },
    features: dbCar.features || [], // Assumes text[] array in Postgres
    available: dbCar.available,
    description: dbCar.description,
  };
};

export const carService = {
  getAllCars: async (): Promise<Car[]> => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*');

      if (error) {
        console.warn('Supabase error fetching cars, falling back to mock data:', error.message);
        return FEATURED_CARS;
      }

      if (!data || data.length === 0) {
        console.log('No cars found in DB, using mock data.');
        return FEATURED_CARS;
      }

      return data.map(mapDbCarToCar);
    } catch (err) {
      console.error('Unexpected error fetching cars:', err);
      return FEATURED_CARS;
    }
  },

  getCarById: async (id: string): Promise<Car | null> => {
    // First try to find in mock data to avoid DB call if it's a mock ID
    const mockCar = FEATURED_CARS.find(c => c.id === id);
    
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        // If DB fetch fails, check if we have it in mock data (fallback)
        if (mockCar) return mockCar;
        console.warn('Supabase error fetching car:', error?.message);
        return null;
      }

      return mapDbCarToCar(data);
    } catch (err) {
      console.error('Unexpected error fetching car:', err);
      return mockCar || null;
    }
  },

  getFeaturedCars: async (limit: number = 3): Promise<Car[]> => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .limit(limit);

      if (error) {
        return FEATURED_CARS.slice(0, limit);
      }

      if (!data || data.length === 0) {
        return FEATURED_CARS.slice(0, limit);
      }

      return data.map(mapDbCarToCar);
    } catch (err) {
      return FEATURED_CARS.slice(0, limit);
    }
  }
};