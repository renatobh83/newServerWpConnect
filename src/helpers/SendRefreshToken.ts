import type { Response } from "express";

export const SendRefreshToken = (res: Response, token: string): void => {
	res.cookie("jrt", token, {
		httpOnly: true, // Aumenta a segurança do cookie
		secure: false, // Envia o cookie apenas através de HTTPS em produção
		sameSite: "strict", // Protege contra CSRF
		expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expira em 7 dias
	});
};
