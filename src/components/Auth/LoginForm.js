// src/components/Auth/LoginForm.js
import React, { useState } from 'react';
// import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../redux/slices/authSlice';
import { setCookie } from '../../utils/cookie'


const url = require('../../urls');

const LoginForm = ({ setCurrentForm }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(url.login, { email, password }, { 
        withCredentials: true   // Bật cookie khi gửi request
      });
      if (response.status === 200) {
        dispatch(login({ token: response.data.accessToken }));
        setCookie('accessToken',response.data.accessToken,15)
        navigate('/rooms');
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message);
      } else {
        setError('Có lỗi xảy ra, vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đăng nhập Google
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(url.googleLogin, {
        tokenId: credentialResponse.credential,
      });
      
      if (response.status === 200) {
        dispatch(login({ user: response.data.user, token: response.data.token }));
        navigate('/rooms');
      }
    } catch (err) {
      console.error('Đăng nhập Google thất bại:', err);
      setError('Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  return (
    <form onSubmit={handleLogin} className="shadow p-3 mb-5 rounded">
      {/* Form đăng nhập thông thường */}
      <div className="mb-3">
        <input
          style={{ border: 'gray 1px solid' }}
          autoFocus
          type="email"
          className="form-control-lg w-100"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
        />
      </div>
      <div className="mb-3">
        <input
          style={{ border: 'gray 1px solid' }}
          type="password"
          className="form-control-lg w-100"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Mật Khẩu"
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <button
        type="submit"
        className="btn btn-primary w-100 btn-lg"
        disabled={loading}
        style={{ fontWeight: 'bolder'}}
      >
        {loading ? 'Đang tải...' : 'Đăng nhập'}
      </button>

      

      <div className="mt-1 d-flex justify-content-end">
        <a style={{textDecoration:'none'}} href="#" onClick={() => setCurrentForm('forgotPassword')}>Quên mật khẩu?</a>
      </div>
      <hr />
      <div className="mt-3">
        {/* <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => {
            setError('Đăng nhập Google thất bại.');
          }}
        /> */}
      </div>
      <div className="mt-3 d-flex justify-content-center">
        <button
          className="btn btn-success w-75"
          onClick={() => setCurrentForm('register')}
          style={{ fontWeight: 'bolder' }}
        >
          Tạo tài khoản mới
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
