import { motion } from 'framer-motion';
import { X, MapPin, Clock, Star, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const SHEET_TRANSITION = { duration: 0.4, ease: [0.25, 1, 0.5, 1] };

export default function VenueSheet({ venue, onClose, onCreateImpulse }) {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
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
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-12 h-1.5 bg-white/20 rounded-full shadow-lg" />

        {/* Image Header - Full Width & Height */}
        <div className="relative h-72 w-full"> 
          <img src={venue.image_url} className="w-full h-full object-cover" alt="" />
          {/* Градиент стал мощнее для читаемости */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent" />
          
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-black/40 backdrop-blur-md rounded-full text-white/80 border border-white/10 z-20">
            <X size={20} />
          </button>
          
          <div className="absolute bottom-0 left-0 p-6 w-full z-10">
            <div className="flex items-center gap-2 mb-2">
               {venue.is_partner && <span className="px-2 py-0.5 rounded bg-white/20 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase text-white tracking-wider flex items-center gap-1"><Star size={10} className="fill-white" /> Partner</span>}
               <span className="px-2 py-0.5 rounded bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase text-white/80 tracking-wider">{venue.average_check}</span>
            </div>
            <h2 className="text-3xl font-black text-white leading-none tracking-tight mb-1">{venue.name}</h2>
            <p className="text-white/70 text-sm line-clamp-1">{venue.description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-12 pt-6 space-y-6 bg-[#121212]">
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
  );
}