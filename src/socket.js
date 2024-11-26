// src/socket.js
import { io } from 'socket.io-client';
import { getCookie } from './utils/cookie';
import { RefreshToken } from './utils/checkToken';
const url = require('./urls');

let socket = null; // Biến socket được khởi tạo linh hoạt

const initializeSocket = (reconnect = false) => {
  const accessToken = getCookie('accessToken'); // Lấy token từ cookie

  if (reconnect && socket) {
    socket.disconnect(); // Ngắt kết nối cũ nếu có
  }

  // Tạo kết nối mới
  socket = io(url.socketServer, {
    query: { token: accessToken },
    transports: ['websocket'],
  });

  // Xử lý lỗi kết nối
  socket.on('connect_error', async (error) => {
    console.error('Lỗi kết nối socket:', error.message);
    if (error.message === 'Token không tồn tại.' || error.message === 'Token không hợp lệ hoặc đã hết hạn.') {
      const resultRefreshToken = await RefreshToken(); // Lấy token mới
      if (resultRefreshToken.success) {
        initializeSocket(true); // Kết nối lại với token mới
      } else {
        console.error('Lỗi làm mới token, cần đăng nhập lại');
        window.location.href = '/'; // Chuyển hướng về trang login
      }
    }
  });

  return socket;
};

// Khởi tạo socket lần đầu
initializeSocket();

export { initializeSocket, socket };

