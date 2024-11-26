import type { Server } from "node:http";
import { Server as SocketIO } from "socket.io";
import socketRedis from "socket.io-redis";
import { logger } from "../utils/logger";
import User from "../models/User";
import decodeTokenSocket from "./decodeTokenSocket";
let io: SocketIO;

export const initIO = (httpServer: Server): SocketIO => {
	io = new SocketIO(httpServer, {
		cors: {
			origin: "*",
		},
		pingTimeout: 180000,
		pingInterval: 60000,
	});

	const connRedis = {
		host: process.env.IO_REDIS_SERVER,
		port: Number(process.env.IO_REDIS_PORT),
		password: undefined,
	};

	const redis = socketRedis as any;
	io.adapter(redis(connRedis));

	io.use(async (socket, next) => {
		try {
			const token = socket?.handshake?.auth?.token;
			const verify = decodeTokenSocket(token);

			if (verify.isValid) {
				const auth = socket?.handshake?.auth;
				socket.handshake.auth = {
					...auth,
					...verify.data,
					id: String(verify.data.id),
					tenantId: String(verify.data.tenantId),
				};

				const user = await User.findByPk(verify.data.id, {
					attributes: [
						"id",
						"tenantId",
						"name",
						"email",
						"profile",
						"status",
						"lastLogin",
						"lastOnline",
					],
				});

				socket.handshake.auth.user = user;

				next();
			} else {
				next(new Error("authentication error"));
			}
		} catch (error) {
			logger.warn(`tokenInvalid: ${socket}`);
			socket.emit(`tokenInvalid:${socket.id}`);
			next(new Error("authentication error"));
		}
	});

	io.on("connection", (socket) => {
		const { tenantId } = socket.handshake.auth;
		if (tenantId) {
			logger.info({
				message: "Client connected in tenant",
				data: socket.handshake.auth,
			});

			// create room to tenant
			socket.join(tenantId.toString());

			socket.on(`${tenantId}:joinChatBox`, (ticketId) => {
				logger.info(`Client joined a ticket channel ${tenantId}:${ticketId}`);
				socket.join(`${tenantId}:${ticketId}`);
			});

			socket.on(`${tenantId}:joinNotification`, () => {
				logger.info(
					`A client joined notification channel ${tenantId}:notification`,
				);
				socket.join(`${tenantId}:notification`);
			});

			socket.on(`${tenantId}:joinTickets`, (status) => {
				logger.info(
					`A client joined to ${tenantId}:${status} tickets channel.`,
				);
				socket.join(`${tenantId}:${status}`);
			});
			// Chat.register(socket);
		}
		socket.on("disconnect", (reason: any) => {
			logger.info({
				message: `SOCKET Client disconnected , ${tenantId}, ${reason}`,
			});
		});
	});
	return io;
};

export const getIO = (): SocketIO => {
	if (!io) {
		throw new Error("erro socket");
	}
	return io;
};
