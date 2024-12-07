import React, { useState, useEffect, useRef } from "react";
import { useSelector } from 'react-redux';
import { BsPencilFill } from 'react-icons/bs';
import { FaSignOutAlt } from 'react-icons/fa';
import { RefreshToken } from '../../../utils/checkToken';
import { getCookie, deleteCookie } from '../../../utils/cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true; // Bật toàn cục
const url = require("../../../urls");
const UserProfile = () => {
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.auth.user);
    const [titleError, setTitleError] = useState('');
    const [error, setError] = useState('');
    const [confirmChangePicture, setConfirmChangePicture] = useState(false);
    const [confirmChangeUserName, setConfirmChangeUserName] = useState(false);
    const [confirmChangePassword, setConfirmChangePassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        console.log('userInfo', userInfo);
    }, [userInfo]);
    const [hinhAnh, setHinhAnh] = useState(userInfo.profilePicture ? userInfo.profilePicture : undefined);
    const [userName, setUserName] = useState(userInfo.userName ? userInfo.userName : null);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    // xử lý ảnh
    //url xử lý hiển thị hình ảnh
    const [urlAnh, setUrlAnh] = useState();
    useEffect(() => {
        if (hinhAnh && hinhAnh instanceof File) { // Kiểm tra kiểu dữ liệu
            setUrlAnh(URL.createObjectURL(hinhAnh));
        } else setUrlAnh(hinhAnh);
        console.log('hinh anh', hinhAnh);

    }, [hinhAnh]);
    function ImageUpload() {
        const fileInputRef = useRef(null);
        const handleImageChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                // Kiểm tra xem file có phải là hình ảnh hay không
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        setHinhAnh(file)
                        // setDataReq({
                        //     ...dataReq,
                        //     HinhAnh: file // Lưu file hình ảnh vào dataReq
                        // });
                    };
                    reader.readAsDataURL(file);
                    setTitleError(null)
                    setConfirmChangePicture(true)
                } else {
                    setTitleError('Bạn chỉ có thể chọn file hình ảnh.')
                }
            } else {
                setHinhAnh(undefined)
            }
        };

        const handleChooseFileClick = () => {
            fileInputRef.current.click();
        };

        const handleDrop = (event) => {
            event.preventDefault();
            setTitleError(null)
            const file = event.dataTransfer.files[0];

            if (file) {
                // Kiểm tra xem file có phải là hình ảnh hay không
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        setHinhAnh(file)
                        // setDataReq({
                        //     ...dataReq,
                        //     HinhAnh: file // Lưu file hình ảnh vào dataReq
                        // });
                    };
                    reader.readAsDataURL(file);
                    setTitleError(null)
                    setConfirmChangePicture(true)
                } else {
                    setTitleError('Bạn chỉ có thể chọn file hình ảnh.')
                }
            }
        };

        const handleDragOver = (event) => {
            event.preventDefault();
            setTitleError(null)
            setConfirmChangePicture(true)

        };

        return (
            <div className="form-group">
                <div
                    style={{ width: '100%', textAlign: 'center', margin: '1% 0 2% 0' }}
                    onClick={handleChooseFileClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    {!hinhAnh && <span><span style={{ color: 'blue' }}>Chọn file</span> hoặc Kéo và thả ảnh vào đây</span>}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*" // Chỉ chấp nhận các file hình ảnh
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                    {hinhAnh && (
                        <div style={{
                            position: 'relative',
                            display: 'inline-block'
                        }} >
                            <img
                                src={urlAnh} // Sử dụng URL.createObjectURL để hiển thị hình ảnh đã chọn
                                alt="Selected"
                                style={{
                                    width: '200px',
                                    height: '200px',
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                    border: '5px solid #007bff',
                                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 20px 27px 0px'
                                }}
                            />
                            <BsPencilFill
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    cursor: 'pointer',
                                    width: 20, // Thêm độ rộng
                                    height: 20 // Thêm chiều cao 
                                }}
                            >

                            </BsPencilFill>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    const handleSubmit = async () => {

        setError('')
        setSuccess('')

        if (confirmChangePicture) {
            const fetchUpdateProfilePicture = async (isRetry = false) => {
                try {
                    setLoading(true);
                    // Tạo FormData
                    const formData = new FormData();
                    formData.append('profilePicture', hinhAnh);

                    // Gửi dữ liệu với axios
                    const response = await axios.post(url.updateProfilePicture, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${getCookie('accessToken')}`
                        }
                    })
                    setSuccess(response.data.message)
                } catch (error) {
                    if ((error.response.status === 401 || error.response.status === 403) && !isRetry) {
                        const resultRefreshToken = await RefreshToken();
                        if (resultRefreshToken.success) {
                            return fetchUpdateProfilePicture(true);
                        } else navigate('/');
                    } else setError(error.response.data.message)
                } finally {
                    setLoading(false);
                }
            };
            fetchUpdateProfilePicture(false)
        }
        if (confirmChangeUserName) {
            const fetchUpdateUserName = async (isRetry = false) => {
                if (userName) {
                    try {
                        setLoading(true);
                        // Gửi dữ liệu với axios
                        const response = await axios.put(url.updateUserName, { userName }, {
                            headers: {
                                'Authorization': `Bearer ${getCookie('accessToken')}`
                            }
                        })
                        setSuccess(response.data.message)
                    } catch (error) {
                        if ((error.response.status === 401 || error.response.status === 403) && !isRetry) {
                            const resultRefreshToken = await RefreshToken();
                            if (resultRefreshToken.success) {
                                return fetchUpdateUserName(true);
                            } else navigate('/');
                        } else setError(error.response.data.message)
                    } finally {
                        setLoading(false);
                    }
                } else setError('Vui lòng nhập đầy đủ thông tin')
            };
            fetchUpdateUserName(false)
        }
        if (confirmChangePassword) {
            const fetchChangePassword = async (isRetry = false) => {
                if (oldPassword && newPassword && confirmNewPassword) {
                    if (newPassword.trim() === confirmNewPassword.trim()) {
                        try {
                            setLoading(true);
                            // Gửi dữ liệu với axios
                            const response = await axios.post(url.changePassword, { oldPassword, newPassword }, {
                                headers: {
                                    'Authorization': `Bearer ${getCookie('accessToken')}`
                                },
                                withCredentials: true
                            })
                            setSuccess(response.data.message)
                        } catch (error) {
                            if ((error.response.status === 401 || error.response.status === 403) && !isRetry) {
                                const resultRefreshToken = await RefreshToken();
                                if (resultRefreshToken.success) {
                                    return fetchChangePassword(true);
                                } else navigate('/');
                            } else setError(error.response.data.message)
                        } finally {
                            setLoading(false);
                        }
                    } else setError('Mật khẩu mới và nhập lại mật khẩu không khớp')
                } else setError('Vui lòng nhập đầy đủ thông tin')
            };
            fetchChangePassword(false)
        }
    };
    const handleLogout = async () => {
        try {
            const response = await axios.post(url.logout, {}, {
                withCredentials: true
            })
            if (response.data.success) {
                deleteCookie('accessToken');
                navigate('/');
            }

        } catch (error) {
            setError(error.response.data.message)
        }
    };
    useEffect(() => {
       if(userName==='')
        setConfirmChangeUserName(false)
    }, [userName]);
    useEffect(() => {
        if(oldPassword===''||newPassword==='' || confirmNewPassword==='')
         setConfirmChangePassword(false)
     }, [oldPassword,newPassword,confirmNewPassword]);
    return (
        <div>
            <h2 style={{ width: '100%', textAlign: 'center', fontWeight: 'bolder' }}>Thông Tin Người Dùng</h2>
            <div className="mt-3" style={{ width: '100%', textAlign: 'center' }}>
                <ImageUpload />
            </div>


            <h1 style={{ textAlign: 'center', marginBottom: '0' }}>{userName}</h1>
            <p style={{ textAlign: 'center', }}>{userInfo.email}</p>
            <label>Tên người dùng</label>
            <div className="mb-3 mt-2">
                <input
                    style={{ border: 'gray 1px solid' }}
                    type="text"
                    className="form-control-lg w-100"
                    value={userName}
                    onChange={(e) => {
                        setConfirmChangeUserName(true);
                        setUserName(e.target.value)
                        setError('')
                    }}
                    required
                    placeholder="Tên người dùng"
                />
            </div>


            {/* đổi mật khẩu */}
            <h4 className="mt-5">Đổi Mật Khẩu</h4>
            <div className="form-group">
                <label>Mật Khẩu Cũ</label>
                <input
                    type="password"
                    className="form-control"
                    value={oldPassword}
                    onChange={(event) => {
                        setConfirmChangePassword(true);
                        setOldPassword(event.target.value)
                        setError('')
                    }}
                    required
                />
            </div>
            <div className="form-group">
                <label>Mật Khẩu Mới</label>
                <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(event) => {
                        setConfirmChangePassword(true);
                        setNewPassword(event.target.value)
                        setError('')
                    }}
                    required
                />
            </div>
            <div className="form-group">
                <label>Nhập Lại Mật Khẩu Mới</label>
                <input
                    type="password"
                    className="form-control"
                    value={confirmNewPassword}
                    onChange={(event) => {
                        setConfirmChangePassword(true);
                        setConfirmNewPassword(event.target.value)
                        setError('')
                    }}
                    required
                />
            </div>
            {titleError &&
                <p style={{ color: 'red' }} className="text-center">{titleError}</p>
            }
            {error &&
                <p style={{ color: 'red' }} className="text-center">{error}</p>
            }
            {success &&
                <p className="text-center text-primary">{success}</p>
            }
            {
                <div className="d-flex justify-content-center mt-3">
                    <button className="btn btn-primary"
                        disabled={(!(confirmChangePicture || confirmChangeUserName || confirmChangePassword)) || loading}
                        onClick={() => handleSubmit()}
                    >{loading ? 'Đang xử lý' : 'Xác Nhận'}</button>
                </div>
            }
            {
                <div className="d-flex justify-content-end mt-3">
                    <button className="btn btn-warning"
                        onClick={() => handleLogout()}
                    >Đăng Xuất <FaSignOutAlt /></button>
                </div>
            }
        </div>
    )
};

export default UserProfile;