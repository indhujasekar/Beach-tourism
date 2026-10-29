import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';

export default function BookingForm({ activity, onBooked, onClose }) {
  const { user } = useAuth();
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [guests, setGuests] = useState(1);
  const [msg, setMsg] = useState({ ok: false, text: '' });
  const [busy, setBusy] = useState(false);

  if (!user) return <p className="py-2 text-sm">Please <Link className="font-semibold underline" to="/login">log in</Link> to book this activity.</p>;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/bookings', { activityId: activity._id, date, guests });
      setMsg({ ok: true, text: 'Booking confirmed' });
      onBooked();
    } catch (err) {
      setMsg({ ok: false, text: errMsg(err) });
    } finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="mt-2 grid gap-3 rounded-xl border border-sea p-3 sm:grid-cols-3">
      <label className="text-sm text-slate-600">Date
        <input className="input mt-1" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} required />
      </label>
      <label className="text-sm text-slate-600">Guests
        <input className="input mt-1" type="number" min="1" max={activity.slotsLeft} value={guests} onChange={(e) => setGuests(+e.target.value)} required />
      </label>
      <div className="flex items-end gap-2">
        <button className="btn" disabled={busy}>{busy ? 'Booking...' : `Confirm (₹${activity.price * guests})`}</button>
        <button type="button" className="btn-alt" onClick={onClose}>Close</button>
      </div>
      {msg.text && <p role="status" className={`text-sm sm:col-span-3 ${msg.ok ? 'text-green-700' : 'text-red-600'}`}>{msg.text}</p>}
    </form>
  );
}
