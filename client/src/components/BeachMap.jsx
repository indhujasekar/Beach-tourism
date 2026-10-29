import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { FLAG } from '../flag';

export default function BeachMap({ beaches }) {
  const first = beaches[0]?.location.coordinates;
  const center = first ? [first[1], first[0]] : [12.9, 80.25];
  return (
    <MapContainer center={center} zoom={10} className="h-[380px] w-full rounded-2xl md:h-[520px]" scrollWheelZoom={false}>
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {beaches.map((b) => {
        const [lng, lat] = b.location.coordinates;
        const color = FLAG[b.safetyStatus].color;
        return (
          <CircleMarker key={b._id} center={[lat, lng]} radius={11} pathOptions={{ color: '#fff', weight: 3, fillColor: color, fillOpacity: 1 }}>
            <Popup>
              <b>{b.name}</b><br />
              <Link to={`/beaches/${b._id}`}>View details and book</Link>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
