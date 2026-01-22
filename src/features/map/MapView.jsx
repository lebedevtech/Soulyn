import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

// Принудительный ресайз для исключения артефактов при загрузке
function FixMapSize() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => { map.invalidateSize(); }, 500);
  }, [map]);
  return null;
}

export default function MapView({ impulses = [], onImpulseClick }) {
  // Тот самый дизайн маркера: фото + неон + пульс
  const createCustomIcon = (imp) => {
    return L.divIcon({
      className: 'custom-impulse-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute inset-0 w-12 h-12 bg-primary/30 rounded-full blur-md animate-pulse"></div>
          <div class="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-[0_0_15px_rgba(139,92,246,0.5)] z-10">
            <img src="${imp.img}" class="w-full h-full object-cover" />
          </div>
          <div class="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-black flex items-center justify-center z-20 shadow-lg">
            <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24]
    });
  };

  return (
    <div className="w-full h-full bg-black">
      <MapContainer 
        center={[55.7532, 37.6225]} 
        zoom={14} 
        zoomControl={false}
        attributionControl={false} /* УБРАЛИ НАЗВАНИЕ ПРОВАЙДЕРА */
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <FixMapSize />
        
        {impulses.map((imp) => (
          <Marker 
            key={imp.id} 
            position={[imp.lat, imp.lng]} 
            icon={createCustomIcon(imp)}
            eventHandlers={{ click: () => onImpulseClick(imp) }}
          />
        ))}
      </MapContainer>
    </div>
  );
}