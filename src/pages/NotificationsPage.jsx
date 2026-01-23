import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Heart, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Mock data as in stable
    setNotifications([
      { id: 1, type: 'match', text: 'У вас новый мэтч с Анной!', time: '2м назад', read: false },
      { id: 2, type: 'like', text: 'Ваш импульс понравился 3 людям', time: '15м назад', read: true },
    ]);
  }, []);

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      {/* HEADER: Уровень top-14 для единообразия */}
      <div className="absolute top-14 left-0 right-0 h-[52px] z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md border-b border-white/5">
        <span className="text-[17px] font-bold text-white tracking-tight">Уведомления</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pt-32 pb-32 px-4 relative z-0">
        {notifications.map((notif) => (
          <div key={notif.id} className={clsx("w-full p-4 rounded-[20px] mb-2 flex gap-4 items-center", notif.read ? "bg-white/5" : "bg-white/10")}>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Bell size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-white">{notif.text}</p>
              <p className="text-[10px] text-white/30 uppercase mt-1">{notif.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}