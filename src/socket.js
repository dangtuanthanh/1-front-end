// src/socket.js
import { io } from 'socket.io-client';
const url = require("./urls");
const socket = io(url.socketServer, {
  transports: ['websocket'],
});

export default socket;
