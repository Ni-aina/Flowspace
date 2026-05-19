import next from "next";
import { createServer } from "http";
import { Server } from "socket.io";
import { parse } from "url";
import { setIO } from "@/lib/realtime";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

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
        socket.on("join-workspace", (workspaceId: string) => {
            socket.join(`workspace:${workspaceId}`);
        })

        socket.on("leave-workspace", (workspaceId: string) => {
            socket.leave(`workspace:${workspaceId}`);
        })
    })

    httpServer.listen(port, hostname, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    })
})