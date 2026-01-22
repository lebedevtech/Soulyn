import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Heart } from 'lucide-react';

export default function ImpulseSheet({ impulse, onClose }) {
  if (!impulse) return null;

  return (
    <AnimatePresence>
      {impulse && (
        <>
          {/* Темная подложка (Backdrop) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-[1000]"
          />

          {/* Сама шторка */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="y" // Тянется вниз
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose(); // Закрыть, если потянули вниз
            }}
            className="absolute bottom-0 left-0 right-0 z-[1001] glass-panel rounded-t-[32px] px-6 pt-2 pb-10"
          >
            {/* Полоска-индикатор для свайпа */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto my-3" />

            {/* Контент */}
            <div className="flex flex-col items-center text-center mt-4">
              {/* Аватарка в рамке */}
              <div className="relative">
                <div 
                  className="w-24 h-24 rounded-full border-4 border-primary/30 p-1 shadow-2xl"
                  style={{ backgroundImage: `url(${impulse.img})`, backgroundSize: 'cover' }}
                />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-surface rounded-full flex items-center justify-center text-2xl border-2 border-primary/50 shadow-lg">
                  {impulse.emoji}
                </div>
              </div>

              <h2 className="text-2xl font-bold mt-6 text-white">{impulse.user}</h2>
              <p className="text-primary font-medium text-sm">В 200 метрах от тебя</p>

              {/* Текст импульса */}
              <div className="mt-6 glass-accent p-5 rounded-[24px] w-full text-left italic text-white/90">
                "Иду за кофе в ту кофейню с неоном. Кто составит компанию? ☕️✨"
              </div>

              {/* Кнопки действий */}
              <div className="flex gap-4 w-full mt-8">
                <button 
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl bg-white/10 text-white font-bold active:scale-95 transition-transform"
                >
                  Закрыть
                </button>
                <button 
                  className="flex-[2] py-4 rounded-2xl bg-primary text-white font-bold shadow-[0_0_20px_rgba(139,92,246,0.5)] active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <Heart size={20} fill="currentColor" />
                  Откликнуться
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}