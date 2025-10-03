import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Globe } from 'lucide-react';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Custom weather icon
const weatherIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1146/1146869.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Helper component to update map view when coords change
const ChangeView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

interface LocationMapProps {
  coords: { lat: number; lon: number } | null;
  location: string;
  mapStyle: 'standard' | 'satellite' | 'dark';
}

const LocationMap: React.FC<LocationMapProps> = ({ coords, location, mapStyle }) => {
  const getMapTileUrl = () => {
    switch (mapStyle) {
      case 'satellite':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      case 'dark':
        return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-md border-cyan-500/30 shadow-2xl shadow-cyan-500/20 h-96">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-cyan-300">
          <MapPin className="w-5 h-5" />
          Location Map
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-full">
        {coords ? (
          <MapContainer
            center={[coords.lat, coords.lon]}
            zoom={8}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
            className="rounded-b-lg"
          >
            <ChangeView center={[coords.lat, coords.lon]} zoom={8} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={getMapTileUrl()}
            />
            <Marker position={[coords.lat, coords.lon]} icon={weatherIcon}>
              <Popup className="font-semibold">{location}</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-cyan-200/70 bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
            <Globe className="w-16 h-16 mb-4 opacity-50" />
            <p>Search for a location to see it on the map</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationMap;