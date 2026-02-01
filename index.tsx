import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const loader = document.getElementById('loading-screen');

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
  
  // Ocultar cargador después de montar
  if (loader) {
    loader.style.display = 'none';
  }
}