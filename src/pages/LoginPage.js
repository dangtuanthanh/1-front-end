// src/pages/LoginPage.js
import React, { useEffect, useState } from 'react';
import { loadAndApplyTheme } from '../utils/themeUtils';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';
import VerifyCodeForm from '../components/Auth/VerifyCodeForm';
import ForgotPasswordForm from '../components/Auth/ForgotPasswordForm';
import ResetPasswordForm from '../components/Auth/ResetPasswordForm';
import Logo from '../assets/images/Logo.jpg';
import { CheckToken } from '../utils/checkToken';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
const LoginPage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();  // Sử dụng useDispatch tại đây
  useEffect(() => {
    const verifyToken = async () => {
      const result = await CheckToken();  // Gọi hàm checkToken
      if (!result.success) {
        setLoading(false);   // Điều hướng nếu token không hợp lệ
      } else {
        // Dispatch thông tin người dùng nếu token hợp lệ
        if (result.user) {
          dispatch(login({ user: result.user }));
          navigate('/rooms'); 
        }
        setLoading(false);  // Tắt trạng thái loading khi đã xong
      }
    };

    verifyToken();  // Gọi hàm kiểm tra token
    loadAndApplyTheme(); // Kiểm tra và áp dụng giao diện khi trang được tải
  }, [navigate, dispatch]);
  const [currentForm, setCurrentForm] = useState('login'); // 'login', 'register', 'forgotPassword', 'verifyCode', 'resetPassword'
  const [emailCode, setEmailCode] = useState();
  const [isRegister, setIsRegister] = useState(true);
  const renderForm = () => {
    switch (currentForm) {
      case 'login':
        return <LoginForm setCurrentForm={setCurrentForm} />;
      case 'register':
        return <RegisterForm setCurrentForm={setCurrentForm} setIsRegister={setIsRegister} setEmailCode={setEmailCode} />;
      case 'forgotPassword':
        return <ForgotPasswordForm setCurrentForm={setCurrentForm} setIsRegister={setIsRegister} setEmailCode={setEmailCode} />;
      case 'verifyCode':
        return <VerifyCodeForm setCurrentForm={setCurrentForm} isRegister={isRegister} email={emailCode} />;
      case 'resetPassword':
        return <ResetPasswordForm setCurrentForm={setCurrentForm} />;
      default:
        return <LoginForm setCurrentForm={setCurrentForm} />;
    }
  };
  if (loading) {
    return <div>Vui lòng chờ...</div>;  // Hiển thị loading trong khi chờ kết quả từ checkToken
  }
  return (
    <div className="auth-page">
      {/* Bên trái: Logo */}
      <div className="auth-page-logo">
        <img src={Logo} alt="Logo" />
      </div>
      {/* Bên phải: Form */}
      <div className="auth-form">
        {renderForm()}
      </div>
    </div>
  );
};

export default LoginPage;
