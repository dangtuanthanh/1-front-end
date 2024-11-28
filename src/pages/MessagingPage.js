// src/pages/MessagingPage.js
import React, { useState, useEffect } from 'react';
import Room from '../components/Messaging/Room/Room';
import ChatList from '../components/Messaging/Chat/ChatList';
import { loadAndApplyTheme } from '../utils/themeUtils';
import { CheckToken } from '../utils/checkToken';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
const MessagingPage = () => {
  const [currentView, setCurrentView] = useState('room'); // 'room' cho danh sách phòng, 'chat' cho danh sách tin nhắn
  const [selectedRoom, setSelectedRoom] = useState(false); // Phòng đã chọn
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();  // Sử dụng useDispatch tại đây
  // Xử lý responsive
  useEffect(() => {
    const verifyToken = async () => {
      const result = await CheckToken();  // Gọi hàm checkToken

      if (!result.success) {
        navigate('/');  // Điều hướng nếu token không hợp lệ
      } else {
        // Dispatch thông tin người dùng nếu token hợp lệ
        if (result.user) {
          dispatch(login({ user: result.user }));
        }
        setLoading(false);  // Tắt trạng thái loading khi đã xong
      }
    };

    verifyToken();  // Gọi hàm kiểm tra token
    loadAndApplyTheme();  // Áp dụng giao diện khi trang được tải

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Thiết lập giá trị ban đầu
    return () => window.removeEventListener('resize', handleResize);


  }, [navigate, dispatch]);

  // Hàm chọn phòng hoặc người dùng
  const handleSelectView = () => {
    if (currentView === 'chat')
      setCurrentView('room')
    else setCurrentView('chat')

  };
  if (loading) {
    return <div>Vui lòng chờ...</div>;  // Hiển thị loading trong khi chờ kết quả từ checkToken
  }
  return (
    <div className="container-fluid h-100 messaging-page">
      <div className="row h-100">
        {/* Giao diện máy tính và máy tính bảng */}
        {!isMobile ? (
          <>
            {/* Phần bên trái: Room */}
            <div className="col-5 p-0">
              <Room />
            </div>
            {/* Phần bên phải: ChatList */}
            <div className="col-7 p-0">
              <ChatList />
            </div>
          </>
        ) : (
          // Giao diện điện thoại
          <>
            {currentView === 'room' ? (
              // Hiển thị Room trên điện thoại
              <div className="col-12 p-0">
                <Room
                  handleSelectView={handleSelectView}
                  isMobile={isMobile}
                />
              </div>
            ) : (
              // Hiển thị ChatList khi đã chọn phòng trên điện thoại
              <div className="col-12 p-0">
                <ChatList
                  handleSelectView={handleSelectView}
                  isMobile={isMobile}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MessagingPage;
