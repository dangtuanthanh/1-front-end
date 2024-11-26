//MessageForm.js
import React, { useState, useEffect, useRef } from 'react';
import { BsPaperclip, BsFillSendFill } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { initializeSocket, socket } from '../../../socket';
const MessageForm = () => {
    const [message, setMessage] = useState('');
    const chatInfo = useSelector((state) => state.chat);
    const inputRef = useRef(null);
    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSend = () => {
        if (message.trim()) {
            //gửi tin nhắn thông qua socket
            socket.emit('sendMessage', { roomId: chatInfo.roomId,message: message});
            setMessage(''); // Xóa nội dung sau khi gửi
        }
    };

    useEffect(() => {
        // Focus lại ô nhập liệu khi roomId thay đổi
        if (inputRef.current) {
            inputRef.current.focus();
            setMessage('')
        }
    }, [chatInfo.roomId]); // Theo dõi sự thay đổi của chatInfo.roomId
    return (
        <form className="message-form d-flex align-items-center px-3 py-2"
            onSubmit={(e) => {
                e.preventDefault(); // Ngăn việc reload trang
                handleSend(); // Gọi hàm gửi
            }}
        >
            {/* Biểu tượng đính kèm */}
            <div className="icon-container me-2">
                <BsPaperclip size={24} className="text-muted" />
            </div>

            {/* Ô nhập tin nhắn */}
            <input
                ref={inputRef}
                type="text"
                className="form-control flex-grow-1 search-input"
                placeholder="Nhập tin nhắn..."
                value={message}
                onChange={handleInputChange}
                autoFocus

            />

            {/* Nút gửi */}
            <button
                type="submit" // Đặt loại là submit để tương tác đúng với form
                className={`btn btn-primary ms-2 ${message.trim() ? '' : 'disabled'}`}
                disabled={!message.trim()}
            >
                <BsFillSendFill size={20} />
            </button>
        </form>
    );
};

export default MessageForm;
