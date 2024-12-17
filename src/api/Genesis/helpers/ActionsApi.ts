import { createApiSessionInstance, sessionApiDados } from "../services/StartApiSessionByName";

export async function confirmaExame(tenantId: number, atendimento: number) {
    const apiInstance = await createApiSessionInstance({
        nomeApi: "GENESIS",
        tenantId,
        jwt: true,
    });
    const url = `/doAgendaConfirmar?cd_atendimento=${atendimento}`;
    const urlFinal = `${sessionApiDados.baseURl}${url}`;
    try {
        const { data } = await apiInstance.post(urlFinal, {});
        return data;
    } catch (error) {
        console.error("Erro ao confirmar exame:", error);
        throw error;
    }
}

export async function getPreparos({ procedimento, tenantId }) {
    const apiInstance = await createApiSessionInstance({
        nomeApi: "GENESIS",
        tenantId,
        jwt: true,
    });
    const url = `/doProcedimentoPreparo?cd_procedimento=${procedimento}`;
    const urlFinal = `${sessionApiDados.baseURl}${url}`;

    try {
        const { data } = await apiInstance.post(urlFinal, {});
        const blob = data[0].bb_preparo;

        return blob;
    } catch (error) {
        console.error("Erro ao confirmar exame:", error);
        throw error;
    }
}