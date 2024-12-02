// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const ProcessBodyData = (body: any): any => {
	const modifiedbody = body;
	const jsonParse = JSON.parse(body.notificacao);

	const array = jsonParse;

	// const dadosAgendamentosArray = array.dados_agendamentos
	//   .replace(/^\[\(/, "") // Remove o '[(' inicial
	//   .replace(/\)\]$/, "") // Remove o ')]' final
	//   .split(/\),\(/) // Divide a string em tuplas
	//   .map((str: string) => str.split(",")) // Converte cada tupla em um array de valores
	//   .map((item: any[]) => ({
	//     idExterno: parseInt(item[0], 10),
	//     Procedimento: parseInt(item[1], 10),
	//     Hora: item[2],
	//   }));
	const dadosAgendamentosArray = array.dados_agendamentos
		.replace(/^\[\(/, '') // Remove o '[(' inicial
		.replace(/\)\]$/, '') // Remove o ')]' final
		.split(/\), \(/) // Divide a string em tuplas
		.map((str: string) => str.split(',')) // Converte cada tupla em um array de valores
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		.map((item: any[]) => ({
			idExterno: Number.parseInt(item[0], 10),
			Procedimento: Number.parseInt(item[1], 10),
			Hora: item[2],
		}));

	array.dados_agendamentos = dadosAgendamentosArray;

	modifiedbody.notificacao = array;

	return modifiedbody;
};

export default ProcessBodyData;
