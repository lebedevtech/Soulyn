import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.05 }
  }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0, scale: 1 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.3 } },
  tap: { scale: 0.97 }
};

export default function ChatPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // MOCK DATA (Стабильная версия)
  const chats = [
    { id: 1, name: 'Анна', message: 'Привет! Видела твой импульс...', time: '12:30', unread: 2, avatar: 'https://i.pravatar.cc/150?u=anna' },
    { id: 2, name: 'Макс', message: 'Давай встретимся в 19:00', time: 'Вчера', unread: 0, avatar: 'https://i.pravatar.cc/150?u=max' },
    { id: 3, name: 'Елена', message: 'Спасибо за компанию!', time: 'Пн', unread: 0, avatar: 'https://i.pravatar.cc/150?u=elena' },
  ];

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      
      {/* FLOATING HEADER ISLAND */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60]">
        <div className="px-8 py-3 bg-[#1C1C1E]/80 backdrop-blur-md border border-white/10 rounded-full shadow-2xl flex items-center justify-center">
            <span className="text-[15px] font-black text-white tracking-widest uppercase">Чаты</span>
        </div>
      </div>

      {/* Gradient Overlay for bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />

      {/* Content: pt-32 */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-28 pb-32 px-4 relative z-0">
        
        <div className="mb-6 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
            <Search size={18} />
          </div>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск..."
            className="w-full h-12 bg-white/5 border border-white/10 rounded-[20px] pl-11 pr-4 text-white text-[15px] placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-all"
          />
        </div>

        <motion.div className="space-y-2" variants={containerVariants} initial="hidden" animate="visible">
          {chats.map((chat) => (
            <motion.button
              key={chat.id}
              variants={cardVariants}
              whileTap="tap"
              onClick={() => navigate(`/chat/${chat.id}`)}
              className="w-full p-4 rounded-[28px] bg-white/5 border border-white/5 flex items-center gap-4 active:bg-white/10 transition-colors relative overflow-hidden group"
            >
              {/* Active State Highlight */}
              <div className="absolute inset-0 bg-white/0 group-active:bg-white/5 transition-colors" />

              <div className="relative">
                <img src={chat.avatar} className="w-14 h-14 rounded-full object-cover border border-white/10 shadow-lg" alt=""/>
                {chat.unread > 0 && (
                   <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-[#121212] flex items-center justify-center animate-pulse">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                   </div>
                )}
              </div>

              <div className="flex-1 text-left min-w-0 z-10">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-white text-[16px]">{chat.name}</h3>
                  <span className={chat.unread > 0 ? "text-[11px] font-bold text-primary" : "text-[11px] text-white/30 font-medium"}>
                     {chat.time}
                  </span>
                </div>
                
                <div className="flex justify-between items-center gap-2">
                  <p className={clsx("text-[14px] truncate leading-relaxed", chat.unread > 0 ? "text-white font-medium" : "text-white/50")}>
                    {chat.message}
                  </p>
                  
                  {chat.unread > 0 && (
                    <div className="min-w-[22px] h-[22px] px-1.5 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                      <span className="text-[11px] font-bold text-white">{chat.unread}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}