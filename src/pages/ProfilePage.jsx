import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, User, ChevronRight, Star, Shield, QrCode, Crown, Sparkles,
  Coffee, Pizza, Film, Zap, Moon, Share2, History, TrendingUp, Palette, 
  Hexagon, Camera, MapPin, Users, Award, LayoutGrid
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
    <div className="relative w-full h-full bg-black flex flex-col overflow-y-auto no-scrollbar">
      
      {/* HEADER: Строго по эталону (top-14, span -translate-y-3) */}
      <div className="absolute top-14 left-0 right-0 h-[52px] z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md border-b border-white/5 text-center">
        <span className="text-[17px] font-bold text-white tracking-tight -translate-y-3">Профиль</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />

      {/* CONTENT: pt-28 и px-6 для выравнивания */}
      <div className="flex-1 pt-28 pb-32">
        
        {/* 1. ЛИЧНОСТЬ (Human First) */}
        <div className="px-6 flex items-center gap-4 mb-6 mt-2">
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
              className="mt-1.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 active:bg-white/10 transition-all"
            >
              {currentStatus ? (
                <>
                  <currentStatus.icon size={10} className={currentStatus.color} />
                  <span className="text-[10px] font-bold text-white/80">{currentStatus.label}</span>
                </>
              ) : (
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.1em]">Ваш статус</span>
              )}
            </button>
          </div>
        </div>

        {/* 2. DASHBOARD (Stats + Progress) */}
        <div className="px-6 mb-8">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Импульсы', value: '12' },
              { label: 'Мэтчи', value: '48' },
              { label: 'Рейтинг', value: '4.9' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl py-3 text-center active:bg-white/5">
                <p className="text-lg font-black text-white leading-none">{stat.value}</p>
                <p className="text-[8px] text-white/20 font-black uppercase mt-1 tracking-tighter">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="px-1">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Club Tier 1</span>
              <span className="text-[8px] font-black text-primary uppercase">75% to Tier 2</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} className="h-full bg-primary" />
            </div>
          </div>
        </div>

        {/* 3. RECENT CONNECTIONS (Карусель) */}
        <div className="mb-8 overflow-hidden">
          <div className="px-7 mb-3 flex justify-between items-center">
            <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Недавние контакты</h3>
            <Users size={12} className="text-white/10" />
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="shrink-0 w-11 h-11 rounded-full border border-white/5 p-0.5 bg-white/[0.02]">
                <img src={`https://i.pravatar.cc/100?img=${i+20}`} className="w-full h-full rounded-full object-cover opacity-50 grayscale" />
              </div>
            ))}
            <div className="shrink-0 w-11 h-11 rounded-full border border-dashed border-white/10 flex items-center justify-center text-white/20">
              <span className="text-[10px] font-bold">+</span>
            </div>
          </div>
        </div>

        {/* 4. NFT ARTIFACT (Абстрактная карта) */}
        <div className="px-6 mb-8">
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Цифровой актив</h3>
            <Award size={12} className="text-primary/40" />
          </div>
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="relative w-full aspect-[1.6/1] glass-panel rounded-[32px] p-6 overflow-hidden border border-white/10 shadow-2xl"
          >
            {/* Генеративное Ядро */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
               <motion.div 
                 animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
                 className="w-48 h-48 bg-primary/30 blur-3xl rounded-full" 
               />
            </div>
            
            <div className="relative h-full flex flex-col justify-between z-10">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[7px] font-black text-primary uppercase tracking-[0.4em]">Series Genesis</span>
                  <h2 className="text-xs font-black text-white/30 tracking-[0.3em] mt-1 uppercase">Soulyn Passport</h2>
                </div>
                <div className="flex gap-2">
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-white/20"><QrCode size={14} /></div>
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-primary"><Palette size={14} /></div>
                </div>
              </div>

              <div className="flex justify-center">
                 <Hexagon size={32} className="text-white/10 fill-white/5" />
              </div>

              <div className="flex justify-between items-end border-t border-white/5 pt-4">
                <div className="flex flex-col">
                  <span className="text-[7px] font-black text-white/10 uppercase tracking-[0.2em]">Verified Token</span>
                  <span className="text-[9px] font-bold text-white/30">#000{user?.id?.toString().slice(-3) || '482'}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[7px] font-black text-primary uppercase tracking-[0.2em]">Global Rank</span>
                  <span className="text-sm font-black text-white tracking-tighter leading-none">#42</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 5. МЕНЮ УПРАВЛЕНИЯ */}
        <div className="px-6 space-y-6">
          <div className="bg-white/5 border border-white/5 rounded-[28px] overflow-hidden shadow-xl">
            {[
              { icon: Share2, label: 'Передать актив', color: 'text-primary' },
              { icon: TrendingUp, label: 'Ценность карты', color: 'text-green-500' },
              { icon: LayoutGrid, label: 'Топ заведений', color: 'text-orange-400' },
              { icon: Shield, label: 'Безопасность', color: 'text-blue-400' },
              { icon: LogOut, label: 'Выйти из аккаунта', color: 'text-red-500', action: signOut },
            ].map((item, i, arr) => (
              <button 
                key={i} 
                onClick={() => { haptic?.selection(); item.action?.(); }}
                className={clsx(
                  "w-full px-5 py-4 flex items-center justify-between active:bg-white/5 transition-colors text-left",
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
        </div>
      </div>

      {/* STATUS PICKER */}
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