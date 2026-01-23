import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Search, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

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
      // 1. Получаем список принятых матчей
      const { data: matches } = await supabase
        .from('matches')
        .select(`
          id, 
          status, 
          initiator:initiator_id(id, first_name, avatar_url), 
          requester:requester_id(id, first_name, avatar_url), 
          impulse:impulse_id(message)
        `)
        .or(`initiator_id.eq.${user.id},requester_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (!matches || matches.length === 0) {
        setChats([]);
        setLoading(false);
        return;
      }

      const matchIds = matches.map(m => m.id);

      // 2. Получаем последние сообщения для этих матчей
      // (В реальном проекте лучше использовать RPC или View для производительности, 
      // но для прототипа загрузим сообщения и отфильтруем в JS)
      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .in('match_id', matchIds)
        .order('created_at', { ascending: true }); // Загружаем все, сортируем позже

      // 3. Собираем данные для UI
      const processedChats = matches.map(match => {
        const partner = match.initiator.id === user.id ? match.requester : match.initiator;
        
        // Фильтруем сообщения этого чата
        const chatMessages = messages?.filter(m => m.match_id === match.id) || [];
        const lastMessage = chatMessages[chatMessages.length - 1];
        
        // Считаем непрочитанные (где получатель = я, и is_read = false)
        const unreadCount = chatMessages.filter(
          m => m.sender_id !== user.id && m.is_read === false
        ).length;

        return {
          ...match,
          partner,
          lastMessage,
          unreadCount,
          // Для сортировки: берем время последнего сообщения или создания матча
          lastActivity: lastMessage ? new Date(lastMessage.created_at) : new Date(match.created_at || 0)
        };
      });

      // Сортируем: свежие сверху
      processedChats.sort((a, b) => b.lastActivity - a.lastActivity);

      setChats(processedChats);
      setLoading(false);
    };

    fetchChats();

    // Realtime подписка на новые сообщения (чтобы обновлять список)
    const channel = supabase.channel('chats_list')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        fetchChats(); 
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  // Фильтрация
  const filteredChats = chats.filter(chat => {
    const name = chat.partner?.first_name || '';
    const msg = chat.lastMessage?.content || chat.impulse?.message || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || msg.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return <div className="w-full h-full bg-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      {/* HEADER */}
      <div className="absolute top-14 left-0 right-0 h-[52px] z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md border-b border-white/5">
        <span className="text-[17px] font-bold text-white tracking-tight">Чаты</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />

      <div className="flex-1 overflow-y-auto no-scrollbar pt-32 pb-32 px-4 relative z-0">
        
        {/* Search */}
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
            {filteredChats.map((chat) => (
              <motion.button
                key={chat.id}
                variants={cardVariants}
                whileTap="tap"
                onClick={() => navigate(`/chat/${chat.id}`)}
                className="w-full p-3 rounded-[20px] bg-white/5 border border-white/5 flex items-center gap-3 active:bg-white/10 transition-colors relative overflow-hidden"
              >
                {/* Avatar */}
                <div className="relative">
                  <img src={chat.partner?.avatar_url || 'https://i.pravatar.cc/150'} className="w-14 h-14 rounded-full object-cover border border-white/10" alt=""/>
                  {/* Статус онлайн (фейк для примера) */}
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#1C1C1E] rounded-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-white text-[16px]">{chat.partner?.first_name}</h3>
                    {/* Время последнего сообщения */}
                    <span className={chat.unreadCount > 0 ? "text-[11px] font-bold text-primary" : "text-[11px] text-white/30 font-medium"}>
                       {chat.lastMessage ? new Date(chat.lastMessage.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center gap-2">
                    <p className={chat.unreadCount > 0 ? "text-white text-[14px] truncate font-medium" : "text-white/50 text-[14px] truncate"}>
                      {chat.lastMessage 
                        ? (chat.lastMessage.sender_id === user.id ? `Вы: ${chat.lastMessage.content}` : chat.lastMessage.content)
                        : <span className="text-primary italic">Новый мэтч! Напишите первым ✨</span>
                      }
                    </p>
                    
                    {/* Unread Badge */}
                    {chat.unreadCount > 0 && (
                      <div className="min-w-[20px] h-5 px-1.5 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">{chat.unreadCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}