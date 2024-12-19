import type { Message as WbotMessage } from "@wppconnect-team/wppconnect";
import ApiMessage from "../../models/ApiMessage";

export const isApiMessageExistsService = async (msg: WbotMessage): Promise<boolean> => {
    const message = await ApiMessage.findOne({
        where: { messageId: msg?.id },
    });

    if (!message) {
        return false;
    }

    return true;
};