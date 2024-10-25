// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import roomReducer from './slices/roomSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomReducer,
  },
});

export default store;
