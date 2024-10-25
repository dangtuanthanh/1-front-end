// src/components/Auth/RegisterForm.js
import React, { useState } from 'react';
import axios from 'axios';

const url = require('../../urls');

const RegisterForm = ({ setCurrentForm,setIsRegister,setEmailCode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setIsRegister(true)
    try {
      const response = await axios.post(url.register, { email, password });
      if (response.status === 200) {
        setEmailCode(email)
          setCurrentForm('verifyCode'); // Chuyển sang form xác thực mã code
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

  return (
    <form onSubmit={handleRegister} className="shadow p-3 mb-5 bg-white rounded">
        <h2 style={{fontWeight:'bolder'}}>Đăng ký</h2>
        <p>Một tài khoản để kết nối với mọi người.</p>
      <div className="mb-3 mt-2">
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
      {success && <p className="success-message">{success}</p>}
      <button
        type="submit"
        className="btn btn-primary w-100 btn-lg"
        disabled={loading}
        style={{ fontWeight: 'bolder' }}
      >
        {loading ? 'Đang tải...' : 'Đăng ký'}
      </button>

      <div className="mt-1 d-flex justify-content-end">
        <a href="#" style={{ textDecoration: 'none' }} onClick={() => setCurrentForm('login')}>
          Quay lại Đăng nhập
        </a>
      </div>
    </form>
  );
};

export default RegisterForm;
