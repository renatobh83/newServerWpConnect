export interface ServerOptions {
	secretKey: string;
	host: string;
	port: number;
	deviceName: string;
	poweredBy: string;
	startAllSession: boolean;
	tokenStoreType: string;
	maxListeners: number;
	customUserDataDir: string;
	webhook: {
		url: string;
		autoDownload: boolean;
		uploadS3: boolean;
		readMessage: boolean;
		allUnreadOnStart: boolean;
		listenAcks: boolean;
		onPresenceChanged: boolean;
		onParticipantsChanged: boolean;
		onReactionMessage: boolean;
		onPollResponse: boolean;
		onRevokedMessage: boolean;
		onSelfMessage: boolean;
		ignore: string[];
	};
	websocket: {
		autoDownload: boolean;
		uploadS3: boolean;
	};
	archive: {
		enable: boolean;
		waitTime: number;
		daysToArchive: number;
	};
	log: {
		level: string;
		logger: string[];
	};
	createOptions: {
		browserArgs: string[];
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		puppeteerOptions: any;
	};
	mapper: {
		enable: boolean;
		prefix: string;
	};
}
