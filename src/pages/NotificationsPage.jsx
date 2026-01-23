import { motion } from 'framer-motion';
import { Bell, Heart, UserPlus, Star } from 'lucide-react';
import clsx from 'clsx';

const NOTIFICATIONS = [
  { id: 1, type: 'match', title: 'Новый мэтч!', text: 'Анна хочет присоединиться к вам', time: '2м', icon: Heart, color: 'bg-pink-500' },
  { id: 2, type: 'invite', title: 'Приглашение', text: 'Вас пригласили в закрытый клуб', time: '1ч', icon: Star, color: 'bg-yellow-500' },
  { id: 3, type: 'follow', title: 'Новый подписчик', text: 'Максим подписался на обновления', time: '3ч', icon: UserPlus, color: 'bg-blue-500' },
];

export default function NotificationsPage() {
  return (
    <div className="relative w-full h-full bg-black">
      {/* HEADER (pt-24) */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-24 px-6 pb-6 bg-gradient-to-b from-black via-black/90 to-transparent">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          Уведомления <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        </h1>
      </div>

      {/* СПИСОК (pt-44) */}
      <div className="w-full h-full overflow-y-auto no-scrollbar pt-44 pb-32 px-4 space-y-3">
        {NOTIFICATIONS.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-[24px] bg-white/5 border border-white/5 flex items-start gap-4"
          >
            <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white shadow-lg", item.color)}>
              <item.icon size={18} fill="currentColor" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-white text-base">{item.title}</h3>
                <span className="text-[10px] text-white/30 font-black uppercase mt-1">{item.time}</span>
              </div>
              <p className="text-white/60 text-sm mt-1 leading-snug">{item.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}