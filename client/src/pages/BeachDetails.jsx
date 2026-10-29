import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { errMsg } from '../api';
import { FLAG, CROWD } from '../flag';
import TideChart from '../components/TideChart';
import BookingForm from '../components/BookingForm';
import ReviewSection from '../components/ReviewSection';

export default function BeachDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [open, setOpen] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try { setData((await api.get(`/beaches/${id}`)).data); } catch (e) { setError(errMsg(e)); }
  }, [id]);

  useEffect(() => {
    load();
    api.get(`/beaches/${id}/weather`).then((r) => setWeather(r.data)).catch(() => setWeather(null));
  }, [id, load]);

  if (error) return <p role="alert" className="text-red-600">{error}</p>;
  if (!data) return <p className="text-slate-600">Loading beach...</p>;
  const { beach, activities, reviews } = data;
  const flag = FLAG[beach.safetyStatus];
  const stats = [
    ['Air', weather ? `${weather.temp}°C` : '-'], ['Wind', weather ? `${weather.wind} km/h` : '-'],
    ['Humidity', weather ? `${weather.humidity}%` : '-'], ['Crowd', CROWD[beach.crowdLevel - 1]],
  ];

  return (
    <article className="card mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-extrabold">{beach.name}</h1>
      <span className="my-2 inline-block rounded-full border px-3 py-1 text-sm font-semibold" style={{ color: flag.color, borderColor: flag.color }}>{flag.label}</span>
      <p>{beach.description}</p>
      {beach.amenities?.length > 0 && <p className="mt-2 text-sm text-slate-600">Amenities: {beach.amenities.join(', ')}</p>}

      <div className="my-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(([k, v]) => (
          <div key={k} className="rounded-xl border border-slate-200 p-3">
            <b className="block font-display text-xl">{v}</b><span className="text-xs text-slate-600">{k}</span>
          </div>
        ))}
      </div>
      {weather && <p className="mb-4 text-sm capitalize text-slate-600">Conditions: {weather.description}{weather.source === 'sample' && ' (sample data: add an OpenWeatherMap key on the server for live weather)'}</p>}
      {weather?.tide && <><h2 className="mb-2 text-xl font-bold">Estimated tide today</h2><TideChart tide={weather.tide} /></>}

      <h2 className="mb-1 mt-6 text-xl font-bold">Activities</h2>
      {activities.length === 0 && <p className="text-sm text-slate-600">No bookable activities at this beach.</p>}
      {activities.map((a) => (
        <div key={a._id} className="border-b border-slate-200 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <b>{a.name}</b>
              <div className="text-sm text-slate-600">{a.price ? `₹${a.price} per person` : 'Free'} · {a.slotsLeft} spots left</div>
            </div>
            <button className="btn" disabled={a.slotsLeft === 0 || beach.safetyStatus === 'red'} onClick={() => setOpen(open === a._id ? null : a._id)}>
              {a.slotsLeft === 0 ? 'Sold out' : 'Book'}
            </button>
          </div>
          {open === a._id && <BookingForm activity={a} onBooked={load} onClose={() => setOpen(null)} />}
        </div>
      ))}
      {beach.safetyStatus === 'red' && <p className="mt-2 text-sm text-red-600">Booking is paused while the red flag is up.</p>}

      <div className="mt-6"><ReviewSection beachId={beach._id} reviews={reviews} onPosted={load} /></div>
    </article>
  );
}
