import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { FLAG, CROWD, stars } from '../flag';

// Curated backup beaches with real imagery in case the API is offline or initial database is empty
const SAMPLE_FEATURED_BEACHES = [
  {
    _id: 'palm-cove-demo',
    name: 'Palm Cove',
    safetyStatus: 'green',
    crowdLevel: 1,
    avgRating: 4.8,
    reviewCount: 24,
    description: 'A calm, shallow bay ringed with coconut palms. Best for families, gentle swimming, and paddle sports.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    amenities: ['Lifeguard', 'Showers', 'Parking'],
    activities: ['Guided swim', 'Kayak rental']
  },
  {
    _id: 'coral-bay-demo',
    name: 'Coral Bay',
    safetyStatus: 'green',
    crowdLevel: 1,
    avgRating: 4.9,
    reviewCount: 38,
    description: 'Crystal-clear water over an accessible reef close to the shoreline. The most vibrant snorkelling spot on this coast.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    amenities: ['Lifeguard', 'Gear rental'],
    activities: ['Snorkel tour', 'Guided swim']
  },
  {
    _id: 'silver-sands-demo',
    name: 'Silver Sands',
    safetyStatus: 'yellow',
    crowdLevel: 3,
    avgRating: 4.5,
    reviewCount: 52,
    description: 'A long, golden stretch with steady waves and lively beachside shacks. Premier destination for surf coaching and sunset walks.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    amenities: ['Food stalls', 'Restrooms'],
    activities: ['Surf lesson', 'Swim coaching']
  },
  {
    _id: 'lagoon-shore-demo',
    name: 'Lagoon Shore',
    safetyStatus: 'green',
    crowdLevel: 2,
    avgRating: 4.7,
    reviewCount: 19,
    description: 'A sheltered natural lagoon with warm, peaceful water, offering calm paddling and safe swimming all day.',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
    amenities: ['Lifeguard', 'Restrooms', 'Cafe'],
    activities: ['Kayak rental', 'Snorkel tour']
  }
];

const ACTIVITIES = [
  {
    id: 'swimming',
    title: 'Open Water Swimming',
    description: 'Calm, sheltered coves with designated lifeguard patrol zones and crystal clear shallows.',
    icon: '🏊‍♀️',
    tag: 'Family Favorite',
    bg: 'from-blue-600 to-cyan-500'
  },
  {
    id: 'surfing',
    title: 'Surfing & Boarding',
    description: 'Consistent reef breaks and beach swells suitable for both beginners and seasoned wave riders.',
    icon: '🏄‍♂️',
    tag: 'Adrenaline',
    bg: 'from-cyan-600 to-teal-500'
  },
  {
    id: 'snorkeling',
    title: 'Reef Snorkeling',
    description: 'Explore thriving underwater ecosystems, colorful sea life, and shallow coral gardens.',
    icon: '🤿',
    tag: 'Marine Wonder',
    bg: 'from-teal-600 to-emerald-500'
  },
  {
    id: 'kayaking',
    title: 'Coastal Kayaking',
    description: 'Paddle through scenic ocean inlets, mangrove fringes, and serene tidal lagoons.',
    icon: '🛶',
    tag: 'Explorer',
    bg: 'from-emerald-600 to-sky-600'
  }
];

const SAFETY_FLAGS = [
  {
    type: 'green',
    color: '#2E9E5B',
    title: 'Green Flag',
    status: 'Low Hazard / Calm Conditions',
    advice: 'Safe for swimming and family water activities. Always stay within designated zones and keep an eye on young swimmers.'
  },
  {
    type: 'yellow',
    color: '#C99400',
    title: 'Yellow Flag',
    status: 'Medium Hazard / Moderate Surf',
    advice: 'Moderate waves or light undertow present. Weak or inexperienced swimmers should stay close to active lifeguard stations.'
  },
  {
    type: 'red',
    color: '#D64545',
    title: 'Red Flag',
    status: 'High Hazard / Strong Currents',
    advice: 'Rough surf and powerful rip currents. Swimming is prohibited or strictly limited to highly experienced surfers.'
  },
  {
    type: 'purple',
    color: '#9333EA',
    title: 'Purple Flag',
    status: 'Marine Pest Alert',
    advice: 'Jellyfish, sea urchins, stingrays, or other hazardous sea life detected near shore. Exercise extreme caution in the water.'
  }
];

