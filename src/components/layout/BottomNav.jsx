import { NavLink } from 'react-router-dom';
import { Map, MessageCircle, User, Plus, Bell } from 'lucide-react';
import clsx from 'clsx';

export default function BottomNav() {
  const handleAddClick = () => {
    const trigger = document.getElementById('trigger-create-sheet');
    if (trigger) trigger.click();
  };

  const navItems = [
    { path: '/', icon: Map },
    { path: '/chats', icon: MessageCircle },
    { path: '/add', icon: Plus, isSpecial: true },
    { path: '/notifications', icon: Bell },
    { path: '/profile', icon: User },
  ];

  return (
    // z-index: 1000 гарантирует, что меню всегда поверх тумана и контента
    <nav className="absolute bottom-8 left-0 right-0 z-[1000] px-6 flex justify-center pointer-events-none">
      <div className="glass-panel pointer-events-auto flex items-center justify-between px-2 py-2 rounded-[36px] w-full max-w-[360px]">
        {navItems.map((item) => {
          if (item.isSpecial) {
            return (
              <button 
                key="add"
                onClick={handleAddClick}
                className="mx-1 active:scale-95 transition-transform duration-200"
              >
                {/* Убрали -top-8 и сделали размер w-12 h-12. 
                  Теперь кнопка идеально вписана в строку. 
                */}
                <div className="w-12 h-12 bg-gradient-to-tr from-primary to-violet-400 rounded-[22px] flex items-center justify-center shadow-[0_8px_20px_rgba(139,92,246,0.3)] border border-white/10">
                  <Plus color="white" size={26} strokeWidth={3} />
                </div>
              </button>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => clsx(
                "p-4 rounded-full transition-all duration-300 relative flex items-center justify-center",
                isActive ? "text-white" : "text-white/25 hover:text-white/40"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon 
                    size={24} 
                    strokeWidth={isActive ? 2.5 : 2}
                    className={clsx("transition-transform duration-300", isActive && "scale-110")}
                  />
                  {isActive && (
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(139,92,246,1)]" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}