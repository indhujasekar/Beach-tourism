import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Home from './pages/Home';
import BeachDetails from './pages/BeachDetails';
import Auth from './pages/Auth';
import MyBookings from './pages/MyBookings';
import Admin from './pages/Admin';

function Protected({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-ink">
      <Navbar />
      <main className="flex-1 mx-auto max-w-6xl w-full p-4 md:p-6">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/explore" element={<Home />} />
          <Route path="/beaches/:id" element={<BeachDetails />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route path="/bookings" element={<Protected><MyBookings /></Protected>} />
          <Route path="/admin" element={<Protected roles={['admin', 'operator']}><Admin /></Protected>} />
          <Route path="*" element={<p className="p-8 text-center text-slate-600">Page not found.</p>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
