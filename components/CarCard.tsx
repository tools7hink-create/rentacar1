import React from 'react';
import { Car } from '../types';
import { Users, Gauge, Zap, ArrowRight, Ban } from 'lucide-react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const navigate = useNavigate();

  return (
    <div className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col h-full ${!car.available ? 'opacity-75 grayscale-[0.5]' : ''}`}>
      <div className="relative h-64 overflow-hidden">
        <img 
          src={car.imageUrl} 
          alt={car.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 flex gap-2">
            {!car.available && (
                <div className="bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm flex items-center gap-1">
                    <Ban size={12} /> Booked
                </div>
            )}
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-800 shadow-sm">
            {car.category}
            </div>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wide">{car.brand}</h3>
          <h2 className="text-2xl font-bold text-luxury-black mt-1 group-hover:text-luxury-gold transition-colors">{car.name}</h2>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6 text-sm text-slate-600">
          <div className="flex flex-col items-center bg-slate-50 p-2 rounded-lg">
            <Gauge size={18} className="mb-1 text-slate-400" />
            <span className="font-semibold text-slate-800">{car.specs.acceleration}</span>
            <span className="text-[10px] text-slate-400">0-60 mph</span>
          </div>
          <div className="flex flex-col items-center bg-slate-50 p-2 rounded-lg">
            <Users size={18} className="mb-1 text-slate-400" />
            <span className="font-semibold text-slate-800">{car.specs.seats}</span>
            <span className="text-[10px] text-slate-400">Seats</span>
          </div>
          <div className="flex flex-col items-center bg-slate-50 p-2 rounded-lg">
            <Zap size={18} className="mb-1 text-slate-400" />
            <span className="font-semibold text-slate-800">{car.specs.horsepower}</span>
            <span className="text-[10px] text-slate-400">HP</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <span className="text-2xl font-bold text-luxury-black">${car.pricePerDay}</span>
            <span className="text-slate-400 text-sm">/day</span>
          </div>
          <Button 
            variant={car.available ? "outline" : "ghost"} 
            size="sm"
            onClick={() => navigate(`/fleet/${car.id}`)}
            className={`${car.available ? 'group-hover:bg-luxury-black group-hover:text-white group-hover:border-luxury-black' : ''} transition-colors`}
          >
            {car.available ? (
                <>Details <ArrowRight size={16} className="ml-2" /></>
            ) : (
                "Unavailable"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;