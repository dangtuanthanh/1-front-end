// src/redux/slices/chatSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Initial state for chat information
const initialState = {
  roomId: null,
  email: '',
  profilePicture: '',
  userId: null,
  userName: ''
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Action to set chat information
    setChatInfo: (state, action) => {
      const { roomId, email, profilePicture, userId, userName } = action.payload;
      state.roomId = roomId;
      state.email = email;
      state.profilePicture = profilePicture;
      state.userId = userId;
      state.userName = userName;
    },
    // Action to reset chat information
    resetChatInfo: (state) => {
      state.roomId = null;
      state.email = '';
      state.profilePicture = '';
      state.userId = null;
      state.userName = '';
    }
  }
});

// Export actions for usage in components
export const { setChatInfo, resetChatInfo } = chatSlice.actions;

// Export the reducer for store configuration
export default chatSlice.reducer;
