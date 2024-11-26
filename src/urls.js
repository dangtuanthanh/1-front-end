//urls.js
module.exports = {
  //socket server
  socketServer: 'http://localhost:1002',

  //Lấy danh sách tin nhắn của phòng
  getMessagesByRoomId: (roomId) => `http://localhost:1002/${roomId}/messages`,
  // đăng nhập
  login: 'http://localhost:1002/login',
  //đăng nhập bằng google
  googleLogin: 'http://localhost:1002/googleLogin',
  // đăng ký
  register: 'http://localhost:1002/register',
  //xác thực mã code đăng ký email
  verifyCode: "http://localhost:1002/verifyCode",
  //yêu cầu quên mật khẩu
  forgotPassword: "http://localhost:1002/forgotPassword",
  //xác thực mã quên mật khẩu
  verifyResetCode: "http://localhost:1002/verifyResetCode",
  //đổi mật khẩu mới cho chức năng quên mật khẩu
  resetPassword: "http://localhost:1002/resetPassword",

  // kiểm tra token trước khi vào trang
  checkToken: 'http://localhost:1002/checkToken',
  // yêu cầu lấy lại access token
  refreshToken: 'http://localhost:1002/refreshToken',

  // Lấy danh sách phòng chat của người dùng
  getUserRooms: 'http://localhost:1002/getUserRooms',
  // Tìm kiếm người dùng
  searchUser: 'http://localhost:1002/searchUser',
  // Tạo phòng chat
  createRoom: 'http://localhost:1002/createRoom',

  // Sửa tin nhắn
  editMessageById: (messageId) => `http://localhost:1002/editMessage/${messageId}`,
  // Xoá tin nhắn
  deleteMessageById: (messageId) => `http://localhost:1002/deleteMessage/${messageId}`,
};