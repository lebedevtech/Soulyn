import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Star, MapPin, Trash2, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

export default function ImpulseSheet({ impulse, onClose }) {
  const { user } = useAuth();
  const [requestStatus, setRequestStatus] = useState(null); // 'pending' | 'accepted' | null
  const [loading, setLoading] = useState(false);

  // Проверяем, отправлял ли я уже запрос на этот импульс
  useEffect(() => {
    if (impulse && user && impulse.user_id !== user.id) {
      checkRequestStatus();
    } else {
      setRequestStatus(null);
    }
  }, [impulse, user]);

  const checkRequestStatus = async () => {
    const { data } = await supabase
      .from('matches')
      .select('status')
      .eq('impulse_id', impulse.id)
      .eq('requester_id', user.id)
      .maybeSingle();
    
    if (data) {
      setRequestStatus(data.status); // 'pending' или 'accepted'
    } else {
      setRequestStatus(null);
    }
  };

  const handleJoin = async () => {
    if (!user) return;
    setLoading(true);

    // Создаем запись в таблице matches
    const { error } = await supabase
      .from('matches')
      .insert({
        impulse_id: impulse.id,
        initiator_id: impulse.user_id, // Владелец импульса
        requester_id: user.id,         // Я (гость)
        status: 'pending'
      });

    if (error) {
      console.error('Error joining:', error);
      alert('Ошибка при отправке запроса');
    } else {
      setRequestStatus('pending');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Удалить этот импульс?')) return;
    setLoading(true);

    const { error } = await supabase
      .from('impulses')
      .delete()
      .eq('id', impulse.id);

    if (error) {
      console.error('Delete error:', error);
      alert('Ошибка удаления');
    } else {
      onClose(); // Закрываем шторку, а MapPage сам удалит маркер через Realtime
    }
    setLoading(false);
  };

  if (!impulse) return null;

  const author = impulse.users || {};
  const isOwner = user?.id === impulse.user_id; // Это мой импульс?

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="absolute bottom-0 left-0 right-0 z-50 bg-[#121212] rounded-t-[40px] border-t border-white/10 overflow-hidden"
      >
        {/* Верхняя часть с Аватаром */}
        <div className="relative pt-8 px-6 pb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-primary/20 p-1 relative">
                <img src={author.avatar_url} className="w-full h-full rounded-full object-cover" alt="" />
                {author.is_premium && (
                  <div className="absolute -top-1 -right-1 bg-black rounded-full p-1.5 border border-yellow-500">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  </div>
                )}
              </div>
              <div>
                <h2 className={clsx("text-2xl font-black leading-none", author.is_premium ? "text-yellow-400" : "text-white")}>
                  {author.first_name}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold uppercase text-white tracking-wider border border-white/5">
                     CEO & Founder
                  </span>
                  {author.club_status === 'gold' && (
                    <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-[10px] font-bold uppercase text-yellow-500 tracking-wider border border-yellow-500/20">
                      Gold Member
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-white/40">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Контент */}
        <div className="px-6 pb-8">
          <div className="p-5 rounded-[24px] bg-white/5 border border-white/5 mb-6">
             <p className="text-white text-lg font-medium leading-relaxed">
               "{impulse.message}"
             </p>
             {impulse.venues && (
               <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-primary">
                 <MapPin size={16} />
                 <span className="font-bold text-sm uppercase tracking-widest">{impulse.venues.name}</span>
               </div>
             )}
          </div>

          {/* КНОПКА ДЕЙСТВИЯ (ДИНАМИЧЕСКАЯ) */}
          {isOwner ? (
            // СЦЕНАРИЙ 1: Я ВЛАДЕЛЕЦ -> УДАЛИТЬ
            <button 
              onClick={handleDelete}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              {loading ? 'Удаление...' : <>Удалить импульс <Trash2 size={20} /></>}
            </button>
          ) : (
            // СЦЕНАРИЙ 2: Я ГОСТЬ
            requestStatus === 'pending' ? (
              // Уже отправил запрос
              <button disabled className="w-full py-4 rounded-2xl bg-white/5 text-white/40 font-bold text-lg flex items-center justify-center gap-2 cursor-default">
                <Clock size={20} /> Запрос отправлен
              </button>
            ) : requestStatus === 'accepted' ? (
              // Запрос принят -> Перейти в чат
              <button className="w-full py-4 rounded-2xl bg-green-500 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                <MessageCircle size={20} /> Открыть чат
              </button>
            ) : (
              // Еще не отправил -> Погнали
              <button 
                onClick={handleJoin}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.4)] active:scale-[0.98] transition-all"
              >
                {loading ? 'Отправка...' : <>Погнали! <CheckCircle size={20} /></>}
              </button>
            )
          )}

          <p className="text-center text-white/20 text-xs mt-4 font-medium">
            Импульс исчезнет через 4 часа
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}