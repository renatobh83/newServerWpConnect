import type { ServerOptions } from "../types/ServerOptions";

export default {
	secretKey: "THISISMYSECURETOKEN",
	host: "http://localhost",
	port: "21465",
	deviceName: "WppConnect",
	poweredBy: "WPPConnect-Server",
	startAllSession: true,
	tokenStoreType: "file",
	maxListeners: 15,
	customUserDataDir: "./userDataDir/",
	webhook: {
		url: null,
		autoDownload: true,
		uploadS3: false,
		readMessage: true,
		allUnreadOnStart: false,
		listenAcks: true,
		onPresenceChanged: true,
		onParticipantsChanged: true,
		onReactionMessage: true,
		onPollResponse: true,
		onRevokedMessage: true,
		onLabelUpdated: true,
		onSelfMessage: false,
		ignore: ["status@broadcast"],
	},
	websocket: {
		autoDownload: false,
		uploadS3: false,
	},
	chatwoot: {
		sendQrCode: true,
		sendStatus: true,
	},
	archive: {
		enable: false,
		waitTime: 10,
		daysToArchive: 45,
	},
	log: {
		level: "silly", // Before open a issue, change level to silly and retry a action
		logger: ["console", "file"],
	},
	createOptions: {
		browserArgs: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
		/**
		 * Example of configuring the linkPreview generator
		 * If you set this to 'null', it will use global servers; however, you have the option to define your own server
		 * Clone the repository https://github.com/wppconnect-team/wa-js-api-server and host it on your server with ssl
		 *
		 * Configure the attribute as follows:
		 * linkPreviewApiServers: [ 'https://www.yourserver.com/wa-js-api-server' ]
		 */
		linkPreviewApiServers: null,
	},
	mapper: {
		enable: false,
		prefix: "tagone-",
	},
} as unknown as ServerOptions;
