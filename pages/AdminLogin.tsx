import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock } from 'lucide-react';
import Button from '../components/Button';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would check against a backend or Supabase Auth.
    // For this prototype, we use a simple client-side check.
    if (password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-luxury-black rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="text-luxury-gold w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-luxury-black">Admin Portal</h1>
          <p className="text-slate-500">Secure Fleet Management</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold outline-none transition-all"
                placeholder="Enter admin password"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">
              {error}
            </div>
          )}

          <Button fullWidth type="submit" size="lg">
            Access Dashboard
          </Button>

          <div className="text-center">
            <span className="text-xs text-slate-400">Hint: admin123</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;