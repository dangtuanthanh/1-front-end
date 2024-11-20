// src/components/Room/RoomList.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshToken } from '../../../utils/checkToken';
import axios from 'axios';
import UserSearch from './UserSearch';
import RoomItem from './RoomItem';
import { BsArrowLeft } from 'react-icons/bs';
import { getCookie } from '../../../utils/cookie';
import socket from '../../../socket';

const url = require("../../../urls");

const RoomList = () => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [rooms, setRooms] = useState([]); // State lưu danh sách phòng chat
  const [title, setTitle] = useState();
  const accessToken = getCookie('accessToken');

  // Hàm lấy danh sách phòng chat người dùng từ API
  const fetchUserRooms = async (isRetry = false) => {
    try {
      setTitle();
      const response = await axios.get(url.getUserRooms, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        setRooms(response.data.rooms);
      }
    } catch (error) {
      if (error.status === 404) {
        setTitle('Để bắt đầu, hãy tìm kiếm một người dùng')
      } else if ((error.response.status === 401 || error.response.status === 403) && !isRetry) {
        const resultRefreshToken = await RefreshToken();
        if (resultRefreshToken.success) {
          return fetchUserRooms(true);
        } else navigate('/');
      }
    }
  };

  // Kết nối socket và lắng nghe sự kiện 'updateRoomList'
  useEffect(() => {
    // Lấy danh sách phòng lần đầu khi component được tải
    fetchUserRooms();

    // Kết nối tới server socket

    // Lắng nghe sự kiện 'updateRoomList' để cập nhật lại danh sách phòng
    socket.on('updateRoomList', () => {
      fetchUserRooms();
    });

    // Đóng kết nối socket khi component bị unmount
    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  // Hàm để xử lý khi nhấn nút quay lại
  const handleBackClick = () => {
    setIsSearching(false);
    setSearchText('');
  };
  const inputRef = useRef();
  return (
    <div className="room-list-container">
      {/* Tiêu đề */}
      <h1 className="room-list-title">Đoạn chat</h1>

      {/* Thanh tìm kiếm */}
      <div className="search-bar">
        {isSearching && (
          <button className="back-button" onClick={handleBackClick}>
            <BsArrowLeft size={20} />
          </button>
        )}
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm người dùng..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => setIsSearching(true)}
          ref={inputRef}
        />
        {
          searchText &&
          <button
            className="btn btn-close"
            // style={{ color: 'red', marginLeft: '4px', marginTop: '10px' }}
            onClick={() => {
              setSearchText('');
              inputRef.current.focus();
            }}
          >
          </button>
        }
      </div>

      {/* Nội dung chính */}
      <div className="room-list-content">
        {isSearching ? (
          <UserSearch searchText={searchText} />
        ) : title ? <h5 className='text-center text-secondary'>
          {title}
        </h5> : (
          rooms.map((room) => (
            <RoomItem
              key={room.roomId}
              room={room}
            // roomName={room.roomName}
            // unreadMessagesCount={room.unreadMessagesCount}
            // lastMessageTime={room.lastMessageTime}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RoomList;
