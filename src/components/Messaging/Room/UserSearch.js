import React, { useEffect, useState,useRef } from "react";
import { RefreshToken } from "../../../utils/checkToken";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import _ from "lodash";
import { getCookie } from '../../../utils/cookie';
const url = require("../../../urls");

const UserSearch = ({ searchText }) => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]); // Dữ liệu người dùng
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(1); // Tổng số trang
    const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
    const [hasMore, setHasMore] = useState(true); // Kiểm tra còn dữ liệu để tải không
    const [titleError, setTitleError] = useState(); // Dữ liệu người dùng
    const scrollContainerRef = useRef(null);

    const fetchUsers = async (page = 1, append = false, isRetry = false) => {
        if (!searchText.trim()) return;

        setLoading(true);
        setTitleError();
        try {
            const response = await axios.get(url.searchUser, {
                params: {
                    search: searchText,
                    page,
                    limit: 20,
                },
                headers: {
                    Authorization: `Bearer ${getCookie('accessToken')}`, // Thêm token vào header
                },
            });

            const { users: newUsers, totalPages, currentPage } = response.data;

            setUsers((prev) => (append ? [...prev, ...newUsers] : newUsers));
            setCurrentPage(currentPage);
            setTotalPages(totalPages);

            setHasMore(currentPage < totalPages); // Nếu chưa đến trang cuối, còn tải
        } catch (error) {
            if (error.status === 404) {
                setUsers([]);
                setHasMore(true)
                setTitleError(error.response.data.message)
            } else if ((error.response.status === 401 || error.response.status === 403) && !isRetry) {
                const resultRefreshToken = await RefreshToken();
                if (resultRefreshToken.success) {
                    return fetchUsers(page, append, true);
                } else navigate('/');
            }

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debouncedFetch = _.debounce(() => fetchUsers(1, false), 500);

        if (searchText.trim()) {
            debouncedFetch(); // Chỉ gọi debounce khi có dữ liệu
        }

        // Cleanup debounce để tránh memory leak
        return () => debouncedFetch.cancel();
    }, [searchText]);

    // Xử lý cuộn để tải thêm
    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (
          container &&
          container.scrollTop + container.clientHeight >= container.scrollHeight &&
          !loading &&
          hasMore
        ) {
          fetchUsers(currentPage + 1, true);
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

    return (
        <div 
        ref={scrollContainerRef}
        style={{height: '100%',maxHeight:'100%', overflowY: 'auto'}}>
            {/* <h3>Kết quả tìm kiếm:</h3> */}
            <h3></h3>
            <ul>
                {users.map((user) => (
                    <div className="room-item d-flex align-items-center p-2">
                        {/* Hình ảnh bên trái */}
                        <div className="room-image">
                            <img
                                src={user.profilePicture}
                                alt={user.userName || 'user Image'}
                                className="img-fluid rounded-circle"
                            />
                        </div>

                        {/* Phần nội dung bên phải */}
                        <div className="room-content flex-grow-1 ms-3">
                            {/* Tên người dùng hoặc tên phòng */}
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 text-truncate">{user.userName || user.roomName || 'Phòng chat'}</h5>
                                {/* Thời gian tin nhắn */}
                                {/* <small className="text-muted">{user.lastMessageTime}</small> */}
                            </div>

                            {/* Tin nhắn cuối cùng và số lượng chưa đọc */}
                            <div className="d-flex justify-content-between align-items-center mt-1">
                                <p className="mb-0 text-truncate text-muted">
                                    {user.email}
                                </p>
                                {/* {user.unreadMessagesCount > 0 && (
                          <span className="badge bg-danger rounded-pill unread-count">
                            {user.unreadMessagesCount}
                          </span>
                        )} */}
                            </div>
                        </div>
                    </div>
                ))}
            </ul>
            {loading && (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                    <p>Đang tải...</p>
                </div>
            )}


            {titleError && <h4 className="text-center text-danger">{titleError}</h4>}
            {!hasMore && <h5 className="text-center text-primary">Đã hiển thị tất cả kết quả.</h5>}
        </div>
    );
};

export default UserSearch;
