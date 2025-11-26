


import { Server } from "socket.io";
import http from "http";
import express from "express";

export const app = express();
export const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

// userId -> [socketIds]
let onlineUsers = new Map();

export function getReceiverSocketId(userId) {
  const sockets = onlineUsers.get(userId);
  return sockets ? sockets[0] : null; // return first connection
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    // If user already exists, add new socket to the list
    if (onlineUsers.has(userId)) {
      onlineUsers.get(userId).push(socket.id);
    } else {
      onlineUsers.set(userId, [socket.id]);
    }
  }

  // Update all clients
  io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Remove socket.id from user's array
    for (let [userId, sockets] of onlineUsers.entries()) {
      const updatedSockets = sockets.filter((id) => id !== socket.id);

      if (updatedSockets.length === 0) {
        onlineUsers.delete(userId);
      } else {
        onlineUsers.set(userId, updatedSockets);
      }
    }

    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });
});

export { io };
