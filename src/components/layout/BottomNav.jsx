import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Map, MessageCircle, Plus, Bell, User } from 'lucide-react';
import clsx from 'clsx';

export default function BottomNav({ onCreateClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Функция для проверки активности таба
  const isActive = (path) => location.pathname === path;

  return (
    <div className="absolute bottom-8 left-6 right-6 z-40 h-[72px]">
      {/* Стеклянная подложка */}
      <div className="absolute inset-0 bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-[32px] shadow-2xl" />

      <div className="relative z-10 w-full h-full flex items-center justify-between px-2">
        
        {/* КАРТА */}
        <button 
          onClick={() => navigate('/')}
          className={clsx(
            "w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300",
            isActive('/') ? "text-white bg-white/10" : "text-white/40 hover:text-white"
          )}
        >
          <Map size={24} strokeWidth={isActive('/') ? 2.5 : 2} />
        </button>

        {/* ЧАТЫ */}
        <button 
          onClick={() => navigate('/chats')}
          className={clsx(
            "w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300",
            isActive('/chats') ? "text-white bg-white/10" : "text-white/40 hover:text-white"
          )}
        >
          <MessageCircle size={24} strokeWidth={isActive('/chats') ? 2.5 : 2} />
        </button>

        {/* ГЛАВНАЯ КНОПКА СОЗДАНИЯ (ПЛЮС) */}
        <button 
          onClick={onCreateClick}
          className="w-16 h-16 -mt-8 bg-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)] border-4 border-black active:scale-90 transition-transform"
        >
          <Plus size={32} className="text-white" strokeWidth={3} />
        </button>

        {/* УВЕДОМЛЕНИЯ */}
        <button 
          onClick={() => navigate('/notifications')}
          className={clsx(
            "w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300",
            isActive('/notifications') ? "text-white bg-white/10" : "text-white/40 hover:text-white"
          )}
        >
          <Bell size={24} strokeWidth={isActive('/notifications') ? 2.5 : 2} />
        </button>

        {/* ПРОФИЛЬ */}
        <button 
          onClick={() => navigate('/profile')}
          className={clsx(
            "w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300",
            isActive('/profile') ? "text-white bg-white/10" : "text-white/40 hover:text-white"
          )}
        >
          <User size={24} strokeWidth={isActive('/profile') ? 2.5 : 2} />
        </button>
      </div>
    </div>
  );
}