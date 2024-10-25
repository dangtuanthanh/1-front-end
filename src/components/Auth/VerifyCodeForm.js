// src/components/Auth/VerifyCodeForm.js
import React, { useState } from 'react';
import axios from 'axios';

const url = require('../../urls');

const VerifyCodeForm = ({ setCurrentForm, isRegister, email }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isRegister) {
        const response = await axios.post(url.verifyCode, { email, code });
        if (response.status === 200) {
          setSuccess('Xác thực thành công! Vui lòng chờ ...');
          setTimeout(() => {
            setCurrentForm('login'); // Chuyển về form đăng nhập sau khi xác thực thành công
          }, 2000);
        }
      } else {
        const response = await axios.post(url.verifyResetCode, { email, code }, { 
          withCredentials: true   // Bật cookie khi gửi request
        });
        if (response.status === 200) {
          setCurrentForm('resetPassword');
        }
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
    <form onSubmit={handleVerify} className="shadow p-3 mb-5 bg-white rounded">
      <h2 style={{ fontWeight: 'bolder' }}>Xác thực mã</h2>
      <p>Nhập mã code đã được gửi tới email: {email}</p>
      <div className="mb-3 mt-2">
        <input
          style={{ border: 'gray 1px solid' }}
          autoFocus
          type="text"
          className="form-control-lg w-100"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          placeholder="Mã Xác Thực"
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message" style={{ color: 'darkgreen' }}>{success}</p>}
      <button
        type="submit"
        className="btn btn-primary w-100 btn-lg"
        disabled={loading}
        style={{ fontWeight: 'bolder' }}
      >
        {loading ? 'Đang tải...' : 'Xác thực'}
      </button>
      {
        isRegister ? 
        <div className="mt-1 d-flex justify-content-end">
          <a href="#" style={{ textDecoration: 'none' }} onClick={() => setCurrentForm('register')}>
            Quay lại Đăng ký
          </a>
        </div>
        : 
        <div className="mt-1 d-flex justify-content-end">
          <a href="#" style={{ textDecoration: 'none' }} onClick={() => setCurrentForm('forgotPassword')}>
            Quay lại Nhập Email
          </a>
        </div>
      }

    </form>
  );
};

export default VerifyCodeForm;
