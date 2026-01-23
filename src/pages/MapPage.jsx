import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import MapView from '../features/map/MapView';
import ImpulseSheet from '../features/map/ImpulseSheet';
import VenueSheet from '../features/map/VenueSheet';
import { 
  LayoutGrid, 
  Map as MapIcon, 
  Users,
  Building2,
  Star,
  MapPin,
  ChevronRight,
  Navigation
} from 'lucide-react';
import clsx from 'clsx';

// Переключатель слева (Social/Places)
const MapToggle = ({ mode, setMode }) => (
  <div className="flex flex-col gap-3 pointer-events-auto">
    <button
      onClick={() => setMode('social')}
      className={clsx(
        "w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-xl border transition-all shadow-xl active:scale-90",
        mode === 'social' ? "bg-white text-black border-white" : "bg-black/40 text-white/50 border-white/10"
      )}
    >
      <Users size={20} />
    </button>
    <button
      onClick={() => setMode('places')}
      className={clsx(
        "w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-xl border transition-all shadow-xl active:scale-90",
        mode === 'places' ? "bg-white text-black border-white" : "bg-black/40 text-white/50 border-white/10"
      )}
    >
      <Building2 size={20} />
    </button>
  </div>
);

export default function MapPage({ onOpenCreate }) {
  const [viewMode, setViewMode] = useState('map'); 
  const [mapLayer, setMapLayer] = useState('social');
  
  const [selectedImpulse, setSelectedImpulse] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  
  const [impulses, setImpulses] = useState([]);
  const [venues, setVenues] = useState([]);
  
  // GPS Состояния
  const [userLocation, setUserLocation] = useState(null);
  const [followUser, setFollowUser] = useState(true); // По умолчанию следим за юзером

  useEffect(() => {
    const fetchData = async () => {
      const { data: impData } = await supabase
        .from('impulses')
        .select(`*, users (*), venues (name)`)
        .order('created_at', { ascending: false });
      if (impData) setImpulses(impData);

      const { data: venueData } = await supabase.from('venues').select('*');
      if (venueData) setVenues(venueData);
    };

    fetchData();

    if (navigator.geolocation) {
      // Используем watchPosition вместо getCurrentPosition для постоянного обновления
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => console.error("GPS Error:", error),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }

    const channel = supabase
      .channel('public:impulses')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'impulses' }, async (payload) => {
        const { data } = await supabase
          .from('impulses')
          .select(`*, users (*), venues (name)`)
          .eq('id', payload.new.id)
          .single();
        if (data) setImpulses((prev) => [data, ...prev]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      
      {/* 1. ЛОГОТИП (Чистый верх) */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
        <h1 className="text-xl font-black text-white tracking-tighter drop-shadow-2xl leading-none">Soulyn</h1>
        <div className="flex items-center gap-1.5 mt-1">
          <span className={clsx("w-1 h-1 rounded-full animate-pulse shadow-[0_0_10px_rgba(139,92,246,1)]", userLocation ? "bg-blue-500" : "bg-primary")} />
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/50">
            {userLocation ? 'GPS ACTIVE' : 'Москва'}
          </span>
        </div>
      </div>

      {/* 2. ЛЕВЫЙ НИЖНИЙ: Переключатель слоев */}
      <div className="absolute bottom-32 left-4 z-30">
        <MapToggle mode={mapLayer} setMode={setMapLayer} />
      </div>

      {/* 3. КАРТА */}
      <div className="absolute inset-0 z-0">
        <MapView 
          impulses={impulses} 
          venues={venues} 
          mode={mapLayer}
          userLocation={userLocation}
          followUser={followUser} // Передаем флаг слежения
          onUserInteraction={() => setFollowUser(false)} // Если юзер трогает карту - отключаем слежение
          onImpulseClick={setSelectedImpulse} 
          onVenueClick={(venue) => setSelectedVenue(venue)} 
        />
      </div>

      {/* 4. ПРАВЫЙ НИЖНИЙ: Инструменты (Группа) */}
      <div className="absolute bottom-32 right-4 z-30 flex flex-col gap-3 pointer-events-auto">
        
        {/* Кнопка GPS (Показываем только если есть GPS) */}
        {userLocation && (
          <button 
            onClick={() => setFollowUser(true)}
            className={clsx(
              "w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-xl border transition-all shadow-xl active:scale-90",
              followUser 
                ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]" 
                : "bg-black/40 text-white/50 border-white/10"
            )}
          >
            <Navigation size={20} fill={followUser ? "currentColor" : "none"} />
          </button>
        )}

        {/* Кнопка Вида (Одна кнопка - переключатель) */}
        <button 
          onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')} 
          className={clsx(
            "w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-xl border transition-all shadow-xl active:scale-90",
            viewMode === 'list' 
              ? "bg-white text-black border-white" 
              : "bg-black/40 text-white/50 border-white/10"
          )}
        >
          {/* Если Карта - показываем иконку Списка, и наоборот */}
          {viewMode === 'map' ? <LayoutGrid size={20} /> : <MapIcon size={20} />}
        </button>
      </div>

      {/* 5. СПИСОК */}
      <AnimatePresence>
        {viewMode === 'list' && (
          <div className="absolute inset-0 z-10">
            <div className="absolute top-0 left-0 right-0 h-32 z-20 pointer-events-none bg-gradient-to-b from-black via-black/95 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-48 z-20 pointer-events-none bg-gradient-to-t from-black via-black/95 to-transparent" />

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-full h-full bg-black/60 backdrop-blur-2xl overflow-y-auto no-scrollbar pt-32 pb-48 px-6 relative z-10"
            >
              {mapLayer === 'places' ? (
                <section>
                   <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-6 ml-1">Лучшие места</h3>
                   <div className="space-y-4">
                     {venues.map(venue => (
                       <button 
                         key={venue.id} 
                         onClick={() => setSelectedVenue(venue)}
                         className="w-full glass-panel p-4 rounded-[24px] flex gap-4 active:scale-[0.98] transition-transform text-left"
                       >
                         <img src={venue.image_url} className="w-20 h-20 rounded-xl object-cover shadow-lg" alt={venue.name} />
                         <div>
                           <h3 className="text-white font-bold text-lg leading-tight">{venue.name}</h3>
                           <p className="text-white/50 text-xs mt-1 line-clamp-2 leading-relaxed">{venue.description}</p>
                           <span className="inline-block mt-2 px-2 py-1 bg-white/10 rounded text-[10px] text-white font-bold uppercase tracking-wider">{venue.average_check}</span>
                         </div>
                       </button>
                     ))}
                   </div>
                </section>
              ) : (
                <section>
                  <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 ml-1">Актуально сейчас</h3>
                  <div className="space-y-3">
                    {impulses.map((imp) => {
                      const user = imp.users || { first_name: 'Ghost' };
                      return (
                        <button 
                          key={imp.id} 
                          onClick={() => setSelectedImpulse(imp)}
                          className={clsx(
                            "w-full glass-panel p-4 rounded-[30px] flex items-center gap-4 active:scale-[0.98] transition-all text-left",
                            user.is_premium && "border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                          )}
                        >
                          <div className="w-14 h-14 rounded-full border-2 border-primary/20 p-0.5 shrink-0 relative">
                            <img src={user.avatar_url || 'https://i.pravatar.cc/150'} className="w-full h-full rounded-full object-cover" alt="" />
                            {user.is_premium && <div className="absolute -top-1 -right-1 bg-black rounded-full p-1 border border-yellow-500"><Star size={10} className="text-yellow-400 fill-yellow-400" /></div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <p className={clsx("font-bold text-base", user.is_premium ? "text-yellow-400" : "text-white")}>{user.first_name}</p>
                              <span className="text-[10px] font-black text-primary uppercase">~500м</span>
                            </div>
                            <p className="text-white/60 text-sm line-clamp-1 font-medium">{imp.message}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ImpulseSheet impulse={selectedImpulse} onClose={() => setSelectedImpulse(null)} />
      
      <VenueSheet 
        venue={selectedVenue} 
        onClose={() => setSelectedVenue(null)}
        onCreateImpulse={(venue) => {
          setSelectedVenue(null);
          onOpenCreate({ venue, location: userLocation }); 
        }} 
      />
    </div>
  );
}