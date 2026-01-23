import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import MapView from '../features/map/MapView';
import ImpulseSheet from '../features/map/ImpulseSheet';
import { LayoutGrid, Map as MapIcon, Coffee, Pizza, Film, Dumbbell, MapPin, ChevronRight, Star } from 'lucide-react';
import clsx from 'clsx';

const CATEGORIES = [
  { id: 'coffee', label: 'Кофе', count: 0, icon: Coffee, color: 'bg-orange-500' },
  { id: 'food', label: 'Еда', count: 0, icon: Pizza, color: 'bg-red-500' },
  { id: 'movie', label: 'Кино', count: 0, icon: Film, color: 'bg-purple-500' },
  { id: 'vip', label: 'VIP', count: 0, icon: Star, color: 'bg-yellow-500' },
];

export default function MapPage() {
  const [viewMode, setViewMode] = useState('map');
  const [selectedImpulse, setSelectedImpulse] = useState(null);
  
  // Состояние для хранения импульсов с сервера
  const [impulses, setImpulses] = useState([]);

  useEffect(() => {
    // 1. Загрузка существующих импульсов
    const fetchImpulses = async () => {
      const { data, error } = await supabase
        .from('impulses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error) setImpulses(data || []);
    };

    fetchImpulses();

    // 2. Подписка на новые импульсы (Realtime)
    const channel = supabase
      .channel('public:impulses')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'impulses' }, (payload) => {
        setImpulses((current) => [payload.new, ...current]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* КАРТА */}
      <div className="absolute inset-0 z-0">
        <MapView impulses={impulses} onImpulseClick={setSelectedImpulse} />
      </div>

      {/* РЕЖИМ ОБЗОРА */}
      <AnimatePresence>
        {viewMode === 'list' && (
          <div className="absolute inset-0 z-10">
            <div className="absolute top-0 left-0 right-0 h-32 z-20 pointer-events-none bg-gradient-to-b from-black via-black/80 to-transparent backdrop-blur-md" />
            <div className="absolute bottom-0 left-0 right-0 h-48 z-20 pointer-events-none bg-gradient-to-t from-black via-black/95 to-transparent" />

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="w-full h-full bg-black/60 backdrop-blur-2xl overflow-y-auto no-scrollbar pt-32 pb-48 px-6 relative z-10"
            >
              <section className="mb-10">
                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-5 ml-1">Категории</h3>
                <div className="grid grid-cols-2 gap-3">
                  {CATEGORIES.map((cat) => (
                    <button key={cat.id} className="glass-panel p-5 rounded-[32px] flex flex-col items-start gap-4 active:scale-[0.97] transition-all">
                      <div className={clsx("p-3 rounded-2xl text-white", cat.color)}><cat.icon size={22} /></div>
                      <div>
                        <p className="font-bold text-white text-[17px] leading-none">{cat.label}</p>
                        <p className="text-[10px] text-white/30 font-black uppercase mt-1">Доступно</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 ml-1">Актуально сейчас</h3>
                <div className="space-y-3">
                  {impulses.length === 0 && (
                    <p className="text-white/30 text-center py-4 text-sm">Пока нет активных импульсов...</p>
                  )}
                  {impulses.map((imp) => (
                    <button 
                      key={imp.id} 
                      onClick={() => setSelectedImpulse(imp)}
                      className={clsx(
                        "w-full glass-panel p-4 rounded-[30px] flex items-center gap-4 active:scale-[0.98] transition-all text-left",
                        imp.is_premium && "border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                      )}
                    >
                      <div className="w-14 h-14 rounded-full border-2 border-primary/20 p-0.5 shrink-0 shadow-lg">
                        <img 
                          src={imp.avatar_url || 'https://i.pravatar.cc/150'} 
                          className="w-full h-full rounded-full object-cover" 
                          alt=""
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <p className={clsx("font-bold text-base truncate", imp.is_premium ? "text-yellow-400" : "text-white")}>
                            {imp.username}
                          </p>
                          <span className="text-[10px] font-black text-primary uppercase">{imp.dist || '100м'}</span>
                        </div>
                        <p className="text-white/60 text-sm line-clamp-1 mb-1 font-medium">{imp.message}</p>
                        {imp.venue_name && (
                          <div className="flex items-center gap-1 text-[10px] text-white/30 font-black uppercase">
                            <MapPin size={10} className="text-primary" /> {imp.venue_name}
                          </div>
                        )}
                      </div>
                      <ChevronRight size={18} className="text-white/10" />
                    </button>
                  ))}
                </div>
              </section>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-14 px-6 flex items-center justify-between pointer-events-none">
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