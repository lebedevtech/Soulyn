import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Search, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// PREMIUM ANIMATION (SYNCED)
const TRANSITION_EASE = [0.25, 0.1, 0.25, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.05 }
  }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0, filter: 'blur(10px)', scale: 0.96 },
  visible: { 
    y: 0, 
    opacity: 1, 
    filter: 'blur(0px)',
    scale: 1,
    transition: { duration: 0.4, ease: TRANSITION_EASE } 
  },
  tap: { scale: 0.97, transition: { duration: 0.1 } }
};

export default function ChatPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchChats = async () => {
      await new Promise(r => setTimeout(r, 300));
      const { data } = await supabase
        .from('matches')
        .select(`id, status, initiator:initiator_id(first_name, avatar_url), requester:requester_id(first_name, avatar_url), impulse:impulse_id(message)`)
        .or(`initiator_id.eq.${user.id},requester_id.eq.${user.id}`)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false });

      setChats(data || []);
      setLoading(false);
    };
    fetchChats();
  }, [user]);

  if (loading) {
    return <div className="w-full h-full bg-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      <div className="absolute top-12 left-0 right-0 h-[52px] z-20 flex items-center justify-center bg-black/80 backdrop-blur-md border-b border-white/5">
        <span className="text-[17px] font-bold text-white tracking-tight">Чаты</span>
        <button className="absolute right-4 p-2 text-white/50 hover:text-white transition-colors"><Search size={20} /></button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pt-28 pb-32 px-4">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 text-white/20"><MessageCircle size={32} /></div>
            <p className="text-white/40 font-medium">Пока нет активных чатов</p>
            <p className="text-white/20 text-sm mt-2">Откликайся на импульсы на карте!</p>
          </div>
        ) : (
          <motion.div className="space-y-2 will-change-transform" variants={containerVariants} initial="hidden" animate="visible">
            {chats.map((chat) => {
              const partner = chat.initiator_id === user.id ? chat.requester : chat.initiator;
              if (!partner) return null;

              return (
                <motion.button
                  key={chat.id}
                  variants={cardVariants}
                  whileTap="tap"
                  onClick={() => navigate(`/chat/${chat.id}`)}
                  className="w-full p-3 rounded-[20px] bg-white/5 border border-white/5 flex items-center gap-3"
                >
                  <div className="relative">
                    <img src={partner.avatar_url || 'https://i.pravatar.cc/150'} className="w-12 h-12 rounded-full object-cover border border-white/10" alt=""/>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h3 className="font-bold text-white text-[16px]">{partner.first_name}</h3>
                      <span className="text-[10px] text-white/30 font-bold uppercase">12:30</span>
                    </div>
                    <p className="text-white/50 text-[13px] truncate pr-4">{chat.impulse?.message || 'Новый чат'}</p>
                  </div>
                  <ChevronRight size={18} className="text-white/20" />
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}