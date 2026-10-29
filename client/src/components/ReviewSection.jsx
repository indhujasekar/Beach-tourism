import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import { stars } from '../flag';

export default function ReviewSection({ beachId, reviews, onPosted }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', { beachId, rating, comment });
      setComment('');
      setError('');
      onPosted();
    } catch (err) { setError(errMsg(err)); }
  };

  return (
    <section>
      <h3 className="mb-2 text-xl font-bold">Reviews</h3>
      {reviews.length === 0 && <p className="text-sm text-slate-600">No reviews yet. Be the first to share how your visit went.</p>}
      {reviews.map((r) => (
        <div key={r._id} className="border-b border-slate-200 py-3">
          <span className="text-amber-500">{stars(r.rating)}</span> <b>{r.user?.name || 'Visitor'}</b>
          <p className="text-sm">{r.comment}</p>
        </div>
      ))}
      {user ? (
        <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-[100px_1fr_auto]">
          <label className="text-sm text-slate-600">Rating
            <input className="input mt-1" type="number" min="1" max="5" value={rating} onChange={(e) => setRating(+e.target.value)} />
          </label>
          <label className="text-sm text-slate-600">Your review
            <input className="input mt-1" maxLength="300" required value={comment} onChange={(e) => setComment(e.target.value)} />
          </label>
          <button className="btn self-end">Post review</button>
          {error && <p className="text-sm text-red-600 sm:col-span-3">{error}</p>}
        </form>
      ) : (
        <p className="mt-3 text-sm"><Link className="font-semibold underline" to="/login">Log in</Link> to write a review.</p>
      )}
    </section>
  );
}
