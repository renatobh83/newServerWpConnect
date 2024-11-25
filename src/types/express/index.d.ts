import type { Whatsapp } from "@wppconnect-team/wppconnect";
import type { Logger } from "winston";

import type { ServerOptions } from "../ServerOptions";

declare global {
	namespace Express {
		export interface Request {
			client: Whatsapp & { urlcode: string; status: string };
			session: string;
			token?: string;
			serverOptions: ServerOptions;
			user: { id: string; profile: string; tenantId: number };
			APIAuth: { apiId: string; sessionId: number; tenantId: number };
		}
	}
}
