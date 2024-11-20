// src/components/Room/RoomItem.js
import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { getCookie} from '../../../utils/cookie';
// import { RefreshToken } from '../../../utils/checkToken';
const RoomItem = ({ room }) => {
  // const [imageSrc, setImageSrc] = useState(room.image || 'https://via.placeholder.com/50');

  // useEffect(() => {
  //   if (room.image) {
  //     fetchImageWithAxios(room.image);
  //   }
  // }, [room.image]);
  // const fetchImageWithAxios = async (url) => {
  //   try {
  //     const response = await axios.get(url, {
  //       headers: {
  //         Authorization: `Bearer ${getCookie('accessToken')}`, // Thêm header Authorization
  //       },
  //       responseType: 'blob', // Định dạng phản hồi là blob
  //     });

  //     const blob = new Blob([response.data], { type: response.headers['content-type'] });
  //     setImageSrc(URL.createObjectURL(blob)); // Tạo Blob URL từ dữ liệu trả về
  //   } catch (error) {
  //     console.error('Error fetching image:', error);
  //   }
  // };
  return (
    <div className="room-item d-flex align-items-center p-2">
      {/* Hình ảnh bên trái */}
      <div className="room-image">
        <img
          src={room.image}
          alt={room.userName || 'Room Image'}
          className="img-fluid rounded-circle"
        />
      </div>

      {/* Phần nội dung bên phải */}
      <div className="room-content flex-grow-1 ms-3">
        {/* Tên người dùng hoặc tên phòng */}
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-truncate">{room.userName || room.roomName || 'Phòng chat'}</h5>
          {/* Thời gian tin nhắn */}
          <small className="text-muted">{room.lastMessageTime}</small>
        </div>

        {/* Tin nhắn cuối cùng và số lượng chưa đọc */}
        <div className="d-flex justify-content-between align-items-center mt-1">
          <p className="mb-0 text-truncate text-muted">
            {room.lastMessage}
          </p>
          {room.unreadMessagesCount > 0 && (
            <span className="badge bg-danger rounded-pill unread-count">
              {room.unreadMessagesCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomItem;
