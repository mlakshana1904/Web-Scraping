import React, { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('webscrapex_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('webscrapex_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-outline-secondary border-0 text-muted p-2 d-flex align-items-center justify-content-center"
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
      style={{ borderRadius: '50%', width: 40, height: 40 }}
    >
      {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} className="text-warning" />}
    </button>
  );
}
