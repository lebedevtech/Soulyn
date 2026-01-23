import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Send, MapPin, Navigation, Coffee, Pizza, 
  Film, Star, Ghost, Clock, ChevronRight, ChevronLeft,
  Search, Sparkles, Martini, Briefcase, Users, Eye
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import clsx from 'clsx';

const SHEET_TRANSITION = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };

// Анимация теперь по вертикали (y)
const STEP_VARIANTS = {
  enter: { y: 100, opacity: 0 },
  center: { y: 0, opacity: 1 },
  exit: { y: -50, opacity: 0 },
};

const VIBES = [
  { id: 'chill', label: 'Chill', icon: Coffee, color: 'text-blue-400' },
  { id: 'party', label: 'Party', icon: Martini, color: 'text-pink-400' },
  { id: 'business', label: 'Business', icon: Briefcase, color: 'text-slate-400' },
  { id: 'date', label: 'Date', icon: Sparkles, color: 'text-red-400' },
];

const TIME_SLOTS = ["Сейчас", "Через 30 мин", "Через 1 час", "Вечером"];

export default function CreateImpulseSheet({ isOpen, initialData, onClose }) {
  const { user } = useAuth();
  const { location: gpsLocation } = useLocation();

  const [step, setStep] = useState(1);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [message, setMessage] = useState('');
  const [vibe, setVibe] = useState('chill');
  const [plannedTime, setPlannedTime] = useState("Сейчас");
  const [exclusivity, setExclusivity] = useState('everyone'); // everyone, matches, girls
  const [isGhost, setIsGhost] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [popularVenues, setPopularVenues] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setMessage('');
      if (initialData?.venue) {
        setSelectedVenue(initialData.venue);
        setStep(2); 
      }
      fetchPopularVenues();
    }
  }, [isOpen, initialData]);

  const fetchPopularVenues = async () => {
    const { data } = await supabase.from('venues').select('*').limit(3);
    if (data) setPopularVenues(data);
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleCreate = async () => {
    setIsSending(true);
    const lat = selectedVenue?.lat || gpsLocation?.[0] || 55.7558;
    const lng = selectedVenue?.lng || gpsLocation?.[1] || 37.6173;

    const { error } = await supabase.from('impulses').insert([{
      user_id: user.id,
      message: `${vibe.toUpperCase()} • ${plannedTime}: ${message}`,
      lat, lng,
      venue_id: selectedVenue?.id || null,
      is_ghost: isGhost,
      expires_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
    }]);

    setIsSending(false);
    if (!error) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={SHEET_TRANSITION}
            className="fixed bottom-0 left-0 right-0 z-[110] bg-[#0A0A0A] rounded-t-[48px] border-t border-white/5 p-8 pb-12 shadow-2xl overflow-hidden"
          >
            {/* Тонкий индикатор прогресса */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
              <motion.div 
                className="h-full bg-primary shadow-[0_0_10px_rgba(139,92,246,0.8)]"
                animate={{ width: `${(step / 5) * 100}%` }}
              />
            </div>

            <div className="flex justify-between items-center mb-10">
              {step > 1 ? (
                <button onClick={prevStep} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/40"><ChevronLeft size={20} /></button>
              ) : <div className="w-10" />}
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Step 0{step}</span>
              <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/40"><X size={20} /></button>
            </div>

            <div className="relative min-h-[420px]">
              <AnimatePresence mode="wait">
                
                {/* ШАГ 1: ВЫБОР МЕСТА */}
                {step === 1 && (
                  <motion.div key="step1" variants={STEP_VARIANTS} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                    <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Location</h2>
                    <p className="text-white/40 text-sm mb-8 font-medium">Куда отправимся сегодня?</p>
                    
                    <div className="relative mb-8">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input 
                        placeholder="Найти заведение..."
                        className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/40 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="space-y-3">
                      {popularVenues.map(venue => (
                        <button key={venue.id} onClick={() => { setSelectedVenue(venue); nextStep(); }} className="w-full p-4 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center gap-4 active:bg-white/5 transition-colors">
                          <img src={venue.image_url} className="w-14 h-14 rounded-2xl object-cover shadow-2xl" />
                          <div className="text-left flex-1">
                            <p className="font-bold text-white text-[15px]">{venue.name}</p>
                            <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">{venue.average_check}</p>
                          </div>
                          <ChevronRight size={18} className="text-white/10" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ШАГ 2: ВАЙБ И ВРЕМЯ */}
                {step === 2 && (
                  <motion.div key="step2" variants={STEP_VARIANTS} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                    <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Vibe & Time</h2>
                    <p className="text-white/40 text-sm mb-8 font-medium">Настроение и время встречи</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {VIBES.map(v => (
                        <button key={v.id} onClick={() => setVibe(v.id)} className={clsx("p-5 rounded-[32px] border flex flex-col items-start gap-3 transition-all", vibe === v.id ? "bg-white text-black border-white shadow-2xl shadow-white/10" : "bg-white/[0.03] border-white/5 text-white/60")}>
                          <v.icon size={20} className={vibe === v.id ? "text-black" : v.color} />
                          <span className="font-bold text-sm tracking-tight">{v.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="p-1.5 bg-white/[0.03] rounded-2xl border border-white/5 flex gap-1">
                      {TIME_SLOTS.map(t => (
                        <button key={t} onClick={() => setPlannedTime(t)} className={clsx("flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all", plannedTime === t ? "bg-white text-black shadow-lg" : "text-white/20")}>
                          {t}
                        </button>
                      ))}
                    </div>
                    
                    <button onClick={nextStep} className="w-full mt-8 py-4 rounded-3xl bg-white text-black font-black text-sm uppercase tracking-widest active:scale-95 transition-transform">Далее</button>
                  </motion.div>
                )}

                {/* ШАГ 3: СООБЩЕНИЕ */}
                {step === 3 && (
                  <motion.div key="step3" variants={STEP_VARIANTS} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                    <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Plan</h2>
                    <p className="text-white/40 text-sm mb-8 font-medium">Коротко о твоих планах</p>
                    
                    <textarea 
                      autoFocus
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Напиши что-нибудь вдохновляющее..."
                      className="w-full h-44 bg-white/[0.03] border border-white/10 rounded-[32px] p-6 text-white text-lg font-medium focus:outline-none focus:border-primary/40 transition-all resize-none"
                    />
                    
                    <button onClick={nextStep} disabled={!message.trim()} className="w-full mt-6 py-4 rounded-3xl bg-white text-black font-black text-sm uppercase tracking-widest disabled:opacity-20 transition-all">Подтвердить</button>
                  </motion.div>
                )}

                {/* ШАГ 4: EXCLUSIVITY */}
                {step === 4 && (
                  <motion.div key="step4" variants={STEP_VARIANTS} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                    <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Exclusivity</h2>
                    <p className="text-white/40 text-sm mb-8 font-medium">Кто увидит твой импульс?</p>
                    
                    <div className="space-y-3">
                      {[
                        { id: 'everyone', label: 'Для всех', desc: 'Виден всем пользователям в радиусе 2км', icon: Users },
                        { id: 'matches', label: 'Только мэтчи', desc: 'Увидят те, с кем у тебя взаимная симпатия', icon: Heart },
                        { id: 'girls', label: 'Girls Only', desc: 'Виден только прекрасной половине Soulyn', icon: Sparkles },
                      ].map(opt => (
                        <button key={opt.id} onClick={() => setExclusivity(opt.id)} className={clsx("w-full p-5 rounded-[32px] border flex items-center gap-4 transition-all", exclusivity === opt.id ? "bg-primary border-primary text-white shadow-xl shadow-primary/20" : "bg-white/[0.03] border-white/5 text-white/40")}>
                          <div className="p-3 bg-black/20 rounded-2xl"><opt.icon size={20} /></div>
                          <div className="text-left flex-1">
                             <p className="font-bold text-[15px]">{opt.label}</p>
                             <p className="text-[10px] font-medium opacity-60 mt-0.5">{opt.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    <button onClick={nextStep} className="w-full mt-8 py-4 rounded-3xl bg-white text-black font-black text-sm uppercase tracking-widest active:scale-95 transition-transform">Просмотр</button>
                  </motion.div>
                )}

                {/* ШАГ 5: REVIEW & PUBLISH */}
                {step === 5 && (
                  <motion.div key="step5" variants={STEP_VARIANTS} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
                    <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Review</h2>
                    <p className="text-white/40 text-sm mb-8 font-medium">Проверь детали перед публикацией</p>
                    
                    <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-8 mb-10 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-5"><Sparkles size={80} /></div>
                       <div className="flex items-center gap-3 mb-4">
                         <div className="px-3 py-1 bg-primary/20 text-primary rounded-full text-[10px] font-black uppercase tracking-tighter">{vibe}</div>
                         <div className="px-3 py-1 bg-white/10 text-white/40 rounded-full text-[10px] font-black uppercase tracking-tighter">{plannedTime}</div>
                       </div>
                       <p className="text-xl font-bold text-white mb-6 leading-relaxed">"{message}"</p>
                       <div className="flex items-center gap-2 text-white/30 text-xs font-bold uppercase tracking-widest">
                          <MapPin size={14} className="text-primary" /> {selectedVenue?.name || "Твое местоположение"}
                       </div>
                    </div>

                    <div className="flex gap-4 mb-8">
                       <button onClick={() => setIsGhost(!isGhost)} className={clsx("flex-1 p-4 rounded-3xl border flex flex-col items-center gap-2 transition-all", isGhost ? "bg-white text-black border-white" : "bg-white/[0.03] border-white/10 text-white/40")}>
                          <Ghost size={20} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Ghost</span>
                       </button>
                       <div className="flex-1 p-4 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col items-center gap-2 text-white/40">
                          <Clock size={20} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">4 Часа</span>
                       </div>
                    </div>

                    <motion.button 
                      whileTap={{ scale: 0.98 }} onClick={handleCreate} disabled={isSending}
                      className="w-full py-5 rounded-[28px] bg-primary text-white font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-primary/40"
                    >
                      {isSending ? 'Sending...' : <>Publish <Send size={22} /></>}
                    </motion.button>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}