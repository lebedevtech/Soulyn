import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, MoreVertical, Phone } from 'lucide-react';
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
  const bottomRef = useRef(null);

  useEffect(() => {
    // Mock partner & messages
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="w-full h-full bg-black flex flex-col relative">
      {/* HEADER: Кнопки опущены (pt-24), текст партнера поднят выше (-translate-y-3). */}
      <div className="pt-24 pb-4 px-4 flex items-center justify-between bg-black/80 backdrop-blur-md border-b border-white/5 z-20 relative">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white active:opacity-50 z-10">
          <ArrowLeft size={24} />
        </button>
        
        {/* Абсолютное центрирование имени с подъемом текста */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-2 flex flex-col items-center pointer-events-none">
          <span className="font-bold text-white text-[17px] leading-tight -translate-y-3">
            {partner?.first_name || '...'}
          </span>
          <span className="text-[11px] text-green-500 font-medium">Online</span>
        </div>
        
        <div className="flex gap-4 z-10">
           <Phone size={20} className="text-white/50" />
           <MoreVertical size={20} className="text-white/50" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
        <div ref={bottomRef} />
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
            className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shrink-0"
          >
            <Send size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}