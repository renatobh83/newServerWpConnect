import { createApiSessionInstance, sessionApiDados } from "./StartApiSessionByName";

export const consultapacientesService = async ({ tenantId,
    params }) => {
    try {
        const apiInstance = await createApiSessionInstance({
            nomeApi: "GENESIS",
            tenantId: tenantId,
            jwt: false,
        });


        if (!sessionApiDados.baseURl) {
            throw new Error("Url não cadatrada para a api");
        }
        if (!params.NomePaciente) {
            throw new Error("Nao tem parametro para pesquisa")
        }
        const url = "https://otrsweb.zapto.org/clinuxintegra/consultapacientes";
        const urlFinal = `${sessionApiDados.baseURl}${url}`;

        const consultaDados = {
            NomePaciente: params.NomePaciente,
            ...(params.CPF && { CPF: params.CPF }),
        };

        const { data } = await apiInstance.post(url, consultaDados);

        console.log(data)
    } catch (error) {
        console.error(error)
    }
}

// export async function consultaPaciente({
// 	tenantId,
// 	params,
// }: ConsultaPacienteProps) {
// 	try {
// 		const apiInstance = await createApiSessionInstance({
// 			nomeApi: "API GENESIS",
// 			tenantId: tenantId,
// 			jwt: false,
// 		});
// 		if (!sessionApiDados.baseURl) {
// 			throw new Error("Url não cadatrada para a api");
// 		}
// 		if (!params.NomePaciente) {
// 			return "Nao tem parametro para pesquisa";
// 		}

// 		const url = "/clinuxintegra/consultapacientes";
// 		const urlFinal = `${sessionApiDados.baseURl}${url}`;

// 		const consultaDados = {
// 			NomePaciente: params.NomePaciente,
// 			...(params.CPF && { CPF: params.CPF }), // Inclui o CPF somente se ele estiver presente em `params`
// 		};
// 		const { data } = await apiInstance.post(urlFinal, consultaDados);

// 		if (data !== null) {
// 			return data;
// 		}
// 		return [];
// 	} catch (error) {
// 		throw new Error(error.response.statusText);
// 	}
// }