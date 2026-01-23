import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext'; // Импортируем хук
import clsx from 'clsx';

export default function CreateImpulseSheet({ isOpen, onClose }) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  // Получаем реального пользователя из базы!
  const { user } = useAuth(); 

  const handleCreate = async () => {
    if (!message.trim() || !user) return; // Если юзер не загрузился, не даем создать
    
    setIsSending(true);

    const newImpulse = {
      user_id: user.id, // НАСТОЯЩИЙ UUID ИЗ БАЗЫ
      lat: 55.7558 + (Math.random() - 0.5) * 0.02, // Пока рандом, GPS добавим следующим шагом
      lng: 37.6173 + (Math.random() - 0.5) * 0.02,
      message: message,
      // В будущем тут будет выбор заведения (venue_id)
      is_ghost: false 
    };

    const { error } = await supabase
      .from('impulses')
      .insert([newImpulse]);

    setIsSending(false);

    if (error) {
      console.error('Ошибка отправки:', error);
      alert('Ошибка');
    } else {
      setMessage('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 z-50 bg-[#121212] rounded-t-[40px] border-t border-white/10 p-6 pb-12"
          >
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-white tracking-tight">Создать импульс</h2>
              <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-white/40">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Что делаем, ${user?.first_name}?`} // Персонализация
                className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-5 text-white placeholder:text-white/20 resize-none focus:outline-none focus:border-primary/50 text-lg font-medium"
              />
              
              <button 
                onClick={handleCreate}
                disabled={isSending}
                className={clsx(
                  "w-full py-4 rounded-3xl flex items-center justify-center gap-2 font-bold text-lg transition-all active:scale-[0.98]",
                  isSending ? "bg-white/10 text-white/50" : "bg-primary text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                )}
              >
                {isSending ? 'Публикация...' : (
                  <>Опубликовать <Send size={20} /></>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}