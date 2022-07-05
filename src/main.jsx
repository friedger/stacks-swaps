import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap';
import 'bootstrap/js/dist/alert';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/style.css';
import './styles/floating-label.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
