import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, User, ChevronRight, Star, Shield, QrCode, Crown, Sparkles,
  Coffee, Pizza, Film, Zap, Moon, Share2, History, TrendingUp, Palette, 
  Hexagon, Camera, MapPin, Users, Award, LayoutGrid, Cpu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTelegram } from '../context/TelegramContext';
import clsx from 'clsx';

const STATUS_PRESETS = [
  { id: 'coffee', label: 'Кофе', icon: Coffee, color: 'text-orange-400' },
  { id: 'food', label: 'Еда', icon: Pizza, color: 'text-red-400' },
  { id: 'movie', label: 'Кино', icon: Film, color: 'text-purple-400' },
  { id: 'vibe', label: 'Движ', icon: Zap, color: 'text-yellow-400' },
];

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { haptic } = useTelegram();
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);

  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
    : 'Январь 2026';

  return (
    <div className="relative w-full h-full bg-black flex flex-col overflow-hidden">
      
      {/* 1. FIXED HEADER: Теперь полностью прозрачный, без черной заливки */}
      <div className="fixed top-14 left-0 right-0 h-[52px] z-[70] flex items-center justify-center text-center pointer-events-none">
        <span className="text-[17px] font-bold text-white tracking-tight -translate-y-3 pointer-events-auto">
          Профиль
        </span>
      </div>

      {/* 2. GRADIENTS: Мягкие переходы сверху и снизу */}
      {/* Top Gradient: создает плавное исчезновение текста при скролле под заголовок */}
      <div className="fixed top-0 left-0 right-0 h-44 z-[65] bg-gradient-to-b from-black via-black/40 to-transparent pointer-events-none" />
      
      {/* Bottom Gradient: зафиксирован строго внизу экрана, под BottomNav */}
      <div className="fixed bottom-0 left-0 right-0 h-40 z-[45] bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

      {/* 3. SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-28 pb-44 px-6 relative z-10">
        
        {/* HUMAN PROFILE SECTION */}
        <div className="flex items-center gap-4 mb-8 mt-2">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-full border border-white/10 p-1 bg-white/5 shadow-2xl">
              <img 
                src={user?.avatar_url || 'https://i.pravatar.cc/150'} 
                className="w-full h-full rounded-full object-cover" 
                alt="Profile" 
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 p-1 bg-primary rounded-full border-2 border-black">
              <Star size={10} fill="currentColor" className="text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-black text-white tracking-tighter truncate">
              {user?.first_name || 'Resident'}
            </h3>
            <button 
              onClick={() => { haptic?.impact('light'); setShowStatusPicker(!showStatusPicker); }}
              className="mt-1 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 active:bg-white/10 transition-all"
            >
              {currentStatus ? (
                <>
                  <currentStatus.icon size={10} className={currentStatus.color} />
                  <span className="text-[10px] font-bold text-white/80">{currentStatus.label}</span>
                </>
              ) : (
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.1em]">Set Pulse</span>
              )}
            </button>
          </div>
        </div>

        {/* STATS & CLUB TIER */}
        <div className="mb-10">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Импульсы', value: '12' },
              { label: 'Мэтчи', value: '48' },
              { label: 'Рейтинг', value: '4.9' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl py-3 text-center active:bg-white/5 transition-colors">
                <p className="text-lg font-black text-white leading-none">{stat.value}</p>
                <p className="text-[8px] text-white/20 font-black uppercase mt-1 tracking-tighter">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="px-1">
            <div className="flex justify-between items-center mb-1.5 font-black text-[8px] uppercase tracking-widest text-white/30">
              <span>Club Progress</span>
              <span className="text-primary tracking-normal">75% to Tier 2</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} className="h-full bg-primary" />
            </div>
          </div>
        </div>

        {/* ABSTRACT NFT ARTIFACT (Soulyn Passport) */}
        <div className="mb-4 px-1 flex justify-between items-end">
           <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Identity Asset</h3>
           <Award size={12} className="text-primary/40" />
        </div>
        
        <motion.div 
          whileTap={{ scale: 0.98 }}
          className="relative w-full aspect-[1.5/1] glass-panel rounded-[32px] p-6 overflow-hidden border border-white/10 shadow-2xl mb-12"
        >
          {/* Генеративная абстракция фона */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
             <motion.div 
               animate={{ scale: [1, 1.2, 1], rotate: 360 }}
               transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
               className="w-48 h-48 bg-gradient-to-tr from-primary/60 to-transparent blur-[60px] rounded-full"
             />
          </div>

          <div className="relative h-full flex flex-col justify-between z-10">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-[7px] font-black text-primary uppercase tracking-[0.4em]">Series Genesis</span>
                <h2 className="text-sm font-black text-white/20 tracking-[0.5em] uppercase">Artifact</h2>
              </div>
              <div className="flex gap-2">
                <div className="p-2.5 rounded-2xl bg-black/40 border border-white/5 text-white/20"><QrCode size={14} /></div>
                <div className="p-2.5 rounded-2xl bg-black/40 border border-white/5 text-primary"><Palette size={14} /></div>
              </div>
            </div>

            {/* ABSTRACT VISUAL CORE */}
            <div className="flex justify-center items-center">
               <div className="relative w-12 h-12 flex items-center justify-center">
                  <Cpu size={32} className="text-white/10 absolute animate-pulse" />
                  <Hexagon size={44} className="text-primary/20 fill-white/5 rotate-90" />
               </div>
            </div>

            <div className="flex justify-between items-end border-t border-white/5 pt-4">
              <div className="flex flex-col">
                <span className="text-[7px] font-black text-white/10 uppercase tracking-[0.3em] mb-0.5">Asset Reference</span>
                <span className="text-[9px] font-bold text-white/30 tracking-tight">SOUL-GEN-000{user?.id?.toString().slice(-3) || '482'}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[7px] font-black text-primary uppercase tracking-[0.3em] mb-0.5">Global Rank</span>
                <span className="text-lg font-black text-white tracking-tighter leading-none">#42</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* MANAGEMENT MENU */}
        <div className="space-y-6">
          <section>
            <div className="bg-white/5 border border-white/5 rounded-[28px] overflow-hidden">
              {[
                { icon: TrendingUp, label: 'Ценность карты', color: 'text-green-500' },
                { icon: Share2, label: 'Передать актив', color: 'text-primary' },
                { icon: LayoutGrid, label: 'Коллекция мест', color: 'text-orange-400' },
                { icon: Shield, label: 'Приватность', color: 'text-blue-400' },
                { icon: LogOut, label: 'Выйти из аккаунта', color: 'text-red-500', action: signOut },
              ].map((item, i, arr) => (
                <button 
                  key={i} 
                  onClick={() => { haptic?.selection(); item.action?.(); }}
                  className={clsx(
                    "w-full px-6 py-4.5 flex items-center justify-between active:bg-white/5 transition-colors text-left",
                    i !== arr.length - 1 && "border-b border-white/5"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={clsx("p-2 rounded-xl bg-white/5", item.color)}><item.icon size={16} /></div>
                    <span className={clsx("font-bold text-sm", item.color === 'text-red-500' ? "text-red-500" : "text-white/70")}>{item.label}</span>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowStatusPicker(false)} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-32 left-6 right-6 p-4 bg-[#121212] border border-white/10 rounded-[32px] z-[110] flex justify-between shadow-2xl">
              {STATUS_PRESETS.map((s) => (
                <button key={s.id} onClick={() => { setCurrentStatus(s); setShowStatusPicker(false); haptic?.impact('light'); }} className="p-4 rounded-2xl bg-white/5 active:bg-primary/20 transition-all"><s.icon size={20} className={s.color} /></button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}