import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, MessageCircle, Heart, User, Plus } from 'lucide-react';
import clsx from 'clsx';
import { useTelegram } from '../../context/TelegramContext'; // Импорт

const NAV_ITEMS = [
  { id: 'map', path: '/', icon: Map, label: 'Карта' },
  { id: 'chats', path: '/chats', icon: MessageCircle, label: 'Чаты' },
  { id: 'create', path: null, icon: Plus, label: '', isAction: true },
  { id: 'likes', path: '/notifications', icon: Heart, label: 'Лайки' },
  { id: 'profile', path: '/profile', icon: User, label: 'Профиль' },
];

export default function BottomNav({ onOpenCreate }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { haptic } = useTelegram();

  return (
    <div className="absolute bottom-8 left-4 right-4 h-20 bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/10 rounded-[32px] flex items-center justify-between px-2 shadow-2xl z-50">
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path;
        
        if (item.isAction) {
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                haptic.impact('medium'); // Вибрация посильнее на Плюс
                onOpenCreate();
              }}
              className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)] relative -top-6 border-4 border-black active:scale-95 transition-transform"
            >
              <Plus size={28} color="white" strokeWidth={3} />
            </motion.button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => {
              if (!isActive) {
                haptic.selection(); // Легкий щелчок при смене таба
                navigate(item.path);
              }
            }}
            className="flex-1 h-full flex flex-col items-center justify-center gap-1 relative"
          >
            <div className={clsx("transition-colors duration-300", isActive ? "text-white" : "text-white/30")}>
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            {isActive && (
              <motion.div 
                layoutId="nav-indicator"
                className="absolute bottom-2 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white]"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}