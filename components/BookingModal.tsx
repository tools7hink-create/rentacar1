import React, { useState, useEffect } from 'react';
import { Car } from '../types';
import { X, Calendar, CreditCard, CheckCircle2, Loader2, ChevronRight } from 'lucide-react';
import Button from './Button';
import { carService } from '../services/carService';

interface BookingModalProps {
  car: Car;
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ car, isOpen, onClose }) => {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [dates, setDates] = useState({ start: '', end: '' });
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setDates({ start: '', end: '' });
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate days and total price
  const startDate = new Date(dates.start);
  const endDate = new Date(dates.end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  const isValidDateRange = dates.start && dates.end && endDate > startDate;
  const numDays = isValidDateRange ? diffDays : 0;
  const totalPrice = numDays * car.pricePerDay;

  const handleNext = () => {
    if (step === 'details' && isValidDateRange && customer.name && customer.email) {
      setStep('payment');
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    // Simulate booking submission
    await carService.submitBooking({
      carId: car.id,
      ...customer,
      startDate: dates.start,
      endDate: dates.end,
      totalPrice
    });
    setIsSubmitting(false);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-luxury-black text-white p-6 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{car.name}</h3>
            <p className="text-luxury-gold text-sm font-medium uppercase tracking-wider">{car.brand}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 'details' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pick-up</label>
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    value={dates.start}
                    onChange={(e) => setDates({ ...dates, start: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-luxury-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Return</label>
                  <input 
                    type="date" 
                    min={dates.start || new Date().toISOString().split('T')[0]}
                    value={dates.end}
                    onChange={(e) => setDates({ ...dates, end: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-luxury-gold outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={customer.name}
                  onChange={(e) => setCustomer({...customer, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:border-luxury-gold outline-none"
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={customer.email}
                  onChange={(e) => setCustomer({...customer, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:border-luxury-gold outline-none"
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  value={customer.phone}
                  onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:border-luxury-gold outline-none"
                />
              </div>

              {isValidDateRange && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="text-slate-500 text-sm">{numDays} days</span>
                    <div className="font-bold text-lg text-luxury-black">${totalPrice.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Total includes taxes</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'payment' && (
             <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="bg-luxury-gold/10 p-4 rounded-xl border border-luxury-gold/20">
                    <div className="flex justify-between mb-2">
                        <span className="text-slate-600">Vehicle</span>
                        <span className="font-bold text-luxury-black">{car.brand} {car.name}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-slate-600">Dates</span>
                        <span className="font-medium text-luxury-black">{dates.start} to {dates.end}</span>
                    </div>
                    <div className="border-t border-luxury-gold/20 my-2 pt-2 flex justify-between items-center">
                        <span className="text-lg font-bold text-luxury-black">Total</span>
                        <span className="text-xl font-bold text-luxury-black">${totalPrice.toLocaleString()}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-sm text-slate-500 font-medium">Payment Method</p>
                    <div className="flex gap-3">
                        <div className="flex-1 border-2 border-luxury-gold bg-white p-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer">
                            <CreditCard size={18} className="text-luxury-black" />
                            <span className="font-bold text-sm">Credit Card</span>
                        </div>
                        <div className="flex-1 border border-slate-200 bg-slate-50 p-3 rounded-lg flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                            <span className="font-bold text-sm">Crypto</span>
                        </div>
                    </div>
                    
                    {/* Mock Card Input */}
                    <div className="relative">
                         <div className="absolute inset-0 bg-slate-50/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Secure Demo Transaction</span>
                         </div>
                         <div className="p-4 border border-slate-200 rounded-lg bg-white opacity-50">
                             <div className="h-4 bg-slate-100 rounded w-full mb-3"></div>
                             <div className="flex gap-4">
                                 <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                                 <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                             </div>
                         </div>
                    </div>
                </div>
             </div>
          )}

          {step === 'success' && (
              <div className="text-center py-8 animate-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-luxury-black mb-2">Booking Confirmed!</h3>
                  <p className="text-slate-500 mb-8">
                      Thank you, {customer.name}. Your {car.brand} {car.name} has been reserved. 
                      A confirmation email has been sent to {customer.email}.
                  </p>
                  <Button onClick={onClose} fullWidth>Done</Button>
              </div>
          )}
        </div>

        {/* Footer */}
        {step !== 'success' && (
          <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
            {step === 'payment' && (
                 <Button variant="ghost" onClick={() => setStep('details')} disabled={isSubmitting}>Back</Button>
            )}
            {step === 'details' ? (
                <Button 
                    onClick={handleNext} 
                    disabled={!isValidDateRange || !customer.name || !customer.email}
                    className="w-full sm:w-auto"
                >
                    Continue <ChevronRight size={18} className="ml-2" />
                </Button>
            ) : (
                <Button 
                    onClick={handleConfirm} 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto min-w-[150px]"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : `Pay $${totalPrice.toLocaleString()}`}
                </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;