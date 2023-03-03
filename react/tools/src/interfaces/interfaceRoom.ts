export interface Room {
	hash: string | null,
	id : number,
	name: string,
	ownerId: string | null,
	isPrivate: boolean,
	isWhisp: boolean
}