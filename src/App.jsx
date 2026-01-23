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
  
  // Добавляем состояние высоты
  const [appHeight, setAppHeight] = useState('100%');

  useEffect(() => {
    if (WebApp.initData) {
      setIsInTelegram(true);
      WebApp.ready();
      WebApp.expand();
      WebApp.setHeaderColor('#000000');
      WebApp.setBackgroundColor('#000000');

      // ФИКС ВЫСОТЫ ДЛЯ iOS
      // Телеграм иногда не сразу дает правильную высоту, поэтому ставим таймер
      const fixHeight = () => {
        // viewportStableHeight - это самая надежная высота в ТГ
        const h = WebApp.viewportStableHeight || window.innerHeight;
        setAppHeight(`${h}px`);
      };

      fixHeight();
      // Слушаем изменение размера (например, клавиатура выехала)
      WebApp.onEvent('viewportChanged', fixHeight);

      return () => {
        WebApp.offEvent('viewportChanged', fixHeight);
      };
    }
  }, []);

  // Если мы в ТГ, применяем жесткую высоту. Если нет - iPhone фрейм.
  const wrapperStyle = isInTelegram ? { height: appHeight } : {};
  const wrapperClass = isInTelegram 
    ? "relative w-full bg-black overflow-hidden" // Убрали h-screen
    : "phone-frame overflow-hidden";

  return (
    <div className={wrapperClass} style={wrapperStyle}>
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