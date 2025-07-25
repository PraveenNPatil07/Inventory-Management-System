import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // This is where you put your global and auth-specific CSS
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App /> {/* BrowserRouter is now inside App.js in this simplified setup */}
  </React.StrictMode>
);