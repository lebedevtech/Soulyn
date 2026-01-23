import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Bell, Check, X, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useTelegram } from '../context/TelegramContext';
import clsx from 'clsx';

export default function NotificationsPage() {
  const { user } = useAuth();
  const { haptic } = useTelegram();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('matches')
      .select(`id, status, created_at, requester:requester_id(first_name, avatar_url), impulse:impulse_id(message)`)
      .eq('initiator_id', user.id) // Вы как владелец импульса
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    setRequests(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const handleAction = async (id, status) => {
    haptic?.impact('medium');
    const { error } = await supabase
      .from('matches')
      .update({ status })
      .eq('id', id);
    
    if (!error) {
      setRequests(prev => prev.filter(req => req.id !== id));
      if (status === 'accepted') haptic?.notification('success');
    }
  };

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      {/* HEADER: Эталон (top-14, -translate-y-3) */}
      <div className="absolute top-14 left-0 right-0 h-[52px] z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md border-b border-white/5 text-center">
        <span className="text-[17px] font-bold text-white tracking-tight -translate-y-3">Уведомления</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pt-32 pb-32 px-4 relative z-0">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center opacity-30">
            <Bell size={40} className="mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">Нет новых запросов</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 ml-1">Запросы на встречу</h3>
            <AnimatePresence>
              {requests.map((req) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full p-4 rounded-[28px] bg-white/5 border border-white/5 flex flex-col gap-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <img src={req.requester?.avatar_url} className="w-10 h-10 rounded-full object-cover" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-bold tracking-tight">
                        {req.requester?.first_name} <span className="text-white/40 font-medium tracking-normal">хочет присоединиться</span>
                      </p>
                      <p className="text-[11px] text-primary font-bold truncate mt-0.5">«{req.impulse?.message}»</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAction(req.id, 'accepted')}
                      className="flex-1 py-3 rounded-2xl bg-primary text-white text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      <Check size={14} /> Принять
                    </button>
                    <button 
                      onClick={() => handleAction(req.id, 'rejected')}
                      className="px-6 py-3 rounded-2xl bg-white/5 text-white/40 text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}