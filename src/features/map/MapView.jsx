import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import clsx from 'clsx';

// Компонент для обновления центра карты при смене координат
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapView({ 
  impulses = [], 
  venues = [], 
  mode = 'social', // 'social' или 'places'
  onImpulseClick, 
  onVenueClick 
}) {
  const defaultCenter = [55.7558, 37.6173]; // Москва

  // Генератор иконок для ЛЮДЕЙ (Круглые)
  const createSocialIcon = (url, isPremium) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="relative w-12 h-12">
          <div class="${clsx(
            "w-full h-full rounded-full border-2 overflow-hidden shadow-lg bg-black",
            isPremium ? "border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)]" : "border-primary"
          )}">
            <img src="${url}" class="w-full h-full object-cover" />
          </div>
          ${isPremium ? '<div class="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-3 h-3 border border-black"></div>' : ''}
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });
  };

  // Генератор иконок для ЗАВЕДЕНИЙ (Квадратные с логотипом)
  const createVenueIcon = (url, isPartner) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="relative w-14 h-14">
          <div class="${clsx(
            "w-full h-full rounded-2xl border-2 overflow-hidden shadow-2xl bg-black",
            isPartner ? "border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]" : "border-white/20"
          )}">
            <img src="${url}" class="w-full h-full object-cover" />
          </div>
          <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-0.5 rounded-full border border-white/10">
            <span class="text-[8px] font-black text-white uppercase tracking-wider block">Place</span>
          </div>
        </div>
      `,
      iconSize: [56, 56],
      iconAnchor: [28, 28],
    });
  };

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={14} 
      className="w-full h-full z-0 bg-[#050505]" // Темный фон пока не загрузится плитка
      zoomControl={false}
    >
      <ChangeView center={defaultCenter} />
      
      {/* ТЕМНАЯ КАРТА (CartoDB DarkMatter) */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains='abcd'
        maxZoom={20}
      />

      {/* СЛОЙ SOCIAL (Люди) */}
      {mode === 'social' && impulses.map((imp) => {
        if (!imp.users) return null;
        return (
          <Marker 
            key={imp.id} 
            position={[imp.lat, imp.lng]} 
            icon={createSocialIcon(imp.users.avatar_url, imp.users.is_premium)}
            eventHandlers={{ click: () => onImpulseClick(imp) }}
          />
        );
      })}

      {/* СЛОЙ PLACES (Заведения) */}
      {mode === 'places' && venues.map((venue) => (
        <Marker 
          key={venue.id} 
          position={[venue.lat, venue.lng]} 
          icon={createVenueIcon(venue.image_url, venue.is_partner)}
          eventHandlers={{ click: () => onVenueClick(venue) }}
        />
      ))}

    </MapContainer>
  );
}