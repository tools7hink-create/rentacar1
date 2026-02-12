import React from 'react';
import { HashRouter as Router, Routes, Route, ScrollRestoration } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Fleet from './pages/Fleet';
import CarDetails from './pages/CarDetails';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Simple scroll to top component
const ScrollToTop = () => {
  const { pathname } = React.useMemo(() => window.location, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/fleet/:id" element={<CarDetails />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;