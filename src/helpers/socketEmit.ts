import { getIO } from "../libs/scoket";

type Events =
	| "chat:create"
	| "chat:delete"
	| "chat:update"
	| "chat:ack"
	| "ticket:update"
	| "ticket:create"
	| "contact:update"
	| "contact:delete"
	| "notification:new"
	| "campaign:update"
	| "campaign:send";

interface ObjEvent {
	tenantId: number | string;
	type: Events;
	// eslint-disable-next-line @typescript-eslint/ban-types
	payload: object;
}

const emitEvent = ({ tenantId, type, payload }: ObjEvent): void => {
	const io = getIO();
	let eventChannel = `${tenantId}:ticketList`;

	if (type.indexOf("contact:") !== -1) {
		eventChannel = `${tenantId}:contactList`;
	}

	io.to(tenantId.toString()).emit(eventChannel, {
		type,
		payload,
	});
};

export default emitEvent;
