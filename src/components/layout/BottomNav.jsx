import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, MessageCircle, Bell, User, Plus } from 'lucide-react';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useTelegram } from '../../context/TelegramContext'; // Опционально, для вибрации

const navItems = [
  { path: '/', icon: Map, label: 'Карта' },
  { path: '/chats', icon: MessageCircle, label: 'Чаты' },
  { path: '/create', icon: Plus, isPrimary: true }, // Используем /create как маркер для действия
  { path: '/notifications', icon: Bell, label: 'Увед.' },
  { path: '/profile', icon: User, label: 'Профиль' },
];

export default function BottomNav({ onCreateClick }) { // Проп теперь называется onCreateClick, как в старой версии
  const location = useLocation();
  const { user } = useAuth();
  const { haptic } = useTelegram();
  const [unreadTotal, setUnreadTotal] = useState(0);

  // Логика счетчика (не влияет на дизайн)
  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
        .neq('sender_id', user.id);
      setUnreadTotal(count || 0);
    };
    fetchUnread();
    
    const channel = supabase.channel('badges').on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchUnread).subscribe();
    return () => supabase.removeChannel(channel);
  }, [user]);

  return (
    <div className="absolute bottom-8 left-4 right-4 h-20 bg-[#121212]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] flex items-center justify-between px-2 shadow-2xl z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        if (item.isPrimary) {
          return (
            <div key="create" className="relative -top-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }} 
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={() => {
                   haptic?.impact && haptic.impact('medium');
                   onCreateClick(); // Вызываем проп
                }}
                className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)] border-4 border-black"
              >
                <Plus size={32} className="text-white" />
              </motion.button>
            </div>
          );
        }

        return (
          <Link 
            to={item.path} 
            key={item.path} 
            className="flex-1 flex flex-col items-center gap-1 py-2 relative"
            onClick={() => {
               if (!isActive && haptic?.selection) haptic.selection();
            }}
          >
             <motion.div
               whileTap={{ scale: 0.8 }}
               className={clsx(
                 "p-2 rounded-2xl transition-all duration-300 relative", // relative для бейджа
                 isActive ? "bg-white/10 text-white" : "text-white/40"
               )}
             >
               <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
               
               {/* BADGE: Аккуратно внедрен внутрь иконки */}
               {item.path === '/chats' && unreadTotal > 0 && (
                 <motion.div 
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-red-500 rounded-full flex items-center justify-center border-2 border-[#121212]"
                 >
                   <span className="text-[9px] font-bold text-white leading-none">
                     {unreadTotal > 99 ? '99+' : unreadTotal}
                   </span>
                 </motion.div>
               )}
             </motion.div>
             
             {isActive && (
               <motion.div 
                 layoutId="navIndicator"
                 className="absolute bottom-2 w-1 h-1 bg-primary rounded-full box-shadow-[0_0_8px_rgba(139,92,246,1)]"
                 transition={{ type: "spring", stiffness: 500, damping: 30 }}
               />
             )}
          </Link>
        );
      })}
    </div>
  );
}