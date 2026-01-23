import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Send, MoreHorizontal, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useTelegram } from '../context/TelegramContext';
import clsx from 'clsx';

export default function ChatDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { haptic } = useTelegram();
  const [match, setMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (!id || !user) return;

    const fetchData = async () => {
      // 1. Получаем детали мэтча
      const { data: matchData } = await supabase
        .from('matches')
        .select(`*, initiator:initiator_id(first_name, avatar_url), requester:requester_id(first_name, avatar_url)`)
        .eq('id', id)
        .single();
      
      if (matchData) setMatch(matchData);

      // 2. Получаем историю сообщений
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', id)
        .order('created_at', { ascending: true });
      
      if (msgs) {
        setMessages(msgs);
        setTimeout(() => scrollToBottom("auto"), 100);
      }
    };

    fetchData();

    // 3. Подписка на новые сообщения в реальном времени
    const channel = supabase
      .channel(`chat_${id}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${id}` },
        (payload) => {
          if (payload.new.sender_id !== user.id) {
            setMessages(prev => [...prev, payload.new]);
            haptic?.notification('success');
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const text = newMessage;
    setNewMessage('');
    haptic?.impact('light');

    // Оптимистичное обновление UI
    const tempMsg = { 
      id: Math.random(), 
      sender_id: user.id, 
      text, 
      created_at: new Date().toISOString() 
    };
    setMessages(prev => [...prev, tempMsg]);

    const { error } = await supabase.from('messages').insert({
      match_id: id,
      sender_id: user.id,
      text: text
    });

    if (error) console.error("Send error:", error);
  };

  const partner = match?.initiator_id === user?.id ? match?.requester : match?.initiator;

  return (
    <div className="relative w-full h-full bg-black flex flex-col overflow-hidden">
      
      {/* HEADER: Эталон Soulyn (top-14, -translate-y-3) */}
      <div className="fixed top-14 left-0 right-0 h-[52px] z-[70] flex items-center justify-between bg-black/80 backdrop-blur-md border-b border-white/5 px-4">
        <button onClick={() => navigate(-1)} className="p-2 text-white/40 -translate-y-3 active:scale-90 transition-transform">
          <ChevronLeft size={24} />
        </button>
        
        <div className="flex flex-col items-center -translate-y-3">
          <span className="text-[15px] font-bold text-white tracking-tight">{partner?.first_name || 'Чат'}</span>
          <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Online</span>
        </div>

        <button className="p-2 text-white/20 -translate-y-3">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-32 pb-32 px-4 space-y-3 relative z-0">
        <div className="flex justify-center mb-6">
          <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 flex items-center gap-2">
            <ShieldCheck size={12} className="text-primary" />
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Safe Connection</span>
          </div>
        </div>

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={clsx("flex w-full", msg.sender_id === user?.id ? "justify-end" : "justify-start")}
          >
            <div className={clsx(
              "max-w-[80%] px-4 py-3 rounded-[24px] text-[15px] font-medium leading-relaxed",
              msg.sender_id === user?.id 
                ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20" 
                : "bg-white/10 text-white/90 rounded-tl-none border border-white/5"
            )}>
              {msg.text}
              <div className="text-[8px] mt-1.5 opacity-40 font-black uppercase text-right">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-10 bg-gradient-to-t from-black via-black/90 to-transparent z-[80]">
        <form onSubmit={handleSend} className="relative flex items-center gap-2">
          <input 
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Сообщение..."
            className="w-full h-12 bg-white/10 border border-white/10 rounded-2xl px-5 pr-14 text-white text-[15px] focus:outline-none focus:border-primary/40 transition-all placeholder:text-white/20"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="absolute right-1.5 w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary/40 active:scale-90 transition-all disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}