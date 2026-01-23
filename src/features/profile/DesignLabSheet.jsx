import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Droplets, Zap, Shield, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const CORE_COLORS = [
  { id: 'classic', value: 'from-primary to-blue-600', label: 'Classic' },
  { id: 'gold', value: 'from-yellow-400 to-orange-600', label: 'Gold' },
  { id: 'toxic', value: 'from-green-400 to-cyan-500', label: 'Toxic' },
  { id: 'noir', value: 'from-white/40 to-white/5', label: 'Noir' },
];

export default function DesignLabSheet({ isOpen, onClose, design, setDesign }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md"
          />
          <motion.div 
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[120] bg-[#0A0A0A] rounded-t-[48px] border-t border-white/10 p-8 pb-12 shadow-2xl"
          >
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
            
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase tracking-[0.1em]">Design Lab</h2>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40"><X size={20} /></button>
            </div>

            <div className="space-y-8">
              {/* Выбор цвета Ядра */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Droplets size={14} className="text-primary" />
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Core Aura</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {CORE_COLORS.map((color) => (
                    <button 
                      key={color.id}
                      onClick={() => setDesign({ ...design, coreColor: color.value })}
                      className={clsx(
                        "p-4 rounded-2xl border transition-all flex items-center justify-between",
                        design.coreColor === color.value ? "border-primary bg-primary/10" : "border-white/5 bg-white/[0.02]"
                      )}
                    >
                      <div className={clsx("w-4 h-4 rounded-full bg-gradient-to-tr", color.value)} />
                      <span className="text-xs font-bold text-white/60">{color.label}</span>
                      {design.coreColor === color.value && <Check size={14} className="text-primary" />}
                    </button>
                  ))}
                </div>
              </section>

              {/* Интенсивность свечения */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={14} className="text-yellow-400" />
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Energy Intensity</span>
                </div>
                <div className="flex gap-2">
                  {['opacity-20', 'opacity-40', 'opacity-70'].map((op, i) => (
                    <button 
                      key={op}
                      onClick={() => setDesign({ ...design, auraIntensity: op })}
                      className={clsx(
                        "flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                        design.auraIntensity === op ? "bg-white text-black" : "bg-white/5 text-white/20"
                      )}
                    >
                      Level 0{i+1}
                    </button>
                  ))}
                </div>
              </section>

              <button 
                onClick={onClose}
                className="w-full py-5 rounded-[28px] bg-primary text-white font-black text-lg shadow-2xl shadow-primary/40 mt-4"
              >
                Сохранить артефакт
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}