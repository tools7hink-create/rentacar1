import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { carService } from '../services/carService';
import { Car } from '../types';
import { Plus, Edit2, Trash2, LogOut, Search, Loader2 } from 'lucide-react';
import Button from '../components/Button';
import AdminCarForm from '../components/AdminCarForm';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin');
      return;
    }
    loadCars();
  }, [navigate]);

  const loadCars = async () => {
    setIsLoading(true);
    const data = await carService.getAllCars();
    setCars(data);
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingCar(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
      const success = await carService.deleteCar(id);
      if (success) {
        setCars(cars.filter(c => c.id !== id));
      } else {
        alert('Failed to delete car');
      }
    }
  };

  const handleSave = async (carData: any) => {
    if (editingCar) {
      const success = await carService.updateCar(editingCar.id, carData);
      if (success) loadCars();
    } else {
      const success = await carService.createCar(carData);
      if (success) loadCars();
    }
    setIsFormOpen(false);
  };

  const filteredCars = cars.filter(car => 
    car.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    car.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-luxury-black">Fleet Management</h1>
            <p className="text-slate-500">Manage your vehicle inventory</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleCreate}>
              <Plus size={20} className="mr-2" /> Add Vehicle
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut size={18} className="mr-2" /> Logout
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by make or model..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:border-luxury-gold"
            />
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-luxury-gold w-10 h-10" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price / Day</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCars.map(car => (
                    <tr key={car.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={car.imageUrl || 'https://via.placeholder.com/100x75?text=No+Image'} 
                            alt={car.name} 
                            className="w-16 h-12 object-cover rounded-lg bg-slate-200" 
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x75?text=Error';
                            }}
                          />
                          <div>
                            <div className="font-bold text-slate-800">{car.name}</div>
                            <div className="text-xs text-slate-500">{car.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">
                          {car.category}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-luxury-black">${car.pricePerDay}</td>
                      <td className="p-4">
                        {car.available ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
                            Booked
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(car)}
                            className="p-2 text-slate-500 hover:text-luxury-gold hover:bg-yellow-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(car.id)}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCars.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        No vehicles found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AdminCarForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={editingCar}
        onSave={handleSave}
      />
    </div>
  );
};

export default AdminDashboard;
