import Redis from "ioredis";
import { getWbot } from "../libs/wbot";
import { logger } from "../utils/logger";
import SendMessageSystemConfirmacao from "../api/Genesis/services/wbot/SendMessageSystemConfirmacao";

const sending: any = {};

const LOCK_TIMEOUT = 30; // Tempo em segundos que o lock será mantido

const redis = new Redis({
    host: process.env.IO_REDIS_SERVER,
    port: +(process.env.IO_REDIS_PORT || "6379"),
    password: process.env.IO_REDIS_PASSWORD || undefined,
    db: 3,
});

export default {
    key: "SendMessageConfirmar",
    options: {
        delay: 6000,
        attempts: 2,
        removeOnComplete: true,
        removeOnFail: false,
        backoff: {
            type: "fixed",
            delay: 60000 * 3, // 3 min
        },
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async handle(data: any) {
        try {
            logger.info("SendMessageConfirmar Initiated");
            const [{ contato }] = data.contatos;
            const wbot = getWbot(data.sessionId);

            if (!contato) {
                logger.error('Cotnato nao informado')
                throw new Error("Contato não informado");

            }
            const phoneNumber = contato; // Assumindo que 'phoneNumber' é parte do objeto 'data'
            const lockKey = `lock:${phoneNumber}`;

            const isLocked = await redis.exists(lockKey);
            if (isLocked) {
                // Se o lock existe, ignora a nova adição à fila
                logger.info(
                    `Mensagem para ${phoneNumber} não foi adicionada à fila (lock ativo).`,
                );
                return;
            }
            // Se não existe lock, cria um lock temporário
            await redis.set(lockKey, "locked", "EX", LOCK_TIMEOUT);


            if (sending[data.tenantId]) return;

            sending[data.tenantId] = true;
            await SendMessageSystemConfirmacao(wbot, data);
            sending[data.tenantId] = false;
            logger.info("Finalized SendMessageConfirmar");
        } catch (error) {
            throw new Error(error);
        }
    },
};
