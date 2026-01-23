import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, MoreVertical, Phone, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

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

  useEffect(() => {
    setPartner({ first_name: 'Анна', avatar_url: 'https://i.pravatar.cc/150?u=anna', is_online: true });
    setMessages([
      { id: 1, text: 'Привет! Видела твой импульс ⚡️', sender_id: 'partner', created_at: '12:30' },
      { id: 2, text: 'Да, собираемся в Coffeemania. Ты как?', sender_id: user?.id, created_at: '12:31' },
    ]);
  }, [id, user]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), text: newMessage, sender_id: user.id, created_at: 'Just now' }]);
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
      
      {/* --- FLOATING ISLAND HEADER --- 
          Corrected: top-14 (matches MapPage logo), h-[50px] (much smaller)
      */}
      <div className="fixed top-14 left-4 right-4 z-40 h-[50px] bg-[#1C1C1E]/90 backdrop-blur-xl border border-white/10 rounded-[25px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center px-1.5">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 text-white active:scale-90 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Center Info */}
        <div className="flex-1 flex flex-col items-center justify-center leading-none">
          <span className="font-bold text-white text-[14px]">{partner?.first_name || '...'}</span>
          <span className="text-[9px] text-green-500 font-bold tracking-wide uppercase mt-0.5 flex items-center gap-1">
             Online
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 bg-white/5 rounded-full p-0.5 pr-1.5"> 
           <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors">
             <Phone size={16} />
           </button>
           <button 
             onClick={() => setShowMenu(!showMenu)} 
             className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
           >
             <MoreVertical size={16} />
           </button>
        </div>
      </div>

      <AnimatePresence>
        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="fixed top-28 right-8 z-50 bg-[#2C2C2E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden min-w-[160px]"
            >
              <button onClick={handleDeleteChat} className="w-full p-3 flex items-center gap-3 text-red-500 hover:bg-white/5 font-bold text-sm">
                <Trash2 size={16} /> Удалить чат
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto p-4 pt-32 pb-32 space-y-4">
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
                "max-w-[75%] p-3 px-4 rounded-[20px] text-[14px] leading-relaxed relative shadow-sm",
                isMe ? "bg-primary text-white rounded-tr-sm" : "bg-[#1C1C1E] text-white rounded-tl-sm border border-white/5"
              )}>
                {msg.text}
                <span className={clsx("text-[9px] absolute bottom-1 right-3 opacity-50")}>{msg.created_at}</span>
              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 z-50 bg-gradient-to-t from-black via-black to-transparent pt-10">
        <div className="flex gap-2 items-center bg-[#1C1C1E] border border-white/10 rounded-[32px] p-1.5 pl-4 shadow-2xl">
          <input 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Сообщение..."
            className="flex-1 bg-transparent text-white placeholder:text-white/30 focus:outline-none h-10 text-sm"
          />
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          >
            <Send size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}