import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';

const empty = { name: '', description: '', lat: '', lng: '', safetyStatus: 'green', crowdLevel: 2 };

export default function Admin() {
  const [beaches, setBeaches] = useState([]);
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState({ ok: true, text: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const load = () => api.get('/beaches', { params: { sort: 'name' } }).then((r) => setBeaches(r.data));
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    try {
      await api.post('/beaches', form);
      setForm(empty);
      setMsg({ ok: true, text: 'Beach added' });
      load();
    } catch (err) { setMsg({ ok: false, text: errMsg(err) }); }
  };
  const update = async (id, patch) => {
    try { await api.put(`/beaches/${id}`, patch); load(); } catch (err) { setMsg({ ok: false, text: errMsg(err) }); }
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this beach and its activities and reviews?')) return;
    try { await api.delete(`/beaches/${id}`); load(); } catch (err) { setMsg({ ok: false, text: errMsg(err) }); }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[340px_1fr]">
      <form onSubmit={add} className="card grid gap-3 self-start p-4">
        <h2 className="text-xl font-bold">Add a beach</h2>
        <input className="input" placeholder="Name" required value={form.name} onChange={set('name')} aria-label="Name" />
        <textarea className="input" placeholder="Description" value={form.description} onChange={set('description')} aria-label="Description" />
        <div className="grid grid-cols-2 gap-2">
          <input className="input" placeholder="Latitude" required value={form.lat} onChange={set('lat')} aria-label="Latitude" />
          <input className="input" placeholder="Longitude" required value={form.lng} onChange={set('lng')} aria-label="Longitude" />
        </div>
        <select className="input" value={form.safetyStatus} onChange={set('safetyStatus')} aria-label="Safety flag">
          <option value="green">Green flag</option><option value="yellow">Yellow flag</option><option value="red">Red flag</option>
        </select>
        <button className="btn">Add beach</button>
        {msg.text && <p role="status" className={`text-sm ${msg.ok ? 'text-green-700' : 'text-red-600'}`}>{msg.text}</p>}
      </form>

      <section className="card p-4">
        <h2 className="mb-2 text-xl font-bold">Beaches ({beaches.length})</h2>
        {beaches.map((b) => (
          <div key={b._id} className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 py-3">
            <b>{b.name}</b>
            <div className="flex gap-2">
              <select className="input w-auto" aria-label={`Safety flag for ${b.name}`} value={b.safetyStatus} onChange={(e) => update(b._id, { safetyStatus: e.target.value })}>
                <option value="green">Green</option><option value="yellow">Yellow</option><option value="red">Red</option>
              </select>
              <button className="btn-alt" onClick={() => remove(b._id)}>Delete</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
