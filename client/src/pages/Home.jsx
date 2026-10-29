import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { errMsg } from '../api';
import BeachCard from '../components/BeachCard';
import BeachMap from '../components/BeachMap';

const TYPES = ['swimming', 'surfing', 'snorkeling', 'kayaking'];

export default function Home() {
  const [searchParams] = useSearchParams();
  const [q, setQ] = useState(() => searchParams.get('q') || '');
  const [types, setTypes] = useState(() => {
    const act = searchParams.get('activity');
    return act ? act.split(',').filter(Boolean) : [];
  });
  const [sort, setSort] = useState('rating');
  const [pos, setPos] = useState(null);
  const [beaches, setBeaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get('/beaches', {
          params: { q: q || undefined, sort, activity: types.join(',') || undefined, lat: pos?.lat, lng: pos?.lng },
        });
        setBeaches(data);
        setError('');
      } catch (e) { setError(errMsg(e)); } finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [q, types, sort, pos]);

  const toggle = (t) => setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  const locate = () => navigator.geolocation.getCurrentPosition(
    (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
    () => setError('Location access was blocked. Allow it in your browser to see beaches near you.')
  );

  return (
    <div className="grid gap-6 md:grid-cols-[360px_1fr]">
      <div>
        <div className="card mb-3 grid gap-3 p-4">
          <input className="input" type="search" placeholder="Search beaches" aria-label="Search beaches" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="flex flex-wrap gap-2" role="group" aria-label="Activities">
            {TYPES.map((t) => (
              <button key={t} aria-pressed={types.includes(t)} onClick={() => toggle(t)}
                className={`rounded-full border px-3 py-1 text-sm capitalize ${types.includes(t) ? 'border-sea bg-sea text-white' : 'border-slate-300'}`}>{t}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <select className="input" aria-label="Sort beaches" value={sort} onChange={(e) => setSort(e.target.value)} disabled={!!pos}>
              <option value="rating">Top rated</option>
              <option value="crowd">Quietest first</option>
              <option value="name">Name A to Z</option>
            </select>
            {pos ? <button className="btn-alt whitespace-nowrap" onClick={() => setPos(null)}>Clear location</button>
                 : <button className="btn-alt whitespace-nowrap" onClick={locate}>Near me</button>}
          </div>
        </div>
        {error && <p role="alert" className="mb-3 text-sm text-red-600">{error}</p>}
        <div className="grid gap-3">
          {loading && <p className="text-sm text-slate-600">Loading beaches...</p>}
          {!loading && beaches.length === 0 && !error && <p className="card p-6 text-center text-slate-600">No beaches match. Clear a filter to see more.</p>}
          {beaches.map((b) => <BeachCard key={b._id} beach={b} />)}
        </div>
      </div>
      <div className="md:sticky md:top-4 md:self-start"><BeachMap beaches={beaches} /></div>
    </div>
  );
}
