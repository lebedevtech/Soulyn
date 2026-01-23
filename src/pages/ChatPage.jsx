import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Search, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.05 }
  }
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
      // Mock delay as in stable version
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

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      {/* HEADER: Уровень top-14 соответствует логотипу Soulyn на карте */}
      <div className="absolute top-14 left-0 right-0 h-[52px] z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md border-b border-white/5">
        <span className="text-[17px] font-bold text-white tracking-tight">Чаты</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pt-32 pb-32 px-4 relative z-0">
        <div className="mb-6 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
            <Search size={18} />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск чатов"
            className="w-full h-10 bg-white/5 border border-white/10 rounded-[12px] pl-11 pr-4 text-white text-[15px] placeholder:text-white/30 focus:outline-none focus:border-white/20"
          />
        </div>

        <motion.div className="space-y-2" variants={containerVariants} initial="hidden" animate="visible">
          {chats.map((chat) => (
             <button key={chat.id} onClick={() => navigate(`/chat/${chat.id}`)} className="w-full p-3 rounded-[20px] bg-white/5 border border-white/5 flex items-center gap-3">
               {/* Чат-карточки как в v0.2 */}
               <img src={chat.initiator?.avatar_url || 'https://i.pravatar.cc/150'} className="w-12 h-12 rounded-full object-cover" alt=""/>
               <div className="flex-1 text-left">
                  <h3 className="font-bold text-white">{chat.initiator?.first_name || 'Partner'}</h3>
                  <p className="text-white/50 text-sm truncate">{chat.impulse?.message || 'Новое сообщение'}</p>
               </div>
             </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}