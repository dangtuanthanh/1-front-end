// src/components/Room/RoomList.js
import React, { useState } from 'react';
import UserSearch from './UserSearch';
import { BsArrowLeft } from 'react-icons/bs';

const RoomList = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Hàm để xử lý khi nhấn nút quay lại
  const handleBackClick = () => {
    setIsSearching(false);
    setSearchText('');
  };

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
        />
      </div>

      {/* Nội dung chính */}
      <div className="room-list-content">
        {isSearching ? (
          <UserSearch searchText={searchText} />
        ) : (
          <>
            <div>danh sách phòng chat</div>
          </>
        )}
      </div>
    </div>
  );
};

export default RoomList;
