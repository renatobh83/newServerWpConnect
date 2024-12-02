export default {
	secret: process.env.JWT_SECRET || "mad4srsZIISQ0G1MJPoQIeq3PVf25EaRAd",
	expiresIn: "3d",

	refreshSecret:
		process.env.JWT_REFRESH_SECRET || "itI2OQbF3TMy45kIlU7nnhXeIcXugtu9AS",
	refreshExpiresIn: "7d",
};
