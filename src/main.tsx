// Purpose: React application entry point
// Responsibilities: Render App into DOM
// Public interfaces: none
// Dependencies: react, react-dom, ./App
// Related files: index.html

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
