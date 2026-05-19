import { Server } from "socket.io";

export const setIO = (instance: Server) => {
    (globalThis as any).__io = instance;
}

export const emitToRoom = <T>(room: string, event: string, payload: T) => {
    const io: Server | undefined = (globalThis as any).__io;
    io?.to(room).emit(event, payload);
}