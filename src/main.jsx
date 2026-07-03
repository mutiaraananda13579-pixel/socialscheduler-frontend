// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DarkModeProvider } from './context/DarkModeContext';
import './index.css';

// 🔥🔥🔥 PAKSA GLOBAL DI PALING AWAL! 🔥🔥🔥
window.__API_URL = "https://socialscheduler-backend.up.railway.app/api";
console.log("🔥🔥🔥 FORCED FROM main.jsx:", window.__API_URL);

// 🔥 OVERRIDE AXIOS DEFAULTS DARI SINI!
import axios from 'axios';
axios.defaults.baseURL = window.__API_URL;
console.log("🔥 AXIOS DEFAULT BASEURL:", axios.defaults.baseURL);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  </React.StrictMode>
);