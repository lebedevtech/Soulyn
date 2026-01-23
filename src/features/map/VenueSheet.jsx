import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Star, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

// PREMIUM SHEET PHYSICS
const SHEET_TRANSITION = { duration: 0.4, ease: [0.25, 1, 0.5, 1] };

export default function VenueSheet({ venue, onClose, onCreateImpulse }) {
  if (!venue) return null;

  return (
    <AnimatePresence>
      <>
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ y: "100%" }} 
          animate={{ y: 0 }} 
          exit={{ y: "100%" }}
          transition={SHEET_TRANSITION}
          className="absolute bottom-0 left-0 right-0 z-50 bg-[#121212] rounded-t-[32px] border-t border-white/10 overflow-hidden shadow-2xl"
        >
          {/* Drag Handle */}
          <div className="w-full flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 bg-white/20 rounded-full" />
          </div>

          {/* Image Header */}
          <div className="relative h-64 w-full mt-2">
            <img src={venue.image_url} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white/80 border border-white/10"
            >
              <X size={20} />
            </button>
            
            <div className="absolute bottom-0 left-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                 {venue.is_partner && (
                   <span className="px-2 py-0.5 rounded bg-white/20 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase text-white tracking-wider flex items-center gap-1">
                     <Star size={10} className="fill-white" /> Partner
                   </span>
                 )}
                 <span className="px-2 py-0.5 rounded bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase text-white/80 tracking-wider">
                   {venue.average_check}
                 </span>
              </div>
              <h2 className="text-3xl font-black text-white leading-none tracking-tight">{venue.name}</h2>
              <p className="text-white/60 text-sm mt-1 line-clamp-1">{venue.description}</p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-10 pt-2 space-y-6">
            <div className="flex gap-4">
               <div className="flex-1 p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                 <div className="p-2 bg-white/10 rounded-full text-white"><Clock size={18} /></div>
                 <div>
                   <p className="text-[10px] uppercase text-white/30 font-bold">Открыто до</p>
                   <p className="text-white font-bold">23:00</p>
                 </div>
               </div>
               <div className="flex-1 p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                 <div className="p-2 bg-white/10 rounded-full text-white"><MapPin size={18} /></div>
                 <div>
                   <p className="text-[10px] uppercase text-white/30 font-bold">Расстояние</p>
                   <p className="text-white font-bold">1.2 км</p>
                 </div>
               </div>
            </div>

            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={() => onCreateImpulse(venue)}
              className="w-full py-4 rounded-2xl bg-white text-black font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Создать импульс здесь <ArrowRight size={20} />
            </motion.button>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}