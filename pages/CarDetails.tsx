import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { carService } from '../services/carService';
import { Car } from '../types';
import Button from '../components/Button';
import { Check, Calendar, ArrowLeft, Info, Settings, Zap, Loader2, Ban } from 'lucide-react';

const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCar = async () => {
      if (!id) return;
      setIsLoading(true);
      const data = await carService.getCarById(id);
      if (data) {
        setCar(data);
      } else {
        navigate('/fleet');
      }
      setIsLoading(false);
    };
    loadCar();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-luxury-gold" />
      </div>
    );
  }

  if (!car) return null;

  // Mock multiple images for the gallery based on the fetched image
  const images = [
    car.imageUrl,
    `https://picsum.photos/seed/${car.id}2/800/600`,
    `https://picsum.photos/seed/${car.id}3/800/600`
  ];

  return (
    <div className="pt-24 pb-24 min-h-screen bg-white">
      <div className="container mx-auto px-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 hover:text-luxury-black mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Fleet
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Left Column: Images */}
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-lg relative bg-slate-100">
               <img src={images[activeImage]} alt={car.name} className={`w-full h-full object-cover ${!car.available ? 'grayscale' : ''}`} />
               {!car.available && (
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                       <span className="bg-red-500 text-white px-6 py-2 rounded-full font-bold uppercase tracking-widest text-lg shadow-xl border-2 border-white transform -rotate-12">
                           Currently Unavailable
                       </span>
                   </div>
               )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-luxury-black opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt={`${car.name} view ${idx+1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Details */}
          <div>
            <div className="mb-2 flex items-center gap-3">
               <span className="bg-luxury-gold/10 text-luxury-goldHover px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {car.category}
               </span>
               <span className="text-slate-400 text-sm font-medium uppercase tracking-widest">{car.brand}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-luxury-black mb-6">{car.name}</h1>
            
            <div className="flex items-end gap-2 mb-8">
              <span className="text-4xl font-bold text-luxury-black">${car.pricePerDay}</span>
              <span className="text-slate-500 mb-1">/ day</span>
            </div>

            <p className="text-slate-600 leading-relaxed mb-8 text-lg">
              {car.description}
            </p>

            <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
              <h3 className="font-bold text-luxury-black mb-4 flex items-center gap-2">
                <Settings size={18} /> Specifications
              </h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                 <div>
                    <span className="block text-slate-400 text-xs uppercase tracking-wide mb-1">Engine</span>
                    <span className="font-semibold text-slate-800">{car.specs.engine}</span>
                 </div>
                 <div>
                    <span className="block text-slate-400 text-xs uppercase tracking-wide mb-1">Horsepower</span>
                    <span className="font-semibold text-slate-800">{car.specs.horsepower} hp</span>
                 </div>
                 <div>
                    <span className="block text-slate-400 text-xs uppercase tracking-wide mb-1">0-60 mph</span>
                    <span className="font-semibold text-slate-800">{car.specs.acceleration}</span>
                 </div>
                 <div>
                    <span className="block text-slate-400 text-xs uppercase tracking-wide mb-1">Transmission</span>
                    <span className="font-semibold text-slate-800">{car.specs.transmission}</span>
                 </div>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="font-bold text-luxury-black mb-4 flex items-center gap-2">
                <Zap size={18} /> Features
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {car.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-slate-600 text-sm">
                    <Check size={16} className="text-luxury-gold mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sticky bottom-6 bg-white/80 backdrop-blur-md p-4 sm:p-0 sm:static rounded-2xl border border-slate-200 sm:border-none shadow-xl sm:shadow-none">
              <div className="flex-1">
                 <Button 
                    fullWidth 
                    size="lg" 
                    disabled={!car.available}
                    className={!car.available ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' : ''}
                 >
                    {car.available ? 'Book Now' : 'Currently Unavailable'}
                 </Button>
              </div>
              <Button variant="outline" size="lg" className="px-6">
                <Calendar className="mr-2" size={18} /> Check Dates
              </Button>
            </div>
            
            <p className="mt-4 text-xs text-slate-400 flex items-center gap-1">
               <Info size={12} /> Free cancellation up to 48 hours before pick-up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;