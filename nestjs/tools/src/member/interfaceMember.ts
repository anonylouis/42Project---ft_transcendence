import { StreamableFile } from "@nestjs/common";

export interface Member {
	id: string,
	userId: string,
	login: string,
	roomId: number,
	roomName: string,
	unmuteDate: string,
	unbanDate: string,
	avatar: string | undefined
}
