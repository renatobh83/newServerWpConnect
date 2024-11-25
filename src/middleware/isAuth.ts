import type { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import authConfig from "../config/auth";
import AppError from "../errors/AppError";

interface TokenPayload {
	id: string;
	username: string;
	profile: string;
	tenantId: number;
	iat: number;
	exp: number;
}

const isAuth = (req: Request, res: Response, next: NextFunction): void => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		throw new AppError("Token was not provided.", 403);
	}

	const [, token] = authHeader.split(" ");

	try {
		const decoded = verify(token, authConfig.secret);
		const { id, profile, tenantId } = decoded as TokenPayload;

		req.user = {
			id,
			profile,
			tenantId,
		};
	} catch (err) {
		throw new AppError("Invalid token.", 403);
	}

	// biome-ignore lint/correctness/noVoidTypeReturn: <explanation>
	return next();
};

export default isAuth;
