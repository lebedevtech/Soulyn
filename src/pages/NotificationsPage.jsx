import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MessageSquare, 
  UserPlus, 
  Zap, 
  ChevronRight,
  Settings2
} from 'lucide-react';
import clsx from 'clsx';

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'impulse',
    user: 'Алексей',
    avatar: 'https://i.pravatar.cc/150?u=1',
    text: 'откликнулся на твой импульс «Кофе»',
    time: '5 мин назад',
    isNew: true,
    icon: Zap,
    iconColor: 'text-yellow-400'
  },
  {
    id: 2,
    type: 'like',
    user: 'Мария',
    avatar: 'https://i.pravatar.cc/150?u=5',
    text: 'оценила твой новый импульс «Кино»',
    time: '12 мин назад',
    isNew: true,
    icon: Heart,
    iconColor: 'text-red-400'
  },
  {
    id: 3,
    type: 'follow',
    user: 'Иван',
    avatar: 'https://i.pravatar.cc/150?u=8',
    text: 'теперь подписан на твои обновления',
    time: '1 час назад',
    isNew: false,
    icon: UserPlus,
    iconColor: 'text-blue-400'
  },
  {
    id: 4,
    type: 'comment',
    user: 'Дарья',
    avatar: 'https://i.pravatar.cc/150?u=9',
    text: 'оставила комментарий под импульсом',
    time: '3 часа назад',
    isNew: false,
    icon: MessageSquare,
    iconColor: 'text-purple-400'
  },
  {
    id: 5,
    type: 'impulse',
    user: 'Система',
    avatar: 'https://i.pravatar.cc/150?u=30',
    text: 'Рядом с тобой появился импульс «Теннис»',
    time: 'Вчера',
    isNew: false,
    icon: Zap,
    iconColor: 'text-primary'
  }
];

export default function NotificationsPage() {
  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
      
      {/* 1. ОБЛАСТЬ СКРОЛЛА
          pt-32 — контент поднят выше, согласно твоим пожеланиям
          pb-64 — зона для нижнего градиента
      */}
      <div className="absolute inset-0 z-10 overflow-y-auto no-scrollbar pt-32 pb-64 px-6">
        
        {/* Заголовки разделов */}
        <div className="space-y-10">
          
          {/* СЕГОДНЯ */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-4 font-mono">
              Сегодня
            </h3>
            <div className="space-y-2">
              {NOTIFICATIONS.filter(n => n.isNew).map((notif, index) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full glass-panel p-4 rounded-[32px] flex items-center gap-4 relative overflow-hidden group border-l-2 border-l-primary/50"
                >
                  <div className="relative shrink-0">
                    <img src={notif.avatar} className="w-12 h-12 rounded-full object-cover shadow-lg" alt={notif.user} />
                    <div className={clsx("absolute -bottom-1 -right-1 p-1 bg-black rounded-full border border-white/10", notif.iconColor)}>
                      <notif.icon size={10} strokeWidth={3} />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm leading-snug">
                      <span className="font-black">{notif.user}</span> {notif.text}
                    </p>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-tighter mt-1 block">
                      {notif.time}
                    </span>
                  </div>
                  <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(139,92,246,1)]" />
                </motion.div>
              ))}
            </div>
          </section>

          {/* РАНЕЕ */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-4 font-mono">
              Ранее
            </h3>
            <div className="space-y-2">
              {NOTIFICATIONS.filter(n => !n.isNew).map((notif, index) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full glass-panel p-4 rounded-[32px] flex items-center gap-4 relative overflow-hidden group opacity-60"
                >
                  <div className="relative shrink-0 grayscale-[0.5]">
                    <img src={notif.avatar} className="w-12 h-12 rounded-full object-cover" alt={notif.user} />
                    <div className="absolute -bottom-1 -right-1 p-1 bg-black rounded-full border border-white/10 text-white/20">
                      <notif.icon size={10} strokeWidth={3} />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-white/70 text-sm leading-snug">
                      <span className="font-bold text-white/90">{notif.user}</span> {notif.text}
                    </p>
                    <span className="text-[10px] font-medium text-white/10 uppercase tracking-tighter mt-1 block">
                      {notif.time}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-white/5" />
                </motion.div>
              ))}
            </div>
          </section>

        </div>

        <div className="mt-16 text-center opacity-5">
          <p className="text-[9px] font-black uppercase tracking-[0.6em]">Архив очищен</p>
        </div>
      </div>

      {/* 2. ГРАДИЕНТНЫЕ БАРЬЕРЫ (Идентичные Обзору) */}
      <div className="absolute top-0 left-0 right-0 h-32 z-20 pointer-events-none bg-gradient-to-b from-black via-black/80 to-transparent backdrop-blur-md" />
      <div className="absolute bottom-0 left-0 right-0 h-60 z-20 pointer-events-none bg-gradient-to-t from-black via-black/95 to-transparent" />

      {/* 3. ШАПКА */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-14 px-6 flex items-center justify-between pointer-events-auto">
        <h1 className="text-3xl font-black text-white tracking-tighter drop-shadow-2xl leading-none">
          События
        </h1>
        <button className="glass-panel p-3 rounded-full text-white/40 active:text-white transition-all active:scale-90">
          <Settings2 size={20} />
        </button>
      </div>

    </div>
  );
}