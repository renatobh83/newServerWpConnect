import { NextFunction, Request, Response } from "express";
import { getQueueStats } from "../libs/Queue";


export const stats = async(req: Request,
	res: Response,
	next: NextFunction,)=>{
        const { queueName } = req.params;
        try {
            const stats = await getQueueStats(queueName);
            res.status(200).json({
              message: `Estatísticas da fila ${queueName}`,
              stats,
            });
        } catch (error) {
            next(error);
        }
}

