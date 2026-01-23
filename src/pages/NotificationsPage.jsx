import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Heart, Check, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0, scale: 1 },
  visible: { y: 0, opacity: 1, scale: 1 }
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]); // Запросы на переписку (pending matches)
  const [loading, setLoading] = useState(true);

  // Загружаем реальные запросы
  useEffect(() => {
    if (!user) return;
    const fetchRequests = async () => {
      // Ищем матчи, где Я — инициатор импульса, а статус 'pending'
      const { data } = await supabase
        .from('matches')
        .select(`
          id, 
          status, 
          created_at,
          requester:requester_id(id, first_name, avatar_url),
          impulse:impulse_id(message)
        `)
        .eq('initiator_id', user.id) // Только те, где я автор импульса
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      setRequests(data || []);
      setLoading(false);
    };

    fetchRequests();

    // Подписка на новые запросы
    const channel = supabase.channel('requests')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'matches', filter: `initiator_id=eq.${user.id}` }, (payload) => {
        // Чтобы обновить UI с данными юзера, лучше перезапросить (упрощение)
        fetchRequests(); 
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  // Обработка: Принять
  const handleAccept = async (matchId) => {
    // 1. Обновляем статус на 'accepted'
    await supabase.from('matches').update({ status: 'accepted' }).eq('id', matchId);
    
    // 2. Убираем из списка визуально
    setRequests(prev => prev.filter(r => r.id !== matchId));
    
    // 3. (Опционально) Сразу кидаем в чат
    navigate(`/chat/${matchId}`);
  };

  // Обработка: Отклонить
  const handleDecline = async (matchId) => {
    await supabase.from('matches').delete().eq('id', matchId);
    setRequests(prev => prev.filter(r => r.id !== matchId));
  };

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      {/* HEADER */}
      <div className="absolute top-14 left-0 right-0 h-[52px] z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md border-b border-white/5">
        <span className="text-[17px] font-bold text-white tracking-tight">Уведомления</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />

      <div className="flex-1 overflow-y-auto no-scrollbar pt-32 pb-32 px-4 relative z-0">
        
        {loading ? (
           <div className="text-center text-white/30 mt-10">Загрузка...</div>
        ) : requests.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-64 text-center opacity-40">
             <Bell size={48} className="mb-4 text-white/20" />
             <p>Новых уведомлений нет</p>
           </div>
        ) : (
          <motion.div className="space-y-3" variants={listContainerVariants} initial="hidden" animate="visible">
            <h3 className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Запросы на встречу</h3>
            
            {requests.map((req) => (
              <motion.div
                key={req.id}
                variants={itemVariants}
                className="w-full p-4 rounded-[24px] bg-[#1C1C1E] border border-white/10 flex flex-col gap-3"
              >
                {/* Header: User Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden">
                    <img src={req.requester?.avatar_url || 'https://i.pravatar.cc/150'} className="w-full h-full object-cover" alt=""/>
                  </div>
                  <div>
                    <p className="text-white font-bold text-[15px]">
                      {req.requester?.first_name} <span className="text-white/50 font-normal">хочет встретиться</span>
                    </p>
                    <p className="text-white/30 text-xs mt-0.5">на ваш импульс "{req.impulse?.message}"</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-1">
                  <button 
                    onClick={() => handleAccept(req.id)}
                    className="flex-1 py-2.5 bg-white text-black rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <Check size={16} /> Принять
                  </button>
                  <button 
                    onClick={() => handleDecline(req.id)}
                    className="flex-1 py-2.5 bg-white/5 text-white/50 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <X size={16} /> Скрыть
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}