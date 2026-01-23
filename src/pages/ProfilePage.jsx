import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, User, ChevronRight, Star, Shield, Settings, QrCode, Crown, Sparkles,
  Coffee, Pizza, Film, Zap, Moon, Share2, History, TrendingUp, Palette, Hexagon,
  Edit3, Camera, Layout
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTelegram } from '../context/TelegramContext';
import clsx from 'clsx';

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
  const [currentStatus, setCurrentStatus] = useState(null);

  return (
    <div className="relative w-full h-full bg-black flex flex-col overflow-y-auto no-scrollbar">
      
      {/* HEADER: Эталон Soulyn (top-14, -translate-y-3) */}
      <div className="absolute top-14 left-0 right-0 h-[52px] z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md border-b border-white/5 text-center">
        <span className="text-[17px] font-bold text-white tracking-tight -translate-y-3">Профиль</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />

      {/* CONTENT */}
      <div className="flex-1 pt-28 pb-32 px-6">
        
        {/* 1. HUMAN PROFILE (Основа) */}
        <div className="flex items-center gap-5 mb-8 mt-2">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-2 border-primary/30 p-1.5 bg-black/40">
              <img 
                src={user?.avatar_url || 'https://i.pravatar.cc/150'} 
                className="w-full h-full rounded-full object-cover shadow-2xl" 
                alt="Profile" 
              />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1.5 bg-primary rounded-full border-4 border-black text-white">
              <Star size={12} fill="currentColor" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-black text-white tracking-tighter truncate">
              {user?.first_name || 'Username'}
            </h3>
            
            {/* Mood Pulse Selector */}
            <div className="relative mt-2">
              <button 
                onClick={() => { haptic.impact('light'); setShowStatusPicker(!showStatusPicker); }}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 active:bg-white/10 transition-all"
              >
                {currentStatus ? (
                  <>
                    <currentStatus.icon size={12} className={currentStatus.color} />
                    <span className="text-[11px] font-bold text-white/90">{currentStatus.label}</span>
                  </>
                ) : (
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.1em]">Выбрать вайб</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 2. STATS GRID */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { label: 'Импульсы', value: '12' },
            { label: 'Мэтчи', value: '48' },
            { label: 'Рейтинг', value: '4.9' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl py-4 text-center">
              <p className="text-xl font-black text-white leading-none">{stat.value}</p>
              <p className="text-[9px] text-white/20 font-black uppercase mt-1.5 tracking-tighter">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* 3. SOULYN NFT ASSET (Дополнительный пункт/Артефакт) */}
        <div className="mb-6 ml-1 flex justify-between items-center">
          <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Ваша карта доступа</h3>
          <span className="text-[9px] font-bold text-primary uppercase">Unique NFT</span>
        </div>

        <motion.div 
          whileTap={{ scale: 0.98 }}
          className="relative w-full aspect-[1.6/1] glass-panel rounded-[32px] p-6 mb-10 overflow-hidden border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
        >
          {/* Генеративное Ядро (Абстракция без имени) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
             <motion.div 
               animate={{ 
                 scale: [1, 1.2, 1],
                 rotate: 360 
               }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="w-40 h-40 bg-gradient-to-tr from-primary/40 to-blue-500/0 blur-3xl rounded-full"
             />
          </div>

          <div className="relative h-full flex flex-col justify-between z-10">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[8px] font-black text-primary uppercase tracking-[0.4em]">Genesis Series</span>
                <h2 className="text-sm font-black text-white/40 tracking-widest mt-1">SOULYN PASSPORT</h2>
              </div>
              <div className="p-2 bg-black/40 rounded-xl border border-white/5 text-primary">
                <Hexagon size={16} className="animate-pulse" />
              </div>
            </div>

            {/* Центральный визуальный код */}
            <div className="flex justify-center">
              <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                 <div className="w-3 h-3 bg-primary rounded-full animate-ping" />
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-white/5 pt-4">
              <div className="flex flex-col">
                <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em]">Verified Asset</span>
                <span className="text-[10px] font-bold text-white/40 tracking-tighter">TOKEN_ID: #8392-AX</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[7px] font-black text-primary uppercase tracking-[0.2em]">Global Rank</span>
                <span className="text-[18px] font-black text-white tracking-tighter leading-none">#000042</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4. MANAGEMENT MENU */}
        <div className="space-y-6">
          <section>
            <div className="bg-white/5 border border-white/5 rounded-[28px] overflow-hidden">
              {[
                { icon: Palette, label: 'Кастомизация карты', color: 'text-primary' },
                { icon: Share2, label: 'Передать актив', color: 'text-blue-400' },
                { icon: History, label: 'История владения', color: 'text-white/40' },
                { icon: Shield, label: 'Конфиденциальность', color: 'text-green-500' },
                { icon: LogOut, label: 'Выйти из профиля', color: 'text-red-500', action: signOut },
              ].map((item, i, arr) => (
                <button 
                  key={i} 
                  onClick={() => { haptic.selection(); item.action?.(); }}
                  className={clsx(
                    "w-full px-6 py-4 flex items-center justify-between active:bg-white/5 transition-colors text-left",
                    i !== arr.length - 1 && "border-b border-white/5"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={clsx("p-2 rounded-xl bg-white/5", item.color)}><item.icon size={16} /></div>
                    <span className={clsx("font-bold text-[14px]", item.color === 'text-red-500' ? "text-red-500" : "text-white/70")}>
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-white/10" />
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* STATUS PICKER MODAL */}
      <AnimatePresence>
        {showStatusPicker && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowStatusPicker(false)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              className="fixed bottom-32 left-6 right-6 p-4 bg-[#121212] border border-white/10 rounded-[32px] z-[110] flex justify-between shadow-2xl"
            >
              {STATUS_PRESETS.map((s) => (
                <button 
                  key={s.id} 
                  onClick={() => { setCurrentStatus(s); setShowStatusPicker(false); haptic.impact('light'); }} 
                  className="p-4 rounded-2xl bg-white/5 active:bg-primary/20 transition-all"
                >
                  <s.icon size={22} className={s.color} />
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}