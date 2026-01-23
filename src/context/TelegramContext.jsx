import { createContext, useContext, useEffect, useState } from 'react';

// FIX: Безопасные значения по умолчанию, чтобы приложение не падало без контекста
const TelegramContext = createContext({
  webApp: null,
  user: null,
  haptic: {
    impact: () => console.log('Haptic impact (mock)'),
    notification: () => console.log('Haptic notification (mock)'),
    selection: () => console.log('Haptic selection (mock)'),
  }
});

export const TelegramProvider = ({ children }) => {
  const [webApp, setWebApp] = useState(null);

  useEffect(() => {
    // Проверяем наличие Telegram WebApp SDK
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand(); // Разворачиваем на весь экран
      
      try {
        tg.setHeaderColor('#000000');
        tg.setBackgroundColor('#000000');
        // Отключаем вертикальные свайпы закрытия (для полноэкранного опыта)
        if (tg.isVersionAtLeast('7.7')) {
            tg.disableVerticalSwipes();
        }
      } catch (e) {
        console.error('Error setting tg colors', e);
      }
      
      setWebApp(tg);
    }
  }, []);

  const haptic = {
    impact: (style = 'light') => {
      // Проверяем наличие webApp перед вызовом
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.impactOccurred(style);
      }
    },
    notification: (type = 'success') => {
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.notificationOccurred(type);
      }
    },
    selection: () => {
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.selectionChanged();
      }
    }
  };

  return (
    <TelegramContext.Provider value={{ webApp, user: webApp?.initDataUnsafe?.user, haptic }}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => useContext(TelegramContext);