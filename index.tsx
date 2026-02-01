import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const loader = document.getElementById('loading-screen');

if (container) {
  const root = ReactDOM.createRoot(container);
  
  // Renderizado principal
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // Ocultar cargador tras el primer ciclo de renderizado para evitar parpadeos negros
  requestAnimationFrame(() => {
    setTimeout(() => {
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.display = 'none';
        }, 400);
      }
    }, 300);
  });
}