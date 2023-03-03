export interface Friend {
	id: number,
	createdAt: string,
	updatedAt: string,
	friendId: string,
	userId: string,
	login: string,
	victories: number,
	loses: number,
	avatar: string | undefined
}
