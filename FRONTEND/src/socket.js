import { io } from "socket.io-client";

const socket = io("http://localhost:5051", {
    withCredentials: true
});

export default socket;