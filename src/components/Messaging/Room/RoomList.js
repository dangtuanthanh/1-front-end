// src/components/Room/RoomList.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshToken } from '../../../utils/checkToken';
import axios from 'axios';
import UserSearch from './UserSearch';
import RoomItem from './RoomItem';
import { BsArrowLeft } from 'react-icons/bs';
import { getCookie } from '../../../utils/cookie';
import { initializeSocket, socket } from '../../../socket';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setChatInfo } from '../../../redux/slices/chatSlice';
const url = require("../../../urls");

const RoomList = ({handleSelectView,isMobile}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chatInfo = useSelector((state) => state.chat);
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [rooms, setRooms] = useState([]); // State lưu danh sách phòng chat
  const [title, setTitle] = useState();
  const accessToken = getCookie('accessToken');
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
  const [hasMore, setHasMore] = useState(true); // Kiểm tra còn dữ liệu để tải không
  const [titleError, setTitleError] = useState(); // Dữ liệu người dùng
  const scrollContainerRef = useRef(null);
  // Hàm lấy danh sách phòng chat người dùng từ API
  const fetchUserRooms = async (page = 1, append = false, isRetry = false, isAutoLoadChat) => {
    try {
      setLoading(true);
      setTitleError();
      const response = await axios.get(url.getUserRooms, {
        params: {
          page,
          limit: 15,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        const { rooms: newRooms, totalPages, currentPage } = response.data;
        setRooms((prev) => (append ? [...prev, ...newRooms] : newRooms));
        if (!chatInfo.roomId && isAutoLoadChat)
          dispatch(setChatInfo({
            roomId: response.data.rooms[0].roomId,
            profilePicture: response.data.rooms[0].image,
            userName: response.data.rooms[0].userName,
            email: response.data.rooms[0].email
          }));
        setCurrentPage(currentPage);
        setTotalPages(totalPages);
        setHasMore(currentPage < totalPages);
      }
    } catch (error) {
      if (error.status === 404) {
        setRooms([]);
        setHasMore(true)
        setTitleError(error.response.data.message)
      } else if ((error.response.status === 401 || error.response.status === 403) && !isRetry) {
        const resultRefreshToken = await RefreshToken();
        if (resultRefreshToken.success) {
          return fetchUserRooms(page, append, true,isAutoLoadChat);
        } else navigate('/');
      }
    } finally {
      setLoading(false);
    }

  };

  // Kết nối socket và lắng nghe sự kiện 'updateRoomList'
  useEffect(() => {
    // Lấy danh sách phòng lần đầu khi component được tải
   

    // Kết nối tới server socket
    // khởi tạo
    const socketInstance = initializeSocket();
    // Lắng nghe sự kiện 'updateRoomList' để cập nhật lại danh sách phòng
    socketInstance.on('updateRoomList', () => {
      fetchUserRooms(1, false,false,false);
    });

    // Đóng kết nối socket khi component bị unmount
    return () => {
      socketInstance.off('updateRoomList'); // Xóa lắng nghe sự kiện
      socketInstance.disconnect(); // Ngắt kết nối socket
    };
  }, []);

  // Xử lý cuộn để tải thêm
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (
      container &&
      container.scrollTop + container.clientHeight >= container.scrollHeight - 100 &&
      !loading &&
      hasMore
    ) {
      fetchUserRooms(currentPage + 1, true);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loading, hasMore, currentPage]);

  useEffect(() => {
    fetchUserRooms(1, false,false,true);

  }, [chatInfo.roomId]);
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
      <div className="room-list-content"
        ref={scrollContainerRef}
      >
        {isSearching ? (
          <UserSearch searchText={searchText} setIsSearching={setIsSearching} />
        ) : title ? <h5 className='text-center text-secondary'>
          {title}
        </h5> : (
          rooms.map((room) => (
            <RoomItem
              key={room.roomId}
              room={room}
              handleSelectView={handleSelectView}
              isMobile={isMobile}
            // roomName={room.roomName}
            // unreadMessagesCount={room.unreadMessagesCount}
            // lastMessageTime={room.lastMessageTime}
            />
          ))
        )}
        {loading && (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p>Đang tải...</p>
          </div>
        )}


        {titleError && <h4 className="text-center text-danger">{titleError}</h4>}
        {(!hasMore && totalPages != 1) && <h5 className="text-center text-primary mt-2">Đã hiển thị tất cả phòng chat.</h5>}
      </div>
    </div>
  );
};

export default RoomList;
