import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Send, Plus, MoreHorizontal, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const MOCK_MESSAGES = [
  { id: 1, text: 'Привет! Видел твой импульс в Surf Coffee ☕️', sender: 'them', time: '12:40' },
  { id: 2, text: 'Привет! Да, планирую быть там через полчаса. Присоединишься?', sender: 'me', time: '12:42' },
  { id: 3, text: 'С радостью! Возьму с собой ноут, поворкаем немного?', sender: 'them', time: '12:43' },
  { id: 4, text: 'Отличная идея. Я как раз хотел обсудить тот проект.', sender: 'me', time: '12:45' },
  { id: 5, text: 'Супер, тогда до встречи! Буду в черном худи.', sender: 'them', time: '12:46' },
];

export default function ChatDetailPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef(null);

  // Автоскролл вниз при новых сообщениях
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden flex flex-col">
      
      {/* 1. HEADER (Фиксированный) */}
      <div className="absolute top-0 left-0 right-0 z-50 pt-14 px-6 pb-6 bg-black/20 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-white/40 active:text-white transition-colors"
          >
            <ChevronLeft size={28} />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src="https://i.pravatar.cc/150?u=5" 
                className="w-10 h-10 rounded-full object-cover border border-white/10" 
                alt="Maria"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
            </div>
            <div>
              <h4 className="font-bold text-white text-[15px] leading-none">Мария</h4>
              <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">В сети</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-3 text-white/40 active:text-white transition-colors">
            <Phone size={20} />
          </button>
          <button className="p-3 text-white/40 active:text-white transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* 2. AREA СООБЩЕНИЙ
          pt-32 и pb-32 — для отступов от шапки и инпута
      */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar pt-32 pb-32 px-6 space-y-4"
      >
        <div className="flex justify-center my-8">
          <span className="px-4 py-1.5 rounded-full bg-white/5 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] border border-white/5">
            Сегодня, 22 января
          </span>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={clsx(
                "flex w-full",
                msg.sender === 'me' ? "justify-end" : "justify-start"
              )}
            >
              <div className={clsx(
                "max-w-[80%] p-4 rounded-[24px] relative group",
                msg.sender === 'me' 
                  ? "bg-primary/20 border border-primary/30 rounded-tr-none text-white shadow-[0_10px_20px_rgba(139,92,246,0.1)]" 
                  : "glass-panel rounded-tl-none text-white/90"
              )}>
                <p className="text-[15px] leading-relaxed font-medium">
                  {msg.text}
                </p>
                <span className={clsx(
                  "text-[9px] font-black uppercase tracking-tighter mt-2 block opacity-30",
                  msg.sender === 'me' ? "text-right" : "text-left"
                )}>
                  {msg.time}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 3. INPUT (Фиксированный снизу) */}
      <div className="absolute bottom-0 left-0 right-0 z-50 px-6 pb-10 pt-4 bg-gradient-to-t from-black via-black to-transparent">
        <div className="glass-panel p-2 rounded-[32px] flex items-center gap-2">
          <button className="p-3 text-white/20 hover:text-primary transition-colors active:scale-90">
            <Plus size={24} />
          </button>
          
          <input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            type="text" 
            placeholder="Сообщение..." 
            className="flex-1 bg-transparent border-none outline-none text-white text-[15px] font-medium px-2 py-3"
          />

          <button 
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={clsx(
              "p-3 rounded-full transition-all duration-300 active:scale-90",
              inputValue.trim() 
                ? "bg-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]" 
                : "bg-white/5 text-white/10"
            )}
          >
            <Send size={20} fill={inputValue.trim() ? "white" : "none"} />
          </button>
        </div>
      </div>

      {/* Навигация (Градиентные барьеры для скролла сообщений) */}
      <div className="absolute top-28 left-0 right-0 h-16 z-40 pointer-events-none bg-gradient-to-b from-black to-transparent" />
    </div>
  );
}