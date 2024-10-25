//RoomsPage.js
import React, { useEffect, useState } from 'react';
import { loadAndApplyTheme } from '../utils/themeUtils';
import { CheckToken } from '../utils/checkToken';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { BsChatDots, BsPerson } from 'react-icons/bs'; // Import icons
import ChatListForm from '../components/Rooms/ChatListForm';
import UserSearchForm from '../components/Rooms/UserSearchForm';
import UserAvatar from '../assets/images/LogoRemoveBackground.png'; // Hình ảnh đại diện (tạm thời dùng ảnh tĩnh)
const RoomsPage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();  // Sử dụng useDispatch tại đây

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
  }, [navigate, dispatch]);
  const [isSearching, setIsSearching] = useState(false); // Quản lý chuyển đổi giữa danh sách chat và tìm kiếm

  // Xử lý hiển thị form
  const renderForm = () => {
    if (isSearching) {
      return <UserSearchForm setIsSearching={setIsSearching} />; // Khi người dùng tìm kiếm
    }
    return <ChatListForm />; // Mặc định hiển thị danh sách phòng chat
  };
  if (loading) {
    return <div>Vui lòng chờ...</div>;  // Hiển thị loading trong khi chờ kết quả từ checkToken
  }


  return (
    <div className="rooms-page shadow p-3 mb-5 rounded">
      <div className='rooms-page-header'>
        <h1>Đoạn chat</h1>
        <div className={`search-container ${isSearching ? 'expanded' : ''}`}>
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm người dùng..."
            onFocus={() => setIsSearching(true)} // Khi nhấn vào input, mở rộng search
            onBlur={() => setIsSearching(false)} // Khi mất focus, thu nhỏ lại
          />
          <i className="search-icon" onClick={() => setIsSearching(!isSearching)}>abc</i> {/* Biểu tượng kính lúp */}
        </div>

        <div className="avatar-container">
          <img src={UserAvatar} alt="User Avatar" className="user-avatar" />
        </div>
      </div>


      {/* Nội dung chính: Form danh sách phòng chat hoặc form tìm kiếm */}
      <div className="rooms-page-content">
        {renderForm()}
      </div>
    </div>
  );
};

export default RoomsPage;
