import { User, Settings, Star, MapPin, Edit3, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export default function ProfilePage() {
  const { user, debugLogin, isLoading } = useAuth(); 
  const [testUsers, setTestUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await supabase.from('users').select('*').limit(5);
        setTestUsers(data || []);
      } catch (e) {}
    };
    fetchUsers();
  }, []);

  if (isLoading) return <div className="w-full h-full flex items-center justify-center bg-black"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <div className="p-10 text-white text-center">Профиль не найден</div>;

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col">
      {/* HEADER (FIXED at top-12) */}
      <div className="absolute top-12 left-0 right-0 h-[52px] z-50 flex items-center justify-center">
        <span className="relative z-10 text-[17px] font-bold text-white tracking-tight drop-shadow-md">Профиль</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar relative">
        {/* Фон начинается с top-0, чтобы заполнить статус-бар */}
        <div className="absolute top-0 left-0 right-0 h-96 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mask-image-gradient z-0" />
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-black/10 via-black/60 to-black z-0" />

        <div className="relative z-10 pt-32 px-6 pb-32 flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-black p-1 bg-gradient-to-br from-primary to-purple-800 shadow-2xl">
              <img src={user.avatar_url || 'https://i.pravatar.cc/300'} className="w-full h-full rounded-full object-cover" alt="" />
            </div>
            {user.is_premium && <div className="absolute bottom-1 right-1 bg-black rounded-full p-1.5 border border-white/10"><Star size={16} className="text-yellow-400 fill-yellow-400" /></div>}
          </div>

          <h1 className="text-3xl font-black text-white tracking-tight mb-2">{user.first_name}</h1>
          <div className="flex items-center gap-2 text-white/50 text-sm font-medium mb-8"><MapPin size={14} /> Москва, Патриаршие</div>

          <div className="w-full grid grid-cols-3 gap-3 mb-8">
            <div className="glass-panel p-4 rounded-3xl flex flex-col items-center gap-1"><span className="text-2xl font-black text-white">24</span><span className="text-[10px] uppercase text-white/40 tracking-wider">Импульса</span></div>
            <div className="glass-panel p-4 rounded-3xl flex flex-col items-center gap-1"><span className="text-2xl font-black text-white">12</span><span className="text-[10px] uppercase text-white/40 tracking-wider">Мэтча</span></div>
            <div className="glass-panel p-4 rounded-3xl flex flex-col items-center gap-1"><span className="text-2xl font-black text-white">4.9</span><span className="text-[10px] uppercase text-white/40 tracking-wider">Рейтинг</span></div>
          </div>

          <div className="w-full space-y-3">
            <button className="w-full p-5 rounded-[24px] bg-white/5 border border-white/5 flex items-center gap-4 active:scale-[0.98] transition-all"><div className="p-2 bg-white/10 rounded-xl text-white"><Edit3 size={20} /></div><span className="font-bold text-white text-lg flex-1 text-left">Редактировать профиль</span></button>
            <button className="w-full p-5 rounded-[24px] bg-white/5 border border-white/5 flex items-center gap-4 active:scale-[0.98] transition-all"><div className="p-2 bg-white/10 rounded-xl text-white"><Settings size={20} /></div><span className="font-bold text-white text-lg flex-1 text-left">Настройки</span></button>
          </div>

          {debugLogin && (
            <div className="w-full mt-10 border-t border-white/10 pt-6">
                <h3 className="text-white/30 font-bold uppercase text-xs mb-4 flex items-center gap-2"><Terminal size={14}/> Dev: Сменить аккаунт</h3>
                <div className="grid grid-cols-2 gap-2">
                    {testUsers.map(u => (
                        <button key={u.id} onClick={() => debugLogin(u.id)} className={clsx("p-3 rounded-xl border text-xs font-bold text-left truncate transition-colors", user.id === u.id ? "bg-primary border-primary text-white" : "bg-white/5 border-white/10 text-white/50")}>{u.first_name || 'User'}</button>
                    ))}
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}