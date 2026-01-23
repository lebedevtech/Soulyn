import { motion } from 'framer-motion';
import { 
  Settings, LogOut, User, ChevronRight, Star, Shield, Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

export default function ProfilePage() {
  const { user, signOut } = useAuth();

  return (
    <div className="relative w-full h-full bg-black flex flex-col overflow-y-auto no-scrollbar">
      
      {/* HEADER: Уровень top-14 (56px) как на карте. Текст слегка приподнят. */}
      <div className="absolute top-14 left-0 right-0 h-[52px] z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md border-b border-white/5 text-center">
        <span className="text-[17px] font-bold text-white tracking-tight -translate-y-1">Профиль</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />

      {/* CONTENT: pt-32 для выравнивания под хедером */}
      <div className="flex-1 pt-32 pb-32">
        
        {/* User Card */}
        <div className="px-6 mb-8 mt-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-primary/30 p-1">
                <img 
                  src={user?.avatar_url || 'https://i.pravatar.cc/150'} 
                  className="w-full h-full rounded-full object-cover" 
                  alt="Avatar" 
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full border-4 border-black">
                <Star size={12} fill="currentColor" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {user?.first_name || 'Пользователь'}
              </h2>
              <p className="text-white/40 text-sm font-medium mt-1">@soulyn_user</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[10px] font-black text-primary uppercase tracking-wider">
                  Premium
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 px-6 mb-10">
          {[
            { label: 'Импульсы', value: '12' },
            { label: 'Мэтчи', value: '48' },
            { label: 'Рейтинг', value: '4.9' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
              <p className="text-xl font-black text-white">{stat.value}</p>
              <p className="text-[10px] text-white/30 font-bold uppercase mt-1 tracking-tighter">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Settings Groups */}
        <div className="px-6 space-y-6">
          <section>
            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4 ml-1">Аккаунт</h3>
            <div className="bg-white/5 border border-white/5 rounded-[24px] overflow-hidden">
              {[
                { icon: User, label: 'Личные данные', color: 'text-blue-400' },
                { icon: Shield, label: 'Приватность', color: 'text-green-400' },
                { icon: Settings, label: 'Настройки приложения', color: 'text-purple-400' },
                { icon: LogOut, label: 'Выйти из аккаунта', color: 'text-red-500', action: signOut },
              ].map((item, i, arr) => (
                <button 
                  key={i} 
                  onClick={item.action}
                  className={clsx(
                    "w-full px-5 py-4 flex items-center justify-between active:bg-white/5 transition-colors text-left",
                    i !== arr.length - 1 && "border-b border-white/5"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={clsx("p-2 rounded-xl bg-white/5", item.color)}>
                      <item.icon size={18} />
                    </div>
                    <span className={clsx("font-bold", item.color === 'text-red-500' ? "text-red-500" : "text-white/80")}>
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-white/10" />
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}