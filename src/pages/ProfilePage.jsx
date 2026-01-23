import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, User, ChevronRight, Star, Shield, Settings, Crown, Sparkles,
  Coffee, Pizza, Film, Zap, Moon, Share2, History, TrendingUp, Palette, Hexagon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTelegram } from '../context/TelegramContext';
import clsx from 'clsx';
import DesignLabSheet from '../features/profile/DesignLabSheet';

const STATUS_PRESETS = [
  { id: 'coffee', label: 'Кофе', icon: Coffee, color: 'text-orange-400', glow: 'bg-orange-500' },
  { id: 'food', label: 'Еда', icon: Pizza, color: 'text-red-400', glow: 'bg-red-500' },
  { id: 'movie', label: 'Кино', icon: Film, color: 'text-purple-400', glow: 'bg-purple-500' },
  { id: 'vibe', label: 'Движ', icon: Zap, color: 'text-yellow-400', glow: 'bg-yellow-500' },
];

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { haptic } = useTelegram();
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [isDesignLabOpen, setIsDesignLabOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);

  // Глобальные настройки дизайна актива (будут в БД)
  const [design, setDesign] = useState({
    coreType: 'pulsar',
    coreColor: 'from-primary to-blue-600',
    auraIntensity: 'opacity-40',
    frameStyle: 'border-white/10'
  });

  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
    : 'Январь 2026';

  return (
    <div className="relative w-full h-full bg-black flex flex-col overflow-y-auto no-scrollbar">
      
      {/* HEADER: Эталон (top-14, -translate-y-3) */}
      <div className="absolute top-14 left-0 right-0 h-[52px] z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md border-b border-white/5 text-center">
        <span className="text-[17px] font-bold text-white tracking-tight -translate-y-3">Профиль</span>
      </div>

      {/* CONTENT: pt-28 для подъема */}
      <div className="flex-1 pt-28 pb-32 px-6">
        
        {/* GENERATIVE ASSET CARD (Крупнее, без аватара) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={clsx(
            "relative w-full aspect-[1.4/1] glass-panel rounded-[40px] p-8 mb-10 mt-2 overflow-hidden border shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all duration-700",
            design.frameStyle
          )}
        >
          {/* Динамическая Аура */}
          <div className={clsx(
            "absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] animate-pulse transition-all duration-1000 bg-gradient-to-br",
            design.coreColor,
            design.auraIntensity
          )} />
          
          <div className="relative h-full flex flex-col justify-between z-10">
            {/* Top: Serial & Action */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Asset Series 01</span>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tighter mt-1">Soulyn Core</h2>
              </div>
              <button 
                onClick={() => { haptic.impact('medium'); setIsDesignLabOpen(true); }}
                className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white/60 active:scale-90 transition-all hover:bg-white/10"
              >
                <Palette size={20} />
              </button>
            </div>

            {/* Middle: The Generative Core (Вместо аватара) */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="text-2xl font-black text-white tracking-tight mb-2">
                  {user?.first_name || 'Holder'}
                </h3>
                {/* Mood Pulse */}
                <button 
                  onClick={() => { haptic.selection(); setShowStatusPicker(!showStatusPicker); }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 active:bg-white/10 transition-all w-fit"
                >
                  {currentStatus ? (
                    <>
                      <currentStatus.icon size={12} className={currentStatus.color} />
                      <span className="text-[11px] font-bold text-white/90">{currentStatus.label}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} className="text-primary" />
                      <span className="text-[11px] font-bold text-white/30">Set Pulse</span>
                    </>
                  )}
                </button>
              </div>

              {/* Генеративное ядро (Визуальный код) */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <motion.div 
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className={clsx(
                    "w-full h-full rounded-[35%] blur-[2px] bg-gradient-to-tr shadow-[0_0_30px_rgba(139,92,246,0.3)]",
                    design.coreColor
                  )}
                />
                <Hexagon size={40} className="absolute text-white/20 fill-white/5 animate-pulse" />
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex justify-between items-end border-t border-white/5 pt-5">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Authenticated</span>
                <span className="text-[11px] font-bold text-white/60 uppercase">{memberSince}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1">Global Rank</span>
                <span className="text-lg font-black text-white tracking-tighter">#000042</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { label: 'Импульсы', value: '12' },
            { label: 'Мэтчи', value: '48' },
            { label: 'Рейтинг', value: '4.9' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-[28px] p-5 text-center active:bg-white/[0.08] transition-colors">
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-[10px] text-white/20 font-black uppercase mt-1 tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Management & Settings */}
        <div className="space-y-6">
          <section>
            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 ml-1 text-left">Управление активом</h3>
            <div className="bg-white/5 border border-white/5 rounded-[32px] overflow-hidden">
              {[
                { icon: Share2, label: 'Передать карту', color: 'text-primary' },
                { icon: History, label: 'История транзакций', color: 'text-blue-400' },
                { icon: TrendingUp, label: 'Рыночная ценность', color: 'text-green-400' },
              ].map((item, i, arr) => (
                <button key={i} onClick={() => haptic.selection()} className={clsx("w-full px-6 py-5 flex items-center justify-between active:bg-white/5 transition-colors text-left", i !== arr.length - 1 && "border-b border-white/5")}>
                  <div className="flex items-center gap-4">
                    <div className={clsx("p-2.5 rounded-2xl bg-white/5", item.color)}><item.icon size={20} /></div>
                    <span className="font-bold text-[16px] text-white/80">{item.label}</span>
                  </div>
                  <ChevronRight size={20} className="text-white/10" />
                </button>
              ))}
            </div>
          </section>

          <button 
            onClick={signOut}
            className="w-full py-5 rounded-[32px] bg-red-500/10 border border-red-500/20 text-red-500 font-black text-sm uppercase tracking-[0.2em] active:scale-[0.98] transition-all"
          >
            Разорвать соединение
          </button>
        </div>
      </div>

      {/* Шторка кастомизации */}
      <DesignLabSheet 
        isOpen={isDesignLabOpen} 
        onClose={() => setIsDesignLabOpen(false)} 
        design={design}
        setDesign={setDesign}
      />

      {/* Picker статусов */}
      <AnimatePresence>
        {showStatusPicker && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-32 left-6 right-6 p-4 bg-[#121212] border border-white/10 rounded-[32px] z-[100] flex justify-between shadow-2xl"
          >
            {STATUS_PRESETS.map((s) => (
              <button key={s.id} onClick={() => { setCurrentStatus(s); setShowStatusPicker(false); haptic.impact('light'); }} className="p-4 rounded-2xl bg-white/5 active:bg-primary/20 transition-all"><s.icon size={24} className={s.color} /></button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}