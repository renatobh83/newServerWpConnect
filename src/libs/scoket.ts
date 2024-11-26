import type { Server } from "node:http";
import { Server as SocketIO } from "socket.io";

let io: SocketIO;

export const initIO = (httpServer: Server): SocketIO => {
	io = new SocketIO(httpServer, {
		cors: {
			origin: "*",
		},
		pingTimeout: 180000,
		pingInterval: 60000,
	});
	io.on("connection", (socket) => {});
	return io;
};

export const getIO = (): SocketIO => {
	if (!io) {
		throw new Error("erro socket");
	}
	return io;
};
