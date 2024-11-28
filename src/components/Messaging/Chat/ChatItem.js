// src/components/Room/ChatItem.js
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { BsPencil, BsTrash } from 'react-icons/bs';
import axios from 'axios';
import { getCookie } from '../../../utils/cookie';
const url = require("../../../urls");
const ChatItem = ({ message, messageAction, setMessageAction, handleEditMessage,handleDeleteMessage }) => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.auth.user);
  const chatInfo = useSelector((state) => state.chat);
  const isSelected = messageAction && messageAction.messageId === message.messageId;


  return (
    <div>
      {/* Thời gian tin nhắn */}
      <div className="d-flex mt-2">
        <small className="text-muted mx-auto">{message.createdAt}</small>
      </div>
      {/* Hình ảnh bên trái */}
      {(message.senderId !== userLogin.userId) ?
        <div className='room-item '>
          <div
            className="d-flex align-items-center p-2 pt-0"
          >
            <div className="room-image"
              onClick={() => {
                alert('bật trang cá nhân')
              }}>
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
                  {message.editedAt &&
                    <i style={{ display: 'block', 
                      fontSize: '0.55em', 
                      fontWeight: 'normal' 
                    }}>Đã chỉnh sửa: {message.editedAt}</i>
                  }
                </h5>
                
              </div>
            </div>
          </div>
        </div>
        :
        <div className='room-item'>
          <div className=" d-flex align-items-center p-2 pt-0"
            onClick={() => {
              if (isSelected) {
                setMessageAction(null); // Ẩn nội dung nếu phần tử đã được chọn
              } else {
                setMessageAction(message); // Hiển thị nội dung nếu phần tử chưa được chọn
              }
            }}
          >

            {/* Phần nội dung bên trái */}
            <div className="room-content flex-grow-1 me-3">
              {isSelected &&
                <div className='d-flex justify-content-end'>
                  <button
                    className={`btn btn-primary`}
                    onClick={handleEditMessage}
                  >
                    <BsPencil size={15} />
                  </button>
                  <button
                    className={`btn btn-primary ms-2`}
                    onClick={handleDeleteMessage}
                  >
                    <BsTrash size={15} />
                  </button>
                </div>
              }

              {/* Tên người dùng hoặc tên phòng */}
              <div className="d-flex justify-content-end align-items-center">
                <h5
                  style={{ maxWidth: '80%', wordBreak: 'break-word' , textAlign: message.messageContent.length > 20 ? 'null' : 'end' }}
                  className="text-wrap">
                  {message.messageContent || 'Tin nhắn'}
                  {message.editedAt &&
                    <i style={{ display: 'block', 
                      fontSize: '0.55em', 
                      fontWeight: 'normal' 
                    }}>Đã chỉnh sửa: {message.editedAt}</i>
                  }
                </h5>

              </div>

            </div>

            {/* Hình ảnh bên phải */}
            <div className="room-image">
              <img
                src={userLogin.profilePicture}
                alt={""}
                className="img-fluid rounded-circle"
              />
            </div>


          </div>
        </div>

      }

    </div>
  );
};

export default ChatItem;
