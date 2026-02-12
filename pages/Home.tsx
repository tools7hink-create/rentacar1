import React, { useEffect, useState } from 'react';
import { ArrowRight, Shield, Clock, Star, MapPin, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import CarCard from '../components/CarCard';
import { carService } from '../services/carService';
import { Car } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCars = async () => {
      setIsLoading(true);
      const cars = await carService.getFeaturedCars(3);
      setFeaturedCars(cars);
      setIsLoading(false);
    };
    loadCars();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070&auto=format&fit=crop" 
            alt="Luxury Car Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center text-white">
          <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-xs font-semibold uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
            Premium Car Rental
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
            Drive the <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Extraordinary</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-light">
            Experience the thrill of the world's most exclusive fleet. 
            From Italian supercars to British luxury SUVs, your journey begins here.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" onClick={() => navigate('/fleet')}>
              View Fleet
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black hover:border-white">
              Learn More
            </Button>
          </div>
        </div>

        {/* Decorative Scroll Down */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Search/Filter Bar (Floating) */}
      <div className="relative z-20 -mt-16 container mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-end border border-slate-100">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Location</label>
            <div className="flex items-center bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
              <MapPin className="text-slate-400 mr-3" size={20} />
              <input type="text" placeholder="Pick-up Location" className="bg-transparent w-full outline-none text-slate-800 font-medium" />
            </div>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Pick-up Date</label>
            <input type="date" className="w-full bg-slate-50 rounded-lg px-4 py-3 border border-slate-200 outline-none text-slate-800 font-medium" />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Return Date</label>
            <input type="date" className="w-full bg-slate-50 rounded-lg px-4 py-3 border border-slate-200 outline-none text-slate-800 font-medium" />
          </div>
          <div className="w-full md:w-auto">
             <Button size="lg" className="w-full md:w-auto h-[50px]" onClick={() => navigate('/fleet')}>Search Cars</Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-luxury-black mb-4">Why Choose Prestige?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We don't just rent cars; we curate experiences. Every detail is designed to ensure your drive is nothing short of perfection.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Shield, title: "Premium Insurance", desc: "Comprehensive coverage included with every rental for your peace of mind." },
              { icon: Clock, title: "24/7 Concierge", desc: "Our dedicated support team is available around the clock to assist you." },
              { icon: Star, title: "Guaranteed Model", desc: "Drive exactly what you booked. No 'or similar' surprises at the counter." }
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors duration-300">
                <div className="w-16 h-16 bg-blue-50 text-primary-600 rounded-full flex items-center justify-center mb-6">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-luxury-black mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Fleet */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-primary-600 font-semibold tracking-wider text-sm uppercase">Exclusive Selection</span>
              <h2 className="text-3xl md:text-4xl font-bold text-luxury-black mt-2">Featured Vehicles</h2>
            </div>
            <Button variant="ghost" onClick={() => navigate('/fleet')} className="hidden md:flex">
              View All Fleet <ArrowRight className="ml-2" size={18} />
            </Button>
          </div>

          {isLoading ? (
             <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-luxury-gold" />
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
            <Button variant="outline" onClick={() => navigate('/fleet')}>View All Fleet</Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-luxury-black text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to elevate your journey?</h2>
            <p className="text-slate-400 text-lg mb-8">Join our exclusive membership program for priority access and special rates on our entire fleet.</p>
            <div className="flex gap-4">
              <Button variant="secondary" size="lg">Become a Member</Button>
              <Button variant="outline" size="lg" className="border-slate-600 text-white hover:border-white">Contact Us</Button>
            </div>
          </div>
          <div className="relative">
             <div className="w-64 h-64 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-luxury-gold to-primary-900 opacity-20 blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
             {/* Abstract Representation of Speed/Luxury */}
             <div className="text-[200px] leading-none font-bold text-white/5 select-none pointer-events-none">
                GO
             </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;