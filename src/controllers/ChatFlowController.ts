// import * as Yup from "yup";
import type { NextFunction, Request, RequestHandler, Response } from "express";

import AppError from "../errors/AppError";
import CreateChatFlowService from "../services/ChatFlowServices/CreateChatFlowService";
import DeleteChatFlowService from "../services/ChatFlowServices/DeleteChatFlowService";
import ListChatFlowService from "../services/ChatFlowServices/ListChatFlowService";
import UpdateChatFlowService from "../services/ChatFlowServices/UpdateChatFlowService";
// import UpdateAutoReplyService from "../services/AutoReplyServices/UpdateAutoReplyService";
// import DeleteAutoReplyService from "../services/AutoReplyServices/DeleteAutoReplyService";

interface Line {
	connector: string;
	from: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	paintStyle: string | any;
	to: string;
}
interface Configuration {
	maxRetryBotMessage: {
		destiny: string;
		number: number;
		type: number;
	};
	notOptionsSelectMessage: {
		message: string;
		step: string;
	};
	notResponseMessage: {
		destiny: string;
		time: number;
		type: number;
	};
}
interface NodeList {
	ico?: string;
	id: string;
	left: string;
	name: string;
	status: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	style?: string | any;
	top: string;
	type?: string;
	viewOnly?: boolean;
	configurations?: Configuration;
	actions?: [];
	conditions?: [];
	interactions?: [];
}

interface Flow {
	name: string;
	lineList: Line[];
	nodeList: NodeList[];
}

interface ChatFlowData {
	flow: Flow;
	name: string;
	userId: number;
	isActive: boolean;
	celularTeste?: string;
	tenantId: number;
}

export const store: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId } = req.user;

	try {
		if (req.user.profile !== "admin") {
			throw new AppError("ERR_NO_PERMISSION", 403);
		}

		const newFlow: ChatFlowData = {
			flow: { ...req.body },
			name: req.body.name,
			isActive: true,
			userId: +req.user.id,
			tenantId,
		};

		// const schema = Yup.object().shape({
		//   name: Yup.string().required(),
		//   action: Yup.number().required(),
		//   tenantId: Yup.number().required(),
		//   userId: Yup.number().required()
		// });

		// try {
		//   await schema.validate(newAutoReply);
		// } catch (error) {
		//   throw new AppError(error.message);
		// }

		const chatFlow = await CreateChatFlowService(newFlow);

		res.status(200).json(chatFlow);
	} catch (error) {
		next(error);
	}
};

export const index: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { tenantId } = req.user;
	try {
		const chatFlow = await ListChatFlowService({ tenantId });
		res.status(200).json(chatFlow);
	} catch (error) {
		next(error);
	}
};

export const update: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (req.user.profile !== "admin") {
			throw new AppError("ERR_NO_PERMISSION", 403);
		}
		const { tenantId } = req.user;

		const newFlow: ChatFlowData = {
			flow: { ...req.body },
			name: req.body.name,
			isActive: req.body.isReactive,
			userId: +req.user.id,
			tenantId,
		};

		// const schema = Yup.object().shape({
		//   name: Yup.string().required(),
		//   action: Yup.number().required(),
		//   userId: Yup.number().required()
		// });

		// try {
		//   await schema.validate(autoReplyData);
		// } catch (error) {
		//   throw new AppError(error.message);
		// }

		const { chatFlowId } = req.params;
		const chatFlow = await UpdateChatFlowService({
			chatFlowData: newFlow,
			chatFlowId,
			tenantId,
		});

		res.status(200).json(chatFlow);
	} catch (error) {
		next(error);
	}
};
export const remove: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { chatFlowId } = req.params;
	const { tenantId } = req.user;
	try {
		await DeleteChatFlowService({ id: chatFlowId, tenantId });

		res.status(200).json({ message: "Flow deleted" });
	} catch (error) {
		next(error);
	}
};

// export const remove: RequestHandler = async (
//   req: Request,
//   res: Response
// ) => {
//   if (req.user.profile !== "admin") {
//     throw new AppError("ERR_NO_PERMISSION", 403);
//   }
//   const { tenantId } = req.user;
//   const { autoReplyId } = req.params;

//   await DeleteAutoReplyService({ id: autoReplyId, tenantId });
//    res.status(200).json({ message: "Auto reply deleted" });
// };
