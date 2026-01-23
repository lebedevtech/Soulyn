import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Send, MapPin, Navigation, Coffee, Pizza, 
  Film, Star, Ghost, Clock, ChevronRight, ChevronLeft,
  Search, Sparkles, Martini, Briefcase, Users, Heart
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import clsx from 'clsx';

const SHEET_TRANSITION = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };

const STEP_VARIANTS = {
  enter: { y: 30, opacity: 0 },
  center: { y: 0, opacity: 1 },
  exit: { y: -10, opacity: 0 },
};

const VIBES = [
  { id: 'chill', label: 'Chill', icon: Coffee, color: 'text-blue-400' },
  { id: 'party', label: 'Party', icon: Martini, color: 'text-pink-400' },
  { id: 'business', label: 'Business', icon: Briefcase, color: 'text-slate-400' },
  { id: 'date', label: 'Date', icon: Sparkles, color: 'text-red-400' },
];

const TIME_SLOTS = ["Сейчас", "30 мин", "1 час", "Вечер"];

// Добавлен проп onShowMoreVenues для перехода в список мест
export default function CreateImpulseSheet({ isOpen, initialData, onClose, onShowMoreVenues }) {
  const { user } = useAuth();
  const { location: gpsLocation } = useLocation();

  const [step, setStep] = useState(1);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [message, setMessage] = useState('');
  const [vibe, setVibe] = useState('chill');
  const [plannedTime, setPlannedTime] = useState("Сейчас");
  const [exclusivity, setExclusivity] = useState('everyone'); 
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

  const getStepTitle = () => {
    switch(step) {
      case 1: return "Локация";
      case 2: return "Вайб и время";
      case 3: return "Планы";
      case 4: return "Приватность";
      case 5: return "Резюме";
      default: return "Импульс";
    }
  };

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
            className="fixed bottom-0 left-0 right-0 z-[110] bg-[#0A0A0A] rounded-t-[48px] border-t border-white/5 p-6 pb-12 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
              <motion.div 
                className="h-full bg-primary"
                animate={{ width: `${(step / 5) * 100}%` }}
              />
            </div>

            {/* HEADER NAVIGATION: Текст выровнен с кнопками */}
            <div className="flex justify-between items-center mb-10">
              <div className="w-10">
                {step > 1 && (
                  <button onClick={prevStep} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/40 active:scale-90 transition-transform">
                    <ChevronLeft size={20} />
                  </button>
                )}
              </div>
              
              <span className="text-[13px] font-bold text-white uppercase tracking-[0.2em] -translate-y-0.5">
                {getStepTitle()}
              </span>

              <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/40 active:scale-90 transition-transform">
                <X size={20} />
              </button>
            </div>

            <div className="relative min-h-[360px]">
              <AnimatePresence mode="wait">
                
                {step === 1 && (
                  <motion.div key="step1" variants={STEP_VARIANTS} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                    <div className="relative mb-6">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input 
                        placeholder="Найти заведение..."
                        className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/40 transition-all text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-3 ml-1">Популярные места</h3>
                      {popularVenues.map(venue => (
                        <button key={venue.id} onClick={() => { setSelectedVenue(venue); nextStep(); }} className="w-full p-3 rounded-[24px] bg-white/[0.02] border border-white/5 flex items-center gap-3 active:bg-white/5 transition-colors">
                          <img src={venue.image_url} className="w-11 h-11 rounded-xl object-cover shadow-2xl" />
                          <div className="text-left flex-1">
                            <p className="font-bold text-white text-sm">{venue.name}</p>
                            <p className="text-[9px] text-white/30 uppercase font-black tracking-widest mt-0.5">{venue.average_check}</p>
                          </div>
                          <ChevronRight size={16} className="text-white/10" />
                        </button>
                      ))}
                      
                      {/* НОВАЯ КНОПКА: Больше популярных мест */}
                      <button 
                        onClick={() => {
                          onShowMoreVenues(); // Триггер на переключение режима в MapPage
                          onClose();          // Закрываем шторку
                        }} 
                        className="w-full p-4 mt-2 rounded-[20px] border border-dashed border-white/10 bg-white/[0.02] text-white/40 text-[11px] font-bold uppercase tracking-widest hover:text-white hover:border-white/20 transition-all active:scale-[0.98]"
                      >
                        Больше популярных мест
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" variants={STEP_VARIANTS} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                    <div className="grid grid-cols-2 gap-2 mb-8">
                      {VIBES.map(v => (
                        <button key={v.id} onClick={() => setVibe(v.id)} className={clsx("p-4 rounded-[28px] border flex flex-col items-start gap-2 transition-all", vibe === v.id ? "bg-white text-black border-white shadow-xl shadow-white/10" : "bg-white/[0.03] border-white/5 text-white/60")}>
                          <v.icon size={18} className={vibe === v.id ? "text-black" : v.color} />
                          <span className="font-bold text-xs tracking-tight">{v.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-3 ml-1">Когда планируете?</h3>
                      <div className="p-1 bg-white/[0.03] rounded-2xl border border-white/5 flex gap-1">
                        {TIME_SLOTS.map(t => (
                          <button key={t} onClick={() => setPlannedTime(t)} className={clsx("flex-1 py-3 px-1 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all", plannedTime === t ? "bg-white text-black" : "text-white/20")}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <button onClick={nextStep} className="w-full mt-10 py-4 rounded-2xl bg-white text-black font-black text-[11px] uppercase tracking-widest active:scale-95 transition-transform">Далее</button>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" variants={STEP_VARIANTS} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                    <textarea 
                      autoFocus
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Опишите ваши планы на эту встречу..."
                      className="w-full h-40 bg-white/[0.03] border border-white/10 rounded-[28px] p-6 text-white text-base font-medium focus:outline-none focus:border-primary/40 transition-all resize-none shadow-inner"
                    />
                    
                    <button onClick={nextStep} disabled={!message.trim()} className="w-full mt-6 py-4 rounded-2xl bg-white text-black font-black text-[11px] uppercase tracking-widest disabled:opacity-20 transition-all">Подтвердить</button>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div key="step4" variants={STEP_VARIANTS} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                    <div className="space-y-2">
                      {[
                        { id: 'everyone', label: 'Для всех', desc: 'Виден всем в радиусе 2км', icon: Users },
                        { id: 'matches', label: 'Только мэтчи', desc: 'Для тех, с кем есть взаимность', icon: Heart },
                        { id: 'girls', label: 'Girls Only', desc: 'Виден только девушкам', icon: Sparkles },
                      ].map(opt => (
                        <button key={opt.id} onClick={() => setExclusivity(opt.id)} className={clsx("w-full p-4 rounded-[28px] border flex items-center gap-4 transition-all", exclusivity === opt.id ? "bg-primary border-primary text-white" : "bg-white/[0.03] border-white/5 text-white/40")}>
                          <div className="p-2.5 bg-black/20 rounded-xl"><opt.icon size={18} /></div>
                          <div className="text-left flex-1">
                             <p className="font-bold text-sm">{opt.label}</p>
                             <p className="text-[9px] font-medium opacity-60">{opt.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    <button onClick={nextStep} className="w-full mt-10 py-4 rounded-2xl bg-white text-black font-black text-[11px] uppercase tracking-widest active:scale-95 transition-transform">К просмотру</button>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div key="step5" variants={STEP_VARIANTS} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                    <div className="bg-white/[0.03] border border-white/5 rounded-[32px] p-6 mb-6 relative overflow-hidden">
                       <div className="flex items-center gap-2 mb-3">
                         <div className="px-2 py-0.5 bg-primary/20 text-primary rounded-md text-[9px] font-black uppercase tracking-tighter">{vibe}</div>
                         <div className="px-2 py-0.5 bg-white/10 text-white/40 rounded-md text-[9px] font-black uppercase tracking-tighter">{plannedTime}</div>
                       </div>
                       <p className="text-lg font-bold text-white mb-5 leading-relaxed">"{message}"</p>
                       <div className="flex items-center gap-1.5 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                          <MapPin size={12} className="text-primary" /> {selectedVenue?.name || "Моя геопозиция"}
                       </div>
                    </div>

                    <div className="flex gap-2 mb-8">
                       <button onClick={() => setIsGhost(!isGhost)} className={clsx("flex-1 p-3 rounded-2xl border flex items-center justify-center gap-2 transition-all", isGhost ? "bg-white text-black border-white" : "bg-white/[0.03] border-white/10 text-white/40")}>
                          <Ghost size={16} />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Ghost</span>
                       </button>
                       <div className="flex-1 p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center gap-2 text-white/40">
                          <Clock size={16} />
                          <span className="text-[9px] font-bold uppercase tracking-widest">4 Часа</span>
                       </div>
                    </div>

                    <motion.button 
                      whileTap={{ scale: 0.98 }} onClick={handleCreate} disabled={isSending}
                      className="w-full py-5 rounded-[24px] bg-primary text-white font-black text-lg flex items-center justify-center gap-2 shadow-2xl shadow-primary/40"
                    >
                      {isSending ? 'Публикация...' : <>Опубликовать <Send size={20} /></>}
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