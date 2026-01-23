import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Инициализация (как и была)
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const userData = await authService.loginOrRegister();
      setUser(userData);
      setIsLoading(false);
    };
    initAuth();
  }, []);

  // DEV ФУНКЦИЯ: Смена аккаунта
  const debugLogin = async (userId) => {
    setIsLoading(true);
    // Ищем пользователя по ID или создаем фейкового
    let { data } = await supabase.from('users').select('*').eq('id', userId).single();
    
    // Если такого нет (например, тестовый), создадим на лету для удобства
    if (!data) {
        // Это просто для тестов, в проде так не делать
        console.warn("Тестовый юзер не найден, переключаюсь на Mock");
    }
    
    if (data) setUser(data);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, debugLogin }}>
      {isLoading ? (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
          <h1 className="text-4xl font-black text-white tracking-tighter mb-4 animate-pulse">Soulyn</h1>
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);