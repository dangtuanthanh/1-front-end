// src/components/Room/ChatItem.js
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setChatInfo } from '../../../redux/slices/chatSlice';
import { useSelector } from 'react-redux';
const ChatItem = ({ message }) => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.auth.user);
  const chatInfo = useSelector((state) => state.chat);
  const [isClickToChat, setIsClickToChat] = useState(false);
  return (
    <div>
      {/* Thời gian tin nhắn */}
      <div className="d-flex mt-2">
        <small className="text-muted mx-auto">{message.createdAt}</small>
      </div>
      {/* Hình ảnh bên trái */}
      {(message.senderId !== userLogin.userId) ? <div
        className="room-item d-flex align-items-center p-2 pt-0"
        onClick={() => {
          alert("khi click")
        }}
      >
        <div className="room-image">
          <img
            src={chatInfo.profilePicture}
            alt={""}
            className="img-fluid rounded-circle"
          />
        </div>

        {/* Phần nội dung bên phải */}
        <div className="room-content flex-grow-1 ms-3">
          {/* Tên người dùng hoặc tên phòng */}
          <div className="d-flex justify-content-start align-items-center">
          <h5
                style={{ maxWidth: '80%', wordBreak: 'break-word' }}
                className="text-wrap">
                {message.messageContent || 'Tin nhắn'}
              </h5>
          </div>
        </div>
      </div> :
        <div className="room-item d-flex align-items-center p-2 pt-0"
          onClick={() => {
            alert("khi click")
          }}
        >

          {/* Phần nội dung bên phải */}
          <div className="room-content flex-grow-1 me-3">
            {/* Tên người dùng hoặc tên phòng */}
            <div className="d-flex justify-content-end align-items-center">
              <h5
                style={{ maxWidth: '80%', wordBreak: 'break-word' }}
                className="text-wrap">
                {message.messageContent || 'Tin nhắn'}
              </h5>

            </div>
          </div>
          {/* Hình ảnh bên trái */}
          <div className="room-image">
            <img
              src={userLogin.profilePicture}
              alt={""}
              className="img-fluid rounded-circle"
            />
          </div>


        </div>
      }
    </div>
  );
};

export default ChatItem;
