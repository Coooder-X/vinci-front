import { io } from "socket.io-client";

const socket = io('http://localhost:3020');
export default socket;
