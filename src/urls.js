//urls.js
module.exports = {
  //socket server
  //http://localhost:1002
  socketServer: 'https://backendvmess.onrender.com',

  //Lấy danh sách tin nhắn của phòng
  getMessagesByRoomId: (roomId) => `https://backendvmess.onrender.com/${roomId}/messages`,
  // đăng nhập
  login: 'https://backendvmess.onrender.com/login',
  //đăng nhập bằng google
  googleLogin: 'https://backendvmess.onrender.com/googleLogin',
  // đăng ký
  register: 'https://backendvmess.onrender.com/register',
  //xác thực mã code đăng ký email
  verifyCode: "https://backendvmess.onrender.com/verifyCode",
  //yêu cầu quên mật khẩu
  forgotPassword: "https://backendvmess.onrender.com/forgotPassword",
  //xác thực mã quên mật khẩu
  verifyResetCode: "https://backendvmess.onrender.com/verifyResetCode",
  //đổi mật khẩu mới cho chức năng quên mật khẩu
  resetPassword: "https://backendvmess.onrender.com/resetPassword",
  // đăng xuất
  logout: 'https://backendvmess.onrender.com/logout',


  // kiểm tra token trước khi vào trang
  checkToken: 'https://backendvmess.onrender.com/checkToken',
  // yêu cầu lấy lại access token
  refreshToken: 'https://backendvmess.onrender.com/refreshToken',

  // Lấy danh sách phòng chat của người dùng
  getUserRooms: 'https://backendvmess.onrender.com/getUserRooms',
  // Tìm kiếm người dùng
  searchUser: 'https://backendvmess.onrender.com/searchUser',
  // Tạo phòng chat
  createRoom: 'https://backendvmess.onrender.com/createRoom',

  // Sửa tin nhắn
  editMessageById: (messageId) => `https://backendvmess.onrender.com/editMessage/${messageId}`,
  // Xoá tin nhắn
  deleteMessageById: (messageId) => `https://backendvmess.onrender.com/deleteMessage/${messageId}`,

  //đổi ảnh người dùng
  updateProfilePicture: 'https://backendvmess.onrender.com/updateProfilePicture',
  // đổi tên người dùng
  updateUserName: 'https://backendvmess.onrender.com/updateUserName',
  // đổi mật khẩu người dùng
  changePassword: 'https://backendvmess.onrender.com/changePassword',
};