import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import WebApp from '@twa-dev/sdk'; // Импорт SDK
import MapPage from './pages/MapPage';
import ChatPage from './pages/ChatPage'; 
import ChatDetailPage from './pages/ChatDetailPage'; 
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import BottomNav from './components/layout/BottomNav';
import clsx from 'clsx';

export default function App() {
  const location = useLocation();
  const isDetailChat = location.pathname.startsWith('/chat/');
  
  // Состояние: мы в Телеграме или в браузере?
  const [isInTelegram, setIsInTelegram] = useState(false);

  useEffect(() => {
    // Проверяем наличие объекта Telegram WebApp
    if (WebApp.initData) {
      setIsInTelegram(true);
      WebApp.ready(); // Сообщаем, что приложение загрузилось
      WebApp.expand(); // Разворачиваем на полную высоту
      
      // Красим шапку Телеграма в черный, чтобы сливалась с нашим фоном
      WebApp.setHeaderColor('#000000'); 
      WebApp.setBackgroundColor('#000000');
    }
  }, []);

  // Классы обертки: если в ТГ - полный экран, если нет - iPhone-фрейм
  const wrapperClass = isInTelegram 
    ? "relative w-full h-screen bg-black overflow-hidden" 
    : "phone-frame overflow-hidden";

  return (
    <div className={wrapperClass}>
      {/* Notch показываем только в браузере для красоты */}
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
      </div>
      
      {!isDetailChat && <BottomNav />}
    </div>
  );
}