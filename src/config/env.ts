export const env = {
	IO_REDIS_PORT: Number(process.env.IO_REDIS_PORT) || 6379,
	IO_REDIS_PASSWORD: process.env.IO_REDIS_PASSWORD || undefined,
	IO_REDIS_SERVER: "109.199.105.36",
};
