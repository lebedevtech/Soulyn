import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Navigation, Zap } from 'lucide-react';
import clsx from 'clsx';

export default function VenueSheet({ venue, onClose, onCreateImpulse }) {
  // Если место не выбрано, ничего не рендерим
  if (!venue) return null;

  return (
    <AnimatePresence>
      {venue && (
        <>
          {/* Затемнение фона */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Шторка */}
          <motion.div 
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 z-50 bg-[#121212] rounded-t-[40px] border-t border-white/10 overflow-hidden"
          >
            {/* Обложка места */}
            <div className="relative h-56 w-full">
              <img src={venue.image_url} className="w-full h-full object-cover" alt={venue.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
              
              {/* Кнопка закрытия */}
              <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white/80 border border-white/10 active:scale-90 transition-transform">
                <X size={20} />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
                    {venue.category}
                  </span>
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
                    {venue.average_check}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-white leading-none drop-shadow-lg">{venue.name}</h2>
                <p className="text-white/70 text-xs mt-1 font-medium flex items-center gap-1">
                  <MapPin size={12} /> {venue.address || 'Центр Москвы'}
                </p>
              </div>
            </div>

            {/* Контент */}
            <div className="p-6 pt-4 pb-12">
              <p className="text-white/60 text-sm leading-relaxed mb-6 font-medium">
                {venue.description}
              </p>

              {/* Социальное доказательство (Fake data для красоты) */}
              <div className="flex items-center gap-4 mb-8 bg-white/5 p-3 rounded-2xl border border-white/5">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1c1c1e] bg-gray-800 overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${venue.id * 10 + i}`} className="w-full h-full object-cover" alt="" />
                    </div>
                  ))}
                </div>
                <span className="text-xs text-white/40 font-medium">
                  +12 человек хотят сюда
                </span>
              </div>

              {/* Кнопки действий */}
              <div className="grid grid-cols-2 gap-3">
                <button className="py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
                  <Navigation size={18} /> Маршрут
                </button>
                <button 
                  onClick={() => onCreateImpulse(venue)}
                  className="py-4 rounded-2xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.4)] active:scale-[0.98] transition-all"
                >
                  <Zap size={18} fill="currentColor" /> Создать импульс
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}