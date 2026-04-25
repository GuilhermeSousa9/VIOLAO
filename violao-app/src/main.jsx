/**
 * main.jsx
 * Ponto de entrada do ViolãoApp.
 * Monta o React no #root e importa os estilos globais.
 */

import React    from 'react';
import ReactDOM from 'react-dom/client';
import App      from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
