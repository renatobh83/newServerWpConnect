import type { Contact, Ack } from "@wppconnect-team/wppconnect";

export const getId = (obj: Contact | Ack) => {
	// Verifica se o id é um objeto com a propriedade `_serialized`
	if (typeof obj.id === "object" && obj.id._serialized) {
		return obj.id._serialized;
	}
	// Caso contrário, retorna diretamente o valor do id
	return obj.id;
};
