import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Send, MapPin, Navigation, Coffee, Pizza, 
  Film, Star, Ghost, Clock, ChevronRight, ChevronLeft,
  Search, Users, Sparkles, Martini, Briefcase
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import clsx from 'clsx';

const SHEET_TRANSITION = { duration: 0.4, ease: [0.25, 1, 0.5, 1] };
const STEP_VARIANTS = {
  enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
};

const VIBES = [
  { id: 'chill', label: 'Chill', icon: Coffee, color: 'text-blue-400' },
  { id: 'party', label: 'Party', icon: Martini, color: 'text-pink-400' },
  { id: 'business', label: 'Business', icon: Briefcase, color: 'text-slate-400' },
  { id: 'date', label: 'Date', icon: Sparkles, color: 'text-red-400' },
];

export default function CreateImpulseSheet({ isOpen, initialData, onClose }) {
  const { user } = useAuth();
  const { location: gpsLocation } = useLocation();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  
  // Данные импульса
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [message, setMessage] = useState('');
  const [vibe, setVibe] = useState('chill');
  const [expiry, setExpiry] = useState(4);
  const [isGhost, setIsGhost] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Для поиска заведений
  const [searchQuery, setSearchQuery] = useState('');
  const [popularVenues, setPopularVenues] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setMessage('');
      if (initialData?.venue) {
        setSelectedVenue(initialData.venue);
        setStep(2); // Если заведение уже выбрано, идем ко второму шагу
      }
      fetchPopularVenues();
    }
  }, [isOpen, initialData]);

  const fetchPopularVenues = async () => {
    const { data } = await supabase.from('venues').select('*').limit(4);
    if (data) setPopularVenues(data);
  };

  const nextStep = () => { setDirection(1); setStep(s => s + 1); };
  const prevStep = () => { setDirection(-1); setStep(s => s - 1); };

  const handleCreate = async () => {
    setIsSending(true);
    const lat = selectedVenue?.lat || gpsLocation?.[0] || 55.7558;
    const lng = selectedVenue?.lng || gpsLocation?.[1] || 37.6173;

    const { error } = await supabase.from('impulses').insert([{
      user_id: user.id,
      message: `${vibe.toUpperCase()}: ${message}`,
      lat, lng,
      venue_id: selectedVenue?.id || null,
      is_ghost: isGhost,
      expires_at: new Date(Date.now() + expiry * 60 * 60 * 1000).toISOString()
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
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={SHEET_TRANSITION}
            className="fixed bottom-0 left-0 right-0 z-[110] bg-[#121212] rounded-t-[40px] border-t border-white/10 p-6 pb-12 shadow-2xl overflow-hidden"
          >
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: "25%" }}
                animate={{ width: `${(step / 4) * 100}%` }}
              />
            </div>

            <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-8 mt-2" />

            {/* Header Navigation */}
            <div className="flex justify-between items-center mb-8">
              {step > 1 ? (
                <button onClick={prevStep} className="p-2 -ml-2 text-white/40 hover:text-white transition-colors"><ChevronLeft size={24} /></button>
              ) : <div className="w-10" />}
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Шаг {step} из 4</span>
              <button onClick={onClose} className="p-2 -mr-2 text-white/40 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <div className="relative min-h-[380px]">
              <AnimatePresence mode="wait" custom={direction}>
                {step === 1 && (
                  <motion.div key="step1" custom={direction} variants={STEP_VARIANTS} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                    <h2 className="text-3xl font-black text-white tracking-tight mb-2">Куда идем?</h2>
                    <p className="text-white/40 text-sm mb-6">Выберите эксклюзивное место для встречи</p>
                    
                    <div className="relative mb-6">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input 
                        placeholder="Поиск заведений..."
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Популярные локации</h3>
                      {popularVenues.map(venue => (
                        <button 
                          key={venue.id}
                          onClick={() => { setSelectedVenue(venue); nextStep(); }}
                          className="w-full p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 active:scale-[0.98] transition-all"
                        >
                          <img src={venue.image_url} className="w-12 h-12 rounded-xl object-cover" />
                          <div className="text-left flex-1">
                            <p className="font-bold text-white text-sm">{venue.name}</p>
                            <p className="text-[10px] text-white/30 uppercase font-black">{venue.average_check}</p>
                          </div>
                          <ChevronRight size={18} className="text-white/20" />
                        </button>
                      ))}
                      <button 
                        onClick={() => { setSelectedVenue(null); nextStep(); }}
                        className="w-full p-4 rounded-2xl border border-dashed border-white/10 text-white/40 font-bold text-sm"
                      >
                        Пропустить выбор места
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" custom={direction} variants={STEP_VARIANTS} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                    <h2 className="text-3xl font-black text-white tracking-tight mb-2">Настроение</h2>
                    <p className="text-white/40 text-sm mb-8">Какой вайб у этой встречи?</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {VIBES.map(v => (
                        <button
                          key={v.id}
                          onClick={() => { setVibe(v.id); nextStep(); }}
                          className={clsx(
                            "p-6 rounded-[32px] border flex flex-col items-start gap-4 transition-all duration-300",
                            vibe === v.id ? "bg-white text-black border-white shadow-xl shadow-white/10" : "bg-white/5 border-white/5 text-white"
                          )}
                        >
                          <v.icon size={24} className={vibe === v.id ? "text-black" : v.color} />
                          <span className="font-black text-lg">{v.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" custom={direction} variants={STEP_VARIANTS} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                    <h2 className="text-3xl font-black text-white tracking-tight mb-2">Сообщение</h2>
                    <p className="text-white/40 text-sm mb-8">Что именно вы планируете делать?</p>
                    
                    <textarea 
                      autoFocus
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Опишите ваши планы..."
                      className="w-full h-40 bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-xl font-medium focus:outline-none resize-none"
                    />
                    
                    <button 
                      onClick={nextStep}
                      disabled={!message.trim()}
                      className="w-full mt-6 py-4 rounded-2xl bg-white text-black font-bold text-lg disabled:opacity-30 transition-opacity"
                    >
                      Далее
                    </button>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div key="step4" custom={direction} variants={STEP_VARIANTS} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                    <h2 className="text-3xl font-black text-white tracking-tight mb-2">Финальные штрихи</h2>
                    <p className="text-white/40 text-sm mb-8">Настройте видимость и время</p>
                    
                    <div className="space-y-4 mb-10">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Clock className="text-primary" size={20} />
                          <span className="text-white font-bold">Время жизни</span>
                        </div>
                        <div className="flex gap-2">
                          {[1, 4, 12].map(h => (
                            <button 
                              key={h} onClick={() => setExpiry(h)}
                              className={clsx("px-4 py-2 rounded-xl text-xs font-black transition-all", expiry === h ? "bg-primary text-white" : "bg-white/5 text-white/30")}
                            >
                              {h}Ч
                            </button>
                          ))}
                        </div>
                      </div>

                      <button 
                        onClick={() => setIsGhost(!isGhost)}
                        className={clsx(
                          "w-full p-4 rounded-2xl border flex items-center justify-between transition-all",
                          isGhost ? "bg-white text-black border-white" : "bg-white/5 border-white/5 text-white/40"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Ghost size={20} />
                          <span className="font-bold">Ghost Mode</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{isGhost ? 'Active' : 'Off'}</span>
                      </button>
                    </div>

                    <motion.button 
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCreate}
                      disabled={isSending}
                      className="w-full py-5 rounded-[24px] bg-primary text-white font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-primary/40"
                    >
                      {isSending ? 'Публикация...' : <>Опубликовать <Send size={22} /></>}
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