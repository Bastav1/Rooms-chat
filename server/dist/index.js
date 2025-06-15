"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
function broadcastUserCount(roomId) {
    const usersInRoom = allSocket.filter((u) => u.roomId === roomId);
    const count = usersInRoom.length;
    const dataToSend = JSON.stringify({
        type: "user-count",
        payload: {
            count,
        },
    });
    usersInRoom.forEach((u) => u.socket.send(dataToSend));
    return count;
}
function random() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for (let i = 0; i < 6; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
}
let allSocket = [];
const rooms = new Set();
wss.on("connection", (socket) => {
    socket.on("message", (e) => {
        //@ts-ignore
        const parsedMessage = JSON.parse(e);
        if (parsedMessage.type === "join") {
            const roomId = parsedMessage.payload.roomId;
            if (rooms.has(roomId)) {
                allSocket.push({
                    socket,
                    roomId,
                });
                socket.send(JSON.stringify({ success: "true" }));
                broadcastUserCount(roomId);
            }
            else {
                socket.send(JSON.stringify({ success: "false" }));
            }
        }
        if (parsedMessage.type === "chat") {
            //find socket for fetching its roomId
            const user = allSocket.find((u) => u.socket === socket);
            if (!user)
                return;
            //broadcasting the message to every socket having that roomId
            allSocket.forEach((u) => {
                if (u.roomId === user.roomId) {
                    const dataToSend = JSON.stringify({
                        type: "chat",
                        payload: {
                            message: parsedMessage.payload.message,
                        },
                    });
                    u.socket.send(dataToSend);
                }
            });
        }
        if (parsedMessage.type === "create") {
            const roomId = random();
            rooms.add(roomId);
            allSocket.push({
                socket,
                roomId,
            });
            socket.send(JSON.stringify({ type: "room-created", payload: { roomId } }));
        }
    });
    socket.on("close", () => {
        const user = allSocket.find((u) => u.socket === socket);
        if (user) {
            allSocket = allSocket.filter((u) => u.socket !== socket);
            broadcastUserCount(user.roomId);
        }
    });
});
