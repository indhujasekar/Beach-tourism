import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand & Mission */}
          <div className="md:col-span-1">
            <Link to="/" className="font-display text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="text-teal-400">🌊</span> Shoreline
            </Link>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Your real-time coastal companion. Live sea safety flags, tide estimates, weather forecasts, and certified coastal activity bookings.
            </p>
            <div className="mt-4 flex items-center gap-3 text-slate-400 text-sm">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Coastal monitors active</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-semibold text-white tracking-wide text-sm uppercase">Explore & Discover</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li><Link to="/explore" className="hover:text-teal-300 transition-colors">Find Beaches</Link></li>
              <li><Link to="/explore?activity=swimming" className="hover:text-teal-300 transition-colors">Family Swim Bays</Link></li>
              <li><Link to="/explore?activity=surfing" className="hover:text-teal-300 transition-colors">Surfing Beaches</Link></li>
              <li><Link to="/explore?activity=snorkeling" className="hover:text-teal-300 transition-colors">Coral Reefs & Snorkeling</Link></li>
              <li><Link to="/explore?activity=kayaking" className="hover:text-teal-300 transition-colors">Kayak Rentals</Link></li>
            </ul>
          </div>

          {/* Coastal Safety Resources */}
          <div>
            <h4 className="font-semibold text-white tracking-wide text-sm uppercase">Safety & Guides</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li><a href="#safety-flags" className="hover:text-teal-300 transition-colors">Beach Flag Meanings</a></li>
              <li><a href="#rip-currents" className="hover:text-teal-300 transition-colors">Rip Current Survival</a></li>
              <li><a href="#tides" className="hover:text-teal-300 transition-colors">Tides & Sea Conditions</a></li>
              <li><span className="text-amber-400 font-medium">Emergency: Call 112 / Coastguard</span></li>
              <li><span className="text-xs text-slate-500">Always follow local lifeguard instructions</span></li>
            </ul>
          </div>

          {/* Account & Operators */}
          <div>
            <h4 className="font-semibold text-white tracking-wide text-sm uppercase">Account & Partners</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li><Link to="/login" className="hover:text-teal-300 transition-colors">Log In</Link></li>
              <li><Link to="/register" className="hover:text-teal-300 transition-colors">Sign Up as Tourist</Link></li>
              <li><Link to="/register" className="hover:text-teal-300 transition-colors">Register as Activity Operator</Link></li>
              <li><Link to="/bookings" className="hover:text-teal-300 transition-colors">Manage My Bookings</Link></li>
              <li><Link to="/admin" className="hover:text-teal-300 transition-colors">Operator Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Shoreline Tourism Portal. Crafted for beachgoers and ocean lovers.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Safety Guidelines</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Notice</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
