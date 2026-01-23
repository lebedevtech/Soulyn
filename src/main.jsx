import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { TelegramProvider } from './context/TelegramContext'; // Импорт

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TelegramProvider> {/* Оборачиваем самым первым */}
      <AuthProvider>
        <LocationProvider>
          <App />
        </LocationProvider>
      </AuthProvider>
    </TelegramProvider>
  </React.StrictMode>,
);