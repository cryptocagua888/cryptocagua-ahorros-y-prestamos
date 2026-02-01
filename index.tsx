import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const loader = document.getElementById('loading-screen');

if (container) {
  try {
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Ocultar cargador con un ligero retraso para suavidad tras el montaje
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (loader) {
          loader.style.opacity = '0';
          setTimeout(() => {
            loader.style.display = 'none';
          }, 400);
        }
      }, 800);
    });
  } catch (error) {
    console.error("Error al iniciar React:", error);
    const display = document.getElementById('error-display');
    if (display) {
      display.style.display = 'block';
      display.innerText = "Error Fatal al Iniciar la Aplicación:\n" + (error instanceof Error ? error.stack : String(error));
    }
  }
}