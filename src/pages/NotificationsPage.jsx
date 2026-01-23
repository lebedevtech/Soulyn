import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, X, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

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
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const { data: requests } = await supabase.from('matches').select(`id, status, created_at, requester:requester_id(id, first_name, avatar_url), impulse:impulse_id(message)`).eq('initiator_id', user.id).eq('status', 'pending');
      const { data: messages } = await supabase.from('messages').select(`id, content, created_at, match_id, match:match_id (initiator:initiator_id(id, first_name, avatar_url), requester:requester_id(id, first_name, avatar_url))`).eq('is_read', false).neq('sender_id', user.id);

      const formattedRequests = (requests || []).map(r => ({
        type: 'request', id: r.id, date: new Date(r.created_at), user: r.requester,
        text: `хочет встретиться: "${r.impulse?.message}"`
      }));

      const formattedMessages = (messages || []).map(m => {
        const match = m.match;
        const partner = match.initiator.id === user.id ? match.requester : match.initiator;
        return {
          type: 'message', id: m.id, date: new Date(m.created_at), user: partner,
          text: `Сообщение: ${m.content}`, matchId: m.match_id
        };
      });

      const allItems = [...formattedRequests, ...formattedMessages].sort((a, b) => b.date - a.date);
      setItems(allItems);
      setLoading(false);
    };

    fetchData();
    const channel = supabase.channel('notifications').on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, fetchData).on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchData).subscribe();
    return () => supabase.removeChannel(channel);
  }, [user]);

  const handleAccept = async (matchId) => {
    await supabase.from('matches').update({ status: 'accepted' }).eq('id', matchId);
    setItems(prev => prev.filter(i => i.id !== matchId));
    navigate(`/chat/${matchId}`);
  };

  const handleDecline = async (matchId) => {
    await supabase.from('matches').delete().eq('id', matchId);
    setItems(prev => prev.filter(i => i.id !== matchId));
  };

  return (
    <div className="w-full h-full bg-black flex flex-col overflow-hidden">
      
      {/* 1. STATUS SPACER */}
      <div className="w-full h-6 shrink-0 bg-black" />

      {/* 2. HEADER */}
      <div className="w-full h-12 shrink-0 flex items-center justify-center bg-black border-b border-white/5 z-20">
        <span className="text-[17px] font-bold text-white tracking-tight">Уведомления</span>
      </div>

      {/* 3. CONTENT */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 pb-32">
        {loading ? (
           <div className="text-center text-white/30 mt-10">...</div>
        ) : items.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-64 text-center opacity-40">
             <Bell size={48} className="mb-4 text-white/20" />
             <p>Пусто</p>
           </div>
        ) : (
          <motion.div className="space-y-3" variants={listContainerVariants} initial="hidden" animate="visible">
            {items.map((item) => (
              <motion.div key={`${item.type}-${item.id}`} variants={itemVariants} className="w-full p-4 rounded-[24px] bg-[#1C1C1E] border border-white/10 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden relative">
                    <img src={item.user?.avatar_url || 'https://i.pravatar.cc/150'} className="w-full h-full object-cover" alt=""/>
                    {item.type === 'message' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border border-black" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <p className="text-white font-bold text-[15px] truncate">{item.user?.first_name}</p>
                        <span className="text-[10px] text-white/30 whitespace-nowrap ml-2">
                            {item.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                    <p className="text-white/50 text-xs mt-0.5 line-clamp-2 leading-relaxed">{item.text}</p>
                  </div>
                </div>

                {item.type === 'request' ? (
                    <div className="flex gap-2 mt-1">
                      <button onClick={() => handleAccept(item.id)} className="flex-1 py-2.5 bg-white text-black rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"><Check size={16} /> Принять</button>
                      <button onClick={() => handleDecline(item.id)} className="flex-1 py-2.5 bg-white/5 text-white/50 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"><X size={16} /> Скрыть</button>
                    </div>
                ) : (
                    <button onClick={() => navigate(`/chat/${item.matchId}`)} className="w-full py-2.5 bg-white/5 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-white/10"><MessageCircle size={16} /> Ответить</button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}