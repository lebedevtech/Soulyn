import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Send, CheckCircle2 } from 'lucide-react'; // Добавил иконки
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const SHEET_TRANSITION = { duration: 0.4, ease: [0.25, 1, 0.5, 1] };

export default function ImpulseSheet({ impulse, onClose }) {
  const { user } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [hasSent, setHasSent] = useState(false);

  // Логика отправки отклика
  const handleConnect = async () => {
    if (!user || isSending) return;
    setIsSending(true);

    try {
      // 1. Создаем матч со статусом 'pending' (ожидает подтверждения)
      const { error } = await supabase.from('matches').insert([{
        initiator_id: impulse.user_id, // Тот, кто создал импульс
        requester_id: user.id,         // Тот, кто откликается (я)
        impulse_id: impulse.id,
        status: 'pending'
      }]);

      if (!error) {
        setHasSent(true);
        // Через 1.5 сек закрываем шторку
        setTimeout(() => {
          onClose();
          setHasSent(false);
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  if (!impulse) return null;
  const author = impulse.users || { first_name: 'Ghost', avatar_url: null };

  return (
    <>
      {/* Backdrop: Z-100 (перекрывает меню) */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
      />
      
      {/* Sheet: Z-110, Fixed Bottom */}
      <motion.div 
        initial={{ y: "100%" }} 
        animate={{ y: 0 }} 
        exit={{ y: "100%" }}
        transition={SHEET_TRANSITION}
        className="fixed bottom-0 left-0 right-0 z-[110] bg-[#121212] rounded-t-[32px] border-t border-white/10 p-6 pb-12 shadow-2xl overflow-hidden"
      >
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-8" />

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 rounded-full border-4 border-[#1C1C1E] p-1 bg-gradient-to-br from-primary to-purple-900 shadow-2xl mb-4 relative">
             <img src={author.avatar_url || 'https://i.pravatar.cc/300'} className="w-full h-full rounded-full object-cover" alt="" />
             {/* Статус онлайн (фейк для красоты) */}
             <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-[#1C1C1E] rounded-full" />
          </div>
          
          <h2 className="text-3xl font-black text-white tracking-tight mb-2">{author.first_name}</h2>
          
          {impulse.venues ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-primary">
              <MapPin size={14} fill="currentColor" />
              <span className="text-sm font-bold uppercase tracking-wide">{impulse.venues.name}</span>
            </div>
          ) : (
            <p className="text-white/40 text-sm font-medium">~500м от вас</p>
          )}
        </div>

        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 mb-8 relative overflow-hidden">
           <p className="text-xl text-white font-medium leading-relaxed relative z-10">"{impulse.message}"</p>
           <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
        </div>

        {/* КНОПКА ОТКЛИКА */}
        {user?.id !== impulse.user_id && (
          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={handleConnect}
            disabled={isSending || hasSent}
            className={clsx(
              "w-full py-5 rounded-[24px] font-bold text-lg flex items-center justify-center gap-3 transition-all",
              hasSent 
                ? "bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                : "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            )}
          >
            {hasSent ? (
              <>Отклик отправлен <CheckCircle2 size={24} /></>
            ) : isSending ? (
              "Отправка..."
            ) : (
              <>Откликнуться <Send size={24} /></>
            )}
          </motion.button>
        )}
      </motion.div>
    </>
  );
}