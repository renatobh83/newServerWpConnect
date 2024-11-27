import type { Request, RequestHandler, Response } from "express";
import AppError from "../errors/AppError";

export const ReceivedRequest360: RequestHandler = async (
	req: Request,
	res: Response,
) => {
	try {
		// const message = {
		//   token: req.params.token,
		//   messages: req.body
		// };
		// await req.app.rabbit.publishInQueue("waba360", JSON.stringify(message));
	} catch (error) {}
	// Queue.add("SendMessageAPI", newMessage);

	res.status(200).json({ message: "Message add queue" });
};

export const CheckServiceMessenger: RequestHandler = async (
	req: Request,
	res: Response,
) => {
	const challenge = req.query["hub.challenge"];
	res.status(200).send(challenge);
};

export const ReceivedRequestMessenger: RequestHandler = async (
	req: Request,
	res: Response,
) => {
	// try {
	// 	// const message = {
	// token: req.params.token,
	// 	//   messages: req.body
	// 	// };
	// 	// await req.app.rabbit.publishInQueue("messenger", JSON.stringify(message));
	// } catch (error) {
	// 	throw new AppError(error.message);
	// }
	// // Queue.add("SendMessageAPI", newMessage);

	res.status(200).json({ message: "Message add queue" });
};
