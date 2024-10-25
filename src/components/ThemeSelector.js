// src/components/ThemeSelector.js
import React, { useEffect, useState } from 'react';
import { applyTheme } from '../utils/themeUtils';

const ThemeSelector = () => {
  const [theme, setTheme] = useState('system'); // 'system', 'dark', 'light'

  useEffect(() => {
    // Kiểm tra nếu người dùng đã chọn chế độ trước đó
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme('system');
      applyTheme(prefersDarkMode ? 'dark' : 'light');
    }
  }, []);

  const handleChangeTheme = (event) => {
    const selectedTheme = event.target.value;
    setTheme(selectedTheme);
    localStorage.setItem('theme', selectedTheme);
    applyTheme(selectedTheme);
  };

  return (
    <div className="theme-selector">
      <label htmlFor="theme-select">Chế độ tối</label>
      <select
        id="theme-select"
        className="form-select"
        value={theme}
        onChange={handleChangeTheme}
      >
        <option value="system">Hệ thống</option>
        <option value="dark">Bật</option>
        <option value="light">Tắt</option>
      </select>
    </div>
  );
};

export default ThemeSelector;
