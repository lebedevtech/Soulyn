import clsx from 'clsx';

export default function MobileFrame({ children }) {
  return (
    <div className="min-h-screen w-full bg-black flex justify-center items-center overflow-hidden relative">
      
      {/* Декоративный фон для ПК */}
      <div className="absolute inset-0 z-0 hidden sm:block pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-black to-[#110524]" />
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] opacity-40" />
      </div>

      {/* Рамка телефона */}
      <div className={clsx(
        "w-full h-[100dvh] z-10 relative flex flex-col transition-all duration-300", 
        "sm:h-[850px] sm:max-h-[90vh] sm:w-[400px] sm:rounded-[45px] sm:border-[8px] sm:border-[#1a1a1a] sm:shadow-[0_0_60px_rgba(0,0,0,0.5)]"
      )}>
        
        {/* Dynamic Island */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-b-[20px] z-[5000] hidden sm:block pointer-events-none border-b border-white/5">
           <div className="absolute top-[10px] right-[20px] w-2 h-2 rounded-full bg-[#1a1a1a]" />
           <div className="absolute top-[10px] left-[20px] w-1.5 h-1.5 rounded-full bg-[#050520]/80" />
        </div>

        {/* ЭКРАН ПРИЛОЖЕНИЯ */}
        <div className={clsx(
          "flex-1 w-full h-full flex flex-col theme-bg",
          "relative overflow-hidden", // КРИТИЧЕСКИ ВАЖНО: держит шторки внутри
          "sm:rounded-[36px]"
        )}>
          {children}
        </div>

      </div>
    </div>
  );
}