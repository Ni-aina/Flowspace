import { io } from "socket.io-client";

const url = process.env.NEXTAUTH_URL!;

export const socket = io(url, {
    autoConnect: false
})