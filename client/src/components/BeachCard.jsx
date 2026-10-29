import { Link } from 'react-router-dom';
import { FLAG, CROWD, stars } from '../flag';

export default function BeachCard({ beach }) {
  const flag = FLAG[beach.safetyStatus];
  return (
    <Link to={`/beaches/${beach._id}`} className="card block p-4 hover:border-sea">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold">{beach.name}</h3>
        <span className="text-amber-500" aria-label={`${beach.avgRating} out of 5`}>{beach.reviewCount ? stars(beach.avgRating) : 'No reviews'}</span>
      </div>
      <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
        <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: flag.color }} />
        {flag.label.split(':')[0]} · {CROWD[beach.crowdLevel - 1]}
      </p>
      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{beach.description}</p>
    </Link>
  );
}
