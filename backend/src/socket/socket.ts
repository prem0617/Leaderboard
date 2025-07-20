import { Server as IOServer } from "socket.io";
import express, { Application } from "express";
import { createServer, Server as HTTPServer } from "http";
import { Socket } from "socket.io";

const app: Application = express();
const server: HTTPServer = createServer(app);

const io: IOServer = new IOServer(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket: Socket) => {
  console.log(`connection: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`disconnect: ${socket.id}`);
  });
});

export { app, server, io };
