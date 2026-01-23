import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import MapView from '../features/map/MapView';
import ImpulseSheet from '../features/map/ImpulseSheet';
import { 
  LayoutGrid, 
  Map as MapIcon, 
  Users,
  Building2,
  Star,
  MapPin,
  ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

// КОМПОНЕНТ ПЕРЕКЛЮЧАТЕЛЯ
// Сделали его более "стеклянным" и премиальным
const MapToggle = ({ mode, setMode }) => (
  <div className="absolute top-28 left-6 z-30 flex items-center gap-1 p-1 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
    <button
      onClick={() => setMode('social')}
      className={clsx(
        "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
        mode === 'social' ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white"
      )}
    >
      <Users size={12} strokeWidth={3} /> Social
    </button>
    <button
      onClick={() => setMode('places')}
      className={clsx(
        "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
        mode === 'places' ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white"
      )}
    >
      <Building2 size={12} strokeWidth={3} /> Places
    </button>
  </div>
);

export default function MapPage() {
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list'
  const [mapLayer, setMapLayer] = useState('social'); // 'social' | 'places'
  
  const [selectedImpulse, setSelectedImpulse] = useState(null);
  const [impulses, setImpulses] = useState([]);
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    // Загрузка данных (Импульсы + Заведения)
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

    // Realtime
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
      
      {/* 1. ЛОГОТИП И ГОРОД (Сдвинули на top-14, чтобы уйти из под кнопки Закрыть) */}
      <div className="absolute top-14 left-6 z-30 flex flex-col pointer-events-none">
        <h1 className="text-3xl font-black text-white tracking-tighter drop-shadow-2xl leading-none">Soulyn</h1>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(139,92,246,1)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Москва</span>
        </div>
      </div>

      {/* 2. ПЕРЕКЛЮЧАТЕЛЬ (Сдвинули на top-28 и прижали ВЛЕВО, под логотип) */}
      {/* Это создает единую вертикаль управления и освобождает центр карты */}
      <MapToggle mode={mapLayer} setMode={setMapLayer} />

      {/* 3. КАРТА */}
      <div className="absolute inset-0 z-0">
        <MapView 
          impulses={impulses} 
          venues={venues} 
          mode={mapLayer} 
          onImpulseClick={setSelectedImpulse} 
          onVenueClick={(venue) => alert(venue.name)} 
        />
      </div>

      {/* 4. КНОПКИ ВИДА (Справа снизу, над меню) */}
      <div className="absolute bottom-28 right-4 z-30 flex flex-col gap-3 pointer-events-auto">
        <button 
          onClick={() => setViewMode('map')} 
          className={clsx(
            "w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl border transition-all shadow-xl active:scale-90",
            viewMode === 'map' 
              ? "bg-white text-black border-white" 
              : "bg-black/60 text-white/50 border-white/10"
          )}
        >
          <MapIcon size={20} />
        </button>
        <button 
          onClick={() => setViewMode('list')} 
          className={clsx(
            "w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl border transition-all shadow-xl active:scale-90",
            viewMode === 'list' 
              ? "bg-white text-black border-white" 
              : "bg-black/60 text-white/50 border-white/10"
          )}
        >
          <LayoutGrid size={20} />
        </button>
      </div>

      {/* 5. РЕЖИМ СПИСКА (List View) */}
      <AnimatePresence>
        {viewMode === 'list' && (
          <div className="absolute inset-0 z-10">
            {/* Градиенты */}
            <div className="absolute top-0 left-0 right-0 h-64 z-20 pointer-events-none bg-gradient-to-b from-black via-black/90 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-48 z-20 pointer-events-none bg-gradient-to-t from-black via-black/95 to-transparent" />

            {/* Контент списка (Сдвинули начало на pt-48, чтобы список начинался ПОД переключателем) */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-full h-full bg-black/60 backdrop-blur-2xl overflow-y-auto no-scrollbar pt-48 pb-48 px-6 relative z-10"
            >
              {mapLayer === 'places' ? (
                <section>
                   <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-6 ml-1">Лучшие места</h3>
                   <div className="space-y-4">
                     {venues.map(venue => (
                       <div key={venue.id} className="glass-panel p-4 rounded-[24px] flex gap-4 active:scale-[0.98] transition-transform">
                         <img src={venue.image_url} className="w-20 h-20 rounded-xl object-cover shadow-lg" />
                         <div>
                           <h3 className="text-white font-bold text-lg leading-tight">{venue.name}</h3>
                           <p className="text-white/50 text-xs mt-1 line-clamp-2 leading-relaxed">{venue.description}</p>
                           <span className="inline-block mt-2 px-2 py-1 bg-white/10 rounded text-[10px] text-white font-bold uppercase tracking-wider">{venue.average_check}</span>
                         </div>
                       </div>
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

      <ImpulseSheet impulse={selectedImpulse} onClose={() => setSelectedImpulse(null)} />
    </div>
  );
}