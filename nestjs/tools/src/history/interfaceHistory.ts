import { StreamableFile } from "@nestjs/common";

export interface HistoryBack {
	id : number,
	createdAt: string,
	enemyLogin: string,
	enemyScore: number,
	userId: string,
	userScore: number,
	enemyAvatar: string | undefined
} 