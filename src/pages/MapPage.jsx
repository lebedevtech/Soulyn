import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import MapView from '../features/map/MapView';
import ImpulseSheet from '../features/map/ImpulseSheet';
import VenueSheet from '../features/map/VenueSheet';
import CreateImpulseSheet from '../features/map/CreateImpulseSheet';
import { 
  LayoutGrid, Map as MapIcon, Users, Building2, Navigation, 
  Coffee, Pizza, Film, Star, MapPin 
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import clsx from 'clsx';

const TRANSITION_EASE = [0.25, 0.1, 0.25, 1];

// Вспомогательный компонент для переключения слоев карты
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.05 } }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: TRANSITION_EASE } },
  tap: { scale: 0.97 }
};

export default function MapPage({ onOpenCreate, isCreateOpen, setCreateOpen, createData }) {
  const [viewMode, setViewMode] = useState('map'); 
  const [mapLayer, setMapLayer] = useState('social');
  const [selectedImpulse, setSelectedImpulse] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [impulses, setImpulses] = useState([]);
  const [venues, setVenues] = useState([]);
  const { location: userLocation } = useLocation();
  const [followUser, setFollowUser] = useState(true);

  const handleShowMoreVenues = () => {
    setViewMode('list');
    setMapLayer('places');
  };

  useEffect(() => {
    const fetchData = async () => {
      const [impRes, venRes] = await Promise.all([
        supabase.from('impulses').select(`*, users (*), venues (name)`).order('created_at', { ascending: false }),
        supabase.from('venues').select('*')
      ]);
      if (impRes.data) setImpulses(impRes.data);
      if (venRes.data) setVenues(venRes.data);
    };
    fetchData();
  }, []);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* HEADER */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center pointer-events-none">
        <h1 className="text-xl font-black text-white tracking-tighter drop-shadow-2xl">Soulyn</h1>
        <div className="flex items-center gap-1.5 mt-1">
          <span className={clsx("w-1 h-1 rounded-full animate-pulse", userLocation ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]" : "bg-primary")} />
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/50">{userLocation ? 'GPS ACTIVE' : 'MOSCOW'}</span>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="absolute bottom-32 left-4 z-30"><MapToggle mode={mapLayer} setMode={setMapLayer} /></div>
      <div className="absolute bottom-32 right-4 z-30 flex flex-col gap-3">
        <button onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')} className="w-12 h-12 rounded-2xl flex items-center justify-center bg-black/40 backdrop-blur-xl border border-white/10 text-white/50 active:bg-white active:text-black transition-all shadow-xl">
          {viewMode === 'map' ? <LayoutGrid size={20} /> : <MapIcon size={20} />}
        </button>
      </div>

      {/* MAP */}
      <div className="absolute inset-0 z-0">
        <MapView impulses={impulses} venues={venues} mode={mapLayer} userLocation={userLocation} followUser={followUser} onImpulseClick={setSelectedImpulse} onVenueClick={setSelectedVenue} />
      </div>

      {/* LIST VIEW */}
      <AnimatePresence>
        {viewMode === 'list' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 bg-black/60 backdrop-blur-xl pt-32 pb-48 px-6 overflow-y-auto no-scrollbar">
             {mapLayer === 'places' ? (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                   <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-6">Лучшие места</h3>
                   {venues.map(v => (
                     <motion.button key={v.id} variants={cardVariants} whileTap="tap" onClick={() => setSelectedVenue(v)} className="relative w-full p-4 flex gap-4 bg-white/5 border border-white/5 rounded-[24px]">
                        <img src={v.image_url} className="w-20 h-20 rounded-xl object-cover shrink-0" alt="" />
                        <div className="text-left"><h3 className="text-white font-bold">{v.name}</h3><p className="text-white/50 text-xs mt-1 line-clamp-2">{v.description}</p></div>
                     </motion.button>
                   ))}
                </motion.div>
             ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
                   <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6">Актуально сейчас</h3>
                   {impulses.map(imp => (
                     <motion.button key={imp.id} variants={cardVariants} onClick={() => setSelectedImpulse(imp)} className="w-full p-4 flex gap-4 bg-white/5 border border-white/5 rounded-[30px] items-center">
                        <img src={imp.users?.avatar_url} className="w-12 h-12 rounded-full object-cover" alt="" />
                        <div className="text-left flex-1"><p className="font-bold text-white">{imp.users?.first_name}</p><p className="text-white/50 text-sm truncate">{imp.message}</p></div>
                     </motion.button>
                   ))}
                </motion.div>
             )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SHEETS */}
      <AnimatePresence>
        {selectedImpulse && <ImpulseSheet impulse={selectedImpulse} onClose={() => setSelectedImpulse(null)} />}
        {selectedVenue && <VenueSheet venue={selectedVenue} onClose={() => setSelectedVenue(null)} onCreateImpulse={(v) => { setSelectedVenue(null); onOpenCreate({ venue: v }); }} />}
        <CreateImpulseSheet isOpen={isCreateOpen} onClose={() => setCreateOpen(false)} onShowMoreVenues={handleShowMoreVenues} initialData={createData} />
      </AnimatePresence>
    </div>
  );
}