import { Server as SocketIO } from "socket.io";
import type { Server } from "node:http";


let io: SocketIO;

export const initIO = (httpServer: Server): SocketIO => {
 
    io = new SocketIO(httpServer, {
        cors: {
          origin: "*",
        },
        pingTimeout: 180000,
        pingInterval: 60000,
      });

      io.on("connection", (socket) => { 
        console.log(socket)
      })
      return io;
}

export const getIO = (): SocketIO => {
    if (!io) {
      throw new Error("erro socket")
    }
    return io;
  };