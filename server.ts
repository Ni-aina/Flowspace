import next from "next";
import { createServer } from "http";
import { Server } from "socket.io";
import { parse } from "url";
import { setIO } from "@/lib/realtime";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = Number(process.env.PORT) || 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer((req, res) => {
        const parsedUrl = parse(req.url!, true);
        handler(req, res, parsedUrl);
    })

    const io = new Server(httpServer, {
        cors: {
            origin: "*"
        }
    })

    setIO(io);

    io.on("connection", (socket) => {
        socket.on("join-workspace", (room: string) => {
            socket.join(room);
        })

        socket.on("leave-workspace", (room: string) => {
            socket.leave(room);
        })
    })

    httpServer.listen(port, hostname, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    })
})