import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import MapView from '../features/map/MapView';
import ImpulseSheet from '../features/map/ImpulseSheet';
import VenueSheet from '../features/map/VenueSheet';
import { 
  LayoutGrid, Map as MapIcon, Users, Building2, Navigation, 
  Coffee, Pizza, Film, Star, MapPin 
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import clsx from 'clsx';

// ЭТАЛОННАЯ АНИМАЦИЯ (КАК В УВЕДОМЛЕНИЯХ)
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.3 }
  },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Четкий каскад
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 30 // Мягкая, но быстрая пружина (как в iOS уведомлениях)
    } 
  }
};

const CATEGORIES = [
  { id: 'coffee', label: 'Кофе', icon: Coffee, color: 'bg-orange-500' },
  { id: 'food', label: 'Еда', icon: Pizza, color: 'bg-red-500' },
  { id: 'movie', label: 'Кино', icon: Film, color: 'bg-purple-500' },
  { id: 'vip', label: 'VIP', icon: Star, color: 'bg-yellow-500' },
];

const MapToggle = ({ mode, setMode }) => (
  <div className="flex flex-col gap-3 pointer-events-auto">
    <button onClick={() => setMode('social')} className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-xl border transition-all duration-300 shadow-xl active:scale-90", mode === 'social' ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]" : "bg-black/40 text-white/50 border-white/10")}>
      <Users size={20} />
    </button>
    <button onClick={() => setMode('places')} className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-xl border transition-all duration-300 shadow-xl active:scale-90", mode === 'places' ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]" : "bg-black/40 text-white/50 border-white/10")}>
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
  
  const locationContext = useLocation();
  const userLocation = locationContext?.location || null;
  const [followUser, setFollowUser] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [impRes, venueRes] = await Promise.all([
          supabase.from('impulses').select(`*, users (*), venues (name)`).order('created_at', { ascending: false }),
          supabase.from('venues').select('*')
        ]);
        if (impRes.data) setImpulses(impRes.data);
        if (venueRes.data) setVenues(venueRes.data);
      } catch (e) { console.error(e); }
    };
    fetchData();

    const channel = supabase.channel('public:impulses')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'impulses' }, async (payload) => {
        const { data } = await supabase.from('impulses').select(`*, users (*), venues (name)`).eq('id', payload.new.id).single();
        if (data) setImpulses((prev) => [data, ...prev]);
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'impulses' }, (payload) => {
        setImpulses((current) => current.filter(imp => imp.id !== payload.old.id));
        if (selectedImpulse?.id === payload.old.id) setSelectedImpulse(null);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [selectedImpulse]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      
      {/* HEADER */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
        <h1 className="text-xl font-black text-white tracking-tighter drop-shadow-2xl leading-none">Soulyn</h1>
        <div className="flex items-center gap-1.5 mt-1">
          <span className={clsx("w-1 h-1 rounded-full animate-pulse shadow-[0_0_10px_rgba(139,92,246,1)]", userLocation ? "bg-blue-500" : "bg-primary")} />
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/50">{userLocation ? 'GPS ACTIVE' : 'Москва'}</span>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="absolute bottom-32 left-4 z-30"><MapToggle mode={mapLayer} setMode={setMapLayer} /></div>
      <div className="absolute bottom-32 right-4 z-30 flex flex-col gap-3 pointer-events-auto">
        {userLocation && (
          <button onClick={() => setFollowUser(true)} className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-xl border transition-all duration-300 shadow-xl active:scale-90", followUser ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]" : "bg-black/40 text-white/50 border-white/10")}>
            <Navigation size={20} fill={followUser ? "currentColor" : "none"} />
          </button>
        )}
        <button onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')} className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-xl border transition-all duration-300 shadow-xl active:scale-90", viewMode === 'list' ? "bg-white text-black border-white" : "bg-black/40 text-white/50 border-white/10")}>
          {viewMode === 'map' ? <LayoutGrid size={20} /> : <MapIcon size={20} />}
        </button>
      </div>

      {/* MAP */}
      <div className="absolute inset-0 z-0">
        <MapView impulses={impulses} venues={venues} mode={mapLayer} userLocation={userLocation} followUser={followUser} onUserInteraction={() => setFollowUser(false)} onImpulseClick={setSelectedImpulse} onVenueClick={(venue) => setSelectedVenue(venue)} />
      </div>

      {/* LIST VIEW (SMOOTH FADE & SCROLL) */}
      <AnimatePresence>
        {viewMode === 'list' && (
          <motion.div 
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 z-10 bg-black/60 backdrop-blur-xl"
          >
            <div className="absolute top-0 left-0 right-0 h-32 z-20 pointer-events-none bg-gradient-to-b from-black via-black/90 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-48 z-20 pointer-events-none bg-gradient-to-t from-black via-black/95 to-transparent" />

            <div className="w-full h-full overflow-y-auto no-scrollbar pt-32 pb-48 px-6 relative z-10">
              {mapLayer === 'places' ? (
                <motion.section variants={listContainerVariants} initial="hidden" animate="visible">
                   <motion.h3 variants={itemVariants} className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-6 ml-1">Лучшие места</motion.h3>
                   <div className="space-y-4">
                     {venues.map(venue => (
                       <motion.button key={venue.id} variants={itemVariants} onClick={() => setSelectedVenue(venue)} className="w-full glass-panel p-4 rounded-[24px] flex gap-4 active:scale-[0.98] transition-transform text-left">
                         <img src={venue.image_url} className="w-20 h-20 rounded-xl object-cover shadow-lg" alt={venue.name} />
                         <div>
                           <h3 className="text-white font-bold text-lg leading-tight">{venue.name}</h3>
                           <p className="text-white/50 text-xs mt-1 line-clamp-2 leading-relaxed">{venue.description}</p>
                           <span className="inline-block mt-2 px-2 py-1 bg-white/10 rounded text-[10px] text-white font-bold uppercase tracking-wider">{venue.average_check}</span>
                         </div>
                       </motion.button>
                     ))}
                   </div>
                </motion.section>
              ) : (
                <motion.div variants={listContainerVariants} initial="hidden" animate="visible">
                  <motion.section variants={itemVariants} className="mb-10">
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
                  </motion.section>

                  <section>
                    <motion.h3 variants={itemVariants} className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 ml-1">Актуально сейчас</motion.h3>
                    <div className="space-y-3">
                      {impulses.length === 0 && <motion.p variants={itemVariants} className="text-white/30 text-center py-4 text-sm">Пока нет активных импульсов...</motion.p>}
                      {impulses.map((imp) => {
                        const user = imp.users || { first_name: 'Ghost' };
                        return (
                          <motion.button key={imp.id} variants={itemVariants} onClick={() => setSelectedImpulse(imp)} className={clsx("w-full glass-panel p-4 rounded-[30px] flex items-center gap-4 active:scale-[0.98] transition-all text-left", user.is_premium && "border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]")}>
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
                              {imp.venues && <div className="flex items-center gap-1 text-[10px] text-white/30 font-black uppercase mt-1"><MapPin size={10} className="text-primary" /> {imp.venues.name}</div>}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </section>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ImpulseSheet impulse={selectedImpulse} onClose={() => setSelectedImpulse(null)} />
      <VenueSheet venue={selectedVenue} onClose={() => setSelectedVenue(null)} onCreateImpulse={(venue) => { setSelectedVenue(null); onOpenCreate({ venue, location: userLocation }); }} />
    </div>
  );
}