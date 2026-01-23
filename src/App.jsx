import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import WebApp from '@twa-dev/sdk'; 
import { AuthProvider } from './context/AuthContext'; // Импорт провайдера

// Страницы
import MapPage from './pages/MapPage';
import ChatPage from './pages/ChatPage'; 
import ChatDetailPage from './pages/ChatDetailPage'; 
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';

// Компоненты
import BottomNav from './components/layout/BottomNav';
import CreateImpulseSheet from './features/map/CreateImpulseSheet';

export default function App() {
  const location = useLocation();
  const isDetailChat = location.pathname.startsWith('/chat/');
  
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    if (WebApp.initData) {
      setIsInTelegram(true);
      WebApp.ready();
      try { WebApp.requestFullscreen(); } catch (e) {}
      try { WebApp.disableVerticalSwipes(); } catch (e) {}
      WebApp.setHeaderColor('#000000');
      WebApp.setBackgroundColor('#000000');
      WebApp.expand();
    }
  }, []);

  const wrapperClass = isInTelegram 
    ? "fixed inset-0 w-full h-full bg-black overflow-hidden" 
    : "phone-frame overflow-hidden m-10"; 

  return (
    // ОБОРАЧИВАЕМ ВСЁ В AUTH PROVIDER
    <AuthProvider>
      <div className={wrapperClass}>
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
    </AuthProvider>
  );
}