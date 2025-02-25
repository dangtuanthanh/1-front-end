// src/components/Room/Room.js
import React, { useState, useEffect } from 'react';
import RoomList from './RoomList';
import UserProfile from './UserProfile';
import { BsChatDots, BsGear } from 'react-icons/bs';
import { socket } from '../../../socket';
import { useSelector } from 'react-redux';

const Room = ({handleSelectView,isMobile}) => {
  const chatInfo = useSelector((state) => state.chat);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' cho Đoạn chat và 'settings' cho Cài đặt
  useEffect(() => {
    // //vào phòng chat
    // console.log('chatInfo.roomId',chatInfo.roomId);
    
    
  }, [chatInfo.roomId]);
  const renderContent = () => {
    if (activeTab === 'chat') {
      return <RoomList handleSelectView={handleSelectView} isMobile={isMobile}/>;
    } else if (activeTab === 'settings') {
      return <UserProfile />;
    }
  };

  return (
    <div className="room-container d-flex flex-column shadow p-3 ms-3 mt-3 me-3 rounded">
      {/* Nội dung chính hiển thị RoomList hoặc UserProfile */}
      <div className="room-content flex-grow-1">
        {renderContent()}
      </div>

      {/* Thanh nav ở dưới cùng */}
      <div className="room-nav d-flex justify-content-around align-items-center">
        <button
          className={`nav-button ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <BsChatDots size={24} />
          <span>Đoạn chat</span>
        </button>
        <button
          className={`nav-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <BsGear size={24} />
          <span>Cài đặt</span>
        </button>
      </div>
    </div>
  );
};

export default Room;
