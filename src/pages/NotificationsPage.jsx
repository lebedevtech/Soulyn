import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Heart, Star } from 'lucide-react'; // Используем мок-иконки
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
    { id: 2, type: 'like', text: 'Ваш импульс понравился 5 людям', time: '1ч назад', read: true },
  ];

  const getIcon = (type) => {
    if (type === 'match') return <Heart size={18} className="text-red-500 fill-red-500" />;
    return <Star size={18} className="text-yellow-500 fill-yellow-500" />;
  };

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      {/* HEADER FIX: pt-16 */}
      <div className="absolute top-0 left-0 right-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md border-b border-white/5 pt-16 pb-4">
        <span className="text-[17px] font-bold text-white tracking-tight">Уведомления</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />

      {/* CONTENT FIX: pt-36 */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-36 pb-32 px-4 relative z-0">
        <motion.div className="space-y-3" variants={listContainerVariants} initial="hidden" animate="visible">
          {notifications.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className={clsx(
                "w-full p-4 rounded-[24px] border flex gap-4 items-center transition-colors",
                item.read ? "bg-white/5 border-white/5" : "bg-white/10 border-white/10"
              )}
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                {getIcon(item.type)}
              </div>
              <div className="flex-1">
                <p className={clsx("text-sm leading-tight", item.read ? "text-white/60" : "text-white font-bold")}>{item.text}</p>
                <p className="text-[10px] text-white/30 font-bold uppercase mt-1.5">{item.time}</p>
              </div>
              {!item.read && <div className="w-2 h-2 rounded-full bg-primary" />}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}