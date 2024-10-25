// src/redux/slices/roomSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';
import axios from 'axios';
const url = require("../../urls");

// Khởi tạo kết nối socket
const socket = io(url.socketServer); // Địa chỉ back-end của bạn

const roomSlice = createSlice({
  name: 'rooms',
  initialState: {
    rooms: [],
    messages: {},
    activeRoomId: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Đặt danh sách phòng chat
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
    // Đặt danh sách tin nhắn của phòng
    setMessages: (state, action) => {
      const { roomId, messages } = action.payload;
      state.messages[roomId] = messages;
    },
    // Đặt phòng chat đang hoạt động
    setActiveRoom: (state, action) => {
      state.activeRoomId = action.payload;
    },
    // Thêm tin nhắn mới vào phòng
    addMessage: (state, action) => {
      const { roomId, message } = action.payload;
      if (state.messages[roomId]) {
        state.messages[roomId].push(message);
      } else {
        state.messages[roomId] = [message];
      }
    },
    // Thêm phòng chat mới
    addRoom: (state, action) => {
      state.rooms.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setRooms,
  setMessages,
  setActiveRoom,
  addMessage,
  addRoom,
  setLoading,
  setError,
} = roomSlice.actions;

export default roomSlice.reducer;

// Thunk action để lấy danh sách phòng chat từ API
export const fetchRooms = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(url.getUserRooms);
    
    if (response.status === 200) {
      dispatch(setRooms(response.data));
    } else {
      dispatch(setError(response.data.message || 'Có lỗi xảy ra.'));
    }
  } catch (error) {
    dispatch(setError(error.response?.data.message || error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk action để lấy danh sách tin nhắn theo phòng từ API
export const fetchMessages = (roomId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(url.getMessagesByRoomId(roomId));
    
    if (response.status === 200) {
      dispatch(setMessages({ roomId, messages: response.data }));
    } else {
      dispatch(setError(response.data.message || 'Có lỗi xảy ra.'));
    }
  } catch (error) {
    dispatch(setError(error.response?.data.message || error.message));
  } finally {
    dispatch(setLoading(false));
  }
};


// Thêm lắng nghe socket cho sự kiện tin nhắn mới
export const listenForMessages = (roomId) => (dispatch) => {
  socket.emit('joinRoom', roomId); // Tham gia phòng chat

  socket.on('receiveMessage', (message) => {
    dispatch(addMessage({ roomId, message }));
  });

  socket.on('messageEdited', (editedMessage) => {
    // Có thể xử lý cập nhật tin nhắn khi nhận được tín hiệu 'messageEdited'
  });

  socket.on('messageDeleted', (deletedMessageId) => {
    // Có thể xử lý xóa tin nhắn khi nhận được tín hiệu 'messageDeleted'
  });
};
