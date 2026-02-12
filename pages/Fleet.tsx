import React, { useState, useMemo, useEffect } from 'react';
import { carService } from '../services/carService';
import { Car, CarCategory } from '../types';
import CarCard from '../components/CarCard';
import { Loader2 } from 'lucide-react';

const Fleet: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCars = async () => {
      setIsLoading(true);
      const data = await carService.getAllCars();
      setCars(data);
      setIsLoading(false);
    };
    loadCars();
  }, []);

  const categories = ['All', ...Object.values(CarCategory)];

  const filteredCars = useMemo(() => {
    if (selectedCategory === 'All') return cars;
    return cars.filter(car => car.category === selectedCategory);
  }, [selectedCategory, cars]);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-luxury-black mb-4">Our Elite Fleet</h1>
          <p className="text-slate-500 text-lg">Choose from our meticulously maintained collection of the world's finest automobiles.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-luxury-black text-white shadow-lg transform scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Car Grid */}
        {isLoading ? (
          <div className="flex justify-center py-24">
             <Loader2 className="w-12 h-12 animate-spin text-luxury-gold" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}

        {!isLoading && filteredCars.length === 0 && (
          <div className="text-center py-24">
            <h3 className="text-2xl font-bold text-slate-400">No vehicles found in this category.</h3>
            <button 
              onClick={() => setSelectedCategory('All')}
              className="mt-4 text-primary-600 hover:text-primary-800 font-medium"
            >
              View all vehicles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Fleet;