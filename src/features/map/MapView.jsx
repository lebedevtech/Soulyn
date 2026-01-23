import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import clsx from 'clsx';

// 1. КОМПОНЕНТ ДЛЯ ОТЛОВА ВЗАИМОДЕЙСТВИЙ
// Слушает и зум, и драг, чтобы вовремя отключить "слежение"
function UserInteractionHandler({ onInteraction }) {
  useMapEvents({
    dragstart: () => onInteraction && onInteraction(), // Начал тянуть
    zoomstart: () => onInteraction && onInteraction(), // Начал зумить
  });
  return null;
}

// 2. УМНЫЙ КОНТРОЛЛЕР КАМЕРЫ (INSTANT VERSION)
function MapController({ center, userLocation, followUser }) {
  const map = useMap();

  useEffect(() => {
    // Работаем только если включено слежение и есть координаты
    if (followUser && userLocation) {
      // Используем setView для мгновенной реакции вместо медленного flyTo
      map.setView(userLocation, 15, {
        animate: true,
        duration: 0.5, // Очень быстро (полсекунды)
        easeLinearity: 1, // Линейно, без "разгона"
        noMoveStart: true
      });
    }
  }, [userLocation, followUser, map]);

  return null;
}

export default function MapView({ 
  impulses = [], 
  venues = [], 
  mode = 'social', 
  userLocation, 
  followUser, 
  onImpulseClick, 
  onVenueClick,
  onUserInteraction // Функция отключения слежения, приходящая сверху
}) {
  const defaultCenter = [55.7558, 37.6173];

  // Иконка "Я"
  const myLocationIcon = L.divIcon({
    className: 'my-location-marker',
    html: `
      <div class="relative flex h-6 w-6">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-6 w-6 bg-blue-500 border-2 border-white shadow-lg"></span>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

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
      className="w-full h-full z-0 bg-[#050505]"
      zoomControl={false}
    >
      {/* Контроллер перемещения (по кнопке) */}
      <MapController 
        center={defaultCenter} 
        userLocation={userLocation} 
        followUser={followUser}
      />
      
      {/* Обработчик действий юзера (драг/зум) */}
      <UserInteractionHandler onInteraction={onUserInteraction} />

      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; CARTO'
        maxZoom={20}
      />

      {userLocation && (
        <Marker position={userLocation} icon={myLocationIcon} zIndexOffset={1000} />
      )}

      {mode === 'social' && impulses.map((imp) => {
        if (!imp.users) return null;
        return (
          <Marker 
            key={imp.id} 
            position={[imp.lat, imp.lng]} 
            icon={createSocialIcon(imp.users.avatar_url, imp.users.is_premium)}
            eventHandlers={{ click: () => { onUserInteraction && onUserInteraction(); onImpulseClick(imp); } }}
          />
        );
      })}

      {mode === 'places' && venues.map((venue) => (
        <Marker 
          key={venue.id} 
          position={[venue.lat, venue.lng]} 
          icon={createVenueIcon(venue.image_url, venue.is_partner)}
          eventHandlers={{ click: () => { onUserInteraction && onUserInteraction(); onVenueClick(venue); } }}
        />
      ))}
    </MapContainer>
  );
}