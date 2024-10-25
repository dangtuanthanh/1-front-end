// src/components/Auth/ResetPasswordForm.js
import React, { useState } from 'react';
import axios from 'axios';
const url = require('../../urls');

const ResetPasswordForm = ({ setCurrentForm }) => {
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await axios.post(url.resetPassword, { newPassword }, { 
                withCredentials: true   // Bật cookie khi gửi request
              });
            if (response.status === 200) {
                setSuccess('Đổi mật khẩu thành công! Vui lòng chờ ...');
                setTimeout(() => {
                    setCurrentForm('login'); // Chuyển về form đăng nhập sau khi xác thực thành công
                }, 2000);
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
            <h2 style={{ fontWeight: 'bolder' }}>Đổi mật khẩu</h2>
            <p>Nhập mật khẩu mới của bạn.</p>
            <div className="mb-3 mt-2">
                <input
                    style={{ border: 'gray 1px solid' }}
                    type="password"
                    className="form-control-lg w-100"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Mật Khẩu Mới"
                />
            </div>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message" style={{color:'darkgreen', fontWeight:'bolder'}}>{success}</p>}
            <button
                type="submit"
                className="btn btn-primary w-100 btn-lg"
                disabled={loading}
                style={{ fontWeight: 'bolder' }}
            >
                {loading ? 'Đang tải...' : 'Đổi mật khẩu'}
            </button>

            <div className="mt-1 d-flex justify-content-end">
                <a href="#" style={{ textDecoration: 'none' }} onClick={() => setCurrentForm('login')}>
                    Quay lại Đăng nhập
                </a>
            </div>
        </form>
    );
};

export default ResetPasswordForm;
