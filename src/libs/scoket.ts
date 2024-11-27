import type { Server } from "node:http";
import { createAdapter } from "@socket.io/redis-adapter";
import IORedis from "ioredis";
import { Server as SocketIO } from "socket.io";
import redisAdapter from "socket.io-redis";
import User from "../models/User";
import { logger } from "../utils/logger";
import decodeTokenSocket from "./decodeTokenSocket";
let io: SocketIO;

export const initIO = async (httpServer: Server): SocketIO => {
	io = new SocketIO(httpServer, {
		cors: {
			origin: ["http://localhost:5173", "https://app3.pluslive.online"],
			credentials: true,
			methods: ["GET", "POST"],
		},
		pingTimeout: 180000,
		pingInterval: 60000,
	});

	const connRedis = new IORedis({
		host: process.env.IO_REDIS_SERVER || "localhost",
		port: +(process.env.IO_REDIS_PORT || 6379),
		password: process.env.IO_REDIS_PASSWORD || undefined,
	});
	const pubClient = connRedis;
	const subClient = connRedis.duplicate();
	pubClient.on("error", (err) => console.error("Redis Pub Client Error:", err));
	subClient.on("error", (err) => console.error("Redis Sub Client Error:", err));

	// Configurar o adaptador Redis
	io.adapter(createAdapter(pubClient, subClient));
	// Evento para verificar conexões do Redis
	pubClient.on("connect", () => );
	subClient.on("connect", () => );

	// Erros de conexão
	pubClient.on("error", (err) =>
		console.error("Erro no PubClient Redis:", err),
	);
	subClient.on("error", (err) =>
		console.error("Erro no SubClient Redis:", err),
	);
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
