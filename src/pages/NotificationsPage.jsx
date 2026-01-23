import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Heart, Star, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0, scale: 1 },
  visible: { y: 0, opacity: 1, scale: 1 }
};

export default function NotificationsPage() {
  const { user } = useAuth();
  
  // MOCK DATA
  const notifications = [
    { id: 1, type: 'match', text: 'Новый мэтч с Анной!', time: '2м назад', read: false },
    { id: 2, type: 'impulse', text: 'На ваш импульс откликнулись', time: '15м назад', read: true },
    { id: 3, type: 'like', text: 'Ваш профиль популярен сегодня', time: '1ч назад', read: true },
  ];

  const getIcon = (type) => {
    if (type === 'match') return <Heart size={18} className="text-red-500 fill-red-500" />;
    if (type === 'impulse') return <Zap size={18} className="text-yellow-400 fill-yellow-400" />;
    return <Bell size={18} className="text-white" />;
  };

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      
      {/* FLOATING HEADER ISLAND */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60]">
        <div className="px-8 py-3 bg-[#1C1C1E]/80 backdrop-blur-md border border-white/10 rounded-full shadow-2xl flex items-center justify-center">
            <span className="text-[15px] font-black text-white tracking-widest uppercase">Уведомления</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />

      {/* CONTENT pt-28 */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-28 pb-32 px-4 relative z-0">
        <motion.div className="space-y-3" variants={listContainerVariants} initial="hidden" animate="visible">
          {notifications.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className={clsx(
                "w-full p-4 rounded-[28px] border flex gap-4 items-center transition-all relative overflow-hidden",
                item.read ? "bg-white/5 border-white/5" : "bg-[#1C1C1E] border-white/10 shadow-lg"
              )}
            >
              <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-white/5", item.read ? "bg-white/5" : "bg-white/10")}>
                {getIcon(item.type)}
              </div>
              <div className="flex-1">
                <p className={clsx("text-[15px] leading-snug", item.read ? "text-white/60" : "text-white font-bold")}>{item.text}</p>
                <p className="text-[11px] text-white/30 font-bold uppercase mt-1.5 tracking-wide">{item.time}</p>
              </div>
              {!item.read && <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(139,92,246,0.5)] mr-2" />}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}