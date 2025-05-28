import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import HabitsPage from './pages/HabitsPage';
import StatsPage from './pages/StatsPage';
import Navigation from './components/Navigation';
import { ThemeProvider } from './contexts/ThemeContext';
import { HabitsProvider } from './contexts/HabitsContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <HabitsProvider>
        <Router>
          <div className="app">
            <Navigation />            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/habits" element={<HabitsPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </div>
        </Router>
      </HabitsProvider>
    </ThemeProvider>
  );
};

export default App;
