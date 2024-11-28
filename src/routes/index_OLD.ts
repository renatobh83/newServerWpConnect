import { NextFunction, type Request, type Response, Router } from "express";
import qrCode from "qrcode";
import { getWbot, initWbot } from "../libs/wbot";
import { StartWhatsAppSession } from "../services/WbotServices/StartWhatsAppSession";

const routes = Router();
import * as prometheusRegister from "../middleware/metrics";

routes.get("/", (_req, res) => {
	res.json("routes in modules");
});
routes.get("/session", async (_req, res) => {
	const a = {
		id: 34343,
		type: "whatsapp",
	};
	await StartWhatsAppSession(a);
	res.json("session");
});

routes.get("/qrCode", async (req: Request, res: Response) => {
	try {
		if (req?.client) {
			const qrOptions = {
				errorCorrectionLevel: "M" as const,
				type: "image/png" as const,
				scale: 5,
				width: 500,
			};
			const qr = req.client
				? await qrCode.toDataURL(
						"2@ogcQHeD8I6VxG9sEYypd8Nwkd6EFTfA3w5NBuzPSin5SWZ5TiZk1CC9tDG3SuxuK+osuqp0RvxXPMUE85evZfm/Io5SM4mX57CQ=,GPYB6rGdnI3B94PJYMrUPxzLtmPSwptdx9sDKSNCQlM=,eJbuYo63saz7WHYUgwOcr7piiVwnpuODsHX8vomKeHA=,daKO7AmW3kKI4KvBmFujZA9sO6gMJe2BE4Up7A4NfJI=,1",
						qrOptions,
					)
				: null;
			const img = Buffer.from(
				(qr as any).replace(/^data:image\/(png|jpeg|jpg);base64,/, ""),
				"base64",
			);
			res.writeHead(200, {
				"Content-Type": "image/png",
				"Content-Length": img.length,
			});
			res.end(img);
		} else if (typeof req.client === "undefined") {
			res.status(200).json({
				status: null,
				message:
					"Session not started. Please, use the /start-session route, for initialization your session",
			});
		} else {
			res.status(200).json({
				status: req.client.status,
				message: "QRCode is not available...",
			});
		}
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: "Error retrieving QRCode",
			error: error,
		});
	}
});

routes.get("/health", async (_request: Request, response: Response) => {
	const healthcheck = {
		uptime: process.uptime(),
		message: "OK",
		timestamp: Date.now(),
	};
	try {
		response.status(200).send(healthcheck);
	} catch (e: any) {
		healthcheck.message = e;
		response.status(503).send();
	}
});

routes.get("/metrics", prometheusRegister.metrics);
export default routes;
