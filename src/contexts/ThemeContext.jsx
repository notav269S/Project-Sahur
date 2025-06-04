import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('projectSahurTheme');
    return storedTheme || 'dark'; 
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('projectSahurTheme', theme);

    if (theme === 'light') {
      document.body.classList.add('clean-pattern-light');
      document.body.classList.remove('clean-pattern-dark');
    } else {
      document.body.classList.add('clean-pattern-dark');
      document.body.classList.remove('clean-pattern-light');
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
