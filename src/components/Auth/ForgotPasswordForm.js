// src/components/Auth/ForgotPasswordForm.js
import React, { useState } from 'react';
import axios from 'axios';

const url = require('../../urls');

const ForgotPasswordForm = ({ setCurrentForm, setIsRegister, setEmailCode }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        setIsRegister(false)
        try {
            const response = await axios.post(url.forgotPassword, { email });
            if (response.status === 200) {
                setEmailCode(email)
                setCurrentForm('verifyCode'); // Chuyển sang form nhập mã code
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
        <form onSubmit={handleForgotPassword} className="shadow p-3 mb-5 bg-white rounded">
            <h2 style={{ fontWeight: 'bolder' }}>Quên mật khẩu</h2>
            <p>Nhập email của bạn để nhận mã khôi phục mật khẩu</p>
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
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <button
                type="submit"
                className="btn btn-primary w-100 btn-lg"
                disabled={loading}
                style={{ fontWeight: 'bolder' }}
            >
                {loading ? 'Đang tải...' : 'Gửi mã xác thực'}
            </button>

            <div className="mt-1 d-flex justify-content-end">
                <a href="#" style={{ textDecoration: 'none' }} onClick={() => setCurrentForm('login')}>
                    Quay lại Đăng nhập
                </a>
            </div>
        </form>
    );
};

export default ForgotPasswordForm;
