import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, MoreVertical, Phone, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
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
  const [showMenu, setShowMenu] = useState(false);
  const bottomRef = useRef(null);

  // MOCK DATA (Стабильная версия)
  useEffect(() => {
    // Имитация загрузки данных, чтобы не ломать логику без БД
    setPartner({ first_name: 'Анна', avatar_url: 'https://i.pravatar.cc/150?u=anna', is_online: true });
    setMessages([
      { id: 1, text: 'Привет! Видела твой импульс ⚡️', sender_id: 'partner', created_at: new Date().toISOString() },
      { id: 2, text: 'Да, собираемся в Coffeemania. Ты как?', sender_id: user?.id, created_at: new Date().toISOString() },
    ]);
  }, [id, user]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      text: newMessage, 
      sender_id: user.id, 
      created_at: new Date().toISOString() 
    }]);
    setNewMessage('');
  };

  const handleDeleteChat = () => {
    if (window.confirm('Удалить чат?')) navigate('/chats');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="w-full h-full bg-black flex flex-col relative overflow-hidden">
      
      {/* --- CREATIVE SOLUTION: FLOATING ISLAND HEADER --- 
          Вместо top-0, мы отступаем top-6. 
          Хедер висит в воздухе как капсула.
      */}
      <div className="fixed top-6 left-4 right-4 z-40 h-[64px] bg-[#1C1C1E]/90 backdrop-blur-xl border border-white/10 rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center px-2">
        
        {/* Back Button (Circle) */}
        <button 
          onClick={() => navigate(-1)} 
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-white active:scale-90 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Center Info */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <span className="font-bold text-white text-[16px] leading-tight">{partner?.first_name || '...'}</span>
          <span className="text-[10px] text-green-500 font-bold tracking-wide uppercase mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/> Online
          </span>
        </div>

        {/* Right Actions (Pill) */}
        <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 pr-2"> 
           <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors">
             <Phone size={18} />
           </button>
           <button 
             onClick={() => setShowMenu(!showMenu)} 
             className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
           >
             <MoreVertical size={18} />
           </button>
        </div>
      </div>

      {/* DROPDOWN MENU (Привязан к острову) */}
      <AnimatePresence>
        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="fixed top-24 right-8 z-50 bg-[#2C2C2E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden min-w-[180px]"
            >
              <button onClick={handleDeleteChat} className="w-full p-4 flex items-center gap-3 text-red-500 hover:bg-white/5 font-bold text-sm">
                <Trash2 size={18} /> Удалить чат
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MESSAGES CONTENT (pt-32 чтобы не заезжать под остров) */}
      <div className="flex-1 overflow-y-auto p-4 pt-32 pb-32 space-y-4">
        {messages.length === 0 && <p className="text-center text-white/30 text-sm mt-10">Начните общение...</p>}
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
                "max-w-[75%] p-4 rounded-[24px] text-[15px] leading-relaxed relative shadow-sm",
                isMe ? "bg-primary text-white rounded-tr-sm" : "bg-[#1C1C1E] text-white rounded-tl-sm border border-white/5"
              )}>
                {msg.text}
                <span className={clsx("text-[10px] absolute bottom-1.5 right-3 opacity-50")}>
                  {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* INPUT AREA (Floating Pill at Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 z-50 bg-gradient-to-t from-black via-black to-transparent pt-10">
        <div className="flex gap-2 items-center bg-[#1C1C1E] border border-white/10 rounded-[32px] p-2 pl-5 shadow-2xl">
          <input 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Сообщение..."
            className="flex-1 bg-transparent text-white placeholder:text-white/30 focus:outline-none h-11"
          />
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            className="w-11 h-11 bg-primary rounded-full flex items-center justify-center text-white shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          >
            <Send size={20} />
          </motion.button>
        </div>
      </div>

    </div>
  );
}