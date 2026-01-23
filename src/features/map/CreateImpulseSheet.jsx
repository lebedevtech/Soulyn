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
  
  // Состояния
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false); // Глобальное состояние шторки

  useEffect(() => {
    // Инициализация Telegram Mini App
    if (WebApp.initData) {
      setIsInTelegram(true);
      WebApp.ready();
      WebApp.expand();
      WebApp.setHeaderColor('#000000');
      WebApp.setBackgroundColor('#000000');
    }
  }, []);

  const wrapperClass = isInTelegram 
    ? "relative w-full h-screen bg-black overflow-hidden" 
    : "phone-frame overflow-hidden";

  return (
    <div className={wrapperClass}>
      {/* Декоративный вырез (Notch) только для браузера */}
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

        {/* Глобальная шторка создания импульса */}
        <CreateImpulseSheet 
          isOpen={isCreateOpen} 
          onClose={() => setIsCreateOpen(false)} 
        />
      </div>
      
      {/* Нижнее меню с передачей обработчика клика на Плюс */}
      {!isDetailChat && (
        <BottomNav onCreateClick={() => setIsCreateOpen(true)} />
      )}
    </div>
  );
}