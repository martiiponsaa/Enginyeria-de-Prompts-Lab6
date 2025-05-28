import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/habits.css';
import './styles/stats.css';
import './styles/home.css';
import './styles/about.css';
import './styles/charts.css';
import './styles/stats-charts.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
