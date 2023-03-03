export interface User {
	id: string,
	sessionID: string,
	currentRoomId: number,
	currentRoomName: string,
	isConnected: boolean,
	createdAt: Date,
	email: string,
	login: string,
	info: string,
	avatar: string | undefined,
	victories: number,
	loses: number
}
