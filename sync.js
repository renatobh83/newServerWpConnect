const sequelize = require("./src/database/index.ts");
const logger = require("./src/utils/logger");

// Sincroniza o banco de dados
sequelize
	.sync({ alter: true }) // 'alter: true' tenta sincronizar sem perder dados
	.then(() => {
		logger.info("Banco de dados sincronizado com sucesso");
		process.exit(0); // Encerra o processo após a sincronização
	})
	.catch((error) => {
		logger.error("Erro ao sincronizar o banco de dados:", error);
		process.exit(1); // Encerra o processo com erro
	});
