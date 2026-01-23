import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import WebApp from '@twa-dev/sdk'; 
import MapPage from './pages/MapPage';
import ChatPage from './pages/ChatPage'; 
import ChatDetailPage from './pages/ChatDetailPage'; 
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import BottomNav from './components/layout/BottomNav';
import CreateImpulseSheet from './features/map/CreateImpulseSheet';

export default function App() {
  const location = useLocation();
  const isDetailChat = location.pathname.startsWith('/chat/');
  
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    // Проверка: мы в Телеграме?
    if (WebApp.initData) {
      setIsInTelegram(true);
      WebApp.ready();
      
      // 1. ВКЛЮЧАЕМ ПОЛНОЭКРАННЫЙ РЕЖИМ (Премиум фича)
      try {
        WebApp.requestFullscreen(); 
      } catch (e) {
        console.log('Fullscreen not supported in this version');
      }

      // 2. Блокируем свайп закрытия (чтобы карта не закрывалась случайно)
      try {
        WebApp.disableVerticalSwipes(); 
      } catch (e) {
        console.log('Vertical swipes disable not supported');
      }

      // 3. Красим шапку
      WebApp.setHeaderColor('#000000');
      WebApp.setBackgroundColor('#000000');
      WebApp.expand(); // На всякий случай для старых клиентов
    }
  }, []);

  // КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ:
  // Вместо JS-высоты используем 'fixed inset-0' для Телеграма.
  // Это растягивает приложение на 100% без вариантов.
  const wrapperClass = isInTelegram 
    ? "fixed inset-0 w-full h-full bg-black overflow-hidden" 
    : "phone-frame overflow-hidden m-10"; // m-10 чтобы на компе не прилипало к краю

  return (
    <div className={wrapperClass}>
      {/* Notch только для браузера */}
      {!isInTelegram && (
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black z-[3000] rounded-b-2xl" />
      )}
      
      <div className="relative w-full h-full bg-black overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<MapPage />} />
            <Route path="/chats" element={<ChatPage />} />
            <Route path="/chat/:id" element={<ChatDetailPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </AnimatePresence>

        <CreateImpulseSheet 
          isOpen={isCreateOpen} 
          onClose={() => setIsCreateOpen(false)} 
        />
      </div>
      
      {!isDetailChat && (
        <BottomNav onCreateClick={() => setIsCreateOpen(true)} />
      )}
    </div>
  );
}