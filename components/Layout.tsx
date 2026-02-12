import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Car, Phone, Instagram, Twitter, Facebook, ShieldCheck } from 'lucide-react';
import GeminiAssistant from './GeminiAssistant';
import Button from './Button';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  // Hide Layout header/footer for Admin Routes to give it a dedicated feel
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Fleet', path: '/fleet' },
    { name: 'Services', path: '#' }, // Mock links
    { name: 'About', path: '#' },
  ];

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled || !isHome ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 z-50">
            <div className={`p-2 rounded-lg ${isScrolled || !isHome ? 'bg-luxury-black text-white' : 'bg-white text-luxury-black'}`}>
              <Car size={24} />
            </div>
            <span className={`text-xl font-bold tracking-tight ${isScrolled || !isHome ? 'text-luxury-black' : 'text-white'}`}>
              PRESTIGE<span className="font-light">MOTORS</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isScrolled || !isHome 
                    ? 'text-slate-600 hover:text-luxury-black' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Button variant={isScrolled || !isHome ? 'primary' : 'secondary'} size="sm">
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden z-50 text-slate-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
               <X className={isScrolled || !isHome ? 'text-slate-800' : 'text-white'} /> 
            ) : (
               <Menu className={isScrolled || !isHome ? 'text-slate-800' : 'text-white'} />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-white z-40 flex flex-col pt-24 px-6 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-bold py-4 border-b border-slate-100 text-slate-800"
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-8">
              <Button fullWidth onClick={() => setIsMobileMenuOpen(false)}>Book Now</Button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-luxury-black text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-lg bg-white text-luxury-black">
                  <Car size={20} />
                </div>
                <span className="text-lg font-bold">PRESTIGE<span className="font-light">MOTORS</span></span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Elevating your journey with the world's most exclusive fleet of luxury and performance vehicles. Experience the extraordinary.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">Company</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">Contact</h4>
              <div className="space-y-4 text-slate-400 text-sm">
                <div className="flex items-center gap-3">
                  <Phone size={16} />
                  <span>+1 (800) 999-9999</span>
                </div>
                <div className="flex gap-4 mt-6">
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-luxury-gold hover:text-luxury-black transition-all"><Instagram size={18} /></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-luxury-gold hover:text-luxury-black transition-all"><Twitter size={18} /></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-luxury-gold hover:text-luxury-black transition-all"><Facebook size={18} /></a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>&copy; 2025 Prestige Motors. All rights reserved.</p>
            <div className="flex items-center gap-6">
                <p>Designed for excellence.</p>
                <Link to="/admin" className="hover:text-luxury-gold transition-colors flex items-center gap-1 text-xs">
                    <ShieldCheck size={12} /> Admin
                </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Assistant */}
      <GeminiAssistant />
    </div>
  );
};

export default Layout;