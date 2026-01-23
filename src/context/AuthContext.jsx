import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const userData = await authService.loginOrRegister();
      setUser(userData);
      setIsLoading(false);
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {isLoading ? (
        // ЭКРАН ЗАГРУЗКИ (Splash Screen)
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