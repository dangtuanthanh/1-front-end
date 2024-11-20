//src/socket.js
import { io } from 'socket.io-client';
import { getCookie } from './utils/cookie';
import { refreshToken } from './utils/checkToken';
const url = require("./urls");
const accessToken = getCookie('accessToken');
const socket = io(url.socketServer, {
  query: { token: accessToken },
  transports: ['websocket'],
});


// Lắng nghe sự kiện `connect_error` để bắt lỗi khi token không hợp lệ
socket.on('connect_error', (error) => {
  if (error.message === 'Token không tồn tại.' || error.message === 'Token không hợp lệ hoặc đã hết hạn.') {
    console.error("Lỗi kết nối:", error.message);
    // Thực hiện các hành động khi lỗi xảy ra, ví dụ: yêu cầu lấy token mới
   
  }
});
export default socket;
