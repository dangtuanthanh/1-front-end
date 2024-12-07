import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshToken } from '../../../utils/checkToken';
import axios from 'axios';
// import RoomItem from './RoomItem';
import { BsCircleFill, BsArrowLeft } from 'react-icons/bs';
import { getCookie } from '../../../utils/cookie';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setChatInfo } from '../../../redux/slices/chatSlice';
import MessageForm from './MessageForm';
import ChatItem from './ChatItem';
import { initializeSocket, socket } from '../../../socket';
const url = require("../../../urls");

const ChatList = ({ handleSelectView, isMobile }) => {
    const navigate = useNavigate();
    const chatInfo = useSelector((state) => state.chat);
    const [title, setTitle] = useState();
    const [messages, setMessages] = useState([]); // State lưu danh sách đoạn chat
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(1); // Tổng số trang
    const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
    const [hasMore, setHasMore] = useState(true); // Kiểm tra còn dữ liệu để tải không
    const [titleError, setTitleError] = useState();
    const scrollContainerRef = useRef(null);
    const [joinRoom, setJoinRoom] = useState(false);
    const hasLoadedRef = useRef(false); // Ref để kiểm tra lần tải trang đầu tiên
    const [messageAction, setMessageAction] = useState(null);
    // Hàm lấy danh sách phòng chat người dùng từ API
    const fetchGetMessagesByRoomId = async (page = 1, append = false, isRetry = false) => {
        if (!chatInfo.roomId)
            return
        setLoading(true);
        setTitleError();
        try {

            const response = await axios.get(url.getMessagesByRoomId(chatInfo.roomId), {
                params: {
                    page,
                    limit: 20,
                },
                headers: {
                    Authorization: `Bearer ${getCookie('accessToken')}`,
                },
            });
            const { messages: newMessages, totalPages, currentPage } = response.data;
            setMessages((prev) => {
                const allMessages = append ? [...prev, ...newMessages] : newMessages;

                // Lọc dữ liệu trùng lặp
                return [...new Map(allMessages.map((msg) => [msg.messageId, msg])).values()];
            });
            setCurrentPage(currentPage);
            setTotalPages(totalPages);

            setHasMore(currentPage < totalPages); // Nếu chưa đến trang cuối, còn tải
            socket.emit('joinRoom', { roomId: chatInfo.roomId });
        } catch (error) {
            if (error.status === 404) {
                setMessages([]);
                setHasMore(true)
                setTitleError('Hãy bắt đầu với tin nhắn đầu tiên')
            }
            else if (error.response.status === 403 && error.response.data.message === "Bạn không phải là thành viên của phòng này!")
                setTitleError(error.response.data.message)
            else if ((error.response.status === 401 || error.response.status === 403) && !isRetry) {
                const resultRefreshToken = await RefreshToken();
                if (resultRefreshToken.success) {
                    return fetchGetMessagesByRoomId(page, append, true);
                } else navigate('/');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Lấy danh sách đoạn chat lần đầu khi component được tải
        fetchGetMessagesByRoomId(1, false);
        // Khởi tạo socket
        const socketInstance = initializeSocket();

        // Lắng nghe sự kiện 'vào phòng' từ server
        socketInstance.on('joinedRoom', (twoMember) => {
            if (twoMember.twoMember)
                setJoinRoom(true)
            else setJoinRoom(false)
        });

        // Lắng nghe sự kiện 'receiveMessage' từ server
        socketInstance.on('receiveMessage', (newMessage) => {
            setMessages((prev) => [newMessage, ...(prev || [])]);
            const container = scrollContainerRef.current;
            // Trì hoãn cuộn cho đến khi tất cả các phần tử được render
            setTimeout(() => {
                container.scrollTop = container.scrollHeight;
            }, 200); // Thử với độ trễ 200ms để DOM render hoàn chỉnh

        });
        hasLoadedRef.current = false;
        //lắng nghe sự kiện sửa tin nhắn
        socketInstance.on('messageEdited', (data) => {
            // Cập nhật danh sách tin nhắn
            setMessages((prevMessages) =>
                prevMessages.map((message) =>
                    message.messageId === data.messageId
                        ? {
                            ...message,
                            messageContent: data.newMessageContent,
                            editedAt: data.editedAt
                        }
                        : message
                )
            );

        });
        //lắng nghe sự kiện xoá tin nhắn
        socketInstance.on('messageDeleted', (data) => {
            setMessages((prevMessages) =>
                prevMessages.filter((message) => message.messageId !== data.messageId)
            );
        });
        // Dọn dẹp kết nối và sự kiện khi component unmount
        return () => {
            socketInstance.off('joinedRoom'); // Xóa lắng nghe sự kiện
            socketInstance.off('receiveMessage');
            socketInstance.off('messageEdited');
            socketInstance.off('messageDeleted');
            socketInstance.disconnect(); // Ngắt kết nối socket
        };



    }, [chatInfo.roomId]);
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container && !hasLoadedRef.current && (container.scrollHeight > container.clientHeight)) {
            // Trì hoãn cuộn cho đến khi tất cả các phần tử được render
            setTimeout(() => {
                container.scrollTop = container.scrollHeight;
                hasLoadedRef.current = true; // Đánh dấu đã hoàn thành cuộn lần đầu
            }, 200); // Thử với độ trễ 200ms để DOM render hoàn chỉnh
        }

        // Thêm sự kiện cuộn
        const handleScroll = () => {
            if (container && container.scrollTop <= 150 && !loading && hasMore) {
                fetchGetMessagesByRoomId(currentPage + 1, true);
            }
        };

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

        console.log('messageAction', messageAction);

    }, [messageAction]);



    const handleEditMessage = async () => {
        let result = prompt('Sửa tin nhắn', messageAction.messageContent);
        if (result !== null) {
            result = result.trim()
            const fetchEditMessage = async (isRetry = false) => {
                try {
                    const response = await axios.put(url.editMessageById(messageAction.messageId), {
                        newMessageContent: result
                    }, {
                        headers: {
                            Authorization: `Bearer ${getCookie('accessToken')}`,
                        }
                    });
                    //thành công
                    // Cập nhật danh sách tin nhắn
                    const updatedMessage = response.data.updatedMessage;
                    setMessages((prevMessages) =>
                        prevMessages.map((message) =>
                            message.messageId === updatedMessage.messageId
                                ? {
                                    ...message,
                                    messageContent: updatedMessage.newMessageContent,
                                    editedAt: updatedMessage.editedAt
                                }
                                : message
                        )
                    );
                    //phát sự kiện cập nhật tin nhắn
                    socket.emit('editMessage', {
                        messageId: updatedMessage.messageId,
                        newMessageContent: updatedMessage.newMessageContent,
                        editedAt: updatedMessage.editedAt,
                        roomId: chatInfo.roomId
                    });
                } catch (error) {
                    if ((error.response.status === 401 || error.response.status === 403) && !isRetry) {
                        const resultRefreshToken = await RefreshToken();
                        if (resultRefreshToken.success) {
                            return fetchEditMessage(true);
                        } else navigate('/');
                    }
                }
            }
            fetchEditMessage(false)
        } else {
            alert("Hãy nhập nội dung tin nhắn");
        }
    };
    const handleDeleteMessage = async () => {
        const fetchDeleteMessage = async (isRetry = false) => {
            try {
                const response = await axios.delete(url.deleteMessageById(messageAction.messageId), {
                    headers: {
                        Authorization: `Bearer ${getCookie('accessToken')}`,
                    }
                });
                //thành công
                // Cập nhật danh sách tin nhắn
                setMessages((prevMessages) =>
                    prevMessages.filter((message) => message.messageId !== response.data.messageId)
                );
                //phát sự kiện xoá tin nhắn
                socket.emit('deleteMessage', {
                    messageId: response.data.messageId,
                    roomId: chatInfo.roomId
                });
            } catch (error) {
                if ((error.response.status === 401 || error.response.status === 403) && !isRetry) {
                    const resultRefreshToken = await RefreshToken();
                    if (resultRefreshToken.success) {
                        return fetchDeleteMessage(true);
                    } else navigate('/');
                }
            }
        }
        fetchDeleteMessage(false)
    };
    return (
        <div className="room-container d-flex flex-column shadow mt-3 p-3 ms-3 me-3 rounded">

            <div className="">
                <div className="room-list-container">
                    <div className="room-item d-flex align-items-center p-2"
                    >
                        {isMobile && (
                            <button className="back-button" onClick={handleSelectView}>
                                <BsArrowLeft size={20} />
                            </button>
                        )}
                        {/* Hình ảnh bên trái */}
                        <div className="room-image"
                        // onClick={() => alert("thông tin người dùng")}
                        >
                            <img
                                src={chatInfo.profilePicture}
                                alt={chatInfo.userName || 'user Image'}
                                className="img-fluid rounded-circle"
                            />
                        </div>

                        {/* Phần nội dung bên phải */}
                        <div className="flex-grow-1 ms-3"
                        // onClick={() => alert("thông tin người dùng")}
                        >
                            {/* Tên người dùng hoặc tên phòng */}
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 text-truncate">{chatInfo.userName || chatInfo.roomName || 'Phòng chat'} {joinRoom && <BsCircleFill style={{ color: '#28a745', fontSize: '1rem' }} />}</h5>
                                {/* Thời gian tin nhắn */}
                                {/* <small className="text-muted">{user.lastMessageTime}</small> */}
                            </div>

                            {/* Tin nhắn cuối cùng và số lượng chưa đọc */}
                            <div className="d-flex justify-content-between align-items-center mt-1">
                                <p className="mb-0 text-truncate text-muted">
                                    {chatInfo.email}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="room-list-container"
                style={{ height: '100%', maxHeight: '100%', overflowY: 'auto' }}
            >
                {/* Nội dung chính */}
                <div className="room-list-content"
                    ref={scrollContainerRef}
                    style={{ height: '100%', maxHeight: '100%', overflowY: 'auto' }}
                >
                    {loading && (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Đang tải...</span>
                            </div>
                            <p>Đang tải...</p>
                        </div>
                    )}


                    {titleError && <h4 className="text-center text-danger">{titleError}</h4>}
                    {(!hasMore && totalPages != 1) && <h5 className="text-center text-primary">Đã hiển thị tất cả tin nhắn.</h5>}
                    {title ? (
                        <h5 className='text-center text-secondary'>
                            {title}
                        </h5>
                    ) : (
                        [...messages].reverse().map((message) => ( // Đảo ngược mảng
                            <ChatItem
                                key={message.messageId}
                                message={message}
                                messageAction={messageAction}
                                setMessageAction={setMessageAction}
                                handleEditMessage={handleEditMessage}
                                handleDeleteMessage={handleDeleteMessage}
                            />
                        ))
                    )}

                </div>

            </div>
            {/* Thanh nav ở dưới cùng */}
            <div className="room-nav d-flex justify-content-around align-items-center">
                <MessageForm
                isMobile = {isMobile}
                ></MessageForm>
            </div>

        </div>
    )
};

export default ChatList;