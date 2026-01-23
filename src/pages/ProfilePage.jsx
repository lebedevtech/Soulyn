import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, User, ChevronRight, Star, Shield, QrCode, Crown, Sparkles,
  Share2, History, TrendingUp, Palette, Hexagon, Camera, MapPin, 
  LayoutGrid, Cpu, Heart, Hash, Bug, RefreshCw, Terminal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTelegram } from '../context/TelegramContext';
import clsx from 'clsx';

// ДАННЫЕ НЕЙТРАЛЬНОГО ДЕВ-АККАУНТА
const DEV_ACCOUNT = {
  first_name: "Soulyn Dev",
  age: "0.1 Alpha",
  bio: "Lead Developer & System Architect. Тестирую генеративные ядра и протоколы мэтчинга. Если ты это видишь — система работает.",
  avatar_url: 'https://i.pravatar.cc/400?u=dev_account',
  interests: ['DevOps', 'Web3', 'Architecture', 'Swift', 'React'],
  rank: "#000001",
  tier: "Superuser",
  stats: { impulses: 99, matches: 256, rating: 5.0 }
};

export default function ProfilePage() {
  const { user: realUser, signOut } = useAuth();
  const { haptic } = useTelegram();
  
  // Состояние для переключателя аккаунтов (только для тестов)
  const [isDevMode, setIsDevMode] = useState(false);

  // Выбираем, какой аккаунт отображать
  const activeUser = isDevMode ? DEV_ACCOUNT : {
    ...realUser,
    age: 26,
    bio: "Создаю продукты, люблю эстетику ночного города и правильный звук. В поиске интересных людей для совместных импульсов.",
    interests: ['Lifestyle', 'Nightlife', 'Business', 'Techno'],
    rank: "#000042",
    tier: "Tier 1",
    stats: { impulses: 12, matches: 48, rating: 4.9 }
  };

  const userPhotos = [
    activeUser.avatar_url || 'https://i.pravatar.cc/400?img=32',
    isDevMode ? 'https://i.pravatar.cc/400?img=3' : 'https://i.pravatar.cc/400?img=33',
    'https://i.pravatar.cc/400?img=34'
  ];

  return (
    <div className="relative w-full h-full bg-black flex flex-col overflow-hidden">
      
      {/* 1. FIXED HEADER: Эталон Soulyn */}
      <div className="fixed top-14 left-0 right-0 h-[52px] z-[70] flex items-center justify-center text-center pointer-events-none">
        <span className="text-[17px] font-bold text-white tracking-tight -translate-y-3 pointer-events-auto">
          {isDevMode ? "Debug Profile" : "Профиль"}
        </span>
      </div>

      {/* 2. FIXED GRADIENTS */}
      <div className="fixed top-0 left-0 right-0 h-40 z-[65] bg-gradient-to-b from-black via-black/40 to-transparent pointer-events-none" />
      <div className="fixed bottom-0 left-0 right-0 h-40 z-[45] bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

      {/* 3. SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-28 pb-44 px-6 relative z-10">
        
        {/* PHOTO GALLERY (Tinder Style) */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8 -mx-1 px-1">
          {userPhotos.map((photo, i) => (
            <motion.div 
              key={photo}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="relative shrink-0 w-[260px] aspect-[3/4] rounded-[32px] overflow-hidden border border-white/5 shadow-2xl"
            >
              <img src={photo} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </motion.div>
          ))}
          <button className="shrink-0 w-20 aspect-[3/4] rounded-[32px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-white/10 gap-2 active:bg-white/5 transition-colors">
            <Camera size={20} />
          </button>
        </div>

        {/* BASIC INFO */}
        <div className="mb-8 px-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-black text-white tracking-tighter">
              {activeUser.first_name}, {activeUser.age}
            </h3>
            <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
              <span className="text-[10px] font-black text-primary uppercase">{activeUser.tier}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-white/60 text-[14px] leading-relaxed font-medium">
              {activeUser.bio}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {activeUser.interests.map(tag => (
                <div key={tag} className="px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-full flex items-center gap-1.5 active:bg-white/10 transition-colors">
                  <Hash size={10} className="text-primary" />
                  <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-3 gap-2 mb-10">
          {[
            { label: 'Импульсы', value: activeUser.stats.impulses },
            { label: 'Мэтчи', value: activeUser.stats.matches },
            { label: 'Рейтинг', value: activeUser.stats.rating },
          ].map((stat, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl py-4 text-center">
              <p className="text-xl font-black text-white leading-none">{stat.value}</p>
              <p className="text-[8px] text-white/20 font-black uppercase mt-1 tracking-tighter">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* SOULYN ARTIFACT: Чистый монолит без полосок */}
        <div className="mb-4 px-1 flex justify-between items-center">
           <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Genetic Passport</h3>
           <div className="flex gap-1">
             <div className="w-1 h-1 bg-primary rounded-full animate-ping" />
             <span className="text-[7px] font-black text-primary/60 uppercase">Live Mutation</span>
           </div>
        </div>
        
        <motion.div 
          whileTap={{ scale: 0.98 }}
          className="relative w-full aspect-[1.6/1] glass-panel rounded-[32px] p-7 overflow-hidden border border-white/10 shadow-2xl mb-12"
        >
          {/* NFT Core: Анимация ядра */}
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
             <motion.div 
               animate={{ 
                 scale: [1, 1.1, 1],
                 rotate: [0, 90, 180, 270, 360] 
               }}
               transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
               className={clsx(
                 "w-64 h-64 blur-[80px] rounded-full",
                 isDevMode ? "bg-gradient-to-tr from-green-500/50 to-cyan-500/20" : "bg-gradient-to-tr from-primary/50 to-blue-500/20"
               )}
             />
          </div>

          <div className="relative h-full flex flex-col justify-between z-10">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-[7px] font-black text-primary uppercase tracking-[0.4em]">{isDevMode ? "Superuser Node" : "Series Genesis"}</span>
                <h2 className="text-sm font-black text-white/10 tracking-[0.7em] uppercase">Artifact</h2>
              </div>
              <div className="flex gap-2">
                <button className="p-2.5 rounded-2xl bg-black/40 border border-white/5 text-white/20"><QrCode size={14} /></button>
                <button className="p-2.5 rounded-2xl bg-black/40 border border-white/5 text-primary"><Palette size={14} /></button>
              </div>
            </div>

            {/* Visual Mutation Code */}
            <div className="flex justify-center items-center">
               <div className="relative">
                  <Cpu size={36} className="text-white/10 animate-pulse" />
                  <Hexagon size={48} className="absolute inset-0 -translate-x-1.5 -translate-y-1.5 text-primary/10 fill-white/5 rotate-90" />
               </div>
            </div>

            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[7px] font-black text-white/10 uppercase tracking-[0.3em] mb-0.5">Genetic Hash</span>
                <span className="text-[9px] font-bold text-white/20 tracking-tight font-mono">
                  {isDevMode ? "SYS-CORE-0X001" : "SOUL-GEN-7F2A..."}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[7px] font-black text-primary uppercase tracking-[0.3em] mb-0.5">Rank</span>
                <span className="text-lg font-black text-white tracking-tighter leading-none">{activeUser.rank}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ACCOUNT SWITCHER & MANAGEMENT (Только для тестов) */}
        <div className="space-y-6">
          <section>
            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 ml-1">Разработчик</h3>
            <div className="bg-white/5 border border-white/5 rounded-[28px] overflow-hidden">
              
              {/* ПЕРЕКЛЮЧАТЕЛЬ АККАУНТОВ */}
              <button 
                onClick={() => { haptic?.impact('heavy'); setIsDevMode(!isDevMode); }}
                className="w-full px-6 py-5 flex items-center justify-between bg-primary/5 active:bg-primary/20 transition-all border-b border-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-2xl bg-primary/20 text-primary">
                    <RefreshCw size={18} className={isDevMode ? "animate-spin" : ""} />
                  </div>
                  <div>
                    <span className="font-black text-sm text-white block">Switch Account (Test)</span>
                    <span className="text-[10px] font-bold text-primary uppercase">Toggle Dev/Real</span>
                  </div>
                </div>
                <div className={clsx("w-10 h-5 rounded-full relative transition-colors duration-300", isDevMode ? "bg-primary" : "bg-white/10")}>
                  <div className={clsx("absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300", isDevMode ? "left-6" : "left-1")} />
                </div>
              </button>

              {[
                { icon: Terminal, label: 'Debug Console', color: 'text-orange-400' },
                { icon: Bug, label: 'Report Issue', color: 'text-blue-400' },
                { icon: LogOut, label: 'Выйти из аккаунта', color: 'text-red-500', action: signOut },
              ].map((item, i, arr) => (
                <button key={i} onClick={() => { haptic?.selection(); item.action?.(); }} className={clsx("w-full px-6 py-5 flex items-center justify-between active:bg-white/5 transition-colors text-left", i !== arr.length - 1 && "border-b border-white/5")}>
                  <div className="flex items-center gap-4">
                    <div className={clsx("p-2.5 rounded-2xl bg-white/5", item.color)}><item.icon size={18} /></div>
                    <span className={clsx("font-bold text-sm", item.color === 'text-red-500' ? "text-red-500" : "text-white/70")}>{item.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-white/10" />
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}