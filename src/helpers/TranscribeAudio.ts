// import fs from "node:fs";
// const { SpeechClient } = require("@google-cloud/speech");

// export async function transcribeAudio(audioFilePath, credentialsJson) {
// 	const credentials = JSON.parse(credentialsJson);

// 	if (!credentials.client_email || !credentials.private_key) {
// 		throw new Error("O JSON de credenciais não contém os campos necessários.");
// 	}

// 	const clientConfig = {
// 		credentials: {
// 			client_email: credentials.client_email,
// 			private_key: credentials.private_key,
// 		},
// 		projectId: credentials.project_id,
// 	};

// 	const client = new SpeechClient(clientConfig);
// 	const audioContent = fs.readFileSync(audioFilePath).toString("base64");

// 	const audio = { content: audioContent };
// 	const config = {
// 		encoding: "MP3",
// 		sampleRateHertz: 16000,
// 		languageCode: "pt-BR",
// 	};

// 	const request = {
// 		audio: audio,
// 		config: config,
// 	};

// 	const [response] = await client.recognize(request);
// 	const transcription =
// 		response.results
// 			?.map((result) => result.alternatives?.[0].transcript)
// 			.join("\n") || "";

// 	return transcription;
// }
