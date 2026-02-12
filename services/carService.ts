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
    galleryImages: dbCar.gallery_images || [],
    specs: {
      engine: dbCar.engine,
      horsepower: Number(dbCar.horsepower),
      acceleration: dbCar.acceleration,
      seats: Number(dbCar.seats),
      transmission: dbCar.transmission,
    },
    features: dbCar.features || [], 
    available: dbCar.available,
    description: dbCar.description,
  };
};

export const carService = {
  getAllCars: async (): Promise<Car[]> => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase error fetching cars, falling back to mock data:', error.message);
        return FEATURED_CARS;
      }

      if (!data || data.length === 0) {
        return FEATURED_CARS;
      }

      return data.map(mapDbCarToCar);
    } catch (err) {
      console.error('Unexpected error fetching cars:', err);
      return FEATURED_CARS;
    }
  },

  getCarById: async (id: string): Promise<Car | null> => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        const mockCar = FEATURED_CARS.find(c => c.id === id);
        return mockCar || null;
      }

      return mapDbCarToCar(data);
    } catch (err) {
      const mockCar = FEATURED_CARS.find(c => c.id === id);
      return mockCar || null;
    }
  },

  getFeaturedCars: async (limit: number = 3): Promise<Car[]> => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('available', true)
        .limit(limit);

      if (error) {
        return FEATURED_CARS.slice(0, limit);
      }
      return data && data.length > 0 ? data.map(mapDbCarToCar) : FEATURED_CARS.slice(0, limit);
    } catch (err) {
      return FEATURED_CARS.slice(0, limit);
    }
  },

  submitBooking: async (bookingDetails: any): Promise<boolean> => {
    // Simulating an API call / Payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, you would insert into a 'bookings' table here:
    // const { error } = await supabase.from('bookings').insert([bookingDetails]);
    // return !error;

    console.log("Booking submitted:", bookingDetails);
    return true;
  },

  // --- Admin Operations ---

  uploadImage: async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Try uploading
      const { error: uploadError } = await supabase.storage
        .from('fleet')
        .upload(filePath, file);

      if (uploadError) {
        // Handle "Bucket not found" by attempting to create it
        if ((uploadError as any).message?.includes('Bucket not found') || (uploadError as any).statusCode === '404') {
            console.warn("Bucket 'fleet' not found. Attempting to auto-create...");
            
            const { error: createError } = await supabase.storage.createBucket('fleet', {
                public: true
            });

            if (createError) {
                console.error("Failed to auto-create bucket. Ensure SQL migration has been run.", createError);
                return null;
            }

            // Retry upload
            const { error: retryError } = await supabase.storage
                .from('fleet')
                .upload(filePath, file);

            if (retryError) {
                console.error('Retry upload failed:', retryError);
                return null;
            }
        } else {
            console.error('Error uploading image:', uploadError);
            return null;
        }
      }

      const { data } = supabase.storage.from('fleet').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error in uploadImage service:', error);
      return null;
    }
  },

  deleteCar: async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('cars').delete().eq('id', id);
    if (error) {
      console.error("Error deleting car:", error);
      return false;
    }
    return true;
  },

  createCar: async (car: Omit<Car, 'id'>): Promise<boolean> => {
    const dbCar = {
      name: car.name,
      brand: car.brand,
      category: car.category,
      price_per_day: car.pricePerDay,
      image_url: car.imageUrl,
      gallery_images: car.galleryImages,
      engine: car.specs.engine,
      horsepower: car.specs.horsepower,
      acceleration: car.specs.acceleration,
      seats: car.specs.seats,
      transmission: car.specs.transmission,
      features: car.features,
      available: car.available,
      description: car.description
    };

    const { error } = await supabase.from('cars').insert([dbCar]);
    if (error) {
      console.error("Error creating car:", error);
      return false;
    }
    return true;
  },

  updateCar: async (id: string, car: Partial<Car>): Promise<boolean> => {
    const updates: any = {};
    if (car.name) updates.name = car.name;
    if (car.brand) updates.brand = car.brand;
    if (car.category) updates.category = car.category;
    if (car.pricePerDay) updates.price_per_day = car.pricePerDay;
    if (car.imageUrl) updates.image_url = car.imageUrl;
    if (car.galleryImages) updates.gallery_images = car.galleryImages;
    if (car.available !== undefined) updates.available = car.available;
    if (car.description) updates.description = car.description;
    if (car.features) updates.features = car.features;
    
    // Handle nested specs flattening
    if (car.specs) {
      if (car.specs.engine) updates.engine = car.specs.engine;
      if (car.specs.horsepower) updates.horsepower = car.specs.horsepower;
      if (car.specs.acceleration) updates.acceleration = car.specs.acceleration;
      if (car.specs.seats) updates.seats = car.specs.seats;
      if (car.specs.transmission) updates.transmission = car.specs.transmission;
    }

    const { error } = await supabase.from('cars').update(updates).eq('id', id);
    if (error) {
      console.error("Error updating car:", error);
      return false;
    }
    return true;
  }
};