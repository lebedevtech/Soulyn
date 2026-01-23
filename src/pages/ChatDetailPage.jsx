import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, MoreVertical, Phone, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
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

  // Mark as Read
  const markAsRead = async () => {
    if (!user || !id) return;
    await supabase.from('messages')
      .update({ is_read: true })
      .eq('match_id', id)
      .neq('sender_id', user.id)
      .eq('is_read', false);
  };

  useEffect(() => {
    if (!user || !id) return;

    const fetchChatData = async () => {
      const { data: match } = await supabase
        .from('matches')
        .select(`initiator:initiator_id(id, first_name, avatar_url), requester:requester_id(id, first_name, avatar_url)`)
        .eq('id', id)
        .single();

      if (match) {
        const partnerData = match.initiator.id === user.id ? match.requester : match.initiator;
        setPartner(partnerData);
      }

      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', id)
        .order('created_at', { ascending: true });

      if (msgs) {
        setMessages(msgs);
        markAsRead();
      }
    };

    fetchChatData();

    const channel = supabase.channel(`chat:${id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${id}` }, (payload) => {
        setMessages((prev) => {
           if (prev.some(m => m.id === payload.new.id)) return prev;
           return [...prev, payload.new];
        });
        if (payload.new.sender_id !== user.id) markAsRead();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [id, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const content = newMessage.trim();
    setNewMessage(''); 

    const tempId = Date.now(); 
    const optimisticMsg = {
      id: tempId, match_id: id, sender_id: user.id, content: content, created_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, optimisticMsg]);

    const { data, error } = await supabase.from('messages').insert([{
      match_id: id, sender_id: user.id, content: content 
    }]).select().single();

    if (error) {
        console.error('Error:', error);
        setMessages(prev => prev.filter(m => m.id !== tempId));
        setNewMessage(content); 
    } else if (data) {
        setMessages(prev => prev.map(m => m.id === tempId ? data : m));
    }
  };

  const handleDeleteChat = async () => {
    if (!window.confirm('Удалить чат?')) return;
    await supabase.from('messages').delete().eq('match_id', id);
    await supabase.from('matches').delete().eq('id', id);
    navigate('/chats');
  };

  return (
    // NEW ARCHITECTURE: Flex Column
    <div className="w-full h-full bg-black flex flex-col overflow-hidden">
      
      {/* 1. STATUS BAR SPACER (Hardcoded Safety) */}
      <div className="w-full h-6 shrink-0 bg-black" />

      {/* 2. HEADER (Static Block, not fixed) */}
      <div className="w-full h-14 shrink-0 flex items-center relative bg-black border-b border-white/5 px-4 z-30">
        
        {/* Left */}
        <button onClick={() => navigate(-1)} className="absolute left-2 p-2 text-white active:opacity-50 z-20">
          <ArrowLeft size={24} />
        </button>

        {/* Center Title (Absolute to ensure perfect centering) */}
        <div className="w-full flex flex-col items-center justify-center pointer-events-none">
          <span className="font-bold text-white text-[17px] leading-tight">{partner?.first_name || '...'}</span>
          <span className="text-[10px] text-green-500 font-bold tracking-wide">ONLINE</span>
        </div>

        {/* Right Actions (Padding right to avoid TG menu) */}
        <div className="absolute right-4 flex gap-1 z-20 pr-8"> 
           <button className="p-2 text-white/40 hover:text-white"><Phone size={20} /></button>
           <button onClick={() => setShowMenu(!showMenu)} className="p-2 text-white/40 hover:text-white"><MoreVertical size={20} /></button>
        </div>
      </div>

      {/* Dropdown Menu (Fixed above content) */}
      <AnimatePresence>
        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute top-24 right-12 z-50 bg-[#1C1C1E] border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[160px]"
            >
              <button onClick={handleDeleteChat} className="w-full p-4 flex items-center gap-3 text-red-500 hover:bg-white/5 text-sm font-bold">
                <Trash2 size={18} /> Удалить чат
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. CONTENT (Flex-1 takes remaining space) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
        {messages.length === 0 && partner && <p className="text-center text-white/30 text-sm mt-10">Начните общение...</p>}
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
                {msg.content || msg.text} 
                <span className={clsx("text-[10px] absolute bottom-1 right-3 opacity-50")}>
                  {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* 4. FOOTER (Static Block, not fixed) */}
      <div className="shrink-0 bg-black border-t border-white/10 p-4 pb-8 z-30">
        <div className="flex gap-2 items-center bg-[#1C1C1E] rounded-full p-2 pl-4">
          <input 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
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