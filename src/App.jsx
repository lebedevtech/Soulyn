import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import WebApp from '@twa-dev/sdk'; 
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';

import MapPage from './pages/MapPage';
import ChatPage from './pages/ChatPage'; 
import ChatDetailPage from './pages/ChatDetailPage'; 
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import OnboardingPage from './pages/OnboardingPage';

import BottomNav from './components/layout/BottomNav';
import CreateImpulseSheet from './features/map/CreateImpulseSheet';
import MobileFrame from './components/layout/MobileFrame';

export default function App() {
  const location = useLocation();
  const isDetailChat = location.pathname.startsWith('/chat/');
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [createData, setCreateData] = useState(null); 

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

  const openCreateSheet = (initialData = {}) => {
    setCreateData(initialData); 
  };

  // Контент вынесен в переменную для удобства
  const content = (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<MapPage onOpenCreate={openCreateSheet} />} />
          <Route path="/chats" element={<ChatPage />} />
          <Route path="/chat/:id" element={<ChatDetailPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Routes>
      </AnimatePresence>

      <CreateImpulseSheet 
        isOpen={!!createData} 
        initialData={createData || {}} 
        onClose={() => setCreateData(null)} 
      />
      
      {!isDetailChat && (
        <BottomNav onCreateClick={() => openCreateSheet({})} />
      )}
    </div>
  );

  return (
    <AuthProvider>
      <LocationProvider>
        {isInTelegram ? (
          // Для Telegram: на весь экран
          <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
            {content}
          </div>
        ) : (
          // Для Браузера: используем рамку телефона
          <MobileFrame>
            {content}
          </MobileFrame>
        )}
      </LocationProvider>
    </AuthProvider>
  );
}