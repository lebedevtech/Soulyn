import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, MessageCircle, Bell, User, Plus } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { path: '/', icon: Map, label: 'Карта' },
  { path: '/chats', icon: MessageCircle, label: 'Чаты' },
  { path: '/create', icon: Plus, isPrimary: true },
  { path: '/notifications', icon: Bell, label: 'Увед.' },
  { path: '/profile', icon: User, label: 'Профиль' },
];

export default function BottomNav({ onCreateClick }) {
  const location = useLocation();

  return (
    <div className="absolute bottom-8 left-4 right-4 h-20 bg-[#121212]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] flex items-center justify-between px-2 shadow-2xl z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        if (item.isPrimary) {
          return (
            <div key="create" className="relative -top-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }} // Сильное сжатие (Tactile feel)
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={onCreateClick}
                className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)] border-4 border-black"
              >
                <Plus size={32} className="text-white" />
              </motion.button>
            </div>
          );
        }

        return (
          <Link to={item.path} key={item.path} className="flex-1 flex flex-col items-center gap-1 py-2 relative">
             <motion.div
               whileTap={{ scale: 0.8 }} // Отклик на нажатие
               className={clsx(
                 "p-2 rounded-2xl transition-all duration-300",
                 isActive ? "bg-white/10 text-white" : "text-white/40"
               )}
             >
               <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
             </motion.div>
             
             {/* Точка-индикатор (Animation layoutId для плавного перемещения) */}
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