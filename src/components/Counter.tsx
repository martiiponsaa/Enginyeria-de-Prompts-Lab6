import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface CounterProps {
  initialValue?: number;
}

const Counter: React.FC<CounterProps> = ({ initialValue = 0 }) => {
  const [count, setCount] = useState<number>(initialValue);
  const { theme, isDarkMode, toggleDarkMode } = useTheme();

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);
  return (
    <div className={`counter ${isDarkMode ? 'dark' : ''}`}>
      <h3>Counter: {count}</h3>
      <div className="counter-controls">
        <button onClick={decrement} style={{ backgroundColor: theme.secondaryColor }}>-</button>
        <button onClick={reset} style={{ backgroundColor: theme.secondaryColor }}>Reset</button>
        <button onClick={increment} style={{ backgroundColor: theme.primaryColor }}>+</button>
      </div>
      <div className="theme-toggle">
        <label>
          <input 
            type="checkbox" 
            checked={isDarkMode}
            onChange={toggleDarkMode}
          />
          Dark Mode
        </label>
      </div>
    </div>
  );
};

export default Counter;
