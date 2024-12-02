import { writeFile } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';
import ChatFlow from '../../models/ChatFlow';

const writeFileAsync = promisify(writeFile);

interface Request {
	flow: any;
	name: string;
	isActive: boolean;
	userId: number;
	tenantId: number;
}
// type ChatFlowCreateAttributes = Pick<
// 	ChatFlow,
// 	"flow" | "userId" | "tenantId" | "name" | "isActive"
// >;
// type ChatFlowCreateAttributesP = Partial<
// 	Pick<ChatFlow, "flow" | "userId" | "tenantId" | "name" | "isActive">
// >;
// interface ChatFlowCreationAttributesI {
// 	flow: any;
// 	userId: number;
// 	tenantId: number;
// 	name: string;
// 	isActive: boolean;
// }
// type ChatFlowCreateAttributesO = Omit<
// 	ChatFlow,
// 	"tableName" | "sequelize" | "destroy" | "restore"
// >;

const CreateChatFlowService = async ({ flow, userId, tenantId, name, isActive }: Request): Promise<ChatFlow> => {
	for await (const node of flow.nodeList) {
		if (node.type === 'node') {
			// biome-ignore lint/correctness/noUnsafeOptionalChaining: <explanation>
			for await (const item of node.data?.interactions) {
				if (item.type === 'MediaField' && item.data.media) {
					const newName = `${new Date().getTime()}-${item.data.name}`;
					await writeFileAsync(
						join(__dirname, '..', '..', '..', 'public', newName),
						item.data.media.split('base64')[1],
						'base64',
					);

					item.data.media = undefined;
					item.data.fileName = item.data.name;
					item.data.mediaUrl = newName;
				}
			}
		}
	}

	const chatFlow = await ChatFlow.create({
		flow,
		userId,
		tenantId,
		name,
		isActive,
	});

	return chatFlow;
};

export default CreateChatFlowService;
