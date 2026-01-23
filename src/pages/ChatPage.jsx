import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Search, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

// ЭТАЛОННАЯ АНИМАЦИЯ СПИСКА (КАК В NOTIFICATIONS)
const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } 
  }
};

export default function ChatPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchChats = async () => {
      // Имитация задержки для красоты (чтобы увидеть анимацию)
      await new Promise(r => setTimeout(r, 300));

      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          status,
          initiator:initiator_id(first_name, avatar_url),
          requester:requester_id(first_name, avatar_url),
          impulse:impulse_id(message)
        `)
        .or(`initiator_id.eq.${user.id},requester_id.eq.${user.id}`)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      setChats(data || []);
      setLoading(false);
    };

    fetchChats();
  }, [user]);

  if (loading) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black flex flex-col pt-12 px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Чаты</h1>
        <div className="p-3 bg-white/5 rounded-full border border-white/5">
          <Search size={20} className="text-white/50" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 text-white/20">
              <MessageCircle size={32} />
            </div>
            <p className="text-white/40 font-medium">Пока нет активных чатов</p>
            <p className="text-white/20 text-sm mt-2">Откликайся на импульсы на карте!</p>
          </div>
        ) : (
          <motion.div 
            className="space-y-2"
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {chats.map((chat) => {
              const partner = chat.initiator_id === user.id ? chat.requester : chat.initiator;
              if (!partner) return null; // Защита от удаленных юзеров

              return (
                <motion.button
                  key={chat.id}
                  variants={itemVariants}
                  onClick={() => navigate(`/chat/${chat.id}`)}
                  className="w-full p-4 rounded-[24px] bg-white/5 border border-white/5 flex items-center gap-4 active:scale-[0.98] transition-all"
                >
                  <div className="relative">
                    <img 
                      src={partner.avatar_url || 'https://i.pravatar.cc/150'} 
                      className="w-14 h-14 rounded-full object-cover border border-white/10" 
                      alt=""
                    />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-black rounded-full" />
                  </div>
                  
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-white text-lg">{partner.first_name}</h3>
                      <span className="text-[10px] text-white/30 font-bold uppercase">12:30</span>
                    </div>
                    <p className="text-white/50 text-sm truncate pr-4">
                      {chat.impulse?.message || 'Новый чат'}
                    </p>
                  </div>
                  
                  <ChevronRight size={20} className="text-white/20" />
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}