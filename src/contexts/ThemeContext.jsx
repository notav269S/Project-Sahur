
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('projectSahurTheme');
    return storedTheme || 'dark'; // Default to dark theme
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('projectSahurTheme', theme);

    // Apply body background pattern based on theme
    if (theme === 'light') {
      document.body.classList.add('elegant-stripes-light');
      document.body.classList.remove('elegant-stripes-dark');
    } else {
      document.body.classList.add('elegant-stripes-dark');
      document.body.classList.remove('elegant-stripes-light');
    }

  }, [theme]);

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
