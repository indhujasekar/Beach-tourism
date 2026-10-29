import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const link = ({ isActive }) => `rounded-full px-3 py-1.5 text-sm font-semibold ${isActive ? 'bg-sea text-white' : 'text-slate-600 hover:bg-slate-100'}`;
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 p-4">
        <Link to="/" className="font-display text-2xl font-extrabold flex items-center gap-2 text-ink">
          <span className="text-sea">🌊</span> Shoreline
        </Link>
        <nav className="flex flex-wrap items-center gap-1">
          <NavLink to="/" end className={link}>Home</NavLink>
          <NavLink to="/explore" className={link}>Explore Beaches</NavLink>
          <a href="/#safety-flags" className="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">Safety Guide</a>
          {user && <NavLink to="/bookings" className={link}>My bookings</NavLink>}
          {user && ['admin', 'operator'].includes(user.role) && <NavLink to="/admin" className={link}>Manage beaches</NavLink>}
          {user ? (
            <button className="btn-alt ml-2" onClick={logout}>Log out ({user.name})</button>
          ) : (
            <>
              <NavLink to="/login" className={link}>Log in</NavLink>
              <NavLink to="/register" className={link}>Sign up</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
