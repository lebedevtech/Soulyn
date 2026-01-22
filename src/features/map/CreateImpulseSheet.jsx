import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Loader2, X, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

export default function CreateImpulseSheet({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuery(''); setResults([]); setSelectedPlace(null); setMessage('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length < 3 || selectedPlace) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1&viewbox=37.3,55.9,37.9,55.5&bounded=1`);
        const data = await response.json();
        setResults(data);
      } catch (error) { console.error("Search error:", error); } finally { setIsLoading(false); }
    }, 600);
    return () => clearTimeout(timer);
  }, [query, selectedPlace]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} 
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-[2000]" 
          />

          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="absolute bottom-0 left-0 right-0 z-[2001] glass-panel rounded-t-[42px] p-6 pb-14 flex flex-col max-h-[94%]"
          >
            {/* Handle */}
            <div className="w-12 h-1.5 bg-white/30 rounded-full mx-auto mb-8 shrink-0 shadow-sm" />

            <div className="flex items-center justify-between mb-10 shrink-0 px-2">
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80 active:scale-90 transition-all border border-white/10 shadow-lg"
              >
                <X size={22} />
              </button>
              <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-lg">Новый Импульс</h2>
              <div className="w-10" />
            </div>
            
            <div className="overflow-y-auto no-scrollbar flex-1 px-1">
              <div className="mb-10">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 block ml-2 opacity-90 drop-shadow-md">Твой вайб</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Напиши, что ты делаешь сейчас..."
                  className="w-full glass-input rounded-[30px] p-6 text-[18px] leading-relaxed h-36"
                />
              </div>

              <div className="relative mb-6 z-20">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 block ml-2 opacity-90 drop-shadow-md">Место встречи</label>
                
                <div className={clsx(
                  "glass-input rounded-[30px] flex items-center px-6 py-5 gap-4",
                  results.length > 0 && !selectedPlace ? "rounded-b-none border-b-transparent shadow-none" : ""
                )}>
                  {isLoading ? <Loader2 className="text-primary animate-spin" size={24} /> : <Search className="text-white/30" size={24} />}
                  <input 
                    value={selectedPlace ? selectedPlace.display_name.split(',')[0] : query}
                    onChange={(e) => { setQuery(e.target.value); setSelectedPlace(null); }}
                    placeholder="Найти заведение..."
                    className="bg-transparent border-none outline-none w-full text-white placeholder:text-white/20 text-[18px]"
                  />
                  {selectedPlace && <X className="text-white/40" size={20} onClick={() => setSelectedPlace(null)} />}
                </div>

                <AnimatePresence>
                  {results.length > 0 && !selectedPlace && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                      className="absolute top-full left-0 right-0 glass-panel rounded-b-[30px] overflow-hidden z-[2010] mt-[-1px] border-t-0 shadow-2xl"
                    >
                      {results.map((place) => (
                        <button
                          key={place.place_id}
                          onClick={() => { setSelectedPlace(place); setResults([]); }}
                          className="w-full px-6 py-5 flex items-start gap-4 hover:bg-primary/20 transition-colors border-b border-white/5 last:border-none text-left"
                        >
                          <MapPin size={22} className="text-primary mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[16px] font-bold text-white mb-1 leading-snug">
                              {place.name || place.display_name.split(',')[0]}
                            </p>
                            <p className="text-[11px] text-white/40 line-clamp-1 leading-snug uppercase tracking-wider">
                              {place.display_name.split(',').slice(1, 3).join(',')}
                            </p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-8 shrink-0">
              <button 
                disabled={!selectedPlace || !message.trim()}
                onClick={() => { alert('Опубликовано!'); onClose(); }}
                className={clsx(
                  "w-full py-5 rounded-[30px] font-black text-[18px] flex items-center justify-center gap-3 transition-all active:scale-[0.96]",
                  (!selectedPlace || !message.trim())
                    ? "bg-white/5 text-white/20 border border-white/5"
                    : "bg-primary text-white shadow-[0_15px_35px_rgba(139,92,246,0.45)] border border-primary/50"
                )}
              >
                <Send size={22} strokeWidth={2.5} />
                Опубликовать
              </button>
              
              <button 
                onClick={onClose}
                className="w-full py-5 rounded-[30px] font-bold text-white/40 hover:text-white transition-all active:scale-[0.96]"
              >
                Отменить
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}