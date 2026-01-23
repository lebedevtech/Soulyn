import { User, Settings, Star, MapPin, Edit3 } from 'lucide-react';
import WebApp from '@twa-dev/sdk';

export default function ProfilePage() {
  // Данные из Телеграма или заглушка
  const user = WebApp.initDataUnsafe?.user || {
    first_name: 'Эльвир',
    photo_url: 'https://i.pravatar.cc/150?u=me',
    is_premium: true
  };

  return (
    <div className="relative w-full h-full bg-black overflow-y-auto no-scrollbar">
      {/* ФОНОВАЯ КАРТИНКА СВЕРХУ */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mask-image-gradient" />
      
      {/* ГРАДИЕНТ, чтобы текст читался */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-black/30 via-black/60 to-black" />

      {/* КОНТЕНТ (pt-32, так как тут нет фиксированной шапки, но нужно отступить от верха ТГ) */}
      <div className="relative z-10 pt-32 px-6 pb-32 flex flex-col items-center">
        
        {/* АВАТАР */}
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full border-4 border-black p-1 bg-gradient-to-br from-primary to-purple-800 shadow-2xl">
            <img src={user.photo_url} className="w-full h-full rounded-full object-cover" alt="" />
          </div>
          {user.is_premium && (
            <div className="absolute bottom-1 right-1 bg-black rounded-full p-1.5 border border-white/10">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
            </div>
          )}
        </div>

        {/* ИМЯ */}
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">{user.first_name}</h1>
        <div className="flex items-center gap-2 text-white/50 text-sm font-medium mb-8">
          <MapPin size={14} /> Москва, Патриаршие
        </div>

        {/* СТАТИСТИКА */}
        <div className="w-full grid grid-cols-3 gap-3 mb-8">
          <div className="glass-panel p-4 rounded-3xl flex flex-col items-center gap-1">
            <span className="text-2xl font-black text-white">24</span>
            <span className="text-[10px] uppercase text-white/40 tracking-wider">Импульса</span>
          </div>
          <div className="glass-panel p-4 rounded-3xl flex flex-col items-center gap-1">
            <span className="text-2xl font-black text-white">12</span>
            <span className="text-[10px] uppercase text-white/40 tracking-wider">Мэтча</span>
          </div>
          <div className="glass-panel p-4 rounded-3xl flex flex-col items-center gap-1">
            <span className="text-2xl font-black text-white">4.9</span>
            <span className="text-[10px] uppercase text-white/40 tracking-wider">Рейтинг</span>
          </div>
        </div>

        {/* МЕНЮ */}
        <div className="w-full space-y-3">
          <button className="w-full p-5 rounded-[24px] bg-white/5 border border-white/5 flex items-center gap-4 active:scale-[0.98] transition-all">
            <div className="p-2 bg-white/10 rounded-xl text-white"><Edit3 size={20} /></div>
            <span className="font-bold text-white text-lg flex-1 text-left">Редактировать профиль</span>
          </button>
          
          <button className="w-full p-5 rounded-[24px] bg-white/5 border border-white/5 flex items-center gap-4 active:scale-[0.98] transition-all">
            <div className="p-2 bg-white/10 rounded-xl text-white"><Settings size={20} /></div>
            <span className="font-bold text-white text-lg flex-1 text-left">Настройки</span>
          </button>
        </div>
      </div>
    </div>
  );
}