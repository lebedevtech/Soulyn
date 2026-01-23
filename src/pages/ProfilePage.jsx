import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, User, ChevronRight, Star, Shield, QrCode, Sparkles,
  Share2, TrendingUp, Palette, Hexagon, Camera, MapPin, 
  LayoutGrid, Cpu, Hash, Terminal, Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTelegram } from '../context/TelegramContext';
import { supabase } from '../lib/supabase';
import clsx from 'clsx';

export default function ProfilePage() {
  const { user } = useAuth();
  const { haptic } = useTelegram();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Локальная функция выхода (так как в AuthContext её может не быть)
  const handleSignOut = async () => {
    haptic?.impact('medium');
    await supabase.auth.signOut();
    window.location.reload();
  };

  // Фотографии (заглушки для визуала Tinder-style)
  const userPhotos = [
    user?.avatar_url || 'https://i.pravatar.cc/400?img=32',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop'
  ];

  const interests = ['Lifestyle', 'Business', 'Techno', 'Art', 'Travel'];

  const handleQuickLogin = async (email) => {
    setIsLoggingIn(true);
    haptic?.impact('heavy');
    await supabase.auth.signOut();
    const { error } = await supabase.auth.signInWithPassword({ email, password: '123456' });
    if (error) alert(`Ошибка: ${error.message}`);
    else window.location.reload();
    setIsLoggingIn(false);
  };

  return (
    <div className="relative w-full h-full bg-black flex flex-col overflow-hidden">
      
      {/* 1. FIXED HEADER */}
      <div className="fixed top-14 left-0 right-0 h-[52px] z-[70] flex items-center justify-center text-center pointer-events-none">
        <span className="text-[17px] font-bold text-white tracking-tight -translate-y-3 pointer-events-auto">
          {user?.email?.includes('test') ? 'Developer' : 'Профиль'}
        </span>
      </div>

      {/* 2. FIXED GRADIENTS */}
      <div className="fixed top-0 left-0 right-0 h-44 z-[65] bg-gradient-to-b from-black via-black/40 to-transparent pointer-events-none" />
      <div className="fixed bottom-0 left-0 right-0 h-40 z-[45] bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

      {/* 3. SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-28 pb-48 px-6 relative z-10">
        
        {/* PHOTO GALLERY (Horizontal Scroll) */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8 -mx-1 px-1">
          {userPhotos.map((photo, i) => (
            <motion.div 
              key={photo}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="relative shrink-0 w-[260px] aspect-[3/4] rounded-[32px] overflow-hidden border border-white/5 shadow-2xl"
            >
              <img src={photo} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {i === 0 && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full flex items-center gap-1.5">
                  <Star size={10} className="text-primary fill-primary" />
                  <span className="text-[9px] font-black text-white uppercase">Резидент</span>
                </div>
              )}
            </motion.div>
          ))}
          <button className="shrink-0 w-20 aspect-[3/4] rounded-[32px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-white/10 gap-2 active:bg-white/5">
            <Camera size={20} />
            <span className="text-[8px] font-black uppercase">Add</span>
          </button>
        </div>

        {/* BASIC INFO */}
        <div className="mb-8 px-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-black text-white tracking-tighter">
              {user?.first_name || 'Resident'}, 26
            </h3>
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg flex items-center gap-1.5">
              <MapPin size={10} className="text-primary" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Active</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-white/60 text-[14px] leading-relaxed font-medium">
              Исследую городские смыслы и редкие заведения. Люблю минимализм в дизайне и сложный звук в музыке.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {interests.map(tag => (
                <div key={tag} className="px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-full flex items-center gap-1.5 active:bg-white/10 transition-colors">
                  <Hash size={10} className="text-primary" />
                  <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-2 mb-10">
          {[
            { label: 'Импульсы', value: '12' },
            { label: 'Мэтчи', value: '48' },
            { label: 'Рейтинг', value: '4.9' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl py-4 text-center">
              <p className="text-xl font-black text-white leading-none">{stat.value}</p>
              <p className="text-[8px] text-white/20 font-black uppercase mt-1 tracking-tighter">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* NFT ARTIFACT CARD */}
        <div className="mb-4 px-1 flex justify-between items-end">
           <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Identity Asset</h3>
           <Award size={12} className="text-primary/40" />
        </div>
        
        <motion.div 
          whileTap={{ scale: 0.98 }}
          className="relative w-full aspect-[1.5/1] glass-panel rounded-[32px] p-7 overflow-hidden border border-white/10 shadow-2xl mb-12"
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
             <motion.div 
               animate={{ scale: [1, 1.15, 1], rotate: 360 }}
               transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
               className="w-56 h-56 bg-gradient-to-tr from-primary/50 via-blue-500/20 to-transparent blur-[80px] rounded-full"
             />
          </div>

          <div className="relative h-full flex flex-col justify-between z-10">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-[7px] font-black text-primary uppercase tracking-[0.4em]">Series Genesis</span>
                <h2 className="text-sm font-black text-white/10 tracking-[0.7em] uppercase">Artifact</h2>
              </div>
              <div className="flex gap-2">
                <button className="p-2.5 rounded-2xl bg-black/40 border border-white/5 text-white/20"><QrCode size={14} /></button>
                <button className="p-2.5 rounded-2xl bg-black/40 border border-white/5 text-primary"><Palette size={14} /></button>
              </div>
            </div>

            <div className="flex justify-center items-center">
               <div className="relative">
                  <Cpu size={36} className="text-white/10 animate-pulse" />
                  <Hexagon size={48} className="absolute inset-0 -translate-x-1.5 -translate-y-1.5 text-primary/10 fill-white/5 rotate-90" />
               </div>
            </div>

            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[7px] font-black text-white/10 uppercase tracking-[0.3em] mb-0.5">Genetic Hash</span>
                <span className="text-[9px] font-bold text-white/20 tracking-tight font-mono uppercase">SOUL-ID-{user?.id?.slice(0,8)}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[7px] font-black text-primary uppercase tracking-[0.3em] mb-0.5">Global Rank</span>
                <span className="text-lg font-black text-white tracking-tighter leading-none">#000{user?.id?.slice(-3) || '042'}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* DEBUG AUTH SWITCHER */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4 ml-1">
            <Terminal size={12} className="text-primary" />
            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Debug Auth Control</h3>
          </div>
          
          <div className="bg-primary/5 border border-primary/10 rounded-[28px] p-4">
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleQuickLogin('test1@example.com')}
                className={clsx(
                  "py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all",
                  user?.email === 'test1@example.com' ? "bg-primary border-primary text-white" : "bg-white/5 border-white/5 text-white/40 active:scale-95"
                )}
              >
                Account A
              </button>
              <button 
                onClick={() => handleQuickLogin('test2@example.com')}
                className={clsx(
                  "py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all",
                  user?.email === 'test2@example.com' ? "bg-primary border-primary text-white" : "bg-white/5 border-white/5 text-white/40 active:scale-95"
                )}
              >
                Account B
              </button>
            </div>
          </div>
        </section>

        {/* STANDARD MENU */}
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/5 rounded-[28px] overflow-hidden shadow-xl">
            {[
              { icon: Shield, label: 'Приватность', color: 'text-green-500' },
              { icon: TrendingUp, label: 'Ценность актива', color: 'text-blue-500' },
              { icon: LayoutGrid, label: 'Коллекция мест', color: 'text-orange-400' },
              { icon: LogOut, label: 'Выйти из аккаунта', color: 'text-red-500', action: handleSignOut },
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
        </div>
      </div>
    </div>
  );
}