## Rooms-chat
This file implements a lightweight WebSocket-based real-time communication server using Node.js and the ws library. It supports:
Room creation: Generates a unique 6-character room ID and tracks it using a Set.
Joining rooms: Clients can join existing rooms; joining multiple times is safely handled.
Chat messaging: Messages sent by a user are broadcast to all members in the same room.
User count updates: Whenever users join or leave a room, an updated user count is broadcast to all clients in that room.
Automatic room cleanup: When all users leave a room, that room is automatically deleted from memory to prevent stale data.
This server enables features like real-time group chats, multiplayer game lobbies, or collaborative rooms with minimal overhead.

Framework & Libraries Frontend
React – For building the interactive user interface.
TypeScript – Ensures type safety and better development tooling.
Tailwind CSS – Utility-first CSS framework for fast and responsive UI styling.
WebSocket API – Native browser API used for establishing real-time communication with the backend server.

Backend
Node.js – JavaScript runtime environment used to build the server.
TypeScript – Adds static typing for improved development experience and safety.
ws – A lightweight WebSocket library for handling real-time, full-duplex communication between clients and the server.

Features
Room creation & joining – Users can create rooms or join existing ones via room ID.
Real-time chat – Messages are sent and received instantly using WebSocket connections.
Live user count – Displays how many users are currently in the room.

Minimal UI – Clean, responsive interface using Tailwind CSS.
Used vite framework, react
