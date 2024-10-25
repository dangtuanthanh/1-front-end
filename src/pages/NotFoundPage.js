// src/pages/NotFoundPage.js
import React , {useEffect } from 'react';
import notFoundImage from '../assets/images/404.png';
import { loadAndApplyTheme } from '../utils/themeUtils';
import  ThemeSelector  from '../components/ThemeSelector';
const NotFoundPage = () => {
  useEffect(() => {
    loadAndApplyTheme(); // Kiểm tra và áp dụng giao diện khi trang được tải
  }, []);
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">Ố Ồ!</h1>
      <p className="notfound-description">Xin lỗi, chúng tôi không tìm thấy gì ngoài cái nịt ở trang này.</p>
      <a href="/" className="btn btn-primary notfound-btn">Quay về Trang Chủ</a>
      <ThemeSelector/>
      <img src={notFoundImage} alt="Not Found" className="notfound-image" />
    </div>
  );
};

export default NotFoundPage;
