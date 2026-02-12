import React, { useState, useEffect, useRef } from 'react';
import { Car, CarCategory } from '../types';
import { X, Save, Loader2, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import Button from './Button';
import { carService } from '../services/carService';

interface AdminCarFormProps {
  initialData?: Car | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (car: any) => Promise<void>;
}

const emptyCar = {
  name: '',
  brand: '',
  category: CarCategory.SEDAN,
  pricePerDay: 0,
  imageUrl: '',
  galleryImages: [] as string[],
  description: '',
  available: true,
  specs: {
    engine: '',
    horsepower: 0,
    acceleration: '',
    seats: 2,
    transmission: ''
  },
  features: [] as string[]
};

const AdminCarForm: React.FC<AdminCarFormProps> = ({ initialData, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<any>(emptyCar);
  const [featuresInput, setFeaturesInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setFeaturesInput(initialData.features.join(', '));
    } else {
      setFormData(emptyCar);
      setFeaturesInput('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const processedData = {
      ...formData,
      features: featuresInput.split(',').map(f => f.trim()).filter(f => f.length > 0)
    };

    await onSave(processedData);
    setIsSubmitting(false);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSpecChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      specs: { ...prev.specs, [field]: value }
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery: boolean = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      if (isGallery) {
        // Parallel upload for better performance
        const uploadPromises = Array.from(files).map(file => carService.uploadImage(file));
        const results = await Promise.all(uploadPromises);
        const newImages = results.filter((url): url is string => url !== null);

        setFormData((prev: any) => ({
          ...prev,
          galleryImages: [...(prev.galleryImages || []), ...newImages]
        }));
      } else {
        const url = await carService.uploadImage(files[0]);
        if (url) {
          handleChange('imageUrl', url);
        }
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload image. Please ensure your bucket is public.");
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = ''; // Reset input
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_: any, i: number) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-luxury-black">
            {initialData ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Images Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 flex items-center gap-2">
              <ImageIcon size={20} /> Imagery
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Main Image */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Main Image</label>
                <div className="relative aspect-[4/3] bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 overflow-hidden group hover:border-luxury-gold transition-colors">
                  {formData.imageUrl ? (
                    <>
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="secondary"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Change Image
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <Upload size={32} className="mb-2" />
                      <span className="text-sm">Click to upload main image</span>
                    </div>
                  )}
                  {isUploading && (
                     <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <Loader2 className="animate-spin text-luxury-gold" />
                     </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                  />
                </div>
                {/* Fallback URL input */}
                <div className="mt-2">
                    <input 
                        type="url" 
                        placeholder="Or enter image URL..."
                        value={formData.imageUrl}
                        onChange={e => handleChange('imageUrl', e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-luxury-gold outline-none text-slate-600 bg-slate-50"
                    />
                </div>
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Gallery Images</label>
                <div className="grid grid-cols-3 gap-2">
                  {formData.galleryImages?.map((img: string, idx: number) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-luxury-gold hover:text-luxury-gold transition-colors"
                  >
                    <PlusIcon />
                  </button>
                  <input 
                    type="file" 
                    ref={galleryInputRef} 
                    className="hidden" 
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e, true)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Basic Info */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Make / Brand</label>
                <input 
                  type="text" 
                  required
                  value={formData.brand}
                  onChange={e => handleChange('brand', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-luxury-gold focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Model Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => handleChange('name', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-luxury-gold focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={e => handleChange('category', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-luxury-gold focus:border-transparent outline-none"
                >
                  {Object.values(CarCategory).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price Per Day ($)</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  value={formData.pricePerDay}
                  onChange={e => handleChange('pricePerDay', Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-luxury-gold focus:border-transparent outline-none"
                />
              </div>
            </div>
          </section>

          {/* Specs */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Technical Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Engine</label>
                <input 
                  type="text" 
                  required
                  value={formData.specs.engine}
                  onChange={e => handleSpecChange('engine', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-luxury-gold focus:border-transparent outline-none"
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Horsepower</label>
                <input 
                  type="number" 
                  required
                  value={formData.specs.horsepower}
                  onChange={e => handleSpecChange('horsepower', Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-luxury-gold focus:border-transparent outline-none"
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">0-60 mph</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 3.2s"
                  value={formData.specs.acceleration}
                  onChange={e => handleSpecChange('acceleration', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-luxury-gold focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Seats</label>
                <input 
                  type="number" 
                  required
                  value={formData.specs.seats}
                  onChange={e => handleSpecChange('seats', Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-luxury-gold focus:border-transparent outline-none"
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Transmission</label>
                <input 
                  type="text" 
                  required
                  value={formData.specs.transmission}
                  onChange={e => handleSpecChange('transmission', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-luxury-gold focus:border-transparent outline-none"
                />
              </div>
            </div>
          </section>

          {/* Details */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Details & Features</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea 
                required
                rows={4}
                value={formData.description}
                onChange={e => handleChange('description', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-luxury-gold focus:border-transparent outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Features (comma separated)</label>
              <textarea 
                rows={2}
                placeholder="Bluetooth, Leather Seats, GPS..."
                value={featuresInput}
                onChange={e => setFeaturesInput(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-luxury-gold focus:border-transparent outline-none resize-none"
              />
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-lg">
               <input 
                 type="checkbox"
                 id="available"
                 checked={formData.available}
                 onChange={e => handleChange('available', e.target.checked)}
                 className="w-5 h-5 text-luxury-gold rounded focus:ring-luxury-gold border-gray-300"
               />
               <label htmlFor="available" className="font-medium text-slate-700">Available for Booking</label>
            </div>
          </section>

          <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="animate-spin mr-2" size={18} /> Saving...</> : <><Save className="mr-2" size={18} /> Save Vehicle</>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

export default AdminCarForm;
