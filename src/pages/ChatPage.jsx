import React from 'react';
import { motion } from 'framer-motion';
import { Search, MoreVertical, CheckCheck, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const MOCK_CHATS = [
  { id: 1, user: 'Мария', avatar: 'https://i.pravatar.cc/150?u=5', lastMsg: 'Погнали в Surf Coffee через 15 минут? ☕️', time: '12:45', unread: 2, online: true, impulse: 'Кофе' },
  { id: 2, user: 'Алексей', avatar: 'https://i.pravatar.cc/150?u=1', lastMsg: 'Слушай, а там вход платный сегодня?', time: '10:20', unread: 0, online: true, impulse: 'Спорт' },
  { id: 3, user: 'Дарья', avatar: 'https://i.pravatar.cc/150?u=9', lastMsg: 'Фотография.jpg', time: 'Вчера', unread: 0, online: false, impulse: 'Кино' },
  { id: 4, user: 'Иван', avatar: 'https://i.pravatar.cc/150?u=8', lastMsg: 'Я уже на месте, жду у входа в парк', time: 'Пятница', unread: 0, online: false, impulse: 'Прогулка' },
  { id: 5, user: 'Максим', avatar: 'https://i.pravatar.cc/150?u=12', lastMsg: 'Как тебе идея стартапа?', time: '01.02', unread: 0, online: true, impulse: 'Работа' }
];

// Варианты анимации для исключения "прыжков" и мерцания
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export default function ChatPage() {
  const navigate = useNavigate();

  return (
    // Добавлен overflow-x-hidden, чтобы ничего не вылетало за границы телефона
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden flex flex-col">
      
      {/* Скролл-контейнер теперь с жесткой шириной */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto no-scrollbar pt-32 pb-48 px-6 w-full max-w-full overflow-x-hidden"
      >
        {/* Поиск */}
        <div className="mb-8 px-1">
          <div className="glass-input flex items-center gap-3 px-5 py-3.5 rounded-[24px]">
            <Search size={18} className="text-white/20" />
            <input 
              type="text" 
              placeholder="Поиск сообщений..." 
              className="bg-transparent border-none outline-none w-full text-[15px] font-medium text-white"
            />
          </div>
        </div>

        {/* Список чатов */}
        <div className="space-y-3 w-full">
          {MOCK_CHATS.map((chat) => (
            <motion.button 
              key={chat.id}
              variants={itemVariants}
              onClick={() => navigate(`/chat/${chat.id}`)}
              // transform-gpu + will-change: opacity лечат мерцание в конце анимации
              className="w-full glass-panel p-4 rounded-[32px] flex items-center gap-4 active:scale-[0.97] transition-all text-left relative overflow-hidden group transform-gpu"
              style={{ willChange: 'opacity' }}
            >
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-full border-2 border-white/5 p-0.5 bg-white/5">
                  <img src={chat.avatar} className="w-full h-full rounded-full object-cover" alt={chat.user} />
                </div>
                {chat.online && (
                  <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-green-500 rounded-full border-[3px] border-black shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-white text-[16px] tracking-tight truncate">{chat.user}</h4>
                  <span className="text-[11px] font-black text-white/20 uppercase tracking-wider shrink-0">{chat.time}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-white/50 text-sm line-clamp-1 flex-1 font-medium pr-4">{chat.lastMsg}</p>
                  {chat.unread > 0 ? (
                    <div className="min-w-[20px] h-5 px-1.5 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-[10px] font-black text-white">{chat.unread}</span>
                    </div>
                  ) : (
                    <CheckCheck size={16} className="text-white/10" />
                  )}
                </div>

                {chat.impulse && (
                  <div className="flex items-center gap-1 mt-2.5">
                    <div className="px-2 py-0.5 bg-white/5 rounded-lg flex items-center gap-1 border border-white/5">
                      <MapPin size={10} className="text-primary" />
                      <span className="text-[9px] font-black text-white/30 uppercase tracking-tighter">Импульс: {chat.impulse}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Барьеры затухания */}
      <div className="absolute top-0 left-0 right-0 h-32 z-20 pointer-events-none bg-gradient-to-b from-black via-black/80 to-transparent backdrop-blur-md" />
      <div className="absolute bottom-0 left-0 right-0 h-40 z-20 pointer-events-none bg-gradient-to-t from-black via-black/95 to-transparent" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-14 px-6 flex items-center justify-between pointer-events-auto">
        <h1 className="text-3xl font-black text-white tracking-tighter leading-none">Чаты</h1>
        <button className="glass-panel p-3 rounded-full text-white/40 active:text-white transition-all">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
}