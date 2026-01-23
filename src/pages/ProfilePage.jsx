import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, User, ChevronRight, Star, Shield, Settings, QrCode, Crown, Sparkles,
  Coffee, Pizza, Film, Zap, Moon, Share2, History, TrendingUp, Palette, Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTelegram } from '../context/TelegramContext';
import clsx from 'clsx';

// Пресеты для живого статуса (Mood Pulse)
const STATUS_PRESETS = [
  { id: 'coffee', label: 'Кофе', icon: Coffee, color: 'text-orange-400', glow: 'bg-orange-500' },
  { id: 'food', label: 'Еда', icon: Pizza, color: 'text-red-400', glow: 'bg-red-500' },
  { id: 'movie', label: 'Кино', icon: Film, color: 'text-purple-400', glow: 'bg-purple-500' },
  { id: 'vibe', label: 'Движ', icon: Zap, color: 'text-yellow-400', glow: 'bg-yellow-500' },
  { id: 'busy', label: 'Занят', icon: Moon, color: 'text-blue-400', glow: 'bg-blue-500' },
];

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { haptic } = useTelegram();
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);

  // Состояние темы карты (база для Design Lab)
  const [cardTheme] = useState({
    bg: 'bg-primary/20',
    border: 'border-white/10',
    glow: 'from-primary/20 via-primary/5 to-transparent'
  });

  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
    : 'Январь 2026';

  const handleStatusSelect = (status) => {
    haptic.impact('light');
    setCurrentStatus(status);
    setShowStatusPicker(false);
  };

  return (
    <div className="relative w-full h-full bg-black flex flex-col overflow-y-auto no-scrollbar">
      
      {/* HEADER: Эталонный стиль (absolute top-14, -translate-y-3) */}
      <div className="absolute top-14 left-0 right-0 h-[52px] z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md border-b border-white/5 text-center">
        <span className="text-[17px] font-bold text-white tracking-tight -translate-y-3">Профиль</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />

      {/* CONTENT: pt-28 для подъема контента */}
      <div className="flex-1 pt-28 pb-32 px-6">
        
        {/* DIGITAL ASSET CARD (Клубная карта) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={clsx(
            "relative w-full aspect-[1.6/1] glass-panel rounded-[32px] p-6 mb-8 mt-2 overflow-hidden border shadow-2xl transition-all duration-700",
            cardTheme.border
          )}
        >
          {/* Фоновое свечение актива */}
          <div className={clsx(
            "absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[60px] animate-pulse transition-colors duration-1000",
            cardTheme.bg
          )} />
          
          <div className="relative h-full flex flex-col justify-between">
            {/* Top: Status & Market Value */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Genesis Series</span>
                  {currentStatus && <div className={clsx("w-1.5 h-1.5 rounded-full animate-ping", currentStatus.glow)} />}
                </div>
                <h2 className="text-xl font-black text-white tracking-tighter">Soulyn Passport</h2>
              </div>
              <div className="flex flex-col items-end">
                <button 
                  onClick={() => { haptic.selection(); /* Hook for Design Lab */ }}
                  className="p-2 bg-white/5 rounded-full border border-white/10 text-white/40 active:scale-90 transition-all"
                >
                  <Palette size={18} />
                </button>
              </div>
            </div>

            {/* Middle: User & Mood Pulse */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                {/* Кольцо Live Pulse вокруг аватара */}
                <div className={clsx(
                  "absolute inset-0 rounded-full blur-[4px] transition-all duration-500",
                  currentStatus ? currentStatus.glow : 'bg-transparent'
                )} />
                <div className="relative w-16 h-16 rounded-full border-2 border-white/10 p-1 bg-black">
                  <img src={user?.avatar_url || 'https://i.pravatar.cc/150'} className="w-full h-full rounded-full object-cover" alt="Avatar" />
                </div>
              </div>
              
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-tight truncate">
                    {user?.first_name || 'Holder'}
                  </h3>
                  <Edit3 size={12} className="text-white/20" />
                </div>
                
                {/* MOOD PULSE SELECTOR */}
                <div className="relative mt-1">
                  <button 
                    onClick={() => { haptic.impact('light'); setShowStatusPicker(!showStatusPicker); }}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5 active:bg-white/10 transition-colors"
                  >
                    {currentStatus ? (
                      <>
                        <currentStatus.icon size={10} className={currentStatus.color} />
                        <span className="text-[10px] font-bold text-white/80">{currentStatus.label}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={10} className="text-primary" />
                        <span className="text-[10px] font-bold text-white/40">Mood Pulse</span>
                      </>
                    )}
                  </button>

                  <AnimatePresence>
                    {showStatusPicker && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute top-full left-0 mt-2 p-2 bg-[#1C1C1E] border border-white/10 rounded-2xl shadow-2xl z-50 flex gap-2"
                      >
                        {STATUS_PRESETS.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => handleStatusSelect(s)}
                            className="p-2 rounded-xl bg-white/5 active:bg-white/10 transition-colors"
                          >
                            <s.icon size={16} className={s.color} />
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Bottom Row: Rank & Value */}
            <div className="flex justify-between items-end border-t border-white/5 pt-4">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-0.5">Member Since</span>
                <span className="text-[10px] font-bold text-white/60 uppercase">{memberSince}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-primary uppercase tracking-widest mb-0.5">Global Rank</span>
                <span className="text-sm font-black text-white uppercase tracking-tighter">#000042</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Импульсы', value: '12' },
            { label: 'Мэтчи', value: '48' },
            { label: 'Рейтинг', value: '4.9' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-[24px] p-4 text-center active:bg-white/[0.07] transition-colors">
              <p className="text-xl font-black text-white">{stat.value}</p>
              <p className="text-[9px] text-white/30 font-black uppercase mt-1 tracking-tighter">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ASSET MANAGEMENT */}
        <div className="space-y-6">
          <section>
            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4 ml-1 text-left">Управление активом</h3>
            <div className="bg-white/5 border border-white/5 rounded-[24px] overflow-hidden">
              {[
                { icon: Share2, label: 'Передать карту', color: 'text-primary' },
                { icon: History, label: 'История владельцев', color: 'text-blue-400' },
                { icon: TrendingUp, label: 'Рыночная ценность', color: 'text-green-400' },
              ].map((item, i, arr) => (
                <button 
                  key={i} 
                  onClick={() => haptic.selection()}
                  className={clsx(
                    "w-full px-5 py-4 flex items-center justify-between active:bg-white/5 transition-colors text-left",
                    i !== arr.length - 1 && "border-b border-white/5"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={clsx("p-2 rounded-xl bg-white/5", item.color)}><item.icon size={18} /></div>
                    <span className="font-bold text-[15px] text-white/80">{item.label}</span>
                  </div>
                  <ChevronRight size={18} className="text-white/10" />
                </button>
              ))}
            </div>
          </section>

          {/* Стандартные настройки */}
          <section>
            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4 ml-1 text-left">Настройки</h3>
            <div className="bg-white/5 border border-white/5 rounded-[24px] overflow-hidden">
              {[
                { icon: User, label: 'Личные данные', color: 'text-white/40' },
                { icon: Shield, label: 'Безопасность', color: 'text-white/40' },
                { icon: LogOut, label: 'Выйти из аккаунта', color: 'text-red-500', action: signOut },
              ].map((item, i, arr) => (
                <button 
                  key={i} 
                  onClick={() => { haptic.selection(); item.action && item.action(); }}
                  className={clsx(
                    "w-full px-5 py-4 flex items-center justify-between active:bg-white/5 transition-colors text-left",
                    i !== arr.length - 1 && "border-b border-white/5"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={clsx("p-2 rounded-xl bg-white/5", item.color)}><item.icon size={18} /></div>
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