const TESTIMONIALS = [
  {
    quote: 'Checking Shoreline’s live flag status before driving down to Palm Cove saved our family trip. The water was serene and the kids had a blast!',
    author: 'Elena Rostova',
    location: 'Visited Palm Cove with Family',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
  },
  {
    quote: 'Booked a beginner surf lesson directly through Shoreline at Silver Sands. The instructor was already at the shore with our boards ready. Super smooth!',
    author: 'Marcus Chen',
    location: 'Surfed at Silver Sands',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  {
    quote: 'The estimated tide chart and water visibility ratings helped us time our Coral Bay snorkeling tour perfectly at peak high tide. 10/10 recommendation.',
    author: 'Priya Sundaram',
    location: 'Snorkeled Coral Bay',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [beaches, setBeaches] = useState(SAMPLE_FEATURED_BEACHES);
  const [isLoadingBeaches, setIsLoadingBeaches] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingBeaches(true);
    api.get('/beaches')
      .then((res) => {
        if (isMounted && Array.isArray(res.data) && res.data.length > 0) {
          // Augment API beaches with sample photography if image is absent
          const enriched = res.data.slice(0, 4).map((b, idx) => ({
            ...b,
            image: b.image || SAMPLE_FEATURED_BEACHES[idx % SAMPLE_FEATURED_BEACHES.length].image
          }));
          setBeaches(enriched);
        }
      })
      .catch(() => {
        // Fallback to sample featured beaches if API is offline
      })
      .finally(() => {
        if (isMounted) setIsLoadingBeaches(false);
      });

    return () => { isMounted = false; };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (selectedActivity) params.append('activity', selectedActivity);
    navigate(`/explore?${params.toString()}`);
  };

  const handleActivitySelect = (actId) => {
    navigate(`/explore?activity=${actId}`);
  };

  return (
    <div className="space-y-16 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white shadow-xl">
        {/* Background decorative ocean wave glow */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-400 via-sky-500 to-transparent" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-6 py-16 md:py-24 text-center">
          {/* Live Status Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-950/60 px-4 py-1.5 text-xs md:text-sm font-medium text-teal-300 backdrop-blur-md mb-6">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="h-2 w-2 rounded-full bg-emerald-400 -ml-3" />
            <span>Live Coastal Advisory · Monitored Safety Flags & Tides</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Discover Pristine Shores. <br />
            <span className="bg-gradient-to-r from-teal-300 via-cyan-200 to-sky-300 bg-clip-text text-transparent">
              Swim Safely. Experience the Coast.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-slate-300 leading-relaxed">
            Real-time beach safety flags, wave and tide conditions, crowd forecasts, and instant booking for verified local water adventures.
          </p>

          {/* Interactive Search & Filter Card */}
          <form
            onSubmit={handleSearchSubmit}
            className="mx-auto mt-8 max-w-3xl rounded-2xl bg-white/95 p-3 md:p-4 text-ink shadow-2xl backdrop-blur-lg border border-white/20"
          >
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-3 text-slate-400 text-lg">🔍</span>
                <input
                  type="text"
                  placeholder="Search beaches, coves, bays (e.g. Palm Cove, Coral Bay)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sea"
                  aria-label="Beach search input"
                />
              </div>

              <div className="w-full md:w-48">
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sea"
                  aria-label="Filter by activity"
                >
                  <option value="">All Activities</option>
                  <option value="swimming">🏊 Swimming</option>
                  <option value="surfing">🏄 Surfing</option>
                  <option value="snorkeling">🤿 Snorkeling</option>
                  <option value="kayaking">🛶 Kayaking</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn py-2.5 px-6 font-semibold shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Find Beaches</span>
                <span>→</span>
              </button>
            </div>

            {/* Quick Filter Tags */}
            <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <span className="font-medium text-slate-500">Popular Quick Filters:</span>
              {['swimming', 'surfing', 'snorkeling', 'kayaking'].map((act) => (
                <button
                  type="button"
                  key={act}
                  onClick={() => handleActivitySelect(act)}
                  className="rounded-full bg-slate-100 px-3 py-1 hover:bg-teal-50 hover:text-sea transition capitalize"
                >
                  {act}
                </button>
              ))}
            </div>
          </form>

          {/* Highlights / Trust Metric Badges */}
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 border-t border-slate-800/80 pt-8 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-teal-300">100%</div>
              <div className="mt-1 text-xs md:text-sm text-slate-400">Lifeguard Status Monitored</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-teal-300">Real-Time</div>
              <div className="mt-1 text-xs md:text-sm text-slate-400">Tide & Wave Forecasts</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-teal-300">Instant</div>
              <div className="mt-1 text-xs md:text-sm text-slate-400">Activity Slot Booking</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-teal-300">4.9 ★</div>
              <div className="mt-1 text-xs md:text-sm text-slate-400">Coast Explorer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED BEACH DESTINATIONS */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sea">Curated Coastal Spots</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-ink mt-1">Featured Coastlines & Bays</h2>
            <p className="mt-1 text-sm text-slate-600">
              Hand-picked beaches with active safety flags, certified amenities, and top-rated water experiences.
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1 text-sm font-semibold text-sea hover:text-sea-dark hover:underline self-start md:self-auto"
          >
            <span>View All Beaches on Interactive Map</span>
            <span>→</span>
          </Link>
        </div>

        {isLoadingBeaches ? (
          <div className="card p-8 text-center text-slate-500 animate-pulse">
            Loading coastline status...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {beaches.map((beach) => {
              const flag = FLAG[beach.safetyStatus] || FLAG.green;
              return (
                <div
                  key={beach._id}
                  className="card group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Beach Photo & Status Badge */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-200">
                    <img
                      src={beach.image || SAMPLE_FEATURED_BEACHES[0].image}
                      alt={beach.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: flag.color }} />
                      <span>{flag.label.split(':')[0]}</span>
                    </div>

                    <div className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-ink shadow-sm backdrop-blur-md">
                      {CROWD[beach.crowdLevel ? beach.crowdLevel - 1 : 0]}
                    </div>
                  </div>

                  {/* Beach Details */}
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-lg font-bold text-ink group-hover:text-sea transition-colors">
                        {beach.name}
                      </h3>
                      <div className="text-xs text-amber-500 font-medium">
                        {beach.avgRating ? (
                          <span>{stars(beach.avgRating)} ({beach.avgRating.toFixed(1)})</span>
                        ) : (
                          <span className="text-slate-400">New Spot</span>
                        )}
                      </div>
                    </div>

                    <p className="mt-2 flex-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {beach.description}
                    </p>

                    {/* Amenities Badges */}
                    {beach.amenities && beach.amenities.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {beach.amenities.slice(0, 3).map((amenity, i) => (
                          <span key={i} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 font-medium">
                            ✓ {amenity}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        to={`/beaches/${beach._id}`}
                        className="btn w-full text-center text-xs py-2"
                      >
                        Explore & Check Tides
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. COASTAL ACTIVITIES SHOWCASE */}
      <section className="rounded-3xl bg-sea-light/50 p-6 md:p-10 border border-sea/10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-sea">Adventures by the Water</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-ink mt-1">Water Sports & Coastal Activities</h2>
          <p className="mt-2 text-sm text-slate-600">
            Book certified guides, surf instructors, and gear rentals at authorized beachfront spots with live capacity tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ACTIVITIES.map((act) => (
            <div
              key={act.id}
              onClick={() => handleActivitySelect(act.id)}
              className="card group cursor-pointer p-6 transition-all duration-300 hover:border-sea hover:shadow-md hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl border border-slate-100">
                    {act.icon}
                  </div>
                  <span className="rounded-full bg-sea/10 px-2.5 py-1 text-[11px] font-semibold text-sea">
                    {act.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-ink group-hover:text-sea transition-colors">
                  {act.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {act.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs font-semibold text-sea">
                <span>Browse spots</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. COMPREHENSIVE BEACH SAFETY & FLAG GUIDE */}
      <section id="safety-flags" className="scroll-mt-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Lifeguard Standards</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-ink mt-1">Beach Safety Flag System</h2>
          <p className="mt-2 text-sm text-slate-600">
            Before setting foot in the water, always check the posted beach safety flags. Here is what every coastal visitor must understand:
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SAFETY_FLAGS.map((f) => (
            <div key={f.type} className="card p-5 border-l-4" style={{ borderLeftColor: f.color }}>
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full" style={{ background: f.color }} />
                <h3 className="font-bold text-base text-ink">{f.title}</h3>
              </div>
              <div className="mt-1 font-semibold text-xs text-slate-700">{f.status}</div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">{f.advice}</p>
            </div>
          ))}
        </div>

        {/* Rip Current Survival & Ocean Safety Notice */}
        <div id="rip-currents" className="scroll-mt-8 rounded-2xl bg-gradient-to-r from-cyan-900 to-slate-900 p-6 md:p-8 text-white shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1">
              <span className="inline-block rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-300 uppercase tracking-wide">
                Critical Safety Knowledge
              </span>
              <h3 className="mt-2 text-xl font-extrabold text-white">How to Survive a Rip Current</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Rip currents are strong, narrow seaward-flowing channels of water. They pull swimmers away from the beach, not under water.
              </p>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm border border-white/10">
                <div className="text-xl mb-1">🛑 1. Don't Panic</div>
                <div className="text-xs text-slate-300">
                  Never fight or swim directly against the current. It exhausts your energy within minutes.
                </div>
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm border border-white/10">
                <div className="text-xl mb-1">🏊‍♂️ 2. Swim Parallel</div>
                <div className="text-xs text-slate-300">
                  Escape the pull by swimming parallel to the shoreline until you are out of the narrow current channel.
                </div>
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm border border-white/10">
                <div className="text-xl mb-1">🙋‍♀️ 3. Float & Signal</div>
                <div className="text-xs text-slate-300">
                  If you cannot break free, tread water, conserve your stamina, and wave an arm to alert lifeguards on shore.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TIDE & WEATHER AWARENESS */}
      <section id="tides" className="scroll-mt-8 card p-6 md:p-8 bg-white border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sea">Smart Coastal Planning</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-ink mt-1">Understanding Ocean Tides & Weather</h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Every beach in Shoreline provides an automated 24-hour tide curve and live weather data. Knowing the tide helps you make the most of every activity:
            </p>

            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="text-teal-600 font-bold">🌊</span>
                <span><strong>High Tide:</strong> Ideal for kayaking, paddle-boarding, and swimming without walking over exposed rocks.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-teal-600 font-bold">🏄</span>
                <span><strong>Mid-Rising Tide:</strong> Often generates the cleanest, most consistent wave peel for surfers.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-teal-600 font-bold">🦀</span>
                <span><strong>Low Tide:</strong> Best for beachcombing, uncovering vibrant tidal pools, and broad shoreline walks.</span>
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/explore" className="btn text-xs py-2 px-4">
                Check Today's Tide Forecasts
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-teal-50/60 p-6 border border-teal-100">
            <h4 className="font-bold text-ink text-sm uppercase tracking-wide mb-3 flex items-center justify-between">
              <span>Quick Beachgoer Checklist</span>
              <span className="text-sea text-xs font-semibold">Always Be Prepared</span>
            </h4>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl shadow-xs border border-slate-100">
                <span className="text-lg">🧴</span>
                <span><strong>Reef-Safe Sunscreen:</strong> Protect your skin without damaging sensitive marine coral reefs.</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl shadow-xs border border-slate-100">
                <span className="text-lg">💧</span>
                <span><strong>Hydration First:</strong> Ocean breeze masks dehydration. Drink fresh water every 45 minutes.</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl shadow-xs border border-slate-100">
                <span className="text-lg">🦺</span>
                <span><strong>Observe Lifeguard Towers:</strong> Only swim where lifeguards actively monitor the water.</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl shadow-xs border border-slate-100">
                <span className="text-lg">♻️</span>
                <span><strong>Leave No Trace:</strong> Take all trash with you and keep our beaches pristine for all.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COMMUNITY TESTIMONIALS */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-sea">Loved by Travelers</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-ink mt-1">What Coastal Explorers Say</h2>
          <p className="mt-2 text-sm text-slate-600">
            Real stories from tourists, families, and water sports enthusiasts who plan their days with Shoreline.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, index) => (
            <div key={index} className="card p-6 flex flex-col justify-between">
              <div>
                <div className="text-amber-500 text-sm mb-3">{'★'.repeat(t.rating)}</div>
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="h-10 w-10 rounded-full object-cover border border-teal-200"
                />
                <div>
                  <div className="font-bold text-xs text-ink">{t.author}</div>
                  <div className="text-[11px] text-slate-500">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CALL TO ACTION BANNER */}
      <section className="rounded-3xl bg-gradient-to-r from-sea to-teal-800 p-8 md:p-12 text-white shadow-xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
            Ready to Explore the Coastline?
          </h2>
          <p className="mt-2 text-sm md:text-base text-teal-100">
            Check live flags, find quiet uncrowded spots, or book your next surf session in seconds.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/explore"
            className="rounded-full bg-white px-6 py-3 text-sm font-bold text-sea shadow-md hover:bg-slate-100 transition"
          >
            Open Interactive Map
          </Link>
          <Link
            to="/register"
            className="rounded-full border border-white/40 bg-teal-950/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition backdrop-blur-sm"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
}
