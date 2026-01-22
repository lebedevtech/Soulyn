import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Camera, Sparkles, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  { id: 'welcome', title: 'Добро пожаловать', sub: 'Soulyn — это импульс к новым встречам.' },
  { id: 'info', title: 'О тебе', sub: 'Как тебя зовут и сколько тебе лет?' },
  { id: 'interests', title: 'Твои вайбы', sub: 'Что тебе интересно сейчас?' },
  { id: 'photo', title: 'Твоё лицо', sub: 'Добавь фото, чтобы тебя узнали.' }
];

const INTERESTS_LIST = ['☕️ Кофе', '🍷 Бар', '🎬 Кино', '🏃 Пробежка', '🎮 Игры', '📚 Чтение', '🍕 Еда', '💻 Коворкинг'];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', age: '', bio: '', interests: [] });
  const navigate = useNavigate();

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(prev => prev + 1);
    else navigate('/');
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="absolute inset-0 z-[1000] theme-bg flex flex-col px-8 pt-20 pb-12 overflow-hidden">
      {/* Прогресс-бар сверху */}
      <div className="flex gap-2 mb-12">
        {STEPS.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 'bg-white/10'}`} />
        ))}
      </div>

      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="flex flex-col h-full"
          >
            <h1 className="text-4xl font-black text-white mb-2 tracking-tighter drop-shadow-xl">
              {STEPS[currentStep].title}
            </h1>
            <p className="text-white/40 font-medium mb-12">
              {STEPS[currentStep].sub}
            </p>

            {/* Контент шагов */}
            <div className="flex-1">
              {currentStep === 0 && (
                <div className="flex flex-col items-center justify-center h-48">
                  <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center animate-pulse border border-primary/30 shadow-[0_0_40px_rgba(139,92,246,0.2)]">
                    <Sparkles className="text-primary" size={40} />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <input
                    placeholder="Твоё имя"
                    className="glass-input w-full p-5 rounded-[24px] text-lg"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Возраст"
                    className="glass-input w-full p-5 rounded-[24px] text-lg"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div className="flex flex-wrap gap-3">
                  {INTERESTS_LIST.map(item => (
                    <button
                      key={item}
                      onClick={() => toggleInterest(item)}
                      className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
                        formData.interests.includes(item)
                          ? 'bg-primary text-white shadow-lg'
                          : 'glass-panel text-white/40'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}

              {currentStep === 3 && (
                <div className="flex flex-col items-center gap-6">
                  <div className="w-40 h-40 rounded-full glass-panel border-dashed border-2 border-white/20 flex flex-col items-center justify-center gap-2 text-white/30 cursor-pointer hover:border-primary/50 transition-colors">
                    <Camera size={32} />
                    <span className="text-[10px] font-black uppercase">Выбрать фото</span>
                  </div>
                  <textarea
                    placeholder="Пара слов о себе..."
                    className="glass-input w-full p-5 rounded-[24px] text-base h-24 resize-none"
                  />
                </div>
              )}
            </div>

            {/* Кнопка "Далее" */}
            <button
              onClick={nextStep}
              disabled={currentStep === 1 && (!formData.name || !formData.age)}
              className="w-full py-5 rounded-[28px] bg-primary text-white font-black text-lg shadow-[0_15px_30px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-20"
            >
              {currentStep === STEPS.length - 1 ? 'Завершить' : 'Продолжить'}
              <ChevronRight size={24} />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}