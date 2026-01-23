import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Heart, UserPlus, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const TRANSITION_EASE = [0.25, 0.1, 0.25, 1];

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0, filter: 'blur(8px)', scale: 0.96 },
  visible: { 
    y: 0, 
    opacity: 1, 
    filter: 'blur(0px)',
    scale: 1,
    transition: { duration: 0.4, ease: TRANSITION_EASE } 
  }
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications([
      { id: 1, type: 'match', text: 'У вас новый мэтч с Анной!', time: '2м назад', read: false },
      { id: 2, type: 'like', text: 'Ваш импульс понравился 3 людям', time: '15м назад', read: true },
      { id: 3, type: 'system', text: 'Добро пожаловать в Soulyn Premium', time: '1ч назад', read: true },
    ]);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'match': return <Heart size={18} className="text-red-500 fill-red-500" />;
      case 'like': return <Star size={18} className="text-yellow-500 fill-yellow-500" />;
      default: return <Bell size={18} className="text-white" />;
    }
  };

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      {/* HEADER */}
      <div className="absolute top-12 left-0 right-0 h-[52px] z-20 flex items-center justify-center bg-black/80 backdrop-blur-md border-b border-white/5">
        <span className="text-[17px] font-bold text-white tracking-tight">Уведомления</span>
      </div>

      {/* ГРАДИЕНТЫ ДЛЯ СПИСКА (Исправлено: уход в затемнение) */}
      <div className="absolute top-[100px] left-0 right-0 h-12 z-10 bg-gradient-to-b from-black to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />

      <div className="flex-1 overflow-y-auto no-scrollbar pt-28 pb-32 px-4 relative z-0">
        <motion.div 
          className="space-y-2 will-change-transform"
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              variants={itemVariants}
              className={clsx(
                "w-full p-4 rounded-[20px] border flex gap-4 items-center transition-colors",
                notif.read ? "bg-white/5 border-white/5" : "bg-white/10 border-white/10"
              )}
            >
              <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center shrink-0", notif.read ? "bg-white/5" : "bg-primary/20")}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <p className={clsx("text-sm leading-tight", notif.read ? "text-white/60" : "text-white font-bold")}>{notif.text}</p>
                <p className="text-[10px] text-white/30 font-bold uppercase mt-1.5">{notif.time}</p>
              </div>
              {!notif.read && <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]" />}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}