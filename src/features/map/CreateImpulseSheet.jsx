import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase'; // Проверь, что путь правильный: выход на 2 уровня вверх
import WebApp from '@twa-dev/sdk';
import clsx from 'clsx';

export default function CreateImpulseSheet({ isOpen, onClose }) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Обработчик отправки
  const handleCreate = async () => {
    if (!message.trim()) return;
    
    setIsSending(true);

    // 1. Пытаемся достать данные из Телеграма
    const tgUser = WebApp.initDataUnsafe?.user;

    // 2. Формируем данные
    const userData = {
      username: tgUser?.first_name || 'Эльвир (Browser)',
      avatar_url: tgUser?.photo_url || `https://i.pravatar.cc/150?u=${Math.random()}`,
      is_premium: tgUser?.is_premium || false, 
      tg_id: tgUser?.id || null
    };

    const newImpulse = {
      lat: 55.7558 + (Math.random() - 0.5) * 0.02,
      lng: 37.6173 + (Math.random() - 0.5) * 0.02,
      message: message,
      username: userData.username,
      avatar_url: userData.avatar_url,
      category: 'vip',
      venue_name: 'Simach',
      is_premium: userData.is_premium,
      user_id: userData.tg_id 
    };

    // 3. Отправляем в Supabase
    const { error } = await supabase
      .from('impulses')
      .insert([newImpulse]);

    setIsSending(false);

    if (error) {
      console.error('Ошибка отправки:', error);
      alert('Не удалось создать импульс');
    } else {
      setMessage('');
      onClose(); // Закрываем шторку
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Фон-затемнение */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Шторка */}
          <motion.div 
            initial={{ y: "100%" }} 
            animate={{ y: 0 }} 
            exit={{ y: "100%" }}
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
                placeholder="Например: Кто на кофе в Dr. Живаго?"
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
                  <>
                    Опубликовать <Send size={20} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}