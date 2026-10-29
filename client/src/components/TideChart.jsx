export default function TideChart({ tide }) {
  const now = new Date().getHours();
  const pts = tide.map((h, i) => `${20 + i * 22},${95 - h * 36}`).join(' ');
  return (
    <svg viewBox="0 0 560 120" className="w-full rounded-xl border border-slate-200 bg-sea-light" role="img" aria-label="Estimated tide height today">
      <polyline points={pts} fill="none" stroke="#0E7C86" strokeWidth="3" />
      <line x1={20 + now * 22} x2={20 + now * 22} y1="10" y2="100" stroke="#0B2B3B" strokeDasharray="3 3" />
      <text x={25 + now * 22} y="20" fontSize="11">Now</text>
      <text x="16" y="116" fontSize="11">12am</text>
      <text x="262" y="116" fontSize="11">12pm</text>
      <text x="520" y="116" fontSize="11">12am</text>
    </svg>
  );
}
