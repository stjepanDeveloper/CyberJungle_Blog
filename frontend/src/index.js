//index.js

import React from 'react';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './styles/main.css';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './components/AuthContext';
import reportWebVitals from './reportWebVitals';



// Find the element with ID 'root' and create a root.
const root = createRoot(document.getElementById('root'));

// Initial render: Render an element to the root.
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
