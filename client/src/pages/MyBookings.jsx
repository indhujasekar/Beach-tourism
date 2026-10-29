import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';

export default function MyBookings() {
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.get('/bookings/mine').then((r) => setBookings(r.data)).catch((e) => setError(errMsg(e)));
  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    try { await api.put(`/bookings/${id}/cancel`); load(); } catch (e) { setError(errMsg(e)); }
  };

  return (
    <section className="card mx-auto max-w-3xl p-6">
      <h1 className="mb-3 text-2xl font-extrabold">My bookings</h1>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {bookings && bookings.length === 0 && <p className="text-slate-600">You have no bookings yet. Pick a beach and choose an activity to book.</p>}
      {bookings?.map((b) => (
        <div key={b._id} className="flex items-center justify-between gap-3 border-b border-slate-200 py-3">
          <div>
            <b>{b.activity?.name}</b> at {b.beach?.name}
            <div className="text-sm text-slate-600">
              {new Date(b.date).toLocaleDateString()} · {b.guests} guest{b.guests > 1 ? 's' : ''} · ₹{b.totalPrice} · {b.status}
            </div>
          </div>
          {b.status === 'confirmed' && <button className="btn-alt" onClick={() => cancel(b._id)}>Cancel booking</button>}
        </div>
      ))}
    </section>
  );
}
