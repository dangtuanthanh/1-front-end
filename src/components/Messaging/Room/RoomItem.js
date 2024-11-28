// src/components/Room/RoomItem.js
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setChatInfo } from '../../../redux/slices/chatSlice';
import { useSelector } from 'react-redux';
const RoomItem = ({ room, handleSelectView, isMobile }) => {
  const dispatch = useDispatch();
  const chatInfo = useSelector((state) => state.chat);
  return (
    <div className="room-item d-flex align-items-center p-2"
      onClick={() => {
        dispatch(setChatInfo({
          roomId: room.roomId,
          profilePicture: room.image,
          userName: room.userName,
          email: room.email
        }));
        console.log('isMobile',isMobile);
        
        if (isMobile)
          handleSelectView()
      }}


    >
      {/* Hình ảnh bên trái */}
      <div div className="room-image" >
        <img
          src={room.image}
          alt={room.userName || 'Room Image'}
          className="img-fluid rounded-circle"
        />
      </div >

      {/* Phần nội dung bên phải */}
      < div className="room-content flex-grow-1 ms-3" >
        {/* Tên người dùng hoặc tên phòng */}
        <div div className="d-flex justify-content-between align-items-center" >
          <h5 className="mb-0 text-truncate">{room.userName || room.roomName || 'Phòng chat'}</h5>
          {/* Thời gian tin nhắn */}
          <small className="text-muted">{room.lastMessageTime}</small>
        </div >

        {/* Tin nhắn cuối cùng và số lượng chưa đọc */}
        <div div className="d-flex justify-content-between align-items-center mt-1" >
          <p className="mb-0 text-truncate text-muted">
            {room.lastMessage}
          </p>
          {
            (room.unreadMessagesCount > 0 && chatInfo.roomId != room.roomId) && (
              <span className="badge bg-danger rounded-pill unread-count">
                {room.unreadMessagesCount}
              </span>
            )
          }
        </div >
      </div >
    </div >
  );
};

export default RoomItem;
