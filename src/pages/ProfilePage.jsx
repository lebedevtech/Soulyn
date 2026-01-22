import React from 'react';
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  CircleHelp, 
  LogOut, 
  ChevronRight, 
  Star,
  Camera
} from 'lucide-react';
import clsx from 'clsx';

const SETTINGS_GROUPS = [
  {
    title: "Аккаунт",
    items: [
      { id: 'profile', label: 'Редактировать профиль', icon: User, color: 'text-blue-400' },
      { id: 'safety', label: 'Безопасность', icon: Shield, color: 'text-green-400' },
      { id: 'premium', label: 'Soulyn Premium', icon: Star, color: 'text-yellow-400', badge: 'PRO' },
    ]
  },
  {
    title: "Уведомления и звук",
    items: [
      { id: 'notifs', label: 'Настройки пушей', icon: Bell, color: 'text-purple-400' },
    ]
  },
  {
    title: "Поддержка",
    items: [
      { id: 'help', label: 'Помощь и FAQ', icon: CircleHelp, color: 'text-white/40' },
      { id: 'logout', label: 'Выйти', icon: LogOut, color: 'text-red-500' },
    ]
  }
];

export default function ProfilePage() {
  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
      
      {/* pt-32 — теперь контент начинается выше */}
      <div className="absolute inset-0 z-10 overflow-y-auto no-scrollbar pt-32 pb-64 px-6">
        
        {/* Блок профиля */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full border-2 border-primary/30 p-1 mb-4 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
              <img 
                src="https://i.pravatar.cc/150?u=9" 
                className="w-full h-full rounded-full object-cover shadow-2xl" 
                alt="Profile" 
              />
            </div>
            <button className="absolute bottom-4 right-0 p-2 bg-primary rounded-full border-4 border-black text-white active:scale-90 transition-transform shadow-lg">
              <Camera size={16} />
            </button>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Андрей Лебедев</h2>
          <p className="text-white/40 text-sm font-medium">@soulyn_dev</p>
        </div>

        {/* Списки настроек */}
        <div className="space-y-9">
          {SETTINGS_GROUPS.map((group, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-4 font-mono">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <button 
                    key={item.id} 
                    className="w-full glass-panel p-4 rounded-[30px] flex items-center gap-4 active:scale-[0.98] transition-all text-left group"
                  >
                    <div className={clsx("p-2.5 rounded-2xl bg-white/5", item.color)}>
                      <item.icon size={20} />
                    </div>
                    <span className="flex-1 font-bold text-white text-[15px] tracking-tight">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-black rounded-lg border border-primary/30">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight size={18} className="text-white/10 group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 pb-10 text-center">
          <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em]">
            Soulyn Build v0.8.2
          </p>
        </div>
      </div>

      {/* Барьеры затухания */}
      <div className="absolute top-0 left-0 right-0 h-32 z-20 pointer-events-none bg-gradient-to-b from-black via-black/80 to-transparent backdrop-blur-md" />
      <div className="absolute bottom-0 left-0 right-0 h-60 z-20 pointer-events-none bg-gradient-to-t from-black via-black/95 to-transparent" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-14 px-6 flex items-center justify-between pointer-events-auto">
        <h1 className="text-3xl font-black text-white tracking-tighter drop-shadow-2xl leading-none">
          Профиль
        </h1>
        <button className="glass-panel p-3 rounded-full text-white/40 active:text-white transition-colors">
          <Settings size={22} />
        </button>
      </div>
    </div>
  );
}