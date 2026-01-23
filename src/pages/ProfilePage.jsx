import { motion } from 'framer-motion';
import { 
  LogOut, User, ChevronRight, Star, Shield, Bell, Settings, QrCode, Crown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

export default function ProfilePage() {
  const { user, signOut } = useAuth();

  // Форматирование даты (Member Since)
  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
    : 'Январь 2026';

  return (
    <div className="relative w-full h-full bg-black flex flex-col overflow-y-auto no-scrollbar">
      
      {/* HEADER: Эталонный стиль (top-14, -translate-y-3) */}
      <div className="absolute top-14 left-0 right-0 h-[52px] z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md border-b border-white/5 text-center">
        <span className="text-[17px] font-bold text-white tracking-tight -translate-y-3">Профиль</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />

      {/* CONTENT: pt-28 для подъема контента */}
      <div className="flex-1 pt-28 pb-32 px-6">
        
        {/* CLUB MEMBER CARD: Новый премиальный блок */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full aspect-[1.6/1] glass-panel rounded-[32px] p-6 mb-10 mt-2 overflow-hidden border border-white/10"
        >
          {/* Декоративный градиент на фоне карты */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[60px]" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px]" />

          <div className="relative h-full flex flex-col justify-between">
            {/* Top Row: Brand & Status */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Club Member</span>
                <h2 className="text-xl font-black text-white tracking-tighter">Soulyn</h2>
              </div>
              <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                <QrCode size={20} className="text-white/40" />
              </div>
            </div>

            {/* Middle Row: User Info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-primary/30 p-1">
                  <img 
                    src={user?.avatar_url || 'https://i.pravatar.cc/150'} 
                    className="w-full h-full rounded-full object-cover" 
                    alt="Avatar" 
                  />
                </div>
                {user?.is_premium && (
                  <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-1.5 border border-yellow-500 shadow-lg">
                    <Star size={10} className="text-yellow-500 fill-yellow-500" />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-white tracking-tight leading-none mb-1">
                  {user?.first_name || 'Пользователь'}
                </h3>
                <span className="text-[11px] text-white/40 font-medium tracking-wide">
                  ID: #000{user?.id?.toString().slice(-3) || '482'}
                </span>
              </div>
            </div>

            {/* Bottom Row: Details */}
            <div className="flex justify-between items-end border-t border-white/5 pt-4">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-0.5">Member Since</span>
                <span className="text-[10px] font-bold text-white/60 uppercase">{memberSince}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <Crown size={10} className="text-primary fill-primary" />
                <span className="text-[9px] font-black text-white uppercase tracking-wider">Premium</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid: Стабильная структура с улучшенными иконками */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { label: 'Импульсы', value: '12', color: 'text-primary' },
            { label: 'Мэтчи', value: '48', color: 'text-blue-400' },
            { label: 'Рейтинг', value: '4.9', color: 'text-yellow-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-[24px] p-4 text-center">
              <p className={clsx("text-xl font-black mb-0.5", stat.color)}>{stat.value}</p>
              <p className="text-[9px] text-white/20 font-black uppercase tracking-tighter">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Settings Groups: Эталонный список настроек */}
        <div className="space-y-6">
          <section>
            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4 ml-1 text-left">Аккаунт</h3>
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
                    <span className={clsx("font-bold text-[15px]", item.color === 'text-red-500' ? "text-red-500" : "text-white/80")}>
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