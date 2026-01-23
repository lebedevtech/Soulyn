import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MapPin, Navigation } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

export default function CreateImpulseSheet({ isOpen, initialData, onClose }) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();

  const targetVenue = initialData?.venue;
  const userLocation = initialData?.location; // Координаты [lat, lng] из GPS

  useEffect(() => {
    if (isOpen) setMessage('');
  }, [isOpen]);

  const handleCreate = async () => {
    if (!message.trim() || !user) return;
    
    setIsSending(true);

    // Определяем координаты:
    // 1. Если выбрано место -> координаты места
    // 2. Если есть GPS -> координаты юзера
    // 3. Иначе -> случайные (центр Москвы)
    let lat, lng;

    if (targetVenue) {
      lat = targetVenue.lat;
      lng = targetVenue.lng;
    } else if (userLocation) {
      lat = userLocation[0];
      lng = userLocation[1];
    } else {
      lat = 55.7558 + (Math.random() - 0.5) * 0.02;
      lng = 37.6173 + (Math.random() - 0.5) * 0.02;
    }

    const newImpulse = {
      user_id: user.id,
      message: message,
      lat: lat,
      lng: lng,
      venue_id: targetVenue ? targetVenue.id : null,
      is_ghost: false 
    };

    const { error } = await supabase.from('impulses').insert([newImpulse]);

    setIsSending(false);

    if (error) {
      console.error('Ошибка:', error);
      alert('Не удалось создать импульс');
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 z-50 bg-[#121212] rounded-t-[40px] border-t border-white/10 p-6 pb-12"
          >
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {targetVenue ? 'Встреча в месте' : 'Создать импульс'}
                </h2>
                {targetVenue ? (
                  <div className="flex items-center gap-1.5 mt-1 text-primary">
                    <MapPin size={16} fill="currentColor" />
                    <span className="font-bold text-sm uppercase tracking-wider">{targetVenue.name}</span>
                  </div>
                ) : (
                  // Если без места, показываем статус GPS
                  <div className="flex items-center gap-1.5 mt-1 text-white/50">
                    <Navigation size={14} />
                    <span className="font-bold text-[10px] uppercase tracking-wider">
                      {userLocation ? 'Моя геопозиция' : 'Случайная точка'}
                    </span>
                  </div>
                )}
              </div>
              <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-white/40">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={targetVenue 
                  ? `Кого позовем в ${targetVenue.name}, ${user?.first_name}?` 
                  : `Что делаем, ${user?.first_name}?`
                }
                className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-5 text-white placeholder:text-white/20 resize-none focus:outline-none focus:border-primary/50 text-lg font-medium"
              />
              
              <button 
                onClick={handleCreate}
                disabled={isSending}
                className={clsx(
                  "w-full py-4 rounded-3xl flex items-center justify-center gap-2 font-bold text-lg transition-all active:scale-[0.98]",
                  isSending ? "bg-white/10 text-white/50" : "bg-primary text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                )}
              >
                {isSending ? 'Публикация...' : (
                  <>Опубликовать <Send size={20} /></>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}