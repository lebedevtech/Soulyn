import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MapPage from './pages/MapPage';
import ChatPage from './pages/ChatPage'; 
import ChatDetailPage from './pages/ChatDetailPage'; 
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import BottomNav from './components/layout/BottomNav';

export default function App() {
  const location = useLocation();
  const isDetailChat = location.pathname.startsWith('/chat/');

  return (
    <div className="phone-frame overflow-hidden">
      {/* Notch */}
      <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black z-[3000] rounded-b-2xl" />
      
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