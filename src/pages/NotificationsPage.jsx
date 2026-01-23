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
  
  const notifications = [
    { id: 1, type: 'match', text: 'Новый мэтч с Анной!', time: '2м назад', read: false },
    { id: 2, type: 'impulse', text: 'На ваш импульс откликнулись', time: '15м назад', read: true },
    { id: 3, type: 'like', text: 'Ваш профиль популярен сегодня', time: '1ч назад', read: true },
  ];

  const getIcon = (type) => {
    if (type === 'match') return <Heart size={16} className="text-red-500 fill-red-500" />;
    if (type === 'impulse') return <Zap size={16} className="text-yellow-400 fill-yellow-400" />;
    return <Bell size={16} className="text-white" />;
  };

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      
      {/* FLOATING HEADER ISLAND 
          Corrected: top-14, Smaller padding
      */}
      <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[60]">
        <div className="px-6 py-2 bg-[#1C1C1E]/80 backdrop-blur-md border border-white/10 rounded-full shadow-2xl flex items-center justify-center">
            <span className="text-[13px] font-black text-white tracking-widest uppercase">Уведомления</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />

      {/* CONTENT pt-32 */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-32 pb-32 px-4 relative z-0">
        <motion.div className="space-y-3" variants={listContainerVariants} initial="hidden" animate="visible">
          {notifications.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className={clsx(
                "w-full p-4 rounded-[24px] border flex gap-3 items-center transition-all relative overflow-hidden",
                item.read ? "bg-white/5 border-white/5" : "bg-[#1C1C1E] border-white/10 shadow-lg"
              )}
            >
              <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-white/5", item.read ? "bg-white/5" : "bg-white/10")}>
                {getIcon(item.type)}
              </div>
              <div className="flex-1">
                <p className={clsx("text-[14px] leading-snug", item.read ? "text-white/60" : "text-white font-bold")}>{item.text}</p>
                <p className="text-[10px] text-white/30 font-bold uppercase mt-1 tracking-wide">{item.time}</p>
              </div>
              {!item.read && <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(139,92,246,0.5)] mr-1" />}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}