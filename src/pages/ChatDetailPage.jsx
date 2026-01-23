import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Phone, MoreVertical } from 'lucide-react';

export default function ChatDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      {/* HEADER (pt-24 - Самое важное тут) */}
      <div className="pt-24 pb-4 px-4 bg-black/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between z-30 shrink-0">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2.5 rounded-full bg-white/5 text-white active:bg-white/10 transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="font-bold text-white text-lg leading-none">Алексей</span>
          <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest mt-1">Online</span>
        </div>

        <button className="p-2.5 rounded-full bg-white/5 text-white active:bg-white/10 transition-colors">
          <Phone size={22} />
        </button>
      </div>

      {/* ОБЛАСТЬ СООБЩЕНИЙ */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Пример сообщения собеседника */}
        <div className="flex items-end gap-3 max-w-[80%]">
          <img src="https://i.pravatar.cc/150?u=1" className="w-8 h-8 rounded-full mb-1" />
          <div className="p-4 rounded-2xl rounded-bl-none bg-[#1c1c1e] text-white/90 leading-snug">
            Привет! Ты уже подошел?
            <span className="block text-[10px] text-white/30 mt-1 text-right">18:40</span>
          </div>
        </div>

        {/* Пример моего сообщения */}
        <div className="flex items-end gap-3 max-w-[80%] ml-auto flex-row-reverse">
          <div className="p-4 rounded-2xl rounded-br-none bg-primary text-white leading-snug">
            Да, паркуюсь!
            <span className="block text-[10px] text-white/40 mt-1 text-right">18:42</span>
          </div>
        </div>
      </div>

      {/* ПОЛЕ ВВОДА (Нижнее меню тут скрыто, так что прижимаем к низу) */}
      <div className="p-4 bg-black border-t border-white/10 shrink-0 mb-safe"> 
        <div className="flex items-center gap-3 bg-[#1c1c1e] p-2 pr-2 rounded-[24px]">
          <input 
            type="text" 
            placeholder="Сообщение..." 
            className="flex-1 bg-transparent text-white px-3 py-2 focus:outline-none placeholder:text-white/20"
          />
          <button className="p-3 bg-primary rounded-full text-white shadow-lg active:scale-90 transition-transform">
            <Send size={18} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}