import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, MoreVertical, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Оставляем импорт, но используем мок
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

// PREMIUM MESSAGE ANIMATION
const messageVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95, filter: 'blur(5px)' },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    filter: 'blur(0px)',
    transition: { type: "spring", stiffness: 400, damping: 30 } 
  }
};

export default function ChatDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [partner, setPartner] = useState(null);

  useEffect(() => {
    // Mock partner & messages (как в стабильной версии)
    setPartner({ first_name: 'Анна', avatar_url: 'https://i.pravatar.cc/150?u=anna', is_online: true });
    setMessages([
      { id: 1, text: 'Привет! Видела твой импульс ⚡️', sender_id: 'partner', created_at: '12:30' },
      { id: 2, text: 'Да, собираемся в Coffeemania. Ты как?', sender_id: user?.id, created_at: '12:31' },
    ]);
  }, [id, user]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), text: newMessage, sender_id: user.id, created_at: 'Just now' }]);
    setNewMessage('');
  };

  return (
    <div className="w-full h-full bg-black flex flex-col relative">
      {/* HEADER FIX:
         1. pt-16: Увеличенный отступ сверху (было pt-14).
         2. relative + z-20: Чтобы лежать поверх скролла.
      */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-black/90 backdrop-blur-xl border-b border-white/5 pt-16 pb-3 px-4 shadow-lg">
        <div className="flex items-center justify-between relative">
          
          {/* Левая кнопка (Назад) */}
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white active:opacity-50 z-30">
            <ArrowLeft size={24} />
          </button>
          
          {/* Центр (Имя) - Абсолютное позиционирование для идеального центра */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10">
            <span className="font-bold text-white text-[17px] leading-tight">{partner?.first_name || '...'}</span>
            <span className="text-[10px] text-green-500 font-bold tracking-wide mt-0.5">ONLINE</span>
          </div>
          
          {/* Правые кнопки (Звонок/Меню) - FIX: pr-10 */}
          {/* Добавлен mr-10 или pr-10, чтобы уйти из-под кнопки меню Телеграма */}
          <div className="flex gap-1 z-30 mr-8"> 
             <button className="p-2 text-white/50 hover:text-white transition-colors"><Phone size={20} /></button>
             <button className="p-2 text-white/50 hover:text-white transition-colors"><MoreVertical size={20} /></button>
          </div>
        </div>
      </div>

      {/* Messages: pt-32 (компенсация увеличенного хедера) */}
      <div className="flex-1 overflow-y-auto p-4 pt-32 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.sender_id === user?.id;
          return (
            <motion.div 
              key={msg.id}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              className={clsx("flex", isMe ? "justify-end" : "justify-start")}
            >
              <div className={clsx(
                "max-w-[75%] p-4 rounded-[20px] text-[15px] leading-relaxed relative",
                isMe ? "bg-primary text-white rounded-tr-sm" : "bg-[#1C1C1E] text-white rounded-tl-sm"
              )}>
                {msg.text}
                <span className={clsx("text-[10px] absolute bottom-1 right-3 opacity-50")}>{msg.created_at}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-4 bg-black border-t border-white/10 pb-8">
        <div className="flex gap-2 items-center bg-[#1C1C1E] rounded-full p-2 pl-4">
          <input 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Сообщение..."
            className="flex-1 bg-transparent text-white placeholder:text-white/30 focus:outline-none h-10"
          />
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shrink-0 shadow-lg"
          >
            <Send size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}