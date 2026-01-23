import { createContext, useContext, useEffect, useState } from 'react';

const TelegramContext = createContext({});

export const TelegramProvider = ({ children }) => {
  const [webApp, setWebApp] = useState(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand(); // Разворачиваем на весь экран
      // Настраиваем цвета хедера под тему приложения
      tg.setHeaderColor('#000000'); 
      tg.setBackgroundColor('#000000');
      setWebApp(tg);
    }
  }, []);

  // Утилита для вибрации (безопасная, не упадет если мы не в ТГ)
  const haptic = {
    impact: (style = 'light') => {
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