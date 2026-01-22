import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import clsx from 'clsx';

export default function Layout() {
  const location = useLocation();
  const isMapPage = location.pathname === '/';

  return (
    <div className="h-full w-full relative overflow-hidden bg-black">
      <main className={clsx(
        "absolute inset-0 w-full h-full overflow-y-auto no-scrollbar scroll-smooth",
        // Для всех страниц кроме карты даем отступ снизу
        !isMapPage && "pb-44" 
      )}>
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}