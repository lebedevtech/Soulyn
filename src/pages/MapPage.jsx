import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import MapView from '../features/map/MapView';
import ImpulseSheet from '../features/map/ImpulseSheet';
import { 
  LayoutGrid, 
  Map as MapIcon, 
  Coffee, 
  Pizza, 
  Film, 
  Star, 
  MapPin, 
  ChevronRight,
  Users,
  Building2
} from 'lucide-react';
import clsx from 'clsx';

// Компонент переключателя режимов карты
const MapToggle = ({ mode, setMode }) => (
  <div className="absolute top-28 left-1/2 -translate-x-1/2 z-30 p-1 bg-white/10 backdrop-blur-xl rounded-full border border-white/10 flex shadow-2xl">
    <button
      onClick={() => setMode('social')}
      className={clsx(
        "px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
        mode === 'social' ? "bg-white text-black shadow-lg scale-105" : "text-white/50 hover:text-white"
      )}
    >
      <Users size={12} /> Social
    </button>
    <button
      onClick={() => setMode('places')}
      className={clsx(
        "px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
        mode === 'places' ? "bg-white text-black shadow-lg scale-105" : "text-white/50 hover:text-white"
      )}
    >
      <Building2 size={12} /> Places
    </button>
  </div>
);

export default function MapPage() {
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list'
  const [mapLayer, setMapLayer] = useState('social'); // 'social' | 'places' (НОВОЕ)
  
  const [selectedImpulse, setSelectedImpulse] = useState(null);
  const [impulses, setImpulses] = useState([]);
  const [venues, setVenues] = useState([]); // Состояние для заведений

  useEffect(() => {
    // 1. Загрузка импульсов
    const fetchImpulses = async () => {
      const { data } = await supabase
        .from('impulses')
        .select(`*, users (*), venues (name)`)
        .order('created_at', { ascending: false });
      if (data) setImpulses(data);
    };

    // 2. Загрузка заведений (Places)
    const fetchVenues = async () => {
      const { data } = await supabase
        .from('venues')
        .select('*');
      if (data) setVenues(data);
    };

    fetchImpulses();
    fetchVenues();

    // Realtime подписка на импульсы
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
      {/* ПЕРЕКЛЮЧАТЕЛЬ РЕЖИМОВ (Social / Places) */}
      <MapToggle mode={mapLayer} setMode={setMapLayer} />

      {/* КАРТА */}
      <div className="absolute inset-0 z-0">
        <MapView 
          impulses={impulses} 
          venues={venues} // Передаем заведения
          mode={mapLayer} // Передаем активный режим
          onImpulseClick={setSelectedImpulse} 
          onVenueClick={(venue) => alert(`Выбрано место: ${venue.name}`)} // Пока просто алерт
        />
      </div>

      {/* РЕЖИМ ОБЗОРА (List View) */}
      <AnimatePresence>
        {viewMode === 'list' && (
          <div className="absolute inset-0 z-10">
            <div className="absolute top-0 left-0 right-0 h-48 z-20 pointer-events-none bg-gradient-to-b from-black via-black/80 to-transparent backdrop-blur-md" />
            <div className="absolute bottom-0 left-0 right-0 h-48 z-20 pointer-events-none bg-gradient-to-t from-black via-black/95 to-transparent" />

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-full h-full bg-black/60 backdrop-blur-2xl overflow-y-auto no-scrollbar pt-44 pb-48 px-6 relative z-10"
            >
              {/* Если режим PLACES - показываем список мест */}
              {mapLayer === 'places' ? (
                <section>
                   <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-6 ml-1">Лучшие места</h3>
                   <div className="space-y-4">
                     {venues.map(venue => (
                       <div key={venue.id} className="glass-panel p-4 rounded-[24px] flex gap-4">
                         <img src={venue.image_url} className="w-20 h-20 rounded-xl object-cover" />
                         <div>
                           <h3 className="text-white font-bold">{venue.name}</h3>
                           <p className="text-white/50 text-xs mt-1 line-clamp-2">{venue.description}</p>
                           <span className="inline-block mt-2 px-2 py-1 bg-white/10 rounded text-[10px] text-white font-bold uppercase">{venue.average_check}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                </section>
              ) : (
                /* Если режим SOCIAL - показываем импульсы */
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
                            <img src={user.avatar_url || 'https://i.pravatar.cc/150'} className="w-full h-full rounded-full object-cover" />
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

      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-24 px-6 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col">
          <h1 className="text-3xl font-black text-white tracking-tighter drop-shadow-2xl leading-none">Soulyn</h1>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(139,92,246,1)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Москва</span>
          </div>
        </div>
        <div className="glass-panel p-1 rounded-full flex gap-1 pointer-events-auto shadow-2xl">
          <button onClick={() => setViewMode('map')} className={clsx("p-2.5 rounded-full transition-all", viewMode === 'map' ? "bg-white text-black shadow-lg" : "text-white/40")}>
            <MapIcon size={20} />
          </button>
          <button onClick={() => setViewMode('list')} className={clsx("p-2.5 rounded-full transition-all", viewMode === 'list' ? "bg-white text-black shadow-lg" : "text-white/40")}>
            <LayoutGrid size={20} />
          </button>
        </div>
      </div>

      <ImpulseSheet impulse={selectedImpulse} onClose={() => setSelectedImpulse(null)} />
    </div>
  );
}