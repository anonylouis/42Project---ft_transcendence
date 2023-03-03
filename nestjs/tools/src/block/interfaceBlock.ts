import { StreamableFile } from "@nestjs/common";

export interface Block {
	id: number,
	createdAt: string,
	updatedAt: string,
	blockId: string,
	userId: string,
	login: string,
	avatar: string | undefined
}
