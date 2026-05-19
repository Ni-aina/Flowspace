import { Server } from "socket.io";

let io: Server;

export const setIO = (instance: Server) => {
    io = instance;
}

export const emitToRoom = <T>(
    room: string,
    event: string,
    payload: T
) => {
    io?.to(room).emit(event, payload);
}