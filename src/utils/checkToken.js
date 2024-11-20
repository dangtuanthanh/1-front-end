import axios from 'axios';
import { getCookie, setCookie } from '../utils/cookie';

const url = require('../urls');

const CheckToken = async () => {
    try {
        const response = await axios.post(
            url.checkToken,
            {}, // Body request trống vì chỉ cần header
            {
                headers: {
                    'Authorization': getCookie('accessToken') // Truyền token vào header
                }
            }
        );

        if (response.status === 200) {
            return { success: true, user: response.data.user }; // Trả về kết quả và dữ liệu người dùng
        }
    } catch (err) {
        if (err.response) {
            if (err.response.status === 400 || err.response.status === 401) {
                const result = await RefreshToken();

                if (!result.success) {
                    return { success: false };
                } else {
                    return { success: true, user: result.user };
                }

            } else if (err.response.status === 500) {
                return { success: false };
            }
        } else {
            return { success: false };
        }
    }
    return { success: false }; // Mặc định trả về false nếu có lỗi
};

const RefreshToken = async () => {
    try {
        const response = await axios.post(url.refreshToken, {}, { withCredentials: true });
        if (response.status === 200) {
            setCookie('accessToken', response.data.accessToken, 15);
            return { success: true, user: response.data.user };
        }
    } catch (err) {
        if (err.response) {
            if (err.response.status === 400 || err.response.status === 500) {
                return { success: false };
            }
        }
        return { success: false };
    }
};

export { CheckToken, RefreshToken };
