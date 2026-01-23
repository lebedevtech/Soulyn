import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MapPin, Navigation } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import clsx from 'clsx';

const SHEET_TRANSITION = { duration: 0.4, ease: [0.25, 1, 0.5, 1] };

export default function CreateImpulseSheet({ isOpen, initialData, onClose }) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const { location: gpsLocation } = useLocation();
  const targetVenue = initialData?.venue;

  useEffect(() => { if (isOpen) setMessage(''); }, [isOpen]);

  const handleCreate = async () => {
    if (!message.trim() || !user) return;
    setIsSending(true);
    let lat = targetVenue?.lat || gpsLocation?.[0] || 55.7558;
    let lng = targetVenue?.lng || gpsLocation?.[1] || 37.6173;

    if (!targetVenue && !gpsLocation) {
        lat += (Math.random() - 0.5) * 0.02;
        lng += (Math.random() - 0.5) * 0.02;
    }

    const { error } = await supabase.from('impulses').insert([{
      user_id: user.id, message, lat, lng, venue_id: targetVenue?.id || null, is_ghost: false
    }]);

    setIsSending(false);
    if (!error) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm"
          />
          
          {/* Card Style Sheet - Floats above bottom nav */}
          <motion.div 
            initial={{ y: "120%", scale: 0.95 }} 
            animate={{ y: 0, scale: 1 }} 
            exit={{ y: "120%", scale: 0.95 }}
            transition={SHEET_TRANSITION}
            className="absolute bottom-28 left-4 right-4 z-50 bg-[#1C1C1E] rounded-[32px] border border-white/10 p-6 shadow-2xl overflow-hidden"
          >
             {/* Декоративный элемент сверху */}
             <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0" />

            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">{targetVenue ? 'Встреча в месте' : 'Создать импульс'}</h2>
                {targetVenue ? (
                  <div className="flex items-center gap-1.5 mt-1 text-primary"><MapPin size={16} fill="currentColor" /><span className="font-bold text-sm uppercase tracking-wider">{targetVenue.name}</span></div>
                ) : (
                  <div className="flex items-center gap-1.5 mt-1 text-white/50"><Navigation size={14} /><span className="font-bold text-[10px] uppercase tracking-wider">{gpsLocation ? 'Моя геопозиция' : 'Случайная точка'}</span></div>
                )}
              </div>
              <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-white/40 active:scale-90 transition-transform"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={targetVenue ? `Кого позовем в ${targetVenue.name}, ${user?.first_name}?` : `Что делаем, ${user?.first_name}?`}
                className="w-full h-32 bg-black/20 border border-white/5 rounded-3xl p-5 text-white placeholder:text-white/20 resize-none focus:outline-none focus:border-white/10 text-lg font-medium transition-colors"
                autoFocus
              />
              
              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={handleCreate}
                disabled={isSending}
                className={clsx(
                  "w-full py-4 rounded-3xl flex items-center justify-center gap-2 font-bold text-lg transition-all",
                  isSending ? "bg-white/10 text-white/50" : "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                )}
              >
                {isSending ? '...' : <>Опубликовать <Send size={20} /></>}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}