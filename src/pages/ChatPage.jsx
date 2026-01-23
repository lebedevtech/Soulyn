import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const MOCK_CHATS = [
  { id: 1, name: 'Алексей', msg: 'Давай в 19:00 у входа?', time: '18:45', img: 'https://i.pravatar.cc/150?u=1', unread: 2 },
  { id: 2, name: 'Мария', msg: 'Я уже подхожу, ты где?', time: '18:30', img: 'https://i.pravatar.cc/150?u=5', unread: 0 },
  { id: 3, name: 'Иван', msg: 'Круто побегали! Завтра повторим?', time: 'Вчера', img: 'https://i.pravatar.cc/150?u=8', unread: 0 },
];

export default function ChatPage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full bg-black">
      {/* HEADER (Увеличен отступ pt-24) */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-24 pb-4 px-6 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black text-white tracking-tight">Чаты</h1>
          <button className="p-2 bg-white/5 rounded-full text-white/40">
            <Search size={20} />
          </button>
        </div>
        
        {/* Фильтр (Активные / Архив) */}
        <div className="flex gap-4">
          <button className="text-sm font-bold text-white border-b-2 border-primary pb-1">Активные</button>
          <button className="text-sm font-bold text-white/40 pb-1">Архив</button>
        </div>
      </div>

      {/* СПИСОК ЧАТОВ (Отступ pt-56, чтобы не залезать под высокую шапку) */}
      <div className="w-full h-full overflow-y-auto no-scrollbar pt-56 pb-32 px-4 space-y-2">
        {MOCK_CHATS.map((chat) => (
          <motion.button
            key={chat.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/chat/${chat.id}`)}
            className="w-full p-4 rounded-[24px] bg-white/5 border border-white/5 flex items-center gap-4 active:bg-white/10 transition-colors"
          >
            <div className="relative">
              <img src={chat.img} className="w-14 h-14 rounded-full object-cover" alt="" />
              {chat.unread > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-black">
                  {chat.unread}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0 text-left">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-white">{chat.name}</span>
                <span className="text-xs text-white/30 font-medium">{chat.time}</span>
              </div>
              <p className={clsx("text-sm truncate", chat.unread > 0 ? "text-white" : "text-white/50")}>
                {chat.msg}
              </p>
            </div>
            
            <ChevronRight size={18} className="text-white/10" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}