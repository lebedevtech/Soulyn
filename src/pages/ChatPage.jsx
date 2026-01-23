import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Search, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// PREMIUM ANIMATION CONSTANTS
const TRANSITION_EASE = [0.25, 0.1, 0.25, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.05 }
  }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0, scale: 1 },
  visible: { 
    y: 0, 
    opacity: 1, 
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
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredChats = chats.filter(chat => {
    const partner = chat.initiator_id === user.id ? chat.requester : chat.initiator;
    const name = partner?.first_name || '';
    const msg = chat.impulse?.message || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || msg.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return <div className="w-full h-full bg-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      {/* HEADER: Уровень top-14 (56px) как на карте. Текст поднят выше. */}
      <div className="absolute top-14 left-0 right-0 h-[52px] z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md border-b border-white/5">
        <span className="text-[17px] font-bold text-white tracking-tight -translate-y-2">Чаты</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />

      {/* Контент: отступ pt-32 для выравнивания под хедером */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-32 pb-32 px-4 relative z-0">
        
        {/* SEARCH BAR */}
        <div className="mb-6 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
            <Search size={18} />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск чатов"
            className="w-full h-10 bg-white/5 border border-white/10 rounded-[12px] pl-11 pr-4 text-white text-[15px] placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>

        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center opacity-50">
            {searchQuery ? (
               <p className="text-white/40 font-medium">Ничего не найдено</p>
            ) : (
              <>
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-white/20"><MessageCircle size={28} /></div>
                <p className="text-white/40 font-medium">Пока нет активных чатов</p>
              </>
            )}
          </div>
        ) : (
          <motion.div className="space-y-2" variants={containerVariants} initial="hidden" animate="visible">
            {filteredChats.map((chat) => {
              const partner = chat.initiator_id === user.id ? chat.requester : chat.initiator;
              if (!partner) return null;

              return (
                <motion.button
                  key={chat.id}
                  variants={cardVariants}
                  whileTap="tap"
                  onClick={() => navigate(`/chat/${chat.id}`)}
                  className="w-full p-3 rounded-[20px] bg-white/5 border border-white/5 flex items-center gap-3 active:bg-white/10 transition-colors"
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