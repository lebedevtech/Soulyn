import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MapView from '../features/map/MapView';
import ImpulseSheet from '../features/map/ImpulseSheet';
import CreateImpulseSheet from '../features/map/CreateImpulseSheet';
import { 
  LayoutGrid, 
  Map as MapIcon, 
  Coffee, 
  Pizza, 
  Film, 
  Dumbbell, 
  MapPin, 
  ChevronRight 
} from 'lucide-react';
import clsx from 'clsx';

const CATEGORIES = [
  { id: 'coffee', label: 'Кофе', count: 24, icon: Coffee, color: 'bg-orange-500' },
  { id: 'food', label: 'Еда', count: 18, icon: Pizza, color: 'bg-red-500' },
  { id: 'movie', label: 'Кино', count: 12, icon: Film, color: 'bg-purple-500' },
  { id: 'sport', label: 'Спорт', count: 9, icon: Dumbbell, color: 'bg-green-500' },
];

const MOCK_IMPULSES = [
  { id: 1, lat: 55.7558, lng: 37.6173, user: 'Алексей', dist: '200м', msg: 'Ищу компанию на фильтр в Даблби ☕️', place: 'Surf Coffee', img: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, lat: 55.7520, lng: 37.6210, user: 'Мария', dist: '450м', msg: 'Хочу в кино на вечерний сеанс 🎬', place: 'Художественный', img: 'https://i.pravatar.cc/150?u=5' },
];

export default function MapPage() {
  const [viewMode, setViewMode] = useState('map');
  const [selectedImpulse, setSelectedImpulse] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* КАРТА */}
      <div className="absolute inset-0 z-0">
        <MapView impulses={MOCK_IMPULSES} onImpulseClick={setSelectedImpulse} />
      </div>

      {/* РЕЖИМ ОБЗОРА */}
      <AnimatePresence>
        {viewMode === 'list' && (
          <div className="absolute inset-0 z-10">
            {/* ВЕРХНИЙ БАРЬЕР (Теперь компактный h-32, как в чатах) */}
            <div className="absolute top-0 left-0 right-0 h-32 z-20 pointer-events-none bg-gradient-to-b from-black via-black/80 to-transparent backdrop-blur-md" />
            
            {/* НИЖНИЙ БАРЬЕР */}
            <div className="absolute bottom-0 left-0 right-0 h-48 z-20 pointer-events-none bg-gradient-to-t from-black via-black/95 to-transparent" />

            {/* КОНТЕНТ (Уменьшили pt до 32 для соответствия барьеру) */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
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
                        <p className="text-[10px] text-white/30 font-black uppercase mt-1">{cat.count} импульсов</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 ml-1">Ближайшие импульсы</h3>
                <div className="space-y-3">
                  {MOCK_IMPULSES.map((imp) => (
                    <button 
                      key={imp.id} 
                      onClick={() => setSelectedImpulse(imp)}
                      className="w-full glass-panel p-4 rounded-[30px] flex items-center gap-4 active:scale-[0.98] transition-all text-left"
                    >
                      <div className="w-14 h-14 rounded-full border-2 border-primary/20 p-0.5 shrink-0 shadow-lg">
                        <img src={imp.img} className="w-full h-full rounded-full object-cover" alt="" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-bold text-white text-base truncate">{imp.user}</p>
                          <span className="text-[10px] font-black text-primary uppercase">{imp.dist}</span>
                        </div>
                        <p className="text-white/60 text-sm line-clamp-1 mb-1 font-medium">{imp.msg}</p>
                        <div className="flex items-center gap-1 text-[10px] text-white/30 font-black uppercase">
                          <MapPin size={10} className="text-primary" /> {imp.place}
                        </div>
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
      <CreateImpulseSheet isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <button onClick={() => setIsCreateOpen(true)} className="hidden" id="trigger-create-sheet" />
    </div>
  );
}