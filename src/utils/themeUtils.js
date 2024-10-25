// src/utils/themeUtils.js
export const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else if (theme === 'light') {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    } else {
      // Áp dụng theo cài đặt hệ điều hành
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDarkMode) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
      } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
      }
    }
  };
  
  export const loadAndApplyTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        console.log('có dữ liệu');
        
      applyTheme(savedTheme);
    } else {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDarkMode ? 'dark' : 'light');
    }
  };
